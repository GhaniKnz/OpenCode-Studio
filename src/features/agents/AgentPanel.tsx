import { useState } from 'react'
import {
  Bot,
  MessageSquare,
  Terminal,
  Zap,
  Gamepad2,
  Globe,
  Smartphone,
  Plus,
  Trash2,
  ChevronDown,
  X,
} from 'lucide-react'
import { useAgentStore, AGENT_PRESETS } from '../../stores/agentStore'
import { useAppStore } from '../../stores/appStore'
import { useChatStore } from '../../stores/chatStore'
import { ChatPanel } from '../chat/ChatPanel'
import { PromptInput } from '../chat/PromptInput'
import { LogsPanel } from '../logs/LogsPanel'
import { ChangedFilesPanel } from '../workspace/ChangedFilesPanel'
import { cn } from '../../lib/utils'
import type { AgentPreset } from '../../types'

type PanelTab = 'chat' | 'agents' | 'logs'

const PRESET_ICONS: Record<AgentPreset, React.ElementType> = {
  general: Zap,
  unity: Gamepad2,
  web: Globe,
  mobile: Smartphone,
}

export function AgentPanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>('chat')
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const { agents, activePreset, setActivePreset, deleteAgent } = useAgentStore()
  const currentProject = useAppStore((s) => s.currentProject)

  const presetList = Object.entries(AGENT_PRESETS) as [
    AgentPreset,
    (typeof AGENT_PRESETS)[AgentPreset],
  ][]

  return (
    <div className="flex flex-col h-full overflow-hidden border-l border-border">
      {/* Header */}
      <div className="shrink-0 px-3 py-2 border-b border-border bg-surface flex items-center gap-2">
        <Bot size={14} className="text-accent shrink-0" />
        <span className="text-xs font-semibold text-foreground tracking-wide">
          OpenCode Studio
        </span>
        {currentProject && (
          <span className="ml-auto text-xs text-muted truncate max-w-[100px]" title={currentProject.name}>
            {currentProject.name}
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-border bg-surface">
        {(
          [
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'agents', label: 'Agents', icon: Bot },
            { id: 'logs', label: 'Logs', icon: Terminal },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs transition-colors border-b-2',
              activeTab === id
                ? 'text-accent border-accent'
                : 'text-muted hover:text-foreground border-transparent',
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Preset selector */}
          <div className="shrink-0 px-2 py-2 border-b border-border-subtle">
            <div className="flex items-center gap-1">
              {presetList.map(([preset, info]) => {
                const Icon = PRESET_ICONS[preset]
                return (
                  <button
                    key={preset}
                    onClick={() => setActivePreset(preset)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                      activePreset === preset
                        ? 'bg-accent text-white'
                        : 'text-muted hover:text-foreground hover:bg-surface-hover',
                    )}
                    title={info.label}
                  >
                    <Icon size={11} />
                    <span className="hidden sm:inline">{info.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick actions for active preset */}
          <div className="shrink-0 px-2 py-1.5 border-b border-border-subtle">
            <p className="text-xs text-muted mb-1">Quick actions</p>
            <div className="flex flex-wrap gap-1">
              {AGENT_PRESETS[activePreset].suggestedActions.map((action) => (
                <QuickActionChip key={action} label={action} />
              ))}
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ChatPanel />
          </div>

          {/* Prompt input */}
          <PromptInput />
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Agents header */}
          <div className="shrink-0 px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {agents.length} agent{agents.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowCreateAgent(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-accent text-white text-xs hover:bg-accent-hover transition-colors"
            >
              <Plus size={11} />
              New Agent
            </button>
          </div>

          {/* Agent list */}
          <div className="flex-1 overflow-y-auto p-2">
            {agents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <Bot size={24} className="text-muted mb-2" />
                <p className="text-xs text-muted-foreground">No agents yet</p>
                <p className="text-xs text-muted mt-1">
                  Create an agent with a preset to get started
                </p>
              </div>
            ) : (
              agents.map((agent) => {
                const Icon = PRESET_ICONS[agent.domain]
                return (
                  <div
                    key={agent.id}
                    className="flex items-start gap-2 p-2 rounded border border-border mb-2 hover:border-accent/40 transition-colors group"
                  >
                    <div className="p-1.5 rounded bg-accent/10 shrink-0">
                      <Icon size={12} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
                      <p className="text-xs text-muted truncate mt-0.5">{agent.description}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs bg-surface text-muted capitalize">
                        {agent.domain}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-1 rounded text-muted hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Delete agent"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* Create agent modal */}
          {showCreateAgent && (
            <CreateAgentForm onClose={() => setShowCreateAgent(false)} onCreated={() => setShowCreateAgent(false)} />
          )}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-[2] overflow-hidden border-b border-border min-h-0">
            <LogsPanel />
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <ChangedFilesPanel />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Quick Action Chip ────────────────────────────────────────────────────────

function QuickActionChip({ label }: { label: string }) {
  const { activePreset } = useAgentStore()
  const currentProject = useAppStore((s) => s.currentProject)
  const setDraftPrompt = useChatStore((s) => s.setDraftPrompt)

  const handleClick = () => {
    if (!currentProject) return
    setDraftPrompt(label)
  }

  return (
    <button
      onClick={handleClick}
      disabled={!currentProject}
      className={cn(
        'px-2 py-0.5 rounded border border-border text-xs transition-colors',
        currentProject
          ? 'text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 cursor-pointer'
          : 'text-muted opacity-50 cursor-not-allowed',
      )}
      title={activePreset}
    >
      {label}
    </button>
  )
}

// ─── Create Agent Form ────────────────────────────────────────────────────────

function CreateAgentForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState<AgentPreset>('general')
  const { createAgent } = useAgentStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createAgent({
      name: name.trim(),
      description: description.trim(),
      domain,
      systemPromptTemplate: AGENT_PRESETS[domain].systemPromptTemplate,
      suggestedActions: AGENT_PRESETS[domain].suggestedActions,
    })
    onCreated()
  }

  const presetList = Object.entries(AGENT_PRESETS) as [
    AgentPreset,
    (typeof AGENT_PRESETS)[AgentPreset],
  ][]

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-foreground">New Agent</span>
        <button
          onClick={onClose}
          className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover"
        >
          <X size={13} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {/* Name */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Agent Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Unity Helper"
            className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this agent specialize in?"
            rows={2}
            className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent/60 transition-colors resize-none"
          />
        </div>

        {/* Preset / Domain */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Preset</label>
          <div className="relative">
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as AgentPreset)}
              className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent/60 transition-colors appearance-none"
            >
              {presetList.map(([preset, info]) => (
                <option key={preset} value={preset}>
                  {info.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Preset info */}
        <div className="bg-surface rounded border border-border-subtle p-2">
          <p className="text-xs text-muted-foreground mb-1 font-medium">
            {AGENT_PRESETS[domain].label} preset
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {AGENT_PRESETS[domain].systemPromptTemplate}
          </p>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={cn(
            'mt-auto px-3 py-2 rounded text-xs font-medium transition-colors',
            name.trim()
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-surface text-muted cursor-not-allowed',
          )}
        >
          Create Agent
        </button>
      </form>
    </div>
  )
}
