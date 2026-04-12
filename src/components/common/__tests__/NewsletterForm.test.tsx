// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { NewsletterForm } from '../NewsletterForm'

// Mock motion and lottie
vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: () => <div data-testid="lottie" />,
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}))

// Import after mock
import { toast } from 'sonner'
const toastMock = toast as unknown as { success: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn>; warning: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> }

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

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

describe('NewsletterForm', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    mockFetch.mockReset()
    Object.values(toastMock).forEach((fn) => fn.mockReset())
  })

  it('renders input and submit button', () => {
    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    expect(getByPlaceholderText('your@email.com')).toBeTruthy()
    expect(getByText('Subscribe')).toBeTruthy()
  })

  it('renders in French', () => {
    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="fr" />,
    )
    expect(getByPlaceholderText('votre@email.com')).toBeTruthy()
    expect(getByText("S'abonner")).toBeTruthy()
  })

  it('shows validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    const input = getByPlaceholderText('your@email.com')
    fireEvent.change(input, { target: { value: 'bad' } })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(getByText('Invalid email address.')).toBeTruthy()
    })
  })

  it('calls API and shows success toast on 201', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 })

    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    fireEvent.change(getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith(
        'Thanks! Check your email to confirm.',
      )
    })
  })

  it('shows already subscribed toast on 409', async () => {
    mockFetch.mockResolvedValueOnce({ status: 409 })

    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    fireEvent.change(getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(toastMock.info).toHaveBeenCalledWith(
        "You're already subscribed!",
      )
    })
  })

  it('shows rate limit toast on 429', async () => {
    mockFetch.mockResolvedValueOnce({ status: 429 })

    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    fireEvent.change(getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(toastMock.warning).toHaveBeenCalledWith(
        'Too many attempts, try again in 1 minute.',
      )
    })
  })

  it('shows server error toast on 502', async () => {
    mockFetch.mockResolvedValueOnce({ status: 502 })

    const { getByPlaceholderText, getByText } = render(
      <NewsletterForm locale="en" />,
    )
    fireEvent.change(getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith(
        'Server error, try again later.',
      )
    })
  })

  it('shows Lottie icon after success', async () => {
    mockFetch.mockResolvedValueOnce({ status: 201 })

    const { getByPlaceholderText, getByText, getByTestId } = render(
      <NewsletterForm locale="en" />,
    )
    fireEvent.change(getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(getByText('Subscribe'))

    await waitFor(() => {
      expect(getByTestId('lottie')).toBeTruthy()
      expect(getByText('Email sent!')).toBeTruthy()
    })
  })
})
