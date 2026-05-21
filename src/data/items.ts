import { authFnMiddleware } from '@/middlewares/auth'
import {
  bulkScrapeSchema,
  bulkImportSchema,
  importSchema,
} from '@/schemas/import'
import { createServerFn } from '@tanstack/react-start'
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
