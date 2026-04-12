// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BriefingPanel } from '../BriefingPanel'
import { MetadataChips } from '../MetadataChips'

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  disconnect() {}
  unobserve() {}
})

const DISCLAIMER = 'Les informations présentées sont à titre informatif uniquement.'
const BRIEFING_FR = 'Le CAC 40 progresse dans un contexte de reprise modérée.\nLes investisseurs restent vigilants face aux tensions géopolitiques.'
const BRIEFING_EN = 'The CAC 40 advances in a context of moderate recovery.\nInvestors remain cautious amid geopolitical tensions.'

describe('BriefingPanel', () => {
  it('renders FR text when locale=fr', () => {
    render(
      <BriefingPanel
        briefingFr={BRIEFING_FR}
        briefingEn={BRIEFING_EN}
        locale="fr"
        disclaimer={DISCLAIMER}
      />,
    )
    expect(screen.getByText(DISCLAIMER)).toBeTruthy()
  })

  it('renders disclaimer in DOM', () => {
    render(
      <BriefingPanel
        briefingFr={BRIEFING_FR}
        briefingEn={BRIEFING_EN}
        locale="fr"
        disclaimer={DISCLAIMER}
      />,
    )
    expect(screen.getByText(DISCLAIMER)).toBeTruthy()
  })
})

describe('MetadataChips', () => {
  it('renders crisis alert chip', () => {
    render(
      <MetadataChips
        publishedAt="2026-04-12T06:30:00.000Z"
        readingTimeMin={3}
        alertLevel="crisis"
        locale="fr"
      />,
    )
    expect(screen.getByText('ALERTE CRITIQUE')).toBeTruthy()
  })

  it('renders calm alert chip in EN', () => {
    render(
      <MetadataChips
        publishedAt="2026-04-12T06:30:00.000Z"
        readingTimeMin={3}
        alertLevel="low"
        locale="en"
      />,
    )
    expect(screen.getByText('Calm market')).toBeTruthy()
  })

  it('does not render alert chip when alertLevel is null', () => {
    const { queryByText } = render(
      <MetadataChips
        publishedAt="2026-04-12T06:30:00.000Z"
        readingTimeMin={3}
        alertLevel={null}
        locale="fr"
      />,
    )
    expect(queryByText('Marché calme')).toBeNull()
  })
})
