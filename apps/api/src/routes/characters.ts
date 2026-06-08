import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { MagicForce, CharacterStatus } from '@prisma/client'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { parsePagination, buildPaginatedResponse } from '../utils/pagination'
import { generateSlug } from '../utils/slug'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

const characterInclude = {
  homeLocation: { include: { region: true } },
  affiliations: { include: { faction: true } },
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = parsePagination(req.query as Record<string, unknown>)
    const { force, faction, status } = req.query

    const where = {
      publishedAt: { not: null },
      ...(force ? { primaryForce: force as MagicForce } : {}),
      ...(status ? { status: status as CharacterStatus } : {}),
      ...(faction ? { affiliations: { some: { faction: { slug: String(faction) } } } } : {}),
    }

    const [data, total] = await Promise.all([
      prisma.character.findMany({
        where,
        include: characterInclude,
        orderBy: [{ isMainCharacter: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.character.count({ where }),
    ])

    res.json({ data: buildPaginatedResponse(data, total, { page, pageSize }) })
  } catch (err) {
    next(err)
  }
})

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.character.findMany({
      where: { isMainCharacter: true, publishedAt: { not: null } },
      include: characterInclude,
      orderBy: { name: 'asc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const character = await prisma.character.findUnique({
      where: { slug: req.params.slug },
      include: {
        ...characterInclude,
        articles: { include: { article: true }, take: 10 },
      },
    })
    if (!character) {
      res.status(404).json({ error: { message: 'Character not found' } })
      return
    }
    res.json({ data: character })
  } catch (err) {
    next(err)
  }
})

const characterSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().optional(),
  titles: z.array(z.string()).default([]),
  species: z.string().min(1),
  gender: z.string().optional(),
  age: z.string().optional(),
  status: z.nativeEnum(CharacterStatus),
  primaryForce: z.nativeEnum(MagicForce).optional(),
  secondaryForce: z.nativeEnum(MagicForce).optional(),
  magicLevel: z.number().int().min(1).max(10).optional(),
  biography: z.string().min(1),
  personality: z.string().optional(),
  abilities: z.string().optional(),
  history: z.string().optional(),
  isMainCharacter: z.boolean().default(false),
  homeLocationId: z.string().optional(),
  portraitUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  affiliationIds: z.array(z.string()).default([]),
})

router.post('/', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { affiliationIds, slug: slugInput, ...data } = characterSchema.parse(req.body)
    const slug = slugInput || generateSlug(data.name)

    const character = await prisma.character.create({
      data: {
        ...data,
        slug,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
        affiliations: {
          create: affiliationIds.map((factionId) => ({ factionId })),
        },
      },
      include: characterInclude,
    })
    res.status(201).json({ data: character })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { affiliationIds, slug: slugInput, ...data } = characterSchema.partial().parse(req.body)

    await prisma.charactersOnFactions.deleteMany({ where: { characterId: req.params.id } })

    const character = await prisma.character.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(slugInput ? { slug: slugInput } : {}),
        ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt ? new Date(data.publishedAt) : null } : {}),
        ...(affiliationIds
          ? { affiliations: { create: affiliationIds.map((factionId) => ({ factionId })) } }
          : {}),
      },
      include: characterInclude,
    })
    res.json({ data: character })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.character.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Character deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
