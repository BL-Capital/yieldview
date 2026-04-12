// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FreshnessIndicator } from '../FreshnessIndicator'

const RECENT = new Date(Date.now() - 30 * 60_000).toISOString() // 30 min ago

describe('FreshnessIndicator', () => {
  it('renders Live label in FR', () => {
    render(
      <FreshnessIndicator publishedAt={RECENT} freshnessLevel="fresh" locale="fr" />,
    )
    expect(screen.getByText(/Live/)).toBeTruthy()
    expect(screen.getByText(/Mis à jour/)).toBeTruthy()
  })

  it('renders Live label in EN', () => {
    render(
      <FreshnessIndicator publishedAt={RECENT} freshnessLevel="fresh" locale="en" />,
    )
    expect(screen.getByText(/Updated/)).toBeTruthy()
  })

  it('applies stale color class when freshnessLevel=stale', () => {
    const { container } = render(
      <FreshnessIndicator publishedAt={RECENT} freshnessLevel="stale" locale="fr" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root?.className).toContain('text-bear')
  })

  it('applies fresh color class when freshnessLevel=fresh', () => {
    const { container } = render(
      <FreshnessIndicator publishedAt={RECENT} freshnessLevel="fresh" locale="fr" />,
    )
    const root = container.firstChild as HTMLElement
    expect(root?.className).toContain('text-bull')
  })
})
