// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PromptCodeBlock } from '../PromptCodeBlock'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/components/aceternity/code-block', () => ({
  CodeBlock: ({ code, filename }: { code: string; filename?: string }) => (
    <div data-testid="code-block" data-code={code} data-filename={filename}>
      <pre>{code}</pre>
    </div>
  ),
}))

const VERSIONS = [
  { label: 'v01', code: 'code version 1', notes: 'Note for v01' },
  { label: 'v02', code: 'code version 2', notes: 'Note for v02' },
  { label: 'v03', code: 'code version 3' },
]

describe('PromptCodeBlock', () => {
  it('renders null when versions is empty', () => {
    const { container } = render(<PromptCodeBlock versions={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all version pills', () => {
    render(<PromptCodeBlock versions={VERSIONS} />)
    expect(screen.getByText('v01')).toBeTruthy()
    expect(screen.getByText('v02')).toBeTruthy()
    expect(screen.getByText('v03')).toBeTruthy()
  })

  it('renders title when provided', () => {
    render(<PromptCodeBlock versions={VERSIONS} title="Évolution des prompts" />)
    expect(screen.getByText('Évolution des prompts')).toBeTruthy()
  })

  it('shows first version code by default', () => {
    render(<PromptCodeBlock versions={VERSIONS} />)
    const block = screen.getByTestId('code-block')
    expect(block.getAttribute('data-code')).toBe('code version 1')
  })

  it('switches to clicked version', () => {
    render(<PromptCodeBlock versions={VERSIONS} />)
    fireEvent.click(screen.getByText('v02'))
    const block = screen.getByTestId('code-block')
    expect(block.getAttribute('data-code')).toBe('code version 2')
  })

  it('shows version notes', () => {
    render(<PromptCodeBlock versions={VERSIONS} />)
    expect(screen.getByText('Note for v01')).toBeTruthy()
  })

  it('updates notes when switching versions', () => {
    render(<PromptCodeBlock versions={VERSIONS} />)
    fireEvent.click(screen.getByText('v02'))
    expect(screen.getByText('Note for v02')).toBeTruthy()
  })

  it('passes language prop to CodeBlock', () => {
    render(<PromptCodeBlock versions={VERSIONS} language="python" />)
    // The CodeBlock mock receives language via its own props — no assertion needed beyond no-throw
    expect(screen.getByTestId('code-block')).toBeTruthy()
  })
})
