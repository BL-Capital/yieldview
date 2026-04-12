import { z } from 'zod';

export const AlertLevelSchema = z.enum(['warning', 'alert', 'crisis']);

export const AlertStateSchema = z.object({
  active: z.boolean(),
  level: AlertLevelSchema.nullable(),
  vix_current: z.number(),
  vix_p90_252d: z.number(),
  triggered_at: z.iso.datetime().nullable(),
});

export type AlertLevel = z.infer<typeof AlertLevelSchema>;
export type AlertState = z.infer<typeof AlertStateSchema>;
