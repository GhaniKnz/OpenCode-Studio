import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, AppSettings } from '../types'

interface AppState {
  hasCompletedOnboarding: boolean
  currentProject: Project | null
  recentProjects: Project[]
  settings: AppSettings

  completeOnboarding: () => void
  setCurrentProject: (project: Project | null) => void
  addRecentProject: (project: Project) => void
  removeRecentProject: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
}

const defaultSettings: AppSettings = {
  opencodeExecutablePath: 'opencode',
  theme: 'dark',
  autoScroll: true,
  fontSize: 'md',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentProject: null,
      recentProjects: [],
      settings: defaultSettings,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      setCurrentProject: (project) => set({ currentProject: project }),

      addRecentProject: (project) =>
        set((state) => {
          const filtered = state.recentProjects.filter((p) => p.id !== project.id)
          return {
            recentProjects: [project, ...filtered].slice(0, 10),
          }
        }),

      removeRecentProject: (id) =>
        set((state) => ({
          recentProjects: state.recentProjects.filter((p) => p.id !== id),
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
    }),
    {
      name: 'opencode-studio-app',
    }
  )
)
