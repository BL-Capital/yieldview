'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'

import { cn } from '@/lib/utils'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('markdown', markdown)

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  highlightLines?: number[]
  className?: string
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [highlighted, setHighlighted] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    try {
      const lang = hljs.getLanguage(language) ? language : 'plaintext'
      if (lang === 'plaintext') {
        // plaintext does not escape HTML — do it manually to prevent XSS
        setHighlighted(
          code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        )
        return
      }
      const result = hljs.highlight(code, { language: lang })
      setHighlighted(result.value)
    } catch {
      // Escape HTML entities to prevent XSS when hljs fails
      setHighlighted(
        code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      )
    }
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const lines = (highlighted || code).split('\n')

  const content = (
    <div className={cn('relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-zinc-400">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 uppercase">{language}</span>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-all',
              'border border-zinc-700 hover:border-yield-gold/60',
              'text-zinc-400 hover:text-yield-gold',
              'hover:bg-yield-gold/5',
              copied && 'border-yield-gold/60 text-yield-gold bg-yield-gold/5',
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {lines.map((line, i) => {
              const lineNum = i + 1
              const isHighlighted = highlightLines.includes(lineNum)
              return (
                <tr
                  key={i}
                  className={cn(
                    'group',
                    isHighlighted && 'bg-yield-gold/5 border-l-2 border-yield-gold',
                  )}
                >
                  <td className="select-none w-12 px-3 py-0.5 text-right font-mono text-zinc-600 text-xs align-top">
                    {lineNum}
                  </td>
                  <td className="px-4 py-0.5 font-mono text-zinc-200 whitespace-pre align-top">
                    <span dangerouslySetInnerHTML={{ __html: line || ' ' }} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (prefersReducedMotion) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {content}
    </motion.div>
  )
}

export default CodeBlock
