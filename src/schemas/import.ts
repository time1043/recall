import { z } from 'zod'

export const importSchema = z.object({
  url: z.url(),
})

export const bulkImportSchema = z.object({
  url: z.url(),
  search: z.string(),
})

export const bulkScrapeSchema = z.object({
  urls: z.array(z.url()),
})

// For firecrawl ai
export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})
// export type ExtractType = z.infer<typeof extractSchema>

export const searchSchema = z.object({
  query: z.string().min(1),
})
