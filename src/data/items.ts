import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import type { ExtractType } from '@/schemas/import'
import { importSchema } from '@/schemas/import'
import { createServerFn } from '@tanstack/react-start'
import { getSessionFn } from './session'

// https://tanstack.com/start/v0/docs/framework/react/guide/server-functions#parameters--validation

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(importSchema)
  .handler(async ({ data }) => {
    // const url = 'https://www.firecrawl.dev/blog/introducing-agent'
    const { url } = data

    const {
      user: { id: userId },
    } = await getSessionFn()
    const item = await prisma.savedItem.create({
      data: {
        url,
        userId,
        status: 'PROCESSING',
      },
    })

    try {
      // https://docs.firecrawl.dev/introduction#scrape
      // https://docs.firecrawl.dev/features/llm-extract#json-mode-via-/scrape
      // https://github.com/firecrawl/firecrawl/pull/2604
      const result = await firecrawl.scrape(url, {
        formats: [
          'markdown',
          {
            type: 'json',
            // schema: extractSchema,
            prompt: 'please extract the author and also publishedAt timestamps',
          },
        ], // markdown, html, images
        // onlyMainContent: true, // By default the scraper returns only the main content. Set to false to return full page content including navbar and so on.
      })
      const { metadata, markdown } = result
      const jsonData = result.json as ExtractType

      let publishedAt = null
      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)
        if (!isNaN(parsed.getTime())) publishedAt = parsed
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: metadata?.title || null,
          content: markdown || null,
          ogImage: metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt,
          status: 'COMPLETED',
        },
      })

      return { success: true, data: updatedItem }
    } catch (error) {
      const failedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          status: 'FAILED',
        },
      })

      return { success: false, data: failedItem }
    }
  })
