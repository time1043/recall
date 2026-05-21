import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getItemsFn } from '@/data/items'
import { ItemStatus } from '@/generated/prisma/enums'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import ItemList from './-components/items-list'

const itemsSearchSchema = z.object({
  q: z.string().default(''),
  status: z
    .union([z.literal('all'), z.enum(ItemStatus)])
    .default('all')
    .catch('all'),
})
export type ItemsSearch = z.infer<typeof itemsSearchSchema>

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => getItemsFn(),
  validateSearch: itemsSearchSchema,
})

function RouteComponent() {
  const { success, data } = Route.useLoaderData()
  if (!success) toast.error('Something went wrong')

  const { q, status } = Route.useSearch()
  const navigate = Route.useNavigate()
  // const navigate = useNavigate({ from: Route.fullPath })

  const [searchInput, setSearchInput] = useState(q)

  function setSearch(params: Partial<ItemsSearch>) {
    navigate({
      search: { q, status, ...params },
      replace: true,
    })
  }

  useEffect(() => {
    if (searchInput === q) return

    // debounce
    const timeoutId = setTimeout(() => {
      // navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
      setSearch({ q: searchInput })
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [searchInput, q, navigate])

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">
          Your saved articles and content!
        </p>
      </div>

      {/* Search and Filter controls */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by title or tags"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Select
          value={status}
          onValueChange={(v) => setSearch({ status: v as typeof status })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ItemStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List of saved items */}
      <ItemList {...{ data, q, status }} />
    </div>
  )
}
