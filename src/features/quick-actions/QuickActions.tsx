import { useState } from 'react'
import { Zap, Search, Gamepad2, Globe, Smartphone, ChevronDown, ChevronRight } from 'lucide-react'
import { QUICK_ACTIONS } from '../../lib/quickActions'
import { useOpencode } from '../../hooks/useOpencode'
import { useChatStore } from '../../stores/chatStore'
import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'
import type { QuickAction } from '../../types'

const CATEGORIES = [
  { id: 'general', label: 'General', icon: Zap },
  { id: 'unity', label: 'Unity', icon: Gamepad2 },
  { id: 'web', label: 'Web', icon: Globe },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
] as const

export function QuickActions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['general']))
  const { sendPrompt } = useOpencode()
  const isProcessing = useChatStore((s) => s.isProcessing)
  const currentProject = useAppStore((s) => s.currentProject)

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  const handleAction = async (action: QuickAction) => {
    if (isProcessing || !currentProject) return
    await sendPrompt(action.prompt)
  }

  const filteredActions = searchQuery
    ? QUICK_ACTIONS.filter((a) => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : QUICK_ACTIONS

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
          <Zap size={12} />
          Quick Actions
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-background rounded border border-border focus-within:border-accent/60 transition-colors">
          <Search size={12} className="text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search actions..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <div className="p-2">
            {filteredActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                onAction={handleAction}
                disabled={isProcessing || !currentProject}
              />
            ))}
            {filteredActions.length === 0 && (
              <p className="text-xs text-muted p-2">No actions match &quot;{searchQuery}&quot;</p>
            )}
          </div>
        ) : (
          CATEGORIES.map(({ id, label, icon: Icon }) => {
            const actions = filteredActions.filter((a) => a.category === id)
            const isOpen = expandedCategories.has(id)
            return (
              <div key={id}>
                <button
                  onClick={() => toggleCategory(id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-muted hover:text-foreground transition-colors"
                >
                  {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  <Icon size={11} />
                  {label}
                </button>
                {isOpen && (
                  <div className="pb-1 px-2">
                    {actions.map((action) => (
                      <ActionButton
                        key={action.id}
                        action={action}
                        onAction={handleAction}
                        disabled={isProcessing || !currentProject}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ActionButton({
  action,
  onAction,
  disabled,
}: {
  action: QuickAction
  onAction: (a: QuickAction) => void
  disabled: boolean
}) {
  return (
    <button
      onClick={() => onAction(action)}
      disabled={disabled}
      className={cn(
        'w-full text-left px-2 py-1.5 rounded text-xs transition-colors mb-0.5',
        disabled
          ? 'text-muted cursor-not-allowed opacity-50'
          : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer'
      )}
    >
      {action.label}
    </button>
  )
}
