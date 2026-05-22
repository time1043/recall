import { prisma } from '@/db'
import { model } from '@/lib/open-router'
import { authFnMiddleware } from '@/middlewares/auth'
import {
  bulkImportSchema,
  bulkScrapeSchema,
  importSchema,
} from '@/schemas/import'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { generateText } from 'ai'
import z from 'zod'
import {
  bulkScrapeUrlsService,
  mapUrlService,
  scrapeUrlService,
} from './items.service'

// https://tanstack.com/start/v0/docs/framework/react/guide/server-functions#parameters--validation

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data, context }) => {
    // const url = 'https://www.firecrawl.dev/blog/introducing-agent'
    const { url } = data
    const userId = context.session.user.id

    return await scrapeUrlService({ url, userId })
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportSchema)
  .handler(async ({ data }) => {
    // const url = 'https://www.firecrawl.dev/blog'
    // const search = 'blog'
    const { url, search } = data

    return await mapUrlService({ url, search })
  })

export const bulkScrapeUrlsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkScrapeSchema)
  .handler(async ({ data, context }) => {
    const { urls } = data
    const userId = context.session.user.id

    return await bulkScrapeUrlsService({ urls, userId })
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session.user.id

    try {
      const items = await prisma.savedItem.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      return { success: true, data: items }
    } catch (error) {
      return { success: false, data: [] }
    }
  })

export const getItemByIdFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const userId = context.session.user.id
    const { id } = data

    try {
      const item = await prisma.savedItem.findUnique({
        where: {
          id,
          userId,
        },
      })
      // https://tanstack.com/router/v1/docs/api/router/notFoundFunction
      if (!item) throw notFound()

      return { success: true, data: item }
    } catch (error) {
      return { success: false, data: null }
    }
  })

export const saveSummaryAndGenerateTagsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string(), summary: z.string() }))
  .handler(async ({ context, data }) => {
    const userId = context.session.user.id
    const { id, summary } = data

    // Check if item exists
    const existing = await prisma.savedItem.findUnique({
      where: {
        id,
        userId,
      },
    })
    if (!existing) throw notFound()

    try {
      // Generate tags from summary via AI
      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt(summary),
      })
      const tags = text
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
        .slice(0, 5)

      // Update item
      const item = await prisma.savedItem.update({
        where: {
          id,
          userId,
        },
        data: {
          summary,
          tags,
        },
      })

      return { success: true, data: item }
    } catch (error) {
      return { success: false, data: null }
    }
  })

const systemPrompt = `You are a helpful assistant that extracts relevant tags from content summaries.
Extract 3-5 short, relevant tags that categorize the content.
Return ONLY a comma-separated list of tags, nothing else.
Example: technology, programming, web development, javascript`

const userPrompt = (text: string) =>
  `Extract tags from this summary: \n\n${text}`
