import { Settings, Zap, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../stores/appStore'
import { StatusBadge } from './StatusBadge'
import { useLogsStore } from '../stores/logsStore'

export function TopBar() {
  const navigate = useNavigate()
  const currentProject = useAppStore((s) => s.currentProject)
  const processStatus = useLogsStore((s) => s.processStatus)

  return (
    <header className="flex items-center justify-between px-4 h-11 border-b border-border bg-surface shrink-0">
      {/* Left: Brand + Project */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
            <Zap size={11} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">OpenCode Studio</span>
        </div>
        {currentProject && (
          <>
            <ChevronRight size={14} className="text-muted" />
            <span className="text-sm text-muted-foreground truncate max-w-48">
              {currentProject.name}
            </span>
            <StatusBadge status={processStatus} />
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/settings')}
          className="p-1.5 rounded hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  )
}
