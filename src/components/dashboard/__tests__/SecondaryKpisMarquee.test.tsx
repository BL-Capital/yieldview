// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SecondaryKpisMarquee } from '../SecondaryKpisMarquee'
import { STATIC_SECONDARY_KPIS } from '@/data/mock-kpis'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true, // static list mode
}))

describe('SecondaryKpisMarquee', () => {
  it('renders all 8 KPI labels', () => {
    render(<SecondaryKpisMarquee kpis={STATIC_SECONDARY_KPIS} />)
    expect(screen.getAllByText('DAX').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Nasdaq').length).toBeGreaterThan(0)
    expect(screen.getAllByText('OAT 10Y').length).toBeGreaterThan(0)
  })

  it('renders without animation in reduced-motion mode', () => {
    const { container } = render(<SecondaryKpisMarquee kpis={STATIC_SECONDARY_KPIS} />)
    // In reduced-motion, no marquee animation class
    const animated = container.querySelector('[class*="animate-[marquee"]')
    expect(animated).toBeNull()
  })
})
