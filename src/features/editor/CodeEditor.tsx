import { useCallback, useRef, useMemo } from 'react'
import { X, Save, FileCode, Circle } from 'lucide-react'
import { useEditorStore } from '../../stores/editorStore'
import { saveFile } from '../../services/opencodeService'
import { EmptyState } from '../../components/EmptyState'
import { cn } from '../../lib/utils'

const FILE_ICON_COLORS: Record<string, string> = {
  ts: 'text-blue-400',
  tsx: 'text-blue-400',
  js: 'text-yellow-400',
  jsx: 'text-yellow-400',
  css: 'text-pink-400',
  scss: 'text-pink-400',
  json: 'text-orange-400',
  md: 'text-gray-400',
  cs: 'text-purple-400',
  py: 'text-green-400',
  rs: 'text-orange-400',
  html: 'text-red-400',
}

export function CodeEditor() {
  const { openTabs, activeTabPath, closeTab, setActiveTab, updateTabContent, markTabSaved } =
    useEditorStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeTab = openTabs.find((t) => t.file.path === activeTabPath)

  const handleSave = useCallback(async () => {
    if (!activeTab) return
    try {
      await saveFile(activeTab.file.path, activeTab.content)
      markTabSaved(activeTab.file.path)
    } catch (err) {
      console.error('Failed to save file:', err)
    }
  }, [activeTab, markTabSaved])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl+S / Cmd+S — save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
        return
      }
      // Tab key — insert 2 spaces
      if (e.key === 'Tab') {
        e.preventDefault()
        const ta = e.currentTarget
        const start = ta.selectionStart
        const end = ta.selectionEnd
        if (!activeTabPath) return
        const newContent =
          ta.value.substring(0, start) + '  ' + ta.value.substring(end)
        updateTabContent(activeTabPath, newContent)
        requestAnimationFrame(() => {
          ta.selectionStart = start + 2
          ta.selectionEnd = start + 2
        })
      }
    },
    [handleSave, activeTabPath, updateTabContent],
  )

  if (openTabs.length === 0) {
    return (
      <EmptyState
        icon={<FileCode size={32} />}
        title="No file open"
        description="Click a file in the Explorer to open it in the editor."
        className="h-full"
      />
    )
  }

  const ext = activeTab?.file.extension ?? activeTab?.file.name.split('.').pop() ?? ''
  const tabIconColor = FILE_ICON_COLORS[ext] ?? 'text-muted'

  const lineCount = useMemo(
    () => (activeTab ? activeTab.content.split('\n').length : 0),
    [activeTab?.content],
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab Bar */}
      <div className="flex items-center shrink-0 border-b border-border bg-surface overflow-x-auto">
        {openTabs.map((tab) => {
          const tabExt = tab.file.extension ?? tab.file.name.split('.').pop() ?? ''
          const tabIconColor = FILE_ICON_COLORS[tabExt] ?? 'text-muted'
          const isActive = tab.file.path === activeTabPath
          return (
            <div
              key={tab.file.path}
              onClick={() => setActiveTab(tab.file.path)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs border-r border-border cursor-pointer shrink-0 group transition-colors',
                isActive
                  ? 'bg-background text-foreground border-b-2 border-b-accent -mb-px'
                  : 'text-muted hover:text-foreground hover:bg-surface-hover',
              )}
            >
              <FileCode size={12} className={tabIconColor} />
              <span className="max-w-[120px] truncate">{tab.file.name}</span>
              {tab.isDirty && (
                <Circle size={6} className="fill-accent text-accent shrink-0" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.file.path)
                }}
                className="ml-0.5 p-0.5 rounded hover:bg-surface-hover text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                title="Close tab"
              >
                <X size={11} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Breadcrumb / File path */}
      {activeTab && (
        <div className="flex items-center justify-between px-3 py-1 shrink-0 border-b border-border-subtle bg-background/50">
          <div className="flex items-center gap-1.5 min-w-0">
            <FileCode size={12} className={tabIconColor} />
            <span className="text-xs text-muted truncate font-mono">{activeTab.file.path}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {activeTab.isDirty && (
              <span className="text-xs text-warning">unsaved</span>
            )}
            <button
              onClick={handleSave}
              disabled={!activeTab.isDirty}
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors',
                activeTab.isDirty
                  ? 'text-accent hover:bg-accent/10 cursor-pointer'
                  : 'text-muted cursor-default opacity-50',
              )}
              title="Save (Ctrl+S)"
            >
              <Save size={11} />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Editor area */}
      {activeTab && (
        <div className="flex-1 overflow-hidden relative">
          {/* Line numbers — memoized count avoids repeated splits */}
          <div className="absolute top-0 left-0 bottom-0 w-10 bg-surface border-r border-border-subtle overflow-hidden pointer-events-none select-none">
            <div className="p-2 text-right">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="text-xs text-muted leading-5 font-mono">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={activeTab.content}
            onChange={(e) => updateTabContent(activeTabPath!, e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="absolute inset-0 w-full h-full resize-none bg-background text-foreground font-mono text-sm leading-5 focus:outline-none pl-12 pr-4 pt-2 pb-2"
            style={{ tabSize: 2 }}
          />
        </div>
      )}
    </div>
  )
}
