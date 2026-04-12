// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CrisisIndicator } from '../CrisisIndicator'

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

const defaultProps = {
  level: 'alert' as const,
  vix: 28.4,
  percentile: 95,
  locale: 'en',
}

describe('CrisisIndicator', () => {
  it('renders children', () => {
    mockMatchMedia(false)
    const { getByText } = render(
      <CrisisIndicator {...defaultProps}><span>VIX KPI Card</span></CrisisIndicator>,
    )
    expect(getByText('VIX KPI Card')).toBeTruthy()
  })

  it('renders with warning level', () => {
    mockMatchMedia(false)
    const { container } = render(
      <CrisisIndicator {...defaultProps} level="warning"><span>x</span></CrisisIndicator>,
    )
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot.style.backgroundColor).toContain('245, 158, 11')
  })

  it('renders with crisis level', () => {
    mockMatchMedia(false)
    const { container } = render(
      <CrisisIndicator {...defaultProps} level="crisis"><span>x</span></CrisisIndicator>,
    )
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot.style.backgroundColor).toContain('153, 27, 27')
  })

  it('does not pulse in reduced-motion mode', () => {
    mockMatchMedia(true)
    const { container } = render(
      <CrisisIndicator {...defaultProps}><span>x</span></CrisisIndicator>,
    )
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot.className).not.toContain('animate-pulse')
  })

  it('pulses in normal mode', () => {
    mockMatchMedia(false)
    const { container } = render(
      <CrisisIndicator {...defaultProps}><span>x</span></CrisisIndicator>,
    )
    const dot = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(dot.className).toContain('animate-pulse')
  })
})
