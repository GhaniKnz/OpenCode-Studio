import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SettingsForm } from '../features/settings/SettingsForm'

export function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-surface">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-base font-semibold">Settings</h1>
          <p className="text-xs text-muted">Configure OpenCode Studio</p>
        </div>
      </div>
      <div className="flex-1 p-6 max-w-xl">
        <SettingsForm />
      </div>
    </div>
  )
}
