import Anthropic from '@anthropic-ai/sdk';

// ─── Error ────────────────────────────────────────────────────────────────────

export class ClaudeError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ClaudeError';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: string, msg: string, extra?: Record<string, unknown>): void {
  console.error(JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }));
}

// ─── Singleton client ─────────────────────────────────────────────────────────

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;

  const key = process.env['ANTHROPIC_API_KEY'];
  if (!key) {
    throw new ClaudeError(
      'ANTHROPIC_API_KEY is not set. Add it to your environment variables.',
      0,
    );
  }

  _client = new Anthropic({ apiKey: key });
  return _client;
}

// Reset singleton (for testing only)
export function _resetClient(): void {
  _client = null;
}

// ─── Retry logic ──────────────────────────────────────────────────────────────

const RETRY_DELAYS_MS = [1000, 2000, 4000];

async function withRetry<T>(
  fn: () => Promise<T>,
  context: { model: string },
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const error = err as ClaudeError;
      // No retry on configuration errors (status 0 = missing key)
      if (error.status === 0) throw error;
      // No retry on 4xx except 429 (rate limit)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      lastError = error;
      log('warn', 'Claude retry', {
        attempt,
        model: context.model,
        status: error.status ?? null,
        error: error.message,
      });
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]));
      }
    }
  }

  throw lastError!;
}

// ─── API wrapper ──────────────────────────────────────────────────────────────

async function callClaude(
  model: string,
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
): Promise<{ text: string; usage: { input_tokens: number; output_tokens: number } }> {
  log('info', 'claude call start', { model, max_tokens: maxTokens });

  const response = await withRetry(
    async () => {
      const client = getClient();
      try {
        return await client.messages.create({
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContent }],
        });
      } catch (err) {
        // SDK throws Anthropic.APIError with a `status` field
        const status = typeof (err as { status?: number }).status === 'number'
          ? (err as { status: number }).status
          : 0;
        throw new ClaudeError(
          `Claude API ${status}: ${(err as Error).message ?? String(err)}`,
          status,
        );
      }
    },
    { model },
  );

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new ClaudeError(
      `Unexpected response block type: ${block?.type ?? 'empty'}`,
      0,
    );
  }

  log('info', 'claude call ok', {
    model,
    input_tokens: response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  });

  return { text: block.text, usage: response.usage };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a French briefing via Claude Opus 4.6.
 * Returns raw text (JSON parsing is the caller's responsibility).
 */
export async function generateBriefing(
  systemPrompt: string,
  userContent: string,
): Promise<string> {
  const { text } = await callClaude(
    'claude-opus-4-20250514',
    systemPrompt,
    userContent,
    2048,
  );
  return text;
}

/**
 * Translate French text to English via Claude Haiku 4.5.
 * Returns the translated text.
 */
export async function translateToEN(frenchText: string): Promise<string> {
  const { text } = await callClaude(
    'claude-haiku-4-5-20250514',
    'You are a professional financial translator. Translate the following French text to English. Preserve the tone, financial terminology, and formatting. Return only the translated text.',
    frenchText,
    2048,
  );
  return text;
}
