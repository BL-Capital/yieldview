// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TextGenerateEffect } from '../text-generate-effect'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true, // affiche tout directement
}))

vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    disconnect() {}
    unobserve() {}
  },
)

describe('TextGenerateEffect', () => {
  it('renders the complete text in reduced-motion mode', () => {
    render(<TextGenerateEffect words="Les marchés, chaque jour, avec une voix." />)
    expect(screen.getByText('Les marchés, chaque jour, avec une voix.')).toBeTruthy()
  })

  it('renders as a p element in reduced-motion mode', () => {
    const { container } = render(<TextGenerateEffect words="Hello world" />)
    const p = container.querySelector('p')
    expect(p?.textContent).toBe('Hello world')
  })
})
