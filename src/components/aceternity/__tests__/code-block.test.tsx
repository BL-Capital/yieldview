// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CodeBlock } from '../code-block'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div {...props}>{children}</div>,
  },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('highlight.js', () => ({
  default: {
    getLanguage: () => true,
    // Preserve the code content (with newlines) so line-splitting works correctly
    highlight: (code: string, _opts: unknown) => ({ value: code }),
  },
}))

Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
})

describe('CodeBlock', () => {
  it('renders filename when provided', () => {
    render(<CodeBlock code="const x = 1" filename="example.ts" />)
    expect(screen.getByText('example.ts')).toBeTruthy()
  })

  it('renders language label', () => {
    render(<CodeBlock code="const x = 1" language="typescript" />)
    expect(screen.getByText('typescript')).toBeTruthy()
  })

  it('renders a copy button', () => {
    render(<CodeBlock code="hello" />)
    const btn = screen.getByRole('button', { name: /copy/i })
    expect(btn).toBeTruthy()
  })

  it('calls clipboard.writeText on copy click', async () => {
    render(<CodeBlock code="hello world" />)
    const btn = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(btn)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world')
  })

  it('renders line numbers', () => {
    const { container } = render(<CodeBlock code={'line1\nline2\nline3'} />)
    const rows = container.querySelectorAll('tr')
    // One row per line
    expect(rows.length).toBe(3)
  })

  it('highlights specified lines with a border class', () => {
    const { container } = render(
      <CodeBlock code={'a\nb\nc'} highlightLines={[2]} />,
    )
    const rows = Array.from(container.querySelectorAll('tr'))
    // Line 2 should have the highlight border class
    const highlightedRow = rows.find(tr => tr.className.includes('border-yield-gold'))
    expect(highlightedRow).toBeTruthy()
  })
})
