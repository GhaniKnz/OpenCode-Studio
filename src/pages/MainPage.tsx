import { useEffect } from 'react'
import { FileTree } from '../features/explorer/FileTree'
import { CodeEditor } from '../features/editor/CodeEditor'
import { AgentPanel } from '../features/agents/AgentPanel'
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

      {/* Center: Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <CodeEditor />
      </div>

      {/* Right: OpenCode Studio Panel */}
      <div className="w-80 shrink-0 overflow-hidden flex flex-col">
        <AgentPanel />
      </div>
    </div>
  )
}
