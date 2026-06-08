import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { MagicForce, CreatureCategory, CreatureOrigin } from '@prisma/client'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { parsePagination, buildPaginatedResponse } from '../utils/pagination'
import { generateSlug } from '../utils/slug'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = parsePagination(req.query as Record<string, unknown>)
    const { category, force, danger } = req.query

    const dangerRange = danger
      ? danger === 'low'
        ? { gte: 1, lte: 3 }
        : danger === 'medium'
          ? { gte: 4, lte: 6 }
          : { gte: 7, lte: 10 }
      : undefined

    const where = {
      publishedAt: { not: null },
      ...(category ? { category: category as CreatureCategory } : {}),
      ...(force ? { primaryForce: force as MagicForce } : {}),
      ...(dangerRange ? { dangerLevel: dangerRange } : {}),
    }

    const [data, total] = await Promise.all([
      prisma.creature.findMany({
        where,
        orderBy: [{ dangerLevel: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.creature.count({ where }),
    ])

    res.json({ data: buildPaginatedResponse(data, total, { page, pageSize }) })
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const creature = await prisma.creature.findUnique({
      where: { slug: req.params.slug },
      include: { articles: { include: { article: true }, take: 10 } },
    })
    if (!creature) {
      res.status(404).json({ error: { message: 'Creature not found' } })
      return
    }
    res.json({ data: creature })
  } catch (err) {
    next(err)
  }
})

const creatureSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().optional(),
  category: z.nativeEnum(CreatureCategory),
  subcategory: z.string().optional(),
  origin: z.nativeEnum(CreatureOrigin),
  primaryForce: z.nativeEnum(MagicForce).optional(),
  dangerLevel: z.number().int().min(1).max(10).optional(),
  description: z.string().min(1),
  abilities: z.string().optional(),
  weaknesses: z.string().optional(),
  habitat: z.string().optional(),
  portraitUrl: z.string().url().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
})

router.post('/', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = creatureSchema.parse(req.body)
    const slug = slugInput || generateSlug(data.name)

    const creature = await prisma.creature.create({
      data: { ...data, slug, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null },
    })
    res.status(201).json({ data: creature })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = creatureSchema.partial().parse(req.body)
    const creature = await prisma.creature.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(slugInput ? { slug: slugInput } : {}),
        ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt ? new Date(data.publishedAt) : null } : {}),
      },
    })
    res.json({ data: creature })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.creature.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Creature deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
