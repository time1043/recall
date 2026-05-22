import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

// https://openrouter.ai/models?max_price=0&output_modalities=text
export const model = openrouter.chat('z-ai/glm-4.5-air:free')
