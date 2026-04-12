// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { AlertBanner } from '../AlertBanner'

// Mock motion/react — simplified, no unused destructuring
vi.mock('motion/react', () => ({
  motion: {
    // eslint-disable-next-line react/display-name
    div: (props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
      const { children, onKeyDown, ...rest } = props
      // Strip motion-specific props
      const safeProps = Object.fromEntries(
        Object.entries(rest).filter(([k]) => !['initial', 'animate', 'exit', 'transition'].includes(k)),
      )
      return <div onKeyDown={onKeyDown} {...safeProps}>{children}</div>
    },
  },
  // eslint-disable-next-line react/display-name
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock dialog components at the UI level
vi.mock('@/components/ui/dialog', () => ({
  // eslint-disable-next-line react/display-name
  Dialog: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  // eslint-disable-next-line react/display-name
  DialogTrigger: ({ children }: React.PropsWithChildren) => <button>{children}</button>,
  // eslint-disable-next-line react/display-name
  DialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  // eslint-disable-next-line react/display-name
  DialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  // eslint-disable-next-line react/display-name
  DialogTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  // eslint-disable-next-line react/display-name
  DialogDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
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

const defaultProps = {
  level: 'alert' as const,
  vix: 28.4,
  percentile: 24.2,
  triggeredAt: '2026-04-11T16:30:00Z',
  locale: 'en',
}

describe('AlertBanner', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    sessionStorage.clear()
  })

  it('renders with alert level', () => {
    const { getByText } = render(<AlertBanner {...defaultProps} />)
    expect(getByText('Market Under Stress')).toBeTruthy()
  })

  it('renders with warning level in French', () => {
    const { getByText } = render(
      <AlertBanner {...defaultProps} level="warning" locale="fr" />,
    )
    expect(getByText('Marché sous surveillance')).toBeTruthy()
  })

  it('renders with crisis level', () => {
    const { getByText } = render(
      <AlertBanner {...defaultProps} level="crisis" />,
    )
    expect(getByText('Market Alert')).toBeTruthy()
  })

  it('displays VIX data', () => {
    const { getByText } = render(<AlertBanner {...defaultProps} />)
    expect(getByText(/VIX at p24/)).toBeTruthy()
    expect(getByText(/Current: 28\.4/)).toBeTruthy()
  })

  it('has role="alert" and aria-live="assertive"', () => {
    const { container } = render(<AlertBanner {...defaultProps} />)
    const alertEl = container.querySelector('[role="alert"]')
    expect(alertEl).toBeTruthy()
    expect(alertEl!.getAttribute('aria-live')).toBe('assertive')
  })

  it('dismiss button hides the banner', () => {
    const { getByText, container } = render(<AlertBanner {...defaultProps} />)
    const dismissBtn = getByText('Dismiss')
    fireEvent.click(dismissBtn)
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(sessionStorage.getItem('yf-alert-dismissed')).toBe('true')
  })

  it('renders details button', () => {
    const { getByText } = render(<AlertBanner {...defaultProps} />)
    expect(getByText('View details →')).toBeTruthy()
  })

  it('stays dismissed across re-renders via sessionStorage', () => {
    sessionStorage.setItem('yf-alert-dismissed', 'true')
    const { container } = render(<AlertBanner {...defaultProps} />)
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})
