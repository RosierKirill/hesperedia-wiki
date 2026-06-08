import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'

const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q ?? '').trim()
    const type = req.query.type as string | undefined

    if (q.length < 2) {
      res.json({ data: [] })
      return
    }

    const search = { contains: q, mode: 'insensitive' as const }
    const results: unknown[] = []

    if (!type || type === 'character') {
      const characters = await prisma.character.findMany({
        where: { publishedAt: { not: null }, OR: [{ name: search }, { species: search }] },
        select: { id: true, slug: true, name: true, portraitUrl: true, primaryForce: true },
        take: 5,
      })
      results.push(...characters.map((c) => ({ ...c, type: 'character' })))
    }

    if (!type || type === 'creature') {
      const creatures = await prisma.creature.findMany({
        where: { publishedAt: { not: null }, name: search },
        select: { id: true, slug: true, name: true, portraitUrl: true, category: true },
        take: 5,
      })
      results.push(...creatures.map((c) => ({ ...c, type: 'creature' })))
    }

    if (!type || type === 'article') {
      const articles = await prisma.article.findMany({
        where: { publishedAt: { not: null }, OR: [{ title: search }, { excerpt: search }] },
        select: { id: true, slug: true, title: true, excerpt: true, coverImageUrl: true },
        take: 5,
      })
      results.push(...articles.map((a) => ({ ...a, name: a.title, type: 'article' })))
    }

    if (!type || type === 'faction') {
      const factions = await prisma.faction.findMany({
        where: { publishedAt: { not: null }, name: search },
        select: { id: true, slug: true, name: true, logoUrl: true },
        take: 5,
      })
      results.push(...factions.map((f) => ({ ...f, type: 'faction' })))
    }

    if (!type || type === 'location') {
      const locations = await prisma.location.findMany({
        where: { name: search },
        select: { id: true, slug: true, name: true, type: true },
        take: 5,
      })
      results.push(...locations.map((l) => ({ ...l, type: 'location' })))
    }

    res.json({ data: results })
  } catch (err) {
    next(err)
  }
})

export default router
