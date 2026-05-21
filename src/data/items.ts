import { prisma } from '@/db'
import { authFnMiddleware } from '@/middlewares/auth'
import {
  bulkImportSchema,
  bulkScrapeSchema,
  importSchema,
} from '@/schemas/import'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
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
