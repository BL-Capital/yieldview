// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ShineBorder } from '../shine-border'

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

describe('ShineBorder', () => {
  it('renders children', () => {
    mockMatchMedia(false)
    const { getByText } = render(<ShineBorder><span>Hello</span></ShineBorder>)
    expect(getByText('Hello')).toBeTruthy()
  })

  it('applies custom className', () => {
    mockMatchMedia(false)
    const { container } = render(
      <ShineBorder className="my-class"><span>x</span></ShineBorder>,
    )
    expect(container.firstChild).toHaveProperty('className')
    expect((container.firstChild as HTMLElement).className).toContain('my-class')
  })

  it('renders static border in reduced-motion mode', () => {
    mockMatchMedia(true)
    const { container } = render(
      <ShineBorder color="#C9A84C" borderWidth={2}><span>x</span></ShineBorder>,
    )
    const div = container.firstChild as HTMLElement
    expect(div.style.border).toContain('2px')
    // JSDOM normalizes hex to rgb
    expect(div.style.border).toMatch(/solid/)
  })

  it('renders animated wrapper in normal mode', () => {
    mockMatchMedia(false)
    const { container } = render(
      <ShineBorder duration={4}><span>y</span></ShineBorder>,
    )
    const div = container.firstChild as HTMLElement
    // animation style should be present
    expect(div.style.animation).toContain('4s')
  })

  it('accepts array of colors', () => {
    mockMatchMedia(false)
    // Should not throw with array color prop
    expect(() =>
      render(<ShineBorder color={['#C9A84C', '#F59E0B']}><span>z</span></ShineBorder>),
    ).not.toThrow()
  })
})
