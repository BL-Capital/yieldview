import { z } from 'zod';
import { KpiSchema } from './kpi';
import { AlertStateSchema } from './alert';

const BilingualStringSchema = z.object({ fr: z.string(), en: z.string() });

const MetadataSchema = z.object({
  theme_of_day: BilingualStringSchema,
  certainty: z.enum(['preliminary', 'definitive']),
  upcoming_event: BilingualStringSchema.nullable(),
  risk_level: z.enum(['low', 'medium', 'high', 'crisis']),
});

export const AnalysisSchema = z.object({
  // Metadata pipeline
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generated_at: z.iso.datetime(),
  validated_at: z.iso.datetime().nullable(),
  pipeline_run_id: z.string().uuid(),
  version: z.enum(['ai', 'manual-override']),

  // Editorial
  briefing: BilingualStringSchema,
  tagline: BilingualStringSchema,
  metadata: MetadataSchema,

  // Market data
  kpis: z.array(KpiSchema),

  // Alert state
  alert: AlertStateSchema,

  // Archive IA (préservé si override manuel)
  ai_original: z.object({
    briefing: BilingualStringSchema,
    tagline: BilingualStringSchema,
  }).optional(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type DailyAnalysis = Analysis;
