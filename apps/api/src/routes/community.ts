import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/proposals', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.communityProposal.findMany({
      where: { status: 'OPEN' },
      orderBy: { voteCount: 'desc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.post('/proposals', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, type } = z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(1).max(2000),
      type: z.string().min(1),
    }).parse(req.body)

    const proposal = await prisma.communityProposal.create({
      data: { title, description, type, submittedBy: req.user!.id },
    })
    res.status(201).json({ data: proposal })
  } catch (err) {
    next(err)
  }
})

router.post('/proposals/:id/vote', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { value } = z.object({ value: z.number().int().min(-1).max(1) }).parse(req.body)

    const existing = await prisma.vote.findUnique({
      where: { userId_targetType_targetId: { userId: req.user!.id, targetType: 'proposal', targetId: req.params.id } },
    })

    if (existing) {
      if (existing.value === value) {
        await prisma.vote.delete({ where: { id: existing.id } })
        await prisma.communityProposal.update({
          where: { id: req.params.id },
          data: { voteCount: { decrement: value } },
        })
      } else {
        await prisma.vote.update({ where: { id: existing.id }, data: { value } })
        await prisma.communityProposal.update({
          where: { id: req.params.id },
          data: { voteCount: { increment: value * 2 } },
        })
      }
    } else {
      await prisma.vote.create({
        data: { userId: req.user!.id, targetType: 'proposal', targetId: req.params.id, value },
      })
      await prisma.communityProposal.update({
        where: { id: req.params.id },
        data: { voteCount: { increment: value } },
      })
    }

    const updated = await prisma.communityProposal.findUnique({ where: { id: req.params.id } })
    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

export default router
