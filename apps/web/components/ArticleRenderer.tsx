'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface ArticleRendererProps {
  content: string
  className?: string
}

function processCallouts(content: string): string {
  return content
    .replace(/:::lore-note\n([\s\S]*?):::/g, '<div class="callout callout-lore">$1</div>')
    .replace(/:::warning\n([\s\S]*?):::/g, '<div class="callout callout-warning">$1</div>')
    .replace(/:::magic\n([\s\S]*?):::/g, '<div class="callout callout-magic">$1</div>')
}

export function ArticleRenderer({ content, className }: ArticleRendererProps) {
  const processed = processCallouts(content)

  return (
    <div
      className={cn(
        'prose-hesperedia',
        '[&_.callout]:my-4 [&_.callout]:px-4 [&_.callout]:py-3 [&_.callout]:rounded-lg [&_.callout]:border-l-4 [&_.callout]:text-sm',
        '[&_.callout-lore]:bg-lumen-50 [&_.callout-lore]:border-lumen-500 dark:[&_.callout-lore]:bg-lumen-900/10 dark:[&_.callout-lore]:border-lumen-600',
        '[&_.callout-warning]:bg-sanguis-50 [&_.callout-warning]:border-sanguis-500 dark:[&_.callout-warning]:bg-sanguis-900/10 dark:[&_.callout-warning]:border-sanguis-600',
        '[&_.callout-magic]:bg-vesper-50 [&_.callout-magic]:border-vesper-500 dark:[&_.callout-magic]:bg-vesper-900/10 dark:[&_.callout-magic]:border-vesper-600',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: '' }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{processed}</ReactMarkdown>
    </div>
  )
}
