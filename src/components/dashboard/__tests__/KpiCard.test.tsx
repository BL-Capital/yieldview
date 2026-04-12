// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KpiCard } from '../KpiCard'
import type { Kpi } from '@/lib/schemas/kpi'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => null,
}))

vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  disconnect() {}
  unobserve() {}
})

const mockBullKpi: Kpi = {
  id: 'cac40',
  category: 'indices',
  label: { fr: 'CAC 40', en: 'CAC 40' },
  value: 7234,
  unit: 'pts',
  change_day: 174.23,
  change_pct: 2.47,
  direction: 'up',
  source: 'finnhub',
  timestamp: '2026-04-12T06:30:00.000Z',
  freshness_level: 'live',
}

const mockBearKpi: Kpi = {
  ...mockBullKpi,
  id: 'eurusd',
  label: { fr: 'EUR/USD', en: 'EUR/USD' },
  value: 1.0823,
  unit: '',
  change_day: -0.0083,
  change_pct: -0.76,
  direction: 'down',
}

describe('KpiCard', () => {
  it('renders bull KPI with correct color class', () => {
    const { container } = render(<KpiCard kpi={mockBullKpi} />)
    const badge = container.querySelector('.text-bull')
    expect(badge).toBeTruthy()
  })

  it('renders bear KPI with correct color class', () => {
    const { container } = render(<KpiCard kpi={mockBearKpi} />)
    const badge = container.querySelector('.text-bear')
    expect(badge).toBeTruthy()
  })

  it('has a descriptive aria-label', () => {
    const { container } = render(<KpiCard kpi={mockBullKpi} />)
    const labeled = container.querySelector('[aria-label]')
    expect(labeled?.getAttribute('aria-label')).toContain('CAC 40')
    // Intl.NumberFormat locale-aware: fr-FR → +2,47% | en-US → +2.47%
    const ariaLabel = labeled?.getAttribute('aria-label') ?? ''
    expect(ariaLabel).toContain('CAC 40')
    expect(ariaLabel).toMatch(/\+2[,.]47%/)
  })

  it('renders the KPI label', () => {
    render(<KpiCard kpi={mockBullKpi} />)
    expect(screen.getByText('CAC 40')).toBeTruthy()
  })
})
