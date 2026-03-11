import { cn } from '../lib/utils'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {icon && <div className="mb-3 text-muted opacity-50">{icon}</div>}
      <h3 className="text-sm font-medium text-foreground-secondary mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted max-w-48 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
