// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Meteors } from '../meteors'

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

describe('Meteors', () => {
  it('renders meteors with low density (8)', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors density="low" />)
    const meteors = container.querySelectorAll('.animate-meteor')
    expect(meteors.length).toBe(8)
  })

  it('renders meteors with medium density (15)', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors density="medium" />)
    const meteors = container.querySelectorAll('.animate-meteor')
    expect(meteors.length).toBe(15)
  })

  it('renders meteors with high density (25)', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors density="high" />)
    const meteors = container.querySelectorAll('.animate-meteor')
    expect(meteors.length).toBe(25)
  })

  it('defaults to medium density', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors />)
    const meteors = container.querySelectorAll('.animate-meteor')
    expect(meteors.length).toBe(15)
  })

  it('renders nothing in reduced-motion mode', () => {
    mockMatchMedia(true)
    const { container } = render(<Meteors density="high" />)
    expect(container.innerHTML).toBe('')
  })

  it('has aria-hidden on container', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('aria-hidden')).toBe('true')
  })

  it('applies custom className', () => {
    mockMatchMedia(false)
    const { container } = render(<Meteors className="custom" />)
    expect((container.firstChild as HTMLElement).className).toContain('custom')
  })
})
