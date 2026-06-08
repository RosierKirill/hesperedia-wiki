import { generateSlug as utilSlug } from '../utils/slug'
import { prisma } from '../prisma'

type PrismaModel = {
  findUnique: (args: { where: { slug: string } }) => Promise<unknown>
}

export async function generateUniqueSlug(name: string, model: PrismaModel): Promise<string> {
  const base = utilSlug(name)
  let slug = base
  let attempt = 0

  while (await model.findUnique({ where: { slug } })) {
    attempt++
    slug = `${base}-${attempt}`
  }

  return slug
}

export async function ensureUniqueCharacterSlug(name: string): Promise<string> {
  return generateUniqueSlug(name, prisma.character)
}

export async function ensureUniqueArticleSlug(name: string): Promise<string> {
  return generateUniqueSlug(name, prisma.article)
}

export async function ensureUniqueCreatureSlug(name: string): Promise<string> {
  return generateUniqueSlug(name, prisma.creature)
}
