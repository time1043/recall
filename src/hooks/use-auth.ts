import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const navigate = useNavigate()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully')
          navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error(`Something went wrong: ${error.message}`)
        },
      },
    })
  }

  return { signOut }
}
