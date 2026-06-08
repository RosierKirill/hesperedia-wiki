import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { UserRole as PrismaUserRole } from '@prisma/client'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'
import { requireRole } from '../middleware/requireRole'
import { UserRole } from '@hesperedia/shared-types'

const router = Router()

router.use(authenticate, requireRole(UserRole.ADMIN))

router.get('/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalArticles,
      publishedArticles,
      totalCharacters,
      totalCreatures,
      totalFactions,
      pendingComments,
      openProposals,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { publishedAt: { not: null } } }),
      prisma.character.count(),
      prisma.creature.count(),
      prisma.faction.count(),
      prisma.comment.count({ where: { isApproved: false } }),
      prisma.communityProposal.count({ where: { status: 'OPEN' } }),
    ])

    res.json({
      data: {
        articles: { total: totalArticles, published: publishedArticles, drafts: totalArticles - publishedArticles },
        characters: totalCharacters,
        creatures: totalCreatures,
        factions: totalFactions,
        pendingComments,
        openProposals,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/users', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.put('/users/:id/role', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = z.object({ role: z.nativeEnum(PrismaUserRole) }).parse(req.body)
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, username: true, role: true },
    })
    res.json({ data: user })
  } catch (err) {
    next(err)
  }
})

router.get('/comments/pending', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.comment.findMany({
      where: { isApproved: false },
      include: {
        user: { select: { id: true, username: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.put('/comments/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await prisma.comment.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    })
    res.json({ data: comment })
  } catch (err) {
    next(err)
  }
})

export default router
