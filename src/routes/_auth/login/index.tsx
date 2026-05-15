import { LoginForm } from '@/routes/_auth/login/-components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
