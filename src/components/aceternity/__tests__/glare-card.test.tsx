// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlareCard } from '../glare-card'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({
      matches: true, // reduced-motion = true
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
})

describe('GlareCard', () => {
  it('renders children', () => {
    render(<GlareCard><span>content</span></GlareCard>)
    expect(screen.getByText('content')).toBeTruthy()
  })

  it('does not render glare overlay in reduced-motion mode', () => {
    const { container } = render(<GlareCard><span>content</span></GlareCard>)
    const glareOverlay = container.querySelector('[aria-hidden="true"]')
    expect(glareOverlay).toBeNull()
  })
})
