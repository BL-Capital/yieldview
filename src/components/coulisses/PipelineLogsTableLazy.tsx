'use client'

import dynamic from 'next/dynamic'

const PipelineLogsTable = dynamic(
  () => import('./PipelineLogsTable').then((mod) => ({ default: mod.PipelineLogsTable })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] rounded-xl border border-zinc-800 bg-zinc-950 animate-pulse" />
    ),
  }
)

export function PipelineLogsTableLazy() {
  return <PipelineLogsTable />
}
