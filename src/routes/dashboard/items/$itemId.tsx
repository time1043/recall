import { MessageResponse } from '@/components/ai-elements/message'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { getItemByIdFn, saveSummaryAndGenerateTagsFn } from '@/data/items'
import { cn } from '@/lib/utils'
import type { FileRoutesByTo } from '@/routeTree.gen'
import { useCompletion } from '@ai-sdk/react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  ExternalLink,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

// Server-side
// import { Route as RouteApiAiSummary } from '@/routes/api/ai/summary'
// RouteApiAiSummary.to

export const Route = createFileRoute('/dashboard/items/$itemId')({
  component: RouteComponent,
  loader: ({ params }) => getItemByIdFn({ data: { id: params.itemId } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.data?.title ?? 'Item Details' },
      {
        property: 'twitter:title',
        content: loaderData?.data?.title ?? 'Item Details',
      },
      { property: 'og:image', content: loaderData?.data?.ogImage ?? '' },
    ],
  }),
})

function RouteComponent() {
  const router = useRouter()

  const { success, data } = Route.useLoaderData()
  if (!success) toast.error('Something went wrong')

  const [contentOpen, setContentOpen] = useState(false)

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/ai/summary' as const satisfies keyof FileRoutesByTo,
    initialCompletion: data?.summary ? data.summary : undefined,
    streamProtocol: 'text',
    body: {
      itemId: data?.id,
    },
    onFinish: async (_prompt, completionText) => {
      toast.success('Summary generated successfully and saving...')
      await saveSummaryAndGenerateTagsFn({
        data: {
          id: data!.id,
          summary: completionText,
        },
      })
      // https://tanstack.com/router/v1/docs/guide/data-mutations#invalidating-tanstack-router-after-a-mutation
      router.invalidate()
      toast.success('Summary generated and saved successfully')
    },
    onError: ({ message }) => {
      toast.error(`Something went wrong: ${message}`)
    },
  })

  function handleGenerateSummary() {
    if (!data?.content) {
      toast.error('No content available to generate summary')
      return
    }
    toast.success('Generating summary...')
    complete(data.content)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      <div className="flex justify-start">
        <Link
          to="/dashboard/items"
          className={buttonVariants({ variant: 'outline' })}
        >
          <ArrowLeft />
          Go Back
        </Link>
      </div>

      {/* Cover */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <img
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          src={
            data?.ogImage ??
            'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={data?.title ?? 'Item Image'}
        />
      </div>

      <div className="space-y-3">
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          {data?.title ?? 'Untitled'}
        </h1>
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {data?.author && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" />
              {data.author}
            </span>
          )}
          {data?.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {new Date(data.publishedAt).toLocaleDateString('en-US')}
            </span>
          )}
          {data?.createdAt && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              Saved {new Date(data.createdAt).toLocaleDateString('en-US')}
            </span>
          )}
        </div>
        {/* Redirect the user to an external website */}
        <a
          href={data?.url}
          target="_blank"
          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
        >
          View Original <ExternalLink className="size-3.5" />
        </a>

        {/* Tags */}
        {data?.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Summary Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  Summary
                </h2>

                {completion || data?.summary ? (
                  <MessageResponse>{completion}</MessageResponse>
                ) : (
                  <p className="text-muted-foreground italic">
                    {data?.content
                      ? 'No summary yet. Generate on with AI.'
                      : 'No content available to summarize.'}
                  </p>
                )}
              </div>

              {data?.content && !data.summary && (
                <Button
                  size="sm"
                  onClick={() => handleGenerateSummary()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        {data?.content && (
          <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="font-medium">Full Content</span>
                <ChevronDown
                  className={cn(
                    contentOpen ? 'rotate-180' : '',
                    'size4 transition-transform duration-200',
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent>
                  <MessageResponse>{data.content}</MessageResponse>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}
