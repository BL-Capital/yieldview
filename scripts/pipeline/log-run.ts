import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: Record<string, unknown>) {
  console.error(
    JSON.stringify({ level, msg, timestamp: new Date().toISOString(), ...extra }),
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PipelineRunResult {
  status: 'success' | 'failure';
  kpiCount?: number;
  alertLevel?: string | null;
  durationMs?: number;
  error?: string;
}

// ─── gh CLI wrapper ───────────────────────────────────────────────────────────

async function gh(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync('gh', args);
  return stdout.trim();
}

// ─── Find or create the log issue ─────────────────────────────────────────────

const LOG_ISSUE_TITLE = 'Pipeline Run Log';

async function findLogIssue(): Promise<number | null> {
  try {
    const result = await gh([
      'issue', 'list',
      '--search', LOG_ISSUE_TITLE,
      '--state', 'open',
      '--json', 'number,title',
      '--limit', '1',
    ]);
    const issues = JSON.parse(result || '[]') as { number: number; title: string }[];
    const match = issues.find((i) => i.title === LOG_ISSUE_TITLE);
    return match?.number ?? null;
  } catch {
    return null;
  }
}

function formatRow(date: string, result: PipelineRunResult): string {
  const status = result.status === 'success' ? 'OK' : 'FAIL';
  const kpis = result.kpiCount ?? '-';
  const alert = result.alertLevel ?? 'none';
  const duration = result.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : '-';
  const error = result.error ? result.error.slice(0, 60) : '-';
  return `| ${date} | ${status} | ${kpis} | ${alert} | ${duration} | ${error} |`;
}

const TABLE_HEADER = `| Date | Status | KPIs | Alert | Duration | Error |
|------|--------|------|-------|----------|-------|`;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function logPipelineRun(result: PipelineRunResult): Promise<void> {
  try {
    const date = new Date().toISOString().slice(0, 10);
    const row = formatRow(date, result);

    const issueNumber = await findLogIssue();

    if (issueNumber) {
      // Append row to existing issue
      const currentBody = await gh(['issue', 'view', String(issueNumber), '--json', 'body', '-q', '.body']);
      const lines = currentBody.split('\n');

      // Keep max 30 data rows (header = 2 lines, then data rows)
      const headerLines = lines.slice(0, 2);
      const dataLines = lines.slice(2).filter((l) => l.startsWith('|'));
      const trimmed = dataLines.length >= 30 ? dataLines.slice(1) : dataLines;
      const newBody = [...headerLines, ...trimmed, row].join('\n');

      await gh(['issue', 'edit', String(issueNumber), '--body', newBody]);
      log('info', 'log-run appended to issue', { issue: issueNumber, status: result.status });
    } else {
      // Create new issue
      const body = `${TABLE_HEADER}\n${row}`;
      await gh(['issue', 'create', '--title', LOG_ISSUE_TITLE, '--body', body, '--label', 'pipeline']);
      log('info', 'log-run created new issue', { status: result.status });
    }
  } catch (err) {
    // Never throw — logging failure must not crash the pipeline
    log('error', 'log-run failed (non-fatal)', { error: String(err) });
  }
}

// ─── Standalone entry point ───────────────────────────────────────────────────

async function main(): Promise<void> {
  const statusArg = process.argv.find((a) => a.startsWith('--status='))?.split('=')[1]
    ?? process.argv[process.argv.indexOf('--status') + 1]
    ?? 'success';

  const result: PipelineRunResult = {
    status: statusArg === 'failure' ? 'failure' : 'success',
  };

  await logPipelineRun(result);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    // Even main errors are non-fatal for the pipeline
    log('error', 'log-run main error (non-fatal)', { error: String(err) });
  });
}
