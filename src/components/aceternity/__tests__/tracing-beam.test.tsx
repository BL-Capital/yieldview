// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { TracingBeam } from '../tracing-beam'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      <div style={style} {...props}>{children}</div>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_v: unknown, _from: unknown, _to: unknown) => '0%',
}))

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

describe('TracingBeam', () => {
  it('renders children', () => {
    mockMatchMedia(false)
    const { getByText } = render(
      <TracingBeam><p>Test content</p></TracingBeam>,
    )
    expect(getByText('Test content')).toBeTruthy()
  })

  it('renders static line in reduced-motion mode', () => {
    mockMatchMedia(true)
    const { container } = render(
      <TracingBeam><p>Content</p></TracingBeam>,
    )
    // In reduced-motion mode: simple div with static bg-zinc-700 line
    const line = container.querySelector('.bg-zinc-700')
    expect(line).toBeTruthy()
  })

  it('renders beam track in animated mode', () => {
    mockMatchMedia(false)
    const { container } = render(
      <TracingBeam><p>Content</p></TracingBeam>,
    )
    const track = container.querySelector('.bg-zinc-800')
    expect(track).toBeTruthy()
  })

  it('applies custom className', () => {
    mockMatchMedia(false)
    const { container } = render(
      <TracingBeam className="custom-class"><p>x</p></TracingBeam>,
    )
    expect(container.firstChild).toHaveProperty('className')
    expect((container.firstChild as HTMLElement).className).toContain('custom-class')
  })
})
