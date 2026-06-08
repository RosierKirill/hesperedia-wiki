import { MetadataRoute } from 'next'
import { api } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hesperedia.wiki'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/map`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/characters`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/bestiary`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/lore`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/community`, changeFrequency: 'daily', priority: 0.6 },
  ]

  try {
    const [charRes, articleRes, creatureRes] = await Promise.all([
      api.get('/characters?pageSize=100'),
      api.get('/articles?pageSize=100'),
      api.get('/bestiary?pageSize=100'),
    ])

    const characters = charRes.data.data?.data ?? []
    const articles = articleRes.data.data?.data ?? []
    const creatures = creatureRes.data.data?.data ?? []

    const dynamicPages: MetadataRoute.Sitemap = [
      ...characters.map((c: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/characters/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...articles.map((a: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/lore/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...creatures.map((c: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/bestiary/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]

    return [...staticPages, ...dynamicPages]
  } catch {
    return staticPages
  }
}
