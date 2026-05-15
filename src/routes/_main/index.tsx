import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ChartAreaInteractive />
      <ChartAreaInteractive />
      <ChartAreaInteractive />
    </>
  )
}
