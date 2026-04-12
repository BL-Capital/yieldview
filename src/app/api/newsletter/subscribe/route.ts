import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

// Simple in-memory rate limiter (IP-based, 3/min) with TTL purge
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_MAX_ENTRIES = 10_000

function purgeStaleEntries(now: number): void {
  if (rateLimitMap.size <= RATE_LIMIT_MAX_ENTRIES) return
  for (const [key, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (recent.length === 0) {
      rateLimitMap.delete(key)
    } else {
      rateLimitMap.set(key, recent)
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  purgeStaleEntries(now)

  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate limiting
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    )
  }

  // Validate email
  const parsed = SubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email address.' },
      { status: 400 },
    )
  }

  const email = parsed.data.email

  // Proxy to Buttondown
  const apiKey = process.env['BUTTONDOWN_API_KEY']
  if (!apiKey) {
    console.error('[newsletter] BUTTONDOWN_API_KEY is not configured')
    return NextResponse.json(
      { error: 'Newsletter service is not configured.' },
      { status: 502 },
    )
  }

  try {
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        type: 'unactivated', // double opt-in
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (response.status === 201) {
      return NextResponse.json(
        { message: 'Subscription successful. Check your email to confirm.' },
        { status: 201 },
      )
    }

    if (response.status === 400) {
      const data = await response.json().catch(() => ({}))
      // Buttondown returns 400 for already-subscribed
      const errorMessages = JSON.stringify(data).toLowerCase()
      if (errorMessages.includes('already') || errorMessages.includes('subscriber')) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 },
        )
      }
      return NextResponse.json(
        { error: 'Invalid subscription request.' },
        { status: 400 },
      )
    }

    console.error(`[newsletter] Buttondown returned ${response.status}`)
    return NextResponse.json(
      { error: 'Newsletter service error. Please try again later.' },
      { status: 502 },
    )
  } catch (error) {
    console.error('[newsletter] Failed to reach Buttondown:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Newsletter service unavailable. Please try again later.' },
      { status: 502 },
    )
  }
}
