import { cn } from '@/lib/utils'

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        'animate-aurora-pulse',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #c9a84c 0%, #e5c67f 40%, #c9a84c 60%, #9a7e3a 100%)',
        backgroundSize: '200% auto',
        animation: 'gradient-shimmer 3s linear infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}
