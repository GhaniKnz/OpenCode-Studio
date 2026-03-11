import { create } from 'zustand'
import type { FileNode } from '../types'

interface ExplorerState {
  fileTree: FileNode | null
  selectedFile: FileNode | null
  fileContent: string | null
  searchQuery: string
  isLoading: boolean

  setFileTree: (tree: FileNode | null) => void
  setSelectedFile: (file: FileNode | null) => void
  setFileContent: (content: string | null) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
}

export const useExplorerStore = create<ExplorerState>()((set) => ({
  fileTree: null,
  selectedFile: null,
  fileContent: null,
  searchQuery: '',
  isLoading: false,

  setFileTree: (fileTree) => set({ fileTree }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),
  setFileContent: (fileContent) => set({ fileContent }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (isLoading) => set({ isLoading }),
}))
