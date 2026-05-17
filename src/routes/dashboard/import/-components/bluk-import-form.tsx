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
import { mapUrlFn } from '@/data/items'
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
  >([
    {
      url: 'https://www.firecrawl.dev/blog/best-chunking-strategies-rag',
      title: 'Best Chunking Strategies for RAG (and LLMs) in 2026',
      description:
        'Compare seven chunking strategies for RAG systems using real benchmark data from NVIDIA and Chroma. Learn when to use recursive splitting, semantic chunking,...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/client-relationship-tree-visualization-in-python',
      title: 'How to Build a Client Relationship Tree Visualization Too...',
      description:
        'Build an application that discovers and visualizes client relationships by scraping websites with Firecrawl and presenting the data in an interactive tree st...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/ai-agent-sandbox',
      title: 'AI Agent Sandbox: How to Safely Run Autonomous Agents in ...',
      description:
        'An AI agent sandbox is an isolated execution environment where an agent can take actions without those actions affecting the host system. Learn how it works.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/ai-powered-web-scraping-solutions',
      title: 'Top 7 AI-Powered Web Scraping Solutions in 2026',
      description:
        'Discover the most advanced AI web scraping tools that are revolutionizing data extraction with natural language processing and machine learning capabilities.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/grok-2-setup-and-web-crawler-example',
      title: 'Getting Started with Grok-2: Setup and Web Crawler Example',
      description:
        'A detailed guide on setting up Grok-2 and building a web crawler using Firecrawl.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/claude-managed-agents',
      title: 'Claude Managed Agents: Full MCP Setup with Firecrawl and ...',
      description:
        'Learn how to set up Claude Managed Agents from scratch, connect Firecrawl and Linear as MCP tools, and automate AI news research into Linear tasks without th...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/launch-week-iii-day-5-dev-day',
      title: 'Developer Day: Launch Week III - Day 5',
      description:
        "Launch Week III Day 5 is all about developers. We're shipping big improvements to our Python and Rust SDKs, plus a new dark theme for your favorite code edit...",
    },
    {
      url: 'https://www.firecrawl.dev/blog/pdf-rag-system-langflow-firecrawl',
      title: 'Building a PDF RAG System with LangFlow and Firecrawl',
      description:
        'Build a PDF RAG system with LangFlow and Firecrawl: collect PDFs at scale, index them in Chroma DB, and query them through a Streamlit chat interface.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/ai-resume-parser-job-matcher-python',
      title: 'Building an AI Resume Job Matching App With Firecrawl And...',
      description:
        'Build an AI-powered job matching system that automatically scrapes job postings and matches them to your resume using Claude, Firecrawl, and Streamlit.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/mastering-firecrawl-search-endpoint',
      title: 'Mastering Firecrawl Search Endpoint: Web Search and Data ...',
      description:
        "Use Firecrawl's /v2/search endpoint to combine web search and full content extraction in a single API call. This guide walks through filtering by source and ...",
    },
    {
      url: 'https://www.firecrawl.dev/blog/contradiction-agent',
      title: 'Build an agent that checks for website contradictions',
      description:
        "Using Firecrawl and Claude to scrape your website's data and look for contradictions.",
    },
    {
      url: 'https://www.firecrawl.dev/blog/How-to-Create-an-llms-txt-File-for-Any-Website',
      title: 'How to Create an llms.txt File for Any Website',
      description:
        'Learn how to generate an llms.txt file for any website using the llms.txt Generator and Firecrawl.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/best-open-source-web-crawler',
      title: 'Best Open-Source Web Crawlers in 2026',
      description:
        'Compare the top 10 open-source web crawlers for 2026 including Firecrawl, Scrapy, Crawl4AI, and Playwright. Find the right crawler for your project with deta...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/brave-search-api-alternatives',
      title: 'Top 5 Brave Search API Alternatives in 2026',
      description:
        'Looking for Brave Search API alternatives? We compare Firecrawl, Exa, Tavily, Parallel AI, and LLMLayer on pricing, index quality, extraction depth, and AI a...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/introducing-browser-sandbox',
      title: 'Browser Sandbox: Secure Environments for Agents to Intera...',
      description:
        "Firecrawl Browser Sandbox gives AI agents a fully managed, isolated browser environment - zero config, pre-loaded with tools, and works alongside Firecrawl's...",
    },
    {
      url: 'https://www.firecrawl.dev/blog/branding-format-v2',
      title: 'Branding Format v2: Improved Logo Extraction',
      description:
        'Branding Format v2 delivers significantly improved logo extraction accuracy, better compatibility with modern site builders, and structured brand data for AI...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/gemma-3-fine-tuning-firecrawl-unsloth',
      title: 'Fine-tuning Gemma 3 on a Custom Web Dataset With Firecraw...',
      description:
        "Learn how to efficiently fine-tune Google's Gemma 3 language model on your custom dataset using Firecrawl for data collection and Unsloth AI for optimization.",
    },
    {
      url: 'https://www.firecrawl.dev/blog/langflow-tutorial-visual-ai-workflows',
      title: 'LangFlow Tutorial: Building Production-Ready AI Applicati...',
      description:
        "Learn how to build AI applications visually using LangFlow's drag-and-drop interface. This tutorial covers creating RAG systems, multi-agent workflows, and c...",
    },
    {
      url: 'https://www.firecrawl.dev/blog/how-replit-uses-firecrawl-to-power-ai-agents',
      title: 'How Replit Powers Replit Agent with Always-Fresh Web Data...',
      description:
        'How Replit uses Firecrawl to keep Replit Agent up to date with the latest API documentation and web content, with clean structured data on every request.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/best-pdf-parsers',
      title: 'Best PDF Parsers for AI and RAG Workflows in 2026',
      description:
        'A hands-on comparison of the best PDF parsers for AI and RAG pipelines in 2026, covering speed, output quality, table handling, and LLM-readiness for each tool.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/category/use-cases-and-examples',
      title: 'Firecrawl - Search, Scrape, and Clean the Web for AI Agents',
      description:
        'The web context API for AI agents. Search, scrape, parse, and interact with the live web — turn any source into clean Markdown or structured data your agents...',
    },
    {
      url: 'https://www.firecrawl.dev/blog/launch-week-i-day-5-real-time-crawling-websockets',
      title: 'Launch Week I / Day 5: Real-Time Crawling with WebSockets',
      description:
        'Our new WebSocket-based method for real-time data extraction and monitoring.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/firestarter-rag-chatbot-generator',
      title: 'Announcing Firestarter, our open source tool that turns a...',
      description:
        'Spin up a fully functional RAG chatbot from any website URL using Firecrawl and Upstash—clean markdown in, OpenAI-compatible API out, all in under a minute.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/launch-week-i-day-1-introducing-teams',
      title: 'Launch Week I / Day 1: Introducing Teams',
      description:
        'Our new Teams feature, enabling seamless collaboration on web scraping projects.',
    },
    {
      url: 'https://www.firecrawl.dev/blog/web-scraping-intro-for-beginners',
      title: 'Web Scraping for Beginners: A Step-by-Step Guide',
      description:
        "Learn how to collect data from websites using Python in this beginner's guide.",
    },
  ])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const alreadySelectedAll = selectedUrls.size === discoveredLinks.length

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

            <Button className="w-full">Import {selectedUrls.size} URLs</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
