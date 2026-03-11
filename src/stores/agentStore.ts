import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent, AgentPreset } from '../types'
import { generateId } from '../lib/utils'

export const AGENT_PRESETS: Record<
  AgentPreset,
  { label: string; icon: string; systemPromptTemplate: string; suggestedActions: string[] }
> = {
  general: {
    label: 'General',
    icon: 'Zap',
    systemPromptTemplate:
      'You are a helpful software development assistant. Analyze and improve the codebase.',
    suggestedActions: ['Analyze project', 'Review code', 'Generate tests', 'Create README'],
  },
  unity: {
    label: 'Unity',
    icon: 'Gamepad2',
    systemPromptTemplate:
      'You are a Unity game development expert. Help with C# scripts, scene architecture, and game systems.',
    suggestedActions: [
      'Generate C# Script',
      'Create Manager Class',
      'Review MonoBehaviour',
      'Design Scene Architecture',
    ],
  },
  web: {
    label: 'Web',
    icon: 'Globe',
    systemPromptTemplate:
      'You are a full-stack web development expert. Help with React, TypeScript, APIs, and frontend architecture.',
    suggestedActions: [
      'Generate Component',
      'Review Architecture',
      'Improve TypeScript',
      'Generate API',
    ],
  },
  mobile: {
    label: 'Mobile',
    icon: 'Smartphone',
    systemPromptTemplate:
      'You are a mobile development expert. Help with React Native, Flutter, navigation, and mobile-specific patterns.',
    suggestedActions: [
      'Generate Screen',
      'Improve Navigation',
      'Refactor State',
      'Generate UI Block',
    ],
  },
}

interface AgentState {
  agents: Agent[]
  activeAgentId: string | null
  activePreset: AgentPreset

  setActivePreset: (preset: AgentPreset) => void
  setActiveAgent: (id: string | null) => void
  createAgent: (agentData: Omit<Agent, 'id' | 'status' | 'outputHistory'>) => void
  deleteAgent: (id: string) => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      agents: [],
      activeAgentId: null,
      activePreset: 'general',

      setActivePreset: (preset) => set({ activePreset: preset }),

      setActiveAgent: (id) => set({ activeAgentId: id }),

      createAgent: (agentData) =>
        set((state) => {
          const newAgent: Agent = {
            ...agentData,
            id: generateId(),
            status: 'idle',
            outputHistory: [],
          }
          return { agents: [...state.agents, newAgent], activeAgentId: newAgent.id }
        }),

      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
          activeAgentId: state.activeAgentId === id ? null : state.activeAgentId,
        })),
    }),
    { name: 'opencode-studio-agents' },
  ),
)
