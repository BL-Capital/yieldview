// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroAvatar } from '../HeroAvatar'

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

describe('HeroAvatar', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })

  it('has aria-label mentioning "faible" for riskLevel low', () => {
    render(<HeroAvatar riskLevel="low" />)
    expect(screen.getByLabelText(/faible/i)).toBeTruthy()
  })

  it('has aria-label mentioning "modéré" for riskLevel medium', () => {
    render(<HeroAvatar riskLevel="medium" />)
    expect(screen.getByLabelText(/modéré/i)).toBeTruthy()
  })

  it('has aria-label mentioning "élevé" for riskLevel high', () => {
    render(<HeroAvatar riskLevel="high" />)
    expect(screen.getByLabelText(/élevé/i)).toBeTruthy()
  })

  it('has aria-label mentioning "crise" for riskLevel crisis', () => {
    render(<HeroAvatar riskLevel="crisis" />)
    expect(screen.getByLabelText(/crise/i)).toBeTruthy()
  })

  it('renders the SVG image for low level', () => {
    const { container } = render(<HeroAvatar riskLevel="low" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toContain('low')
  })

  it('renders the SVG image for crisis level', () => {
    const { container } = render(<HeroAvatar riskLevel="crisis" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toContain('crisis')
  })
})
