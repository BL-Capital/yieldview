import { cn } from '@/lib/utils'

interface BentoGridItemProps {
  className?: string
  title?: string
  description?: string
  header?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  'aria-label'?: string
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
  'aria-label': ariaLabel,
}: BentoGridItemProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'group/bento relative overflow-hidden rounded-xl',
        'border border-yield-dark-border',
        'bg-yield-dark-elevated/50 backdrop-blur-sm',
        'transition-colors duration-200',
        'hover:border-yield-gold/40',
        className,
      )}
    >
      {header && <div className="p-4 pb-0">{header}</div>}
      <div className="p-4">
        {icon && <div className="mb-2">{icon}</div>}
        {title && (
          <p className="mb-1 text-xs font-mono uppercase tracking-widest text-yield-gold/70">
            {title}
          </p>
        )}
        {description && (
          <p className="text-sm text-yield-ink-muted">{description}</p>
        )}
        {children}
      </div>
    </div>
  )
}
