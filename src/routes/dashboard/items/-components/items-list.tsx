import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { useEffect, useRef } from 'react'

type Item = NonNullable<Awaited<ReturnType<typeof getItemsFn>>['items']>[number]

type ItemListResolvedProps = {
  items: Item[]
  hasMore: boolean
  isLoadingMore: boolean
  loadMore: () => void
}

export function ItemListResolved({
  items,
  hasMore,
  isLoadingMore,
  loadMore,
}: ItemListResolvedProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loadMore])

  if (items.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="size-12" />
          </EmptyMedia>
          <EmptyTitle>No Items saved yet</EmptyTitle>
          <EmptyDescription>
            Import a URL to get started with saving your content
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link className={buttonVariants()} to="/dashboard/import">
            Import URL
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {isLoadingMore && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden pt-0">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="size-8 rounded-md" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-4" />}
    </div>
  )
}

function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg pt-0">
      <Link
        to="/dashboard/items/$itemId"
        params={{ itemId: item.id }}
        className="block"
      >
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

        {item.summary && (
          <CardDescription className="line-clamp-3 text-sm">
            {item.summary}
          </CardDescription>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {item.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

export function ItemListGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
