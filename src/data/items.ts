import { firecrawl } from '@/lib/firecrawl'
import { importSchema } from '@/schemas/import'
import { createServerFn } from '@tanstack/react-start'

// https://tanstack.com/start/v0/docs/framework/react/guide/server-functions#parameters--validation

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(importSchema)
  .handler(async ({ data }) => {
    // const url = 'https://www.firecrawl.dev/blog/introducing-agent'
    const { url } = data

    // https://docs.firecrawl.dev/introduction#scrape
    const result = await firecrawl.scrape(url, {
      formats: ['markdown'], // markdown, html, images
      // onlyMainContent: true, // By default the scraper returns only the main content. Set to false to return full page content including navbar and so on.
    })
    console.log({ result })
  })
