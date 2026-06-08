import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { MagicForce, ArticleCategory } from '@prisma/client'
import { prisma } from '../prisma'
import { authenticate, optionalAuth } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { parsePagination, buildPaginatedResponse } from '../utils/pagination'
import { generateSlug } from '../utils/slug'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

const articleInclude = {
  author: { select: { id: true, username: true, avatarUrl: true } },
  ratings: { select: { score: true } },
}

function computeRating(ratings: { score: number }[]) {
  if (!ratings.length) return { avgRating: null, ratingCount: 0 }
  const avg = ratings.reduce((s, r) => s + r.score, 0) / ratings.length
  return { avgRating: Math.round(avg * 10) / 10, ratingCount: ratings.length }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = parsePagination(req.query as Record<string, unknown>)
    const { category, tag, force } = req.query

    const where = {
      publishedAt: { not: null },
      ...(category ? { category: category as ArticleCategory } : {}),
      ...(tag ? { tags: { has: String(tag) } } : {}),
      ...(force ? { magicForces: { has: force as MagicForce } } : {}),
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    const data = articles.map((a) => ({ ...a, ...computeRating(a.ratings), ratings: undefined }))
    res.json({ data: buildPaginatedResponse(data, total, { page, pageSize }) })
  } catch (err) {
    next(err)
  }
})

router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await prisma.article.findMany({
      where: { featured: true, publishedAt: { not: null } },
      include: articleInclude,
      orderBy: { publishedAt: 'desc' },
      take: 6,
    })
    res.json({ data: articles.map((a) => ({ ...a, ...computeRating(a.ratings), ratings: undefined })) })
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: {
        ...articleInclude,
        characters: { include: { character: { select: { id: true, name: true, slug: true, portraitUrl: true } } } },
        creatures: { include: { creature: { select: { id: true, name: true, slug: true, portraitUrl: true } } } },
        factions: { include: { faction: { select: { id: true, name: true, slug: true, logoUrl: true } } } },
        locations: { include: { location: { select: { id: true, name: true, slug: true } } } },
      },
    })
    if (!article) {
      res.status(404).json({ error: { message: 'Article not found' } })
      return
    }
    res.json({ data: { ...article, ...computeRating(article.ratings), ratings: undefined } })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: req.params.id, parentId: null, isApproved: true },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        replies: {
          where: { isApproved: true },
          include: { user: { select: { id: true, username: true, avatarUrl: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ data: comments })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/comments', authenticate, requireRole(UserRole.SUBSCRIBER, UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, parentId } = z.object({
      content: z.string().min(1).max(2000),
      parentId: z.string().optional(),
    }).parse(req.body)

    const comment = await prisma.comment.create({
      data: { content, articleId: req.params.id, userId: req.user!.id, parentId },
      include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    })
    res.status(201).json({ data: comment })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id/comments/:cid', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.cid } })
    if (!comment) {
      res.status(404).json({ error: { message: 'Comment not found' } })
      return
    }

    const isAuthor = comment.userId === req.user!.id
    const isAdmin = req.user!.role === UserRole.ADMIN
    if (!isAuthor && !isAdmin) {
      res.status(403).json({ error: { message: 'Insufficient permissions' } })
      return
    }

    await prisma.comment.delete({ where: { id: req.params.cid } })
    res.json({ data: { message: 'Comment deleted' } })
  } catch (err) {
    next(err)
  }
})

router.post('/:id/rate', authenticate, requireRole(UserRole.SUBSCRIBER, UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { score } = z.object({ score: z.number().int().min(1).max(5) }).parse(req.body)

    const rating = await prisma.articleRating.upsert({
      where: { userId_articleId: { userId: req.user!.id, articleId: req.params.id } },
      update: { score },
      create: { score, userId: req.user!.id, articleId: req.params.id },
    })
    res.json({ data: rating })
  } catch (err) {
    next(err)
  }
})

const articleSchema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().optional(),
  category: z.nativeEnum(ArticleCategory),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  magicForces: z.array(z.nativeEnum(MagicForce)).default([]),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
})

router.post('/', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = articleSchema.parse(req.body)
    const slug = slugInput || generateSlug(data.title)

    const article = await prisma.article.create({
      data: { ...data, slug, authorId: req.user!.id, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null },
      include: articleInclude,
    })
    res.status(201).json({ data: article })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authenticate, requireRole(UserRole.EDITOR, UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug: slugInput, ...data } = articleSchema.partial().parse(req.body)
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(slugInput ? { slug: slugInput } : {}),
        ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt ? new Date(data.publishedAt) : null } : {}),
      },
      include: articleInclude,
    })
    res.json({ data: article })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } })
    res.json({ data: { message: 'Article deleted' } })
  } catch (err) {
    next(err)
  }
})

export default router
