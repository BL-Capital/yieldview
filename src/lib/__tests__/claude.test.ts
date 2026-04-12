import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock SDK ─────────────────────────────────────────────────────────────────

const mockCreate = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  function MockAnthropic() {
    return { messages: { create: mockCreate } };
  }
  MockAnthropic.prototype = {};
  return { default: MockAnthropic };
});

import { generateBriefing, translateToEN, ClaudeError, _resetClient } from '../claude';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeResponse(text: string, inputTokens = 100, outputTokens = 200) {
  return {
    content: [{ type: 'text' as const, text }],
    usage: { input_tokens: inputTokens, output_tokens: outputTokens },
  };
}

/** Create an error with a `status` field (duck-typed like Anthropic.APIError) */
function makeAPIError(status: number, message: string) {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  process.env['ANTHROPIC_API_KEY'] = 'test-key';
  _resetClient();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  delete process.env['ANTHROPIC_API_KEY'];
  _resetClient();
});

// ─── generateBriefing ─────────────────────────────────────────────────────────

describe('generateBriefing', () => {
  it('returns text from Claude Opus response', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('{"briefing":"test"}'));

    const result = await generateBriefing('system prompt', 'user content');

    expect(result).toBe('{"briefing":"test"}');
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-opus-4-20250514',
        max_tokens: 2048,
        system: 'system prompt',
      }),
    );
  });

  it('throws ClaudeError when ANTHROPIC_API_KEY is missing', async () => {
    delete process.env['ANTHROPIC_API_KEY'];
    _resetClient();

    await expect(generateBriefing('sys', 'usr')).rejects.toThrow(ClaudeError);
    await expect(generateBriefing('sys', 'usr')).rejects.toThrow('ANTHROPIC_API_KEY is not set');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws ClaudeError on unexpected block type', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'tool_use', id: 'x', name: 'y', input: {} }],
      usage: { input_tokens: 10, output_tokens: 10 },
    });

    await expect(generateBriefing('sys', 'usr')).rejects.toThrow('Unexpected response block type');
  });
});

// ─── translateToEN ────────────────────────────────────────────────────────────

describe('translateToEN', () => {
  it('returns translated text from Claude Haiku', async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('Translated text'));

    const result = await translateToEN('Texte en français');

    expect(result).toBe('Translated text');
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-haiku-4-5-20250514',
        max_tokens: 2048,
      }),
    );
  });
});

// ─── Retry logic ──────────────────────────────────────────────────────────────

describe('retry', () => {
  it('retries on 429 and succeeds', async () => {
    mockCreate
      .mockRejectedValueOnce(makeAPIError(429, 'Rate limited'))
      .mockResolvedValueOnce(makeResponse('ok'));

    const promise = generateBriefing('sys', 'usr');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('ok');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('retries on 500 and succeeds', async () => {
    mockCreate
      .mockRejectedValueOnce(makeAPIError(500, 'Server error'))
      .mockResolvedValueOnce(makeResponse('ok'));

    const promise = generateBriefing('sys', 'usr');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('ok');
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry on 400 — throws immediately', async () => {
    mockCreate.mockRejectedValueOnce(makeAPIError(400, 'Bad request'));

    await expect(generateBriefing('sys', 'usr')).rejects.toThrow(ClaudeError);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry on 401 — throws immediately', async () => {
    mockCreate.mockRejectedValueOnce(makeAPIError(401, 'Unauthorized'));

    await expect(generateBriefing('sys', 'usr')).rejects.toThrow(ClaudeError);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry on status 0 (missing key)', async () => {
    delete process.env['ANTHROPIC_API_KEY'];
    _resetClient();

    await expect(generateBriefing('sys', 'usr')).rejects.toThrow(ClaudeError);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws after 3 failed retries', async () => {
    mockCreate.mockRejectedValue(makeAPIError(429, 'Rate limited'));

    const promise = expect(generateBriefing('sys', 'usr')).rejects.toThrow(ClaudeError);
    await vi.runAllTimersAsync();
    await promise;

    expect(mockCreate).toHaveBeenCalledTimes(3);
  });
});
