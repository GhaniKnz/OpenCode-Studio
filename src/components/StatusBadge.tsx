import { cn } from '../lib/utils'
import type { ProcessStatus } from '../types'

interface StatusBadgeProps {
  status: ProcessStatus
  className?: string
}

const STATUS_CONFIG: Record<ProcessStatus, { label: string; classes: string }> = {
  idle: { label: 'Idle', classes: 'bg-muted/20 text-muted' },
  running: { label: 'Running', classes: 'bg-warning/20 text-warning' },
  success: { label: 'Ready', classes: 'bg-success/20 text-success' },
  error: { label: 'Error', classes: 'bg-error/20 text-error' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', config.classes, className)}>
      {config.label}
    </span>
  )
}
