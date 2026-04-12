import { describe, it, expect } from 'vitest'
import { GET } from '../route'

describe('GET /api/health', () => {
  it('returns 200 with ok status', async () => {
    const response = GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
    expect(new Date(data.timestamp).getTime()).not.toBeNaN()
  })
})
