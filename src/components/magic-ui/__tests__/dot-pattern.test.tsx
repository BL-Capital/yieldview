// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DotPattern } from '../dot-pattern'

describe('DotPattern', () => {
  it('renders an SVG element', () => {
    const { container } = render(<DotPattern />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('is aria-hidden (decorative)', () => {
    const { container } = render(<DotPattern />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders a pattern with correct width/height', () => {
    const { container } = render(<DotPattern width={24} height={24} />)
    const pattern = container.querySelector('pattern')
    expect(pattern?.getAttribute('width')).toBe('24')
    expect(pattern?.getAttribute('height')).toBe('24')
  })

  it('renders a circle with the given radius', () => {
    const { container } = render(<DotPattern cr={2} />)
    const circle = container.querySelector('circle')
    expect(circle?.getAttribute('r')).toBe('2')
  })

  it('applies custom className', () => {
    const { container } = render(<DotPattern className="text-red-500" />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('text-red-500')
  })
})
