import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock child_process via util.promisify ────────────────────────────────────

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
}));

vi.mock('util', () => ({
  promisify: () => mockExecFile,
}));

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}));

import { logPipelineRun, type PipelineRunResult } from '../log-run';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockGhResponse(stdout: string) {
  mockExecFile.mockResolvedValueOnce({ stdout });
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('logPipelineRun', () => {
  it('creates a new issue when none exists', async () => {
    // findLogIssue returns empty
    mockGhResponse('[]');
    // issue create
    mockGhResponse('');

    await logPipelineRun({ status: 'success', kpiCount: 11, alertLevel: null });

    // Second call should be issue create
    expect(mockExecFile).toHaveBeenCalledTimes(2);
    const createCall = mockExecFile.mock.calls[1];
    expect(createCall[0]).toBe('gh');
    expect(createCall[1]).toContain('create');
  });

  it('appends to existing issue when one exists', async () => {
    // findLogIssue returns match
    mockGhResponse(JSON.stringify([{ number: 42, title: 'Pipeline Run Log' }]));
    // view body
    mockGhResponse('| Date | Status | KPIs | Alert | Duration | Error |\n|------|--------|------|-------|----------|-------|\n| 2026-04-11 | OK | 11 | none | 5.2s | - |');
    // edit
    mockGhResponse('');

    await logPipelineRun({ status: 'success', kpiCount: 11 });

    expect(mockExecFile).toHaveBeenCalledTimes(3);
    const editCall = mockExecFile.mock.calls[2];
    expect(editCall[1]).toContain('edit');
  });

  it('never throws even when gh fails', async () => {
    mockExecFile.mockRejectedValue(new Error('gh not found'));

    // Should not throw — logging failure is non-fatal
    await expect(logPipelineRun({ status: 'failure', error: 'pipeline crash' })).resolves.toBeUndefined();
  });

  it('formats failure rows correctly', async () => {
    mockGhResponse('[]');
    mockGhResponse('');

    await logPipelineRun({ status: 'failure', error: 'Claude API timeout', durationMs: 30000 });

    const createCall = mockExecFile.mock.calls[1];
    const body = createCall[1][createCall[1].indexOf('--body') + 1] as string;
    expect(body).toContain('FAIL');
    expect(body).toContain('Claude API timeout');
    expect(body).toContain('30.0s');
  });
});
