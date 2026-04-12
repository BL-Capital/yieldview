import { fileURLToPath } from 'url';
import { uploadJSON } from '../../src/lib/r2.js';
import { AnalysisSchema, type Analysis } from '../../src/lib/schemas/analysis.js';

// ─── Error ────────────────────────────────────────────────────────────────────

export class PublishError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublishError';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function publishAnalysis(analysis: Analysis): Promise<void> {
  log('info', 'publish-r2 start', { date: analysis.date, pipeline_run_id: analysis.pipeline_run_id });

  // 1. Upload latest.json (what the frontend reads)
  await uploadJSON('latest.json', analysis);
  log('info', 'uploaded latest.json');

  // 2. Upload daily archive
  const archiveKey = `archive/${analysis.date}.json`;
  await uploadJSON(archiveKey, analysis);
  log('info', 'uploaded archive', { key: archiveKey });

  log('info', 'publish-r2 complete', { keys: ['latest.json', archiveKey] });
}

// ─── Standalone entry point (reads from stdin) ────────────────────────────────

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function main(): Promise<void> {
  const raw = await readStdin();
  if (!raw.trim()) {
    throw new PublishError('No input on stdin — pipe generate-ai.ts output to this script');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new PublishError('Invalid JSON on stdin');
  }

  const analysis = AnalysisSchema.parse(parsed);
  await publishAnalysis(analysis);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'publish-r2 fatal', { error: String(err) });
    process.exit(1);
  });
}
