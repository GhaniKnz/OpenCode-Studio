import { create } from 'zustand'
import type { LogEntry, ProcessStatus } from '../types'

interface LogsState {
  logs: LogEntry[]
  processStatus: ProcessStatus

  addLog: (log: LogEntry) => void
  clearLogs: () => void
  setProcessStatus: (status: ProcessStatus) => void
}

export const useLogsStore = create<LogsState>()((set) => ({
  logs: [],
  processStatus: 'idle',

  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),

  clearLogs: () => set({ logs: [] }),

  setProcessStatus: (status) => set({ processStatus: status }),
}))
