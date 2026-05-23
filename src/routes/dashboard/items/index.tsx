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
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import {
  ItemListGridSkeleton,
  ItemListResolved,
} from './-components/items-list'

const PAGE_SIZE = 6

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
  validateSearch: itemsSearchSchema,
  head: () => ({
    meta: [
      { title: 'Saved Items' },
      { property: 'og:title', content: 'Saved Items' },
    ],
  }),
})

function RouteComponent() {
  const { q, status } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [searchInput, setSearchInput] = useState(q)
  const [items, setItems] = useState<
    Awaited<ReturnType<typeof getItemsFn>>['items']
  >([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  function setSearch(params: Partial<ItemsSearch>) {
    navigate({
      search: { q, status, ...params },
      replace: true,
    })
  }

  // Debounced search input
  useEffect(() => {
    if (searchInput === q) return
    const timeoutId = setTimeout(() => {
      setSearch({ q: searchInput })
    }, 800)
    return () => clearTimeout(timeoutId)
  }, [searchInput, q, navigate])

  // Fetch first page when search params change
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setItems([])
    setNextCursor(null)
    setHasMore(true)

    getItemsFn({ data: { cursor: null, limit: PAGE_SIZE, q, status } }).then(
      (result) => {
        if (cancelled) return
        setItems(result.items)
        setNextCursor(result.nextCursor)
        setHasMore(result.hasMore)
        setIsLoading(false)
      },
    )

    return () => {
      cancelled = true
    }
  }, [q, status])

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !nextCursor) return
    setIsLoadingMore(true)

    const result = await getItemsFn({
      data: { cursor: nextCursor, limit: PAGE_SIZE, q, status },
    })

    setItems((prev) => [...prev, ...result.items])
    setNextCursor(result.nextCursor)
    setHasMore(result.hasMore)
    setIsLoadingMore(false)
  }, [nextCursor, hasMore, isLoadingMore, q, status])

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
      {isLoading ? (
        <ItemListGridSkeleton />
      ) : (
        <ItemListResolved
          items={items}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMore={loadMore}
        />
      )}
    </div>
  )
}
