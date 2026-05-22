import { prisma } from '@/db'
import { model } from '@/lib/open-router'
import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const userId = context?.session.user.id
        const { itemId, prompt } = await request.json()
        if (!itemId || !prompt)
          return new Response('Missing itemId or prompt', { status: 400 })

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userId,
          },
        })
        if (!item) return new Response('Item not found', { status: 404 })

        // Stream summary
        const result = streamText({
          model,
          system: systemPrompt,
          prompt: userPrompt(prompt),
        })
        // Return the stream in the format useCompletion expects
        return result.toTextStreamResponse()
      },
    },
  },
})

const systemPrompt = `You are a helpful assistant that creates concise, informative summaries of web content.
Your summaries should:
- Be 2-3 paragraphs long
- Capture the main points and key takeaways
- Be written in a clear, professional tone`

const userPrompt = (text: string) =>
  `Please summarize the following content:\n\n${text}`
