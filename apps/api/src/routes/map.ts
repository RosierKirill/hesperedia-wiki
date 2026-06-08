import { Router, Request, Response, NextFunction } from 'express'
import { LocationType } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { generateSlug } from '../utils/slug'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

const locationSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().optional(),
  type: z.nativeEnum(LocationType),
  realmId: z.string().min(1),
  regionId: z.string().optional(),
  description: z.string().optional(),
  isCapital: z.boolean().default(false),
  imageUrl: z.string().url().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  mapCoords: z.object({ x: z.number(), y: z.number() }).optional(),
})

router.get('/realms', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.realm.findMany({ orderBy: { order: 'asc' } })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/realms/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const realm = await prisma.realm.findUnique({
      where: { slug: req.params.slug },
      include: {
        regions: { orderBy: { name: 'asc' } },
        locations: { orderBy: { name: 'asc' } },
      },
    })
    if (!realm) {
      res.status(404).json({ error: { message: 'Realm not found' } })
      return
    }
    res.json({ data: realm })
  } catch (err) {
    next(err)
  }
})

router.get('/regions', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.region.findMany({
      include: { realm: true },
      orderBy: { name: 'asc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/regions/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const region = await prisma.region.findUnique({
      where: { slug: req.params.slug },
      include: {
        realm: true,
        locations: true,
        factions: { include: { faction: true } },
      },
    })
    if (!region) {
      res.status(404).json({ error: { message: 'Region not found' } })
      return
    }
    res.json({ data: region })
  } catch (err) {
    next(err)
  }
})

router.get('/locations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { realmId, regionId, type } = req.query

    const where = {
      ...(realmId ? { realmId: String(realmId) } : {}),
      ...(regionId ? { regionId: String(regionId) } : {}),
      ...(type ? { type: type as LocationType } : {}),
    }

    const data = await prisma.location.findMany({
      where,
      include: { region: true, realm: true },
      orderBy: [{ isCapital: 'desc' }, { name: 'asc' }],
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/locations/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = await prisma.location.findUnique({
      where: { slug: req.params.slug },
      include: {
        region: true,
        realm: true,
        characters: { include: { character: { select: { id: true, name: true, slug: true, portraitUrl: true } } } },
        articles: { include: { article: { select: { id: true, title: true, slug: true, excerpt: true } } }, take: 10 },
      },
    })
    if (!location) {
      res.status(404).json({ error: { message: 'Location not found' } })
      return
    }
    res.json({ data: location })
  } catch (err) {
    next(err)
  }
})

router.post('/locations', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, mapCoords, ...data } = locationSchema.parse(req.body)
    const slug = slugInput || generateSlug(data.name)
    const location = await prisma.location.create({
      data: { ...data, slug, mapCoords: mapCoords ?? undefined },
      include: { region: true, realm: true },
    })
    res.status(201).json({ data: location })
  } catch (err) { next(err) }
})

router.put('/locations/:id', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, mapCoords, ...data } = locationSchema.partial().parse(req.body)
    const location = await prisma.location.update({
      where: { id: req.params.id },
      data: { ...data, ...(slugInput ? { slug: slugInput } : {}), ...(mapCoords !== undefined ? { mapCoords } : {}) },
      include: { region: true, realm: true },
    })
    res.json({ data: location })
  } catch (err) { next(err) }
})

router.delete('/locations/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.location.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Location deleted' } })
  } catch (err) { next(err) }
})

export default router
