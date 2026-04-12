import { getPipelineLogs } from '@/lib/pipeline-logs'
import type { PipelineRun } from '@/lib/pipeline-logs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  success: { label: 'Success', color: '#22C55E', pulse: true },
  warning: { label: 'Warning', color: '#F59E0B', pulse: false },
  error:   { label: 'Error',   color: '#EF4444', pulse: false },
  running: { label: 'Running', color: '#3B82F6', pulse: true },
} as const

function PulseDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {pulse && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ backgroundColor: color, animationDuration: '1.5s' }}
        />
      )}
      <span
        className="relative inline-flex h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatLatency(ms: number): string {
  return new Intl.NumberFormat('fr-FR').format(ms) + ' ms'
}

function StatusBadge({ run }: { run: PipelineRun }) {
  const cfg = STATUS_CONFIG[run.status]
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={run.error ?? undefined}
    >
      <PulseDot color={cfg.color} pulse={cfg.pulse} />
      <span className="text-xs font-mono" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </span>
  )
}

export async function PipelineLogsTable() {
  const runs = await getPipelineLogs()

  return (
    <ScrollArea className="h-[360px] rounded-xl border border-zinc-800 bg-zinc-950">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500 font-mono text-xs">Date</TableHead>
            <TableHead className="text-zinc-500 font-mono text-xs">Status</TableHead>
            <TableHead className="text-zinc-500 font-mono text-xs">Latency</TableHead>
            <TableHead className="text-zinc-500 font-mono text-xs">Output</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow
              key={run.runId}
              className={cn(
                'border-zinc-800/50 transition-colors',
                'hover:bg-zinc-900/50',
              )}
            >
              <TableCell className="font-mono text-xs text-zinc-400">
                {formatDate(run.startedAt)}
              </TableCell>
              <TableCell>
                <StatusBadge run={run} />
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-400">
                {formatLatency(run.latencyMs)}
              </TableCell>
              <TableCell className="font-mono text-xs text-zinc-500 max-w-[200px] truncate">
                {run.outputFilename}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

export default PipelineLogsTable
