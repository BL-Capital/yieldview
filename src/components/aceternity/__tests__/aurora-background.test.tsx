// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuroraBackground } from '../aurora-background'
import { BackgroundBeams } from '../background-beams'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
})

describe('AuroraBackground', () => {
  it('renders children', () => {
    render(<AuroraBackground><span>Hello</span></AuroraBackground>)
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('has aria-hidden on decorative elements', () => {
    const { container } = render(<AuroraBackground><span>content</span></AuroraBackground>)
    const decorative = container.querySelector('[aria-hidden="true"]')
    expect(decorative).toBeTruthy()
  })
})

describe('BackgroundBeams', () => {
  it('renders a canvas with aria-hidden', () => {
    const { container } = render(<BackgroundBeams />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeTruthy()
    expect(canvas?.getAttribute('aria-hidden')).toBe('true')
  })
})
