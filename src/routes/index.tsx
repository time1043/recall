import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <ChartAreaInteractive />
      <ChartAreaInteractive />
      <ChartAreaInteractive />
    </>
  )
}
