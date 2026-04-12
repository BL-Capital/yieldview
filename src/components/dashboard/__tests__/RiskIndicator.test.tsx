// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RiskIndicator } from '../RiskIndicator'

describe('RiskIndicator', () => {
  it('has correct aria-label for low risk in FR', () => {
    const { container } = render(<RiskIndicator alertLevel="low" locale="fr" />)
    const el = container.querySelector('[role="img"]')
    expect(el?.getAttribute('aria-label')).toBe('Indicateur de risque marché : calme')
  })

  it('has correct aria-label for crisis in EN', () => {
    const { container } = render(<RiskIndicator alertLevel="crisis" locale="en" />)
    const el = container.querySelector('[role="img"]')
    expect(el?.getAttribute('aria-label')).toBe('Market risk indicator: crisis')
  })

  it('renders 3 rings for alert level', () => {
    const { container } = render(<RiskIndicator alertLevel="alert" locale="fr" />)
    const rings = container.querySelectorAll('[aria-hidden="true"].rounded-full.border-2')
    expect(rings.length).toBe(3)
  })

  it('renders 1 ring for low level', () => {
    const { container } = render(<RiskIndicator alertLevel="low" locale="fr" />)
    const rings = container.querySelectorAll('[aria-hidden="true"].rounded-full.border-2')
    expect(rings.length).toBe(1)
  })

  it('defaults to low when alertLevel is null', () => {
    const { container } = render(<RiskIndicator alertLevel={null} locale="fr" />)
    const el = container.querySelector('[role="img"]')
    expect(el?.getAttribute('aria-label')).toBe('Indicateur de risque marché : calme')
  })
})
