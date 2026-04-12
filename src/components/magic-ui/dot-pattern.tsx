import { cn } from '@/lib/utils'

interface DotPatternProps {
  width?: number
  height?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  id?: string
}

export function DotPattern({
  width = 20,
  height = 20,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  id = 'dot-pattern',
}: DotPatternProps) {

  return (
    <svg
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export default DotPattern
