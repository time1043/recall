import { createFileRoute } from '@tanstack/react-router'
import SearchForm from './-components/search-form'

export const Route = createFileRoute('/dashboard/discover/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Discover</h1>
          <p className="text-muted-foreground pt-2">
            Search the web for articles on any topic.
          </p>
        </div>

        <SearchForm />
      </div>
    </div>
  )
}
