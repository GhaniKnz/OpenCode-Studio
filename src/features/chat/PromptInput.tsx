import { useState, useRef, useCallback } from 'react'
import { Send, Square, Trash2 } from 'lucide-react'
import { useOpencode } from '../../hooks/useOpencode'
import { useChatStore } from '../../stores/chatStore'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'

export function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendPrompt, error } = useOpencode()
  const isProcessing = useChatStore((s) => s.isProcessing)
  const clearMessages = useChatStore((s) => s.clearMessages)
  const currentProject = useAppStore((s) => s.currentProject)

  const handleSubmit = useCallback(async () => {
    const trimmed = prompt.trim()
    if (!trimmed || isProcessing || !currentProject) return
    setPrompt('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    await sendPrompt(trimmed)
  }, [prompt, isProcessing, currentProject, sendPrompt])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
    // Auto-resize textarea
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-border bg-surface p-3 shrink-0">
      {error && (
        <div className="mb-2 px-3 py-2 rounded bg-error/10 border border-error/30 text-error text-xs">
          {error}
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={
            currentProject
              ? 'Ask OpenCode anything... (Enter to send, Shift+Enter for newline)'
              : 'Open a project to start...'
          }
          disabled={!currentProject || isProcessing}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted',
            'focus:outline-none focus:border-accent/60 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[38px] max-h-40'
          )}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isProcessing || !currentProject}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isProcessing
                ? 'bg-error/20 text-error hover:bg-error/30'
                : 'bg-accent text-white hover:bg-accent-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title={isProcessing ? 'Stop' : 'Send (Enter)'}
          >
            {isProcessing ? <Square size={15} /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  )
}
