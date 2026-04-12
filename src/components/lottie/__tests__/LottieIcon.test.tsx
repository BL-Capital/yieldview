// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LottieIcon } from '../LottieIcon'

// Mock @lottiefiles/dotlottie-react — canvas-based, not available in jsdom
vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({ src, style }: { src: string; style?: React.CSSProperties }) => (
    <div data-testid="dotlottie" data-src={src} style={style} />
  ),
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

describe('LottieIcon', () => {
  describe('normal mode (no reduced motion)', () => {
    beforeEach(() => {
      mockMatchMedia(false)
    })

    it('renders DotLottieReact with correct src', () => {
      render(<LottieIcon src="/lottie/arrow-up.lottie" size={20} />)
      const el = screen.getByTestId('dotlottie')
      expect(el).toBeTruthy()
      expect(el.getAttribute('data-src')).toBe('/lottie/arrow-up.lottie')
    })

    it('applies aria-hidden on wrapper', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-up.lottie" />)
      const wrapper = container.querySelector('[aria-hidden="true"]')
      expect(wrapper).toBeTruthy()
    })

    it('uses default size 24 when size not provided', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-up.lottie" />)
      const wrapper = container.querySelector('[aria-hidden="true"]') as HTMLElement
      expect(wrapper.style.width).toBe('24px')
      expect(wrapper.style.height).toBe('24px')
    })

    it('applies custom size', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-up.lottie" size={32} />)
      const wrapper = container.querySelector('[aria-hidden="true"]') as HTMLElement
      expect(wrapper.style.width).toBe('32px')
      expect(wrapper.style.height).toBe('32px')
    })
  })

  describe('reduced motion mode', () => {
    beforeEach(() => {
      mockMatchMedia(true)
    })

    it('renders SVG fallback instead of DotLottieReact', () => {
      render(<LottieIcon src="/lottie/arrow-up.lottie" />)
      expect(screen.queryByTestId('dotlottie')).toBeNull()
      const svg = document.querySelector('svg')
      expect(svg).toBeTruthy()
    })

    it('renders up arrow SVG for arrow-up src', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-up.lottie" size={20} />)
      const path = container.querySelector('path')
      expect(path?.getAttribute('fill')).toBe('#22C55E')
    })

    it('renders down arrow SVG for arrow-down src', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-down.lottie" size={20} />)
      const path = container.querySelector('path')
      expect(path?.getAttribute('fill')).toBe('#EF4444')
    })

    it('renders neutral rect for arrow-neutral src', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-neutral.lottie" size={20} />)
      const rect = container.querySelector('rect')
      expect(rect?.getAttribute('fill')).toBe('#6B7280')
    })

    it('renders gold circle for loading-pulse src', () => {
      const { container } = render(<LottieIcon src="/lottie/loading-pulse.lottie" size={20} />)
      const circle = container.querySelector('circle')
      expect(circle?.getAttribute('fill')).toBe('#C9A84C')
    })

    it('still applies aria-hidden in fallback mode', () => {
      const { container } = render(<LottieIcon src="/lottie/arrow-up.lottie" />)
      const wrapper = container.querySelector('[aria-hidden="true"]')
      expect(wrapper).toBeTruthy()
    })
  })
})
