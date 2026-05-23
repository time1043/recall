import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import type { getItemsFn } from '@/data/items'
import { copyToClipboard } from '@/lib/clipboard'
import { Link } from '@tanstack/react-router'
import { Copy, Inbox } from 'lucide-react'
import { use } from 'react'
import { toast } from 'sonner'
import type { ItemsSearch } from '..'

type ItemListResolvedProps = {
  itemsPromise: ReturnType<typeof getItemsFn>
  q: ItemsSearch['q']
  status: ItemsSearch['status']
}

export function ItemListResolved({
  itemsPromise,
  q,
  status,
}: ItemListResolvedProps) {
  const { success, data } = use(itemsPromise)
  if (!success) {
    toast.error('Something went wrong')
    return null
  }

  return <ItemList {...{ data, q, status }} />
}

type ItemListProps = {
  // data: SavedItemModel[]
  data: Awaited<ReturnType<typeof getItemsFn>>['data']
  q: ItemsSearch['q']
  status: ItemsSearch['status']
}

export default function ItemList({ data, q, status }: ItemListProps) {
  const filteredData = data.filter((item) => {
    // Filter by search query (matches title or tags)
    const matchesQuery =
      q === '' ||
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
    // Filter by status
    const matchesStatus = status === 'all' || item.status === status

    return matchesQuery && matchesStatus
  })

  if (filteredData.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="size-12" />
          </EmptyMedia>
          <EmptyTitle>
            {data.length === 0 ? 'No Items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {data.length === 0
              ? 'Import a Url to get started with saving your content'
              : 'No items match your current search filter'}
          </EmptyDescription>
        </EmptyHeader>

        {data.length === 0 && (
          <EmptyContent>
            <Link className={buttonVariants()} to="/dashboard/import">
              Import URL
            </Link>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredData.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden transition-all hover:shadow-lg pt-0"
        >
          <Link
            to="/dashboard/items/$itemId"
            params={{ itemId: item.id }}
            className="block"
          >
            {/* If it has no thumbnail, use a default one (gradient background) as fallback */}
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={
                  item.ogImage ??
                  'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                alt={item.title ?? 'Article Thumbnail'}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          <CardHeader className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant={item.status === 'COMPLETED' ? 'default' : 'secondary'}
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
  )
}

export function ItemListGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="space-y-3">
            {/* Status & Copy Button */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            {/* Title */}
            <Skeleton className="h-6 w-full" />
            {/* Author */}
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
