export type ProjectType = 'unity' | 'web' | 'mobile' | 'unknown'

export interface Project {
  id: string
  name: string
  path: string
  type: ProjectType
  lastOpened: string // ISO date string
}

export type MessageRole = 'user' | 'agent' | 'system' | 'error'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  isStreaming?: boolean
}

export type LogLevel = 'info' | 'warning' | 'error' | 'debug'

export interface LogEntry {
  id: string
  level: LogLevel
  message: string
  timestamp: string
  source?: string
}

export type ProcessStatus = 'idle' | 'running' | 'success' | 'error'

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  recentlyModified?: boolean
  extension?: string
}

export interface QuickAction {
  id: string
  label: string
  prompt: string
  icon?: string
  category: 'general' | 'unity' | 'web' | 'mobile'
}

export interface AppSettings {
  opencodeExecutablePath: string
  theme: 'dark'
  autoScroll: boolean
  fontSize: 'sm' | 'md' | 'lg'
}

export interface Agent {
  id: string
  name: string
  description: string
  domain: string
  systemPromptTemplate: string
  suggestedActions: string[]
  status: 'idle' | 'running' | 'completed' | 'error'
  outputHistory: string[]
}
