// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { HeroSection } from '../HeroSection'

// Mock all heavy child components
vi.mock('@/components/aceternity/aurora-with-beams', () => ({
  AuroraWithBeams: ({ children }: React.PropsWithChildren) => <div data-testid="aurora">{children}</div>,
}))
vi.mock('@/components/rive/HeroAvatar', () => ({
  HeroAvatar: () => <div data-testid="hero-avatar" />,
}))
vi.mock('@/components/alerts/AlertBanner', () => ({
  AlertBanner: ({ level }: { level: string }) => <div data-testid="alert-banner" data-level={level} role="alert" />,
}))
vi.mock('../RiskIndicator', () => ({
  RiskIndicator: () => <div data-testid="risk-indicator" />,
}))
vi.mock('../TaglineHeader', () => ({
  TaglineHeader: () => <div data-testid="tagline" />,
}))
vi.mock('../MetadataChips', () => ({
  MetadataChips: () => <div data-testid="metadata" />,
}))
vi.mock('../BriefingPanel', () => ({
  BriefingPanel: () => <div data-testid="briefing" />,
}))
vi.mock('../FreshnessIndicator', () => ({
  FreshnessIndicator: () => <div data-testid="freshness" />,
}))
vi.mock('../KpiBentoGrid', () => ({
  KpiBentoGrid: () => <div data-testid="kpi-grid" />,
}))
vi.mock('../SecondaryKpisMarquee', () => ({
  SecondaryKpisMarquee: () => <div data-testid="marquee" />,
}))
vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <div data-testid="lottie" />,
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

const baseAnalysis = {
  date: '2026-04-12',
  generated_at: '2026-04-12T06:30:00.000Z',
  validated_at: null,
  pipeline_run_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  version: 'ai' as const,
  briefing: { fr: 'Briefing FR', en: 'Briefing EN' },
  tagline: { fr: 'Tagline FR', en: 'Tagline EN' },
  metadata: {
    theme_of_day: { fr: 'Thème', en: 'Theme' },
    certainty: 'definitive' as const,
    upcoming_event: null,
    risk_level: 'low' as const,
  },
  kpis: [{
    id: 'cac40',
    category: 'indices' as const,
    label: { fr: 'CAC 40', en: 'CAC 40' },
    value: 7234.56,
    unit: 'pts',
    change_day: 174.23,
    change_pct: 2.47,
    direction: 'up' as const,
    source: 'finnhub' as const,
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live' as const,
  }],
  alert: {
    active: false,
    level: null,
    vix_current: 22.4,
    vix_p90_252d: 28.0,
    triggered_at: null,
  },
}

describe('HeroSection', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    sessionStorage.clear()
  })

  it('does NOT render AlertBanner when alert.active is false', () => {
    const { queryByTestId } = render(
      <HeroSection analysis={baseAnalysis} locale="en" secondaryKpis={[]} />,
    )
    expect(queryByTestId('alert-banner')).toBeNull()
  })

  it('renders AlertBanner when alert.active is true', () => {
    const alertAnalysis = {
      ...baseAnalysis,
      alert: {
        active: true,
        level: 'alert' as const,
        vix_current: 28.4,
        vix_p90_252d: 24.2,
        triggered_at: '2026-04-11T16:30:00Z',
      },
    }
    const { getByTestId } = render(
      <HeroSection analysis={alertAnalysis} locale="en" secondaryKpis={[]} />,
    )
    expect(getByTestId('alert-banner')).toBeTruthy()
    expect(getByTestId('alert-banner').getAttribute('data-level')).toBe('alert')
  })

  it('renders core sections', () => {
    const { getByTestId } = render(
      <HeroSection analysis={baseAnalysis} locale="en" secondaryKpis={[]} />,
    )
    expect(getByTestId('aurora')).toBeTruthy()
    expect(getByTestId('hero-avatar')).toBeTruthy()
    expect(getByTestId('tagline')).toBeTruthy()
    expect(getByTestId('briefing')).toBeTruthy()
  })
})
