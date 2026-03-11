import { useRef, useEffect } from 'react'
import { Trash2, Terminal } from 'lucide-react'
import { useLogsStore } from '../../stores/logsStore'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'
import { formatTimestamp } from '../../lib/utils'
import type { LogLevel } from '../../types'

const LOG_LEVEL_CLASSES: Record<LogLevel, string> = {
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
  debug: 'text-muted',
}

const LOG_LEVEL_PREFIX: Record<LogLevel, string> = {
  info: '[INFO]',
  warning: '[WARN]',
  error: '[ERR] ',
  debug: '[DBG] ',
}

export function LogsPanel() {
  const logs = useLogsStore((s) => s.logs)
  const clearLogs = useLogsStore((s) => s.clearLogs)
  const autoScroll = useAppStore((s) => s.settings.autoScroll)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs, autoScroll])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Terminal size={12} />
          Logs
        </div>
        <button
          onClick={clearLogs}
          className="p-1 rounded hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
          title="Clear logs"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-muted p-2">No logs yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 py-0.5 hover:bg-surface-hover px-1 rounded">
              <span className="text-muted shrink-0 opacity-60">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={cn('shrink-0 font-semibold', LOG_LEVEL_CLASSES[log.level])}>
                {LOG_LEVEL_PREFIX[log.level]}
              </span>
              <span className="text-foreground-secondary break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
