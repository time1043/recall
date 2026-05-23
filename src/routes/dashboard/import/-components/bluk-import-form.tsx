import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import type { BulkScrapeProgress } from '@/data/items'
import { bulkScrapeUrlsFn, mapUrlFn } from '@/data/items'
import { bulkImportSchema } from '@/schemas/import'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function BlukImportForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: bulkImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const { success, data } = await mapUrlFn({ data: value })
        if (!success) toast.error('Something went wrong')
        if (success) {
          toast.success('Scraped successfully')
          setDiscoveredLinks(data)
        }
      })
    },
  })

  const [discoveredLinks, setDiscoveredLinks] = useState<
    Array<SearchResultWeb>
  >([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const alreadySelectedAll = selectedUrls.size === discoveredLinks.length
  const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)

  function handleSelectAll() {
    if (alreadySelectedAll) setSelectedUrls(new Set())
    else setSelectedUrls(new Set(discoveredLinks.map((link) => link.url)))
  }

  function handleToggleUrl(url: string) {
    const newSelected = new Set(selectedUrls)
    if (newSelected.has(url)) newSelected.delete(url)
    else newSelected.add(url)
    setSelectedUrls(newSelected)
  }

  const [bulkIsPending, bulkStartTransition] = useTransition()

  function handleBulkImport() {
    bulkStartTransition(async () => {
      if (selectedUrls.size === 0) {
        toast.error('Please select at least one URL')
        return
      }

      setProgress({
        completed: 0,
        total: selectedUrls.size,
        url: '',
        status: 'success',
      })
      let successCount = 0
      let failedCount = 0

      const stream = await bulkScrapeUrlsFn({
        data: { urls: Array.from(selectedUrls) },
      })
      for await (const update of stream) {
        setProgress(update)

        if (update.status === 'success') successCount++
        if (update.status === 'failed') failedCount++
      }

      if (failedCount > 0)
        toast.error(`Imported ${successCount} URLs (${failedCount} failed)`)
      else toast.success(`Imported ${successCount} URLs successfully`)

      setSelectedUrls(new Set())
      setProgress(null)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import</CardTitle>
        <CardDescription>
          Discover and import multiple URLs from a website at once 🚀
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                      placeholder="https://www.firecrawl.dev/blog"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name="search"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Filter (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                      placeholder="e.g. blog, docs, tutorial"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing...
                </>
              ) : (
                'Import URLs'
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Discovered links */}
        {discoveredLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Found {discoveredLinks.length} URLs
              </p>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {alreadySelectedAll ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-4">
              {discoveredLinks.map((link) => (
                <label
                  key={link.url}
                  className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md p-2"
                >
                  <Checkbox
                    className="mt-0.5"
                    checked={selectedUrls.has(link.url)}
                    onCheckedChange={() => handleToggleUrl(link.url)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {link.title ?? 'Title has not been found'}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {link.description ?? 'Description has not been found'}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {link.url}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Importing: {progress.completed} / {progress.total}
                  </span>
                  <span className="font-medium">
                    {Math.round((progress.completed / progress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(progress.completed / progress.total) * 100} />
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={handleBulkImport}
              disabled={bulkIsPending}
            >
              {bulkIsPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {progress
                    ? `Importing ${progress.completed} / ${progress.total}`
                    : 'Starting import...'}
                </>
              ) : (
                `Import ${selectedUrls.size} URLs`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
