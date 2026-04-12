// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../subscribe/route'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function createRequest(body: unknown, ip = '127.0.0.1'): NextRequest {
  const req = new NextRequest('http://localhost/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  })
  return req
}

describe('/api/newsletter/subscribe', () => {
  beforeEach(() => {
    vi.stubEnv('BUTTONDOWN_API_KEY', 'test-api-key')
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns 201 on successful subscription', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 201 }))

    const res = await POST(createRequest({ email: 'test@example.com' }))
    expect(res.status).toBe(201)

    const data = await res.json()
    expect(data.message).toContain('Check your email')
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(createRequest({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for missing body', async () => {
    const req = new NextRequest('http://localhost/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.0.0.1' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 409 for already subscribed', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: 'This subscriber already exists.' }), { status: 400 }),
    )

    const res = await POST(createRequest({ email: 'existing@example.com' }, '10.0.0.2'))
    expect(res.status).toBe(409)
  })

  it('returns 502 when Buttondown fails', async () => {
    mockFetch.mockResolvedValueOnce(new Response('', { status: 500 }))

    const res = await POST(createRequest({ email: 'test@example.com' }, '10.0.0.3'))
    expect(res.status).toBe(502)
  })

  it('returns 502 when BUTTONDOWN_API_KEY is missing', async () => {
    vi.stubEnv('BUTTONDOWN_API_KEY', '')
    // Delete the env var
    delete process.env['BUTTONDOWN_API_KEY']

    const res = await POST(createRequest({ email: 'test@example.com' }, '10.0.0.4'))
    expect(res.status).toBe(502)
  })

  it('returns 429 when rate limited', async () => {
    mockFetch.mockResolvedValue(new Response('{}', { status: 201 }))
    const ip = '192.168.1.100'

    // 3 requests should succeed
    for (let i = 0; i < 3; i++) {
      await POST(createRequest({ email: `test${i}@example.com` }, ip))
    }

    // 4th should be rate limited
    const res = await POST(createRequest({ email: 'test4@example.com' }, ip))
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('60')
  })

  it('sends double opt-in (type: unactivated) to Buttondown', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await POST(createRequest({ email: 'test@example.com' }, '10.0.0.5'))

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.buttondown.email/v1/subscribers',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"type":"unactivated"'),
      }),
    )
  })

  it('lowercases and trims email', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}', { status: 201 }))

    await POST(createRequest({ email: '  Test@Example.COM  ' }, '10.0.0.6'))

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('test@example.com'),
      }),
    )
  })
})
