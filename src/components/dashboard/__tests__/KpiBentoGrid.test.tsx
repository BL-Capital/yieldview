// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KpiBentoGrid } from '../KpiBentoGrid'
import { MOCK_PRIMARY_KPIS } from '@/data/mock-kpis'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  disconnect() {}
  unobserve() {}
})

describe('KpiBentoGrid', () => {
  it('renders all 6 KPI cards', () => {
    render(<KpiBentoGrid kpis={MOCK_PRIMARY_KPIS} locale="fr" />)
    expect(screen.getByText('CAC 40')).toBeTruthy()
    expect(screen.getByText('S&P 500')).toBeTruthy()
    expect(screen.getByText('VIX')).toBeTruthy()
    expect(screen.getByText('Or')).toBeTruthy()
  })

  it('renders in EN locale', () => {
    render(<KpiBentoGrid kpis={MOCK_PRIMARY_KPIS} locale="en" />)
    expect(screen.getByText('Gold')).toBeTruthy()
  })

  it('renders without error with mock data', () => {
    expect(() => render(<KpiBentoGrid kpis={MOCK_PRIMARY_KPIS} />)).not.toThrow()
  })
})
