import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { scrapeUrlFn } from '@/data/items'
import { importSchema } from '@/schemas/import'
import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function SignleImportForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const { success } = await scrapeUrlFn({ data: value })
        if (!success) toast.error('Something went wrong')
        if (success) toast.success('Scraped successfully')
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Single URL</CardTitle>
        <CardDescription>
          Scrape and save content from any web app! 👀
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      placeholder="https://react.dev/blog/2025/10/07/react-compiler-1"
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
                'Import URL'
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
