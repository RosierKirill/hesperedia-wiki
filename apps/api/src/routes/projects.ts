import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ProjectType, ProjectStatus } from '@prisma/client'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { generateSlug } from '../utils/slug'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, status } = req.query
    const where = {
      publishedAt: { not: null },
      ...(type ? { type: type as ProjectType } : {}),
      ...(status ? { status: status as ProjectStatus } : {}),
    }
    const data = await prisma.project.findMany({ where, orderBy: { createdAt: 'desc' } })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({ where: { slug: req.params.slug } })
    if (!project) {
      res.status(404).json({ error: { message: 'Project not found' } })
      return
    }
    res.json({ data: project })
  } catch (err) {
    next(err)
  }
})

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  status: z.nativeEnum(ProjectStatus),
  description: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  releaseDate: z.string().datetime().optional().nullable(),
  links: z.record(z.string()).optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().datetime().optional().nullable(),
})

router.post('/', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = projectSchema.parse(req.body)
    const slug = slugInput || generateSlug(data.title)
    const project = await prisma.project.create({
      data: { ...data, slug, releaseDate: data.releaseDate ? new Date(data.releaseDate) : null, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null },
    })
    res.status(201).json({ data: project })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = projectSchema.partial().parse(req.body)
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(slugInput ? { slug: slugInput } : {}),
        ...(data.releaseDate !== undefined ? { releaseDate: data.releaseDate ? new Date(data.releaseDate) : null } : {}),
        ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt ? new Date(data.publishedAt) : null } : {}),
      },
    })
    res.json({ data: project })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Project deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
