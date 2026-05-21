import { createClientOnlyFn } from '@tanstack/react-start'
import { toast } from 'sonner'

// Tanstack Start is isomorphic by default
// This specific code should only run on the client side, and not on the server side
export const copyToClipboard = createClientOnlyFn(async (text: string) => {
  await navigator.clipboard.writeText(text) // Web Api
  toast.success('Copied to clipboard')

  return
})
