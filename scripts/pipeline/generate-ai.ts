import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { generateBriefing, translateToEN } from '../../src/lib/claude.js';
import { buildUserPrompt } from './prompts/user-briefing.js';
import { AnalysisSchema, type Analysis } from '../../src/lib/schemas/analysis.js';
import type { Kpi } from '../../src/lib/schemas/kpi.js';
import type { AlertState } from '../../src/lib/schemas/alert.js';

// ─── Error ────────────────────────────────────────────────────────────────────

export class GenerateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenerateError';
  }
}

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── System prompt loader ─────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadSystemPrompt(): string {
  const promptPath = path.join(__dirname, 'prompts', 'system-chartiste-lettre.md');
  return fs.readFileSync(promptPath, 'utf-8');
}

// ─── Zod schema for partial Opus response ─────────────────────────────────────

const OpusResponseSchema = z.object({
  briefing: z.object({ fr: z.string().min(50) }),
  tagline: z.object({ fr: z.string().min(10) }),
  metadata: z.object({
    theme_of_day: z.object({ fr: z.string() }),
    certainty: z.enum(['preliminary', 'definitive']),
    upcoming_event: z.object({ fr: z.string() }).nullable(),
    risk_level: z.enum(['low', 'medium', 'high', 'crisis']),
  }),
});

type OpusResponse = z.infer<typeof OpusResponseSchema>;

// ─── Zod schema for Haiku translation response ───────────────────────────────

const HaikuResponseSchema = z.object({
  briefing: z.object({ en: z.string() }),
  tagline: z.object({ en: z.string() }),
  theme_of_day: z.object({ en: z.string() }),
  upcoming_event: z.object({ en: z.string() }).nullable(),
});

type HaikuResponse = z.infer<typeof HaikuResponseSchema>;

// ─── Call Opus with JSON retry ────────────────────────────────────────────────

async function callOpus(systemPrompt: string, userPrompt: string): Promise<OpusResponse> {
  const start = Date.now();
  let lastError = '';
  let lastRaw = '';

  for (let attempt = 1; attempt <= 2; attempt++) {
    const prompt = attempt === 1
      ? userPrompt
      : `La reponse precedente etait du JSON invalide. Erreur : ${lastError}\n\nReponse originale :\n${lastRaw}\n\nCorrige et retourne du JSON valide uniquement.`;

    const raw = await generateBriefing(systemPrompt, prompt);

    log('info', attempt === 1 ? 'opus complete' : 'opus retry complete', {
      attempt,
      duration_ms: Date.now() - start,
    });

    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      lastError = 'Invalid JSON from Claude';
      lastRaw = raw;
      if (attempt === 2) throw new GenerateError('Opus returned invalid JSON after retry');
      log('warn', 'retry after invalid JSON', { attempt: 2, error: 'parse error' });
      continue;
    }

    // Zod validation
    const validation = OpusResponseSchema.safeParse(parsed);
    if (!validation.success) {
      lastError = validation.error.message;
      lastRaw = raw;
      if (attempt === 2) throw new GenerateError(`Opus Zod validation failed after retry: ${lastError}`);
      log('warn', 'retry after invalid JSON', { attempt: 2, error: lastError });
      continue;
    }

    return validation.data;
  }

  throw new GenerateError('Unreachable');
}

// ─── Call Haiku for EN translation ────────────────────────────────────────────

async function callHaiku(opus: OpusResponse): Promise<HaikuResponse> {
  const start = Date.now();

  const textToTranslate = JSON.stringify({
    briefing_fr: opus.briefing.fr,
    tagline_fr: opus.tagline.fr,
    theme_of_day_fr: opus.metadata.theme_of_day.fr,
    upcoming_event_fr: opus.metadata.upcoming_event?.fr ?? null,
  });

  const translationPrompt = `Translate these French financial texts to English. Return a JSON object with these exact keys:
{
  "briefing": { "en": "..." },
  "tagline": { "en": "..." },
  "theme_of_day": { "en": "..." },
  "upcoming_event": { "en": "..." } or null
}

Texts to translate:
${textToTranslate}`;

  let lastError = '';
  let lastRaw = '';

  for (let attempt = 1; attempt <= 2; attempt++) {
    const prompt = attempt === 1
      ? translationPrompt
      : `The previous response was invalid JSON. Error: ${lastError}\n\nOriginal: ${lastRaw}\n\nPlease return valid JSON only.`;

    const raw = await translateToEN(prompt);

    log('info', attempt === 1 ? 'haiku complete' : 'haiku retry complete', {
      attempt,
      duration_ms: Date.now() - start,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      lastError = 'Invalid JSON from Haiku';
      lastRaw = raw;
      if (attempt === 2) throw new GenerateError('Haiku returned invalid JSON after retry');
      log('warn', 'retry after invalid Haiku JSON', { attempt: 2, error: 'parse error' });
      continue;
    }

    const validation = HaikuResponseSchema.safeParse(parsed);
    if (!validation.success) {
      lastError = validation.error.message;
      lastRaw = raw;
      if (attempt === 2) throw new GenerateError(`Haiku Zod validation failed after retry: ${lastError}`);
      log('warn', 'retry after invalid Haiku JSON', { attempt: 2, error: lastError });
      continue;
    }

    return validation.data;
  }

  throw new GenerateError('Unreachable');
}

// ─── Main exported function ───────────────────────────────────────────────────

export async function generateAnalysis(kpis: Kpi[], alert: AlertState): Promise<Analysis> {
  log('info', 'generate-ai start', { kpi_count: kpis.length, alert_active: alert.active });

  const systemPrompt = loadSystemPrompt();
  const userPrompt = buildUserPrompt(kpis, alert);

  // Step 1: Claude Opus — generate FR briefing
  const opus = await callOpus(systemPrompt, userPrompt);

  // Step 2: Claude Haiku — translate to EN
  const haiku = await callHaiku(opus);

  // Step 3: Assemble full Analysis object
  const now = new Date();
  const analysis: Analysis = {
    date: now.toISOString().slice(0, 10),
    generated_at: now.toISOString(),
    validated_at: null,
    pipeline_run_id: crypto.randomUUID(),
    version: 'ai',

    briefing: { fr: opus.briefing.fr, en: haiku.briefing.en },
    tagline: { fr: opus.tagline.fr, en: haiku.tagline.en },
    metadata: {
      theme_of_day: { fr: opus.metadata.theme_of_day.fr, en: haiku.theme_of_day.en },
      certainty: opus.metadata.certainty,
      upcoming_event: opus.metadata.upcoming_event
        ? { fr: opus.metadata.upcoming_event.fr, en: haiku.upcoming_event?.en ?? '' }
        : null,
      risk_level: opus.metadata.risk_level,
    },

    kpis,
    alert,

    ai_original: {
      briefing: { fr: opus.briefing.fr, en: haiku.briefing.en },
      tagline: { fr: opus.tagline.fr, en: haiku.tagline.en },
    },
  };

  // Step 4: Validate with full AnalysisSchema
  const validated = AnalysisSchema.parse(analysis);

  log('info', 'generate-ai complete', { pipeline_run_id: validated.pipeline_run_id });

  return validated;
}

// ─── Stdin reader ─────────────────────────────────────────────────────────────

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// ─── Standalone entry point ───────────────────────────────────────────────────

async function main(): Promise<void> {
  const start = Date.now();

  // Read fetch-data.ts output from stdin (piped in the workflow)
  const raw = await readStdin();
  if (!raw.trim()) {
    throw new GenerateError('No input on stdin — pipe fetch-data.ts output to this script');
  }

  const pipelineData = JSON.parse(raw) as { kpis: Kpi[]; fetchedAt: string; alert: AlertState };
  const { kpis, alert } = pipelineData;

  if (kpis.length === 0) {
    throw new GenerateError('Cannot generate: no KPIs available');
  }

  const analysis = await generateAnalysis(kpis, alert);
  process.stdout.write(JSON.stringify(analysis, null, 2) + '\n');

  log('info', 'main complete', { duration_ms: Date.now() - start });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    log('error', 'generate-ai fatal', { error: String(err) });
    process.exit(1);
  });
}
