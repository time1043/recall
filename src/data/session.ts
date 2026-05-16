import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    // authClient  // only works on the client-side
    // auth.api  // only works on the server-side

    // https://better-auth.com/docs/integrations/tanstack#protecting-resources
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    // https://tanstack.com/router/latest/docs/api/router/redirectFunction
    if (!session) throw redirect({ to: '/login' })
    return session
  },
)
