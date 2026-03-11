import { create } from 'zustand'
import type { FileNode } from '../types'

export interface OpenTab {
  file: FileNode
  content: string
  originalContent: string
  isDirty: boolean
}

interface EditorState {
  openTabs: OpenTab[]
  activeTabPath: string | null

  openTab: (file: FileNode, content: string) => void
  closeTab: (filePath: string) => void
  setActiveTab: (filePath: string) => void
  updateTabContent: (filePath: string, content: string) => void
  markTabSaved: (filePath: string) => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  openTabs: [],
  activeTabPath: null,

  openTab: (file, content) =>
    set((state) => {
      const existing = state.openTabs.find((t) => t.file.path === file.path)
      if (existing) {
        return { activeTabPath: file.path }
      }
      return {
        openTabs: [...state.openTabs, { file, content, originalContent: content, isDirty: false }],
        activeTabPath: file.path,
      }
    }),

  closeTab: (filePath) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.file.path !== filePath)
      let newActive = state.activeTabPath
      if (newActive === filePath) {
        const idx = state.openTabs.findIndex((t) => t.file.path === filePath)
        newActive = newTabs.length > 0 ? newTabs[Math.min(idx, newTabs.length - 1)].file.path : null
      }
      return { openTabs: newTabs, activeTabPath: newActive }
    }),

  setActiveTab: (filePath) => set({ activeTabPath: filePath }),

  updateTabContent: (filePath, content) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.file.path === filePath ? { ...t, content, isDirty: content !== t.originalContent } : t,
      ),
    })),

  markTabSaved: (filePath) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.file.path === filePath ? { ...t, originalContent: t.content, isDirty: false } : t,
      ),
    })),
}))
