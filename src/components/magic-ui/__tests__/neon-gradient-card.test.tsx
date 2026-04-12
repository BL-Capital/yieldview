// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { NeonGradientCard } from '../neon-gradient-card'

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

describe('NeonGradientCard', () => {
  it('renders children', () => {
    mockMatchMedia(false)
    const { getByText } = render(
      <NeonGradientCard><span>Alert Content</span></NeonGradientCard>,
    )
    expect(getByText('Alert Content')).toBeTruthy()
  })

  it('renders with warning variant', () => {
    mockMatchMedia(false)
    const { container } = render(
      <NeonGradientCard variant="warning"><span>Warning</span></NeonGradientCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.background).toContain('245, 158, 11')
  })

  it('renders with alert variant', () => {
    mockMatchMedia(false)
    const { container } = render(
      <NeonGradientCard variant="alert"><span>Alert</span></NeonGradientCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.background).toContain('220, 38, 38')
  })

  it('renders with crisis variant', () => {
    mockMatchMedia(false)
    const { container } = render(
      <NeonGradientCard variant="crisis"><span>Crisis</span></NeonGradientCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.style.background).toContain('153, 27, 27')
  })

  it('applies custom className', () => {
    mockMatchMedia(false)
    const { container } = render(
      <NeonGradientCard className="custom-class"><span>x</span></NeonGradientCard>,
    )
    expect((container.firstChild as HTMLElement).className).toContain('custom-class')
  })

  it('does not pulse glow in reduced-motion mode', () => {
    mockMatchMedia(true)
    const { container } = render(
      <NeonGradientCard variant="alert"><span>x</span></NeonGradientCard>,
    )
    const glow = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(glow.className).not.toContain('animate-pulse')
  })

  it('pulses glow in normal mode', () => {
    mockMatchMedia(false)
    const { container } = render(
      <NeonGradientCard variant="alert"><span>x</span></NeonGradientCard>,
    )
    const glow = container.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(glow.className).toContain('animate-pulse')
  })
})
