import { fileURLToPath } from 'url';
import { AnalysisSchema, type Analysis } from '../../src/lib/schemas/analysis.js';
import { downloadJSON } from '../../src/lib/r2.js';

// ─── Error ────────────────────────────────────────────────────────────────────

export class NewsletterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewsletterError';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg: `[newsletter] ${msg}`, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 2000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry non-retryable errors (4xx client errors)
      const isRetryable = !(error instanceof Error && 'retryable' in error && (error as Error & { retryable: boolean }).retryable === false);
      log('warn', `Attempt ${attempt}/${maxRetries} failed`, {
        error: error instanceof Error ? error.message : String(error),
        retryable: isRetryable,
      });
      if (!isRetryable || attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}

// ─── Buttondown API ─────────────────────────────────────────────────────────

async function sendNewsletter(apiKey: string, subject: string, body: string): Promise<void> {
  const response = await fetch('https://api.buttondown.email/v1/emails', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject,
      body,
      status: 'sent',
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const error = new NewsletterError(`Buttondown API returned ${response.status}: ${text}`);
    // Only retry on 5xx server errors, not 4xx client errors
    if (response.status < 500) {
      (error as NewsletterError & { retryable: boolean }).retryable = false;
    }
    throw error;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendDailyNewsletter(analysis: Analysis): Promise<void> {
  const apiKey = process.env['BUTTONDOWN_API_KEY'];
  if (!apiKey) {
    throw new NewsletterError('BUTTONDOWN_API_KEY is not set');
  }

  const subject = analysis.tagline.fr;
  const body = `${analysis.briefing.fr}\n\n---\n\n${analysis.briefing.en}`;

  log('info', 'Sending newsletter', { date: analysis.date, subject });

  await withRetry(() => sendNewsletter(apiKey, subject, body));

  log('info', 'Newsletter sent successfully', { date: analysis.date });
}

// ─── Standalone entry point (fetches latest.json from R2) ────────────────────

async function fetchLatestFromR2(): Promise<Analysis> {
  log('info', 'Fetching latest.json from R2');
  const raw = await downloadJSON<unknown>('latest.json');
  const parsed = AnalysisSchema.safeParse(raw);
  if (!parsed.success) {
    throw new NewsletterError(`Invalid analysis data from R2: ${parsed.error.issues.map(i => i.message).join(', ')}`);
  }
  return parsed.data;
}

async function main(): Promise<void> {
  try {
    const analysis = await fetchLatestFromR2();
    await sendDailyNewsletter(analysis);
  } catch (error) {
    log('error', 'Failed to send newsletter', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Run main() when executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
