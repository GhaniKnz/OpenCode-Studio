import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Clock,
  Settings,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Globe,
  Smartphone,
  Plus,
  Trash2,
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { cn } from '../lib/utils'
import type { Project, ProjectType } from '../types'
import { selectFolder } from '../services/opencodeService'
import { generateId, detectProjectType } from '../lib/utils'
import { useFileExplorer } from '../hooks/useFileExplorer'

const PROJECT_TYPE_ICONS: Record<ProjectType, typeof Globe> = {
  unity: Gamepad2,
  web: Globe,
  mobile: Smartphone,
  unknown: FolderOpen,
}

const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  unity: 'text-purple-400',
  web: 'text-blue-400',
  mobile: 'text-green-400',
  unknown: 'text-muted',
}

export function Sidebar() {
  const navigate = useNavigate()
  const { currentProject, recentProjects, setCurrentProject, addRecentProject, removeRecentProject } =
    useAppStore()
  const { loadProjectFiles } = useFileExplorer()
  const [recentOpen, setRecentOpen] = useState(true)
  const [isOpening, setIsOpening] = useState(false)

  const handleOpenProject = async () => {
    setIsOpening(true)
    try {
      const path = await selectFolder()
      if (!path) return
      const name = path.split(/[/\\]/).pop() ?? 'Project'
      const project: Project = {
        id: generateId(),
        name,
        path,
        type: detectProjectType(path),
        lastOpened: new Date().toISOString(),
      }
      setCurrentProject(project)
      addRecentProject(project)
      await loadProjectFiles(path)
      navigate('/')
    } catch (err) {
      console.error('Failed to open project:', err)
    } finally {
      setIsOpening(false)
    }
  }

  const handleSelectProject = async (project: Project) => {
    const updated = { ...project, lastOpened: new Date().toISOString() }
    setCurrentProject(updated)
    addRecentProject(updated)
    await loadProjectFiles(project.path)
    navigate('/')
  }

  return (
    <aside className="w-56 flex flex-col border-r border-border bg-surface shrink-0 overflow-hidden">
      {/* Open Project Button */}
      <div className="p-3">
        <button
          onClick={handleOpenProject}
          disabled={isOpening}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Plus size={14} />
          {isOpening ? 'Opening...' : 'Open Project'}
        </button>
      </div>

      {/* Recent Projects */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => setRecentOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wider hover:text-foreground transition-colors"
        >
          {recentOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <Clock size={12} />
          Recent Projects
        </button>

        {recentOpen && (
          <div className="pb-2">
            {recentProjects.length === 0 ? (
              <p className="px-4 py-2 text-xs text-muted">No recent projects</p>
            ) : (
              recentProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isActive={currentProject?.id === project.id}
                  onSelect={handleSelectProject}
                  onRemove={removeRecentProject}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          <Settings size={14} />
          Settings
        </button>
      </div>
    </aside>
  )
}

function ProjectItem({
  project,
  isActive,
  onSelect,
  onRemove,
}: {
  project: Project
  isActive: boolean
  onSelect: (p: Project) => void
  onRemove: (id: string) => void
}) {
  const Icon = PROJECT_TYPE_ICONS[project.type]
  const colorClass = PROJECT_TYPE_COLORS[project.type]

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors',
        isActive
          ? 'bg-accent-subtle text-foreground'
          : 'hover:bg-surface-hover text-muted-foreground hover:text-foreground'
      )}
      onClick={() => onSelect(project)}
    >
      <Icon size={13} className={cn('shrink-0', colorClass)} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{project.name}</p>
        <p className="text-xs text-muted truncate">{project.path}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(project.id)
        }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-error transition-all"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}
