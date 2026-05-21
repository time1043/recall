import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
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
import { copyToClipboard } from '@/lib/clipboard'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const itemsSearchSchema = z.object({
  q: z.string().default(''),
  status: z
    .union([z.literal('all'), z.enum(ItemStatus)])
    .default('all')
    .catch('all'),
})
type ItemsSearch = z.infer<typeof itemsSearchSchema>

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
      <div className="grid gap-6 md:grid-cols-2">
        {data.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden transition-all hover:shadow-lg pt-0"
          >
            <Link to="/dashboard" className="block">
              {item.ogImage && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={item.ogImage}
                    alt={item.title ?? 'Article Thumbnail'}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
            </Link>

            <CardHeader className="space-y-3 pt-4">
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={
                    item.status === 'COMPLETED' ? 'default' : 'secondary'
                  }
                >
                  {item.status.toLowerCase()}
                </Badge>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={async (e) => {
                    e.preventDefault()
                    await copyToClipboard(item.url)
                  }}
                >
                  <Copy className="size-4" />
                </Button>
              </div>

              <CardTitle className="line-clamp-1 text-xl leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>

              {item.author && (
                <p className="text-xs text-muted-foreground">{item.author}</p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
