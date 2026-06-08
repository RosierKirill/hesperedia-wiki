import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'

const router = Router()

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.faction.findMany({
      where: { publishedAt: { not: null } },
      include: { characters: { include: { character: { select: { id: true, name: true, slug: true, portraitUrl: true } } }, take: 5 } },
      orderBy: { name: 'asc' },
    })
    res.json({ data })
  } catch (err) {
    next(err)
  }
})

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faction = await prisma.faction.findUnique({
      where: { slug: req.params.slug },
      include: {
        characters: { include: { character: true } },
        regions: { include: { region: true } },
        articles: { include: { article: true }, take: 10 },
      },
    })
    if (!faction) {
      res.status(404).json({ error: { message: 'Faction not found' } })
      return
    }
    res.json({ data: faction })
  } catch (err) {
    next(err)
  }
})

export default router
