import { describe, it, expect } from 'vitest';
import { AlertLevelSchema, AlertStateSchema } from '../alert';

const validAlertState = {
  active: true,
  level: 'warning',
  vix_current: 28.5,
  vix_p90_252d: 25.3,
  triggered_at: '2026-04-12T06:00:00.000Z',
};

const inactiveAlertState = {
  active: false,
  level: null,
  vix_current: 15.2,
  vix_p90_252d: 25.3,
  triggered_at: null,
};

describe('AlertLevelSchema', () => {
  it('validates all alert levels', () => {
    const levels = ['warning', 'alert', 'crisis'] as const;
    for (const level of levels) {
      expect(() => AlertLevelSchema.parse(level)).not.toThrow();
    }
  });

  it('rejects invalid level', () => {
    expect(() => AlertLevelSchema.parse('none')).toThrow();
    expect(() => AlertLevelSchema.parse('critical')).toThrow();
  });
});

describe('AlertStateSchema', () => {
  it('validates an active alert state', () => {
    expect(() => AlertStateSchema.parse(validAlertState)).not.toThrow();
    const result = AlertStateSchema.parse(validAlertState);
    expect(result.active).toBe(true);
    expect(result.level).toBe('warning');
  });

  it('validates an inactive alert state (null level and triggered_at)', () => {
    expect(() => AlertStateSchema.parse(inactiveAlertState)).not.toThrow();
    const result = AlertStateSchema.parse(inactiveAlertState);
    expect(result.active).toBe(false);
    expect(result.level).toBeNull();
    expect(result.triggered_at).toBeNull();
  });

  it('validates all level enum values', () => {
    const levels = ['warning', 'alert', 'crisis'] as const;
    for (const level of levels) {
      expect(() => AlertStateSchema.parse({ ...validAlertState, level })).not.toThrow();
    }
  });

  it('rejects invalid level value', () => {
    expect(() => AlertStateSchema.parse({ ...validAlertState, level: 'none' })).toThrow();
  });

  it('rejects missing active field', () => {
    const { active: _active, ...rest } = validAlertState;
    expect(() => AlertStateSchema.parse(rest)).toThrow();
  });

  it('rejects non-numeric vix_current', () => {
    expect(() => AlertStateSchema.parse({ ...validAlertState, vix_current: 'high' })).toThrow();
  });

  it('rejects invalid triggered_at format', () => {
    expect(() => AlertStateSchema.parse({ ...validAlertState, triggered_at: '2026-04-12' })).toThrow();
  });
});
