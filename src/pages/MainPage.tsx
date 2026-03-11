import { useEffect } from 'react'
import { ChatPanel } from '../features/chat/ChatPanel'
import { PromptInput } from '../features/chat/PromptInput'
import { FileTree } from '../features/explorer/FileTree'
import { LogsPanel } from '../features/logs/LogsPanel'
import { QuickActions } from '../features/quick-actions/QuickActions'
import { ChangedFilesPanel } from '../features/workspace/ChangedFilesPanel'
import { useAppStore } from '../stores/appStore'
import { useFileExplorer } from '../hooks/useFileExplorer'

export function MainPage() {
  const currentProject = useAppStore((s) => s.currentProject)
  const { loadProjectFiles } = useFileExplorer()

  useEffect(() => {
    if (currentProject) {
      loadProjectFiles(currentProject.path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.path])

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: File Explorer */}
      <div className="w-56 border-r border-border bg-surface flex flex-col shrink-0 overflow-hidden">
        <div className="px-3 py-2 border-b border-border shrink-0">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Explorer</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <FileTree />
        </div>
      </div>

      {/* Center: Chat */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>
        <PromptInput />
      </div>

      {/* Right: Tools */}
      <div className="w-64 border-l border-border flex flex-col shrink-0 overflow-hidden">
        {/* Quick Actions */}
        <div className="flex-[2] overflow-hidden border-b border-border min-h-0">
          <QuickActions />
        </div>
        {/* Logs */}
        <div className="flex-[2] overflow-hidden border-b border-border min-h-0">
          <LogsPanel />
        </div>
        {/* Changed Files */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ChangedFilesPanel />
        </div>
      </div>
    </div>
  )
}
