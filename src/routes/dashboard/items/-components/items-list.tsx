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
import type { getItemsFn } from '@/data/items'
import { copyToClipboard } from '@/lib/clipboard'
import { Link } from '@tanstack/react-router'
import { Copy, Inbox } from 'lucide-react'
import type { ItemsSearch } from '..'

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
