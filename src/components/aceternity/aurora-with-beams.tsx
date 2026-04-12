import { cn } from '@/lib/utils'
import { AuroraBackground } from './aurora-background'
import { BackgroundBeams } from './background-beams'

interface AuroraWithBeamsProps {
  children?: React.ReactNode
  className?: string
  alertLevel?: 'low' | 'warning' | 'alert' | 'crisis' | null
}

export function AuroraWithBeams({ children, className, alertLevel }: AuroraWithBeamsProps) {
  return (
    <AuroraBackground alertLevel={alertLevel} className={cn('relative', className)}>
      <BackgroundBeams />
      {children}
    </AuroraBackground>
  )
}
