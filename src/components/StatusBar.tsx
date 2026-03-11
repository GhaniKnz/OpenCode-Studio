import { useAppStore } from '../stores/appStore'
import { useLogsStore } from '../stores/logsStore'
import { cn } from '../lib/utils'

export function StatusBar() {
  const currentProject = useAppStore((s) => s.currentProject)
  const processStatus = useLogsStore((s) => s.processStatus)

  const statusColors: Record<string, string> = {
    idle: 'text-muted',
    running: 'text-warning',
    success: 'text-success',
    error: 'text-error',
  }

  return (
    <footer className="flex items-center justify-between px-4 h-6 border-t border-border bg-surface text-xs text-muted shrink-0">
      <div className="flex items-center gap-3">
        {currentProject ? (
          <span className="truncate max-w-80 text-muted-foreground">{currentProject.path}</span>
        ) : (
          <span>No project selected</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={cn('font-medium', statusColors[processStatus])}>
          {processStatus === 'running'
            ? '⏳ Running...'
            : processStatus === 'success'
              ? '✓ Ready'
              : processStatus === 'error'
                ? '✗ Error'
                : '● Idle'}
        </span>
        <span>v0.1.0</span>
      </div>
    </footer>
  )
}
