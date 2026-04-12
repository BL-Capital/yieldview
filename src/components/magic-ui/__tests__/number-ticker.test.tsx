// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NumberTicker } from '../number-ticker'

// Mock usePrefersReducedMotion to return true — shows final value immediately
vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    disconnect() {}
    unobserve() {}
  })
})

describe('NumberTicker', () => {
  it('renders integer value', () => {
    render(<NumberTicker value={1234} decimalPlaces={0} />)
    expect(screen.getByText('1234')).toBeTruthy()
  })

  it('renders decimal value', () => {
    render(<NumberTicker value={2.47} decimalPlaces={2} />)
    expect(screen.getByText('2.47')).toBeTruthy()
  })

  it('renders negative value', () => {
    render(<NumberTicker value={-0.83} decimalPlaces={2} />)
    expect(screen.getByText('-0.83')).toBeTruthy()
  })

  it('applies prefix and suffix', () => {
    render(<NumberTicker value={42} decimalPlaces={0} prefix="$" suffix="k" />)
    expect(screen.getByText('$42k')).toBeTruthy()
  })
})
