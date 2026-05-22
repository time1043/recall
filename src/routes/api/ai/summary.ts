import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response('Hello, World!')
      },
    },
  },
})
