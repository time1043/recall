import { z } from 'zod'

export const importSchema = z.object({
  url: z.string().url(),
})

export const bulkImportSchema = z.object({
  url: z.string().url(),
  search: z.string(),
})

// For firecrawl ai
export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})
export type ExtractType = z.infer<typeof extractSchema>
