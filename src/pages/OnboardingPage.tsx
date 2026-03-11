import { useState } from 'react'
import { Zap, FolderOpen, Terminal, ArrowRight, Check } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { selectFolder, checkOpencodeInstalled } from '../services/opencodeService'
import { generateId, detectProjectType } from '../lib/utils'
import type { Project } from '../types'

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [opencodeStatus, setOpencodeStatus] = useState<
    'checking' | 'found' | 'not-found' | 'idle'
  >('idle')
  const { completeOnboarding, setCurrentProject, addRecentProject, updateSettings, settings } =
    useAppStore()

  const steps = [
    { title: 'Welcome to OpenCode Studio', icon: Zap },
    { title: 'Configure OpenCode', icon: Terminal },
    { title: 'Open Your First Project', icon: FolderOpen },
  ]

  const handleCheckOpencode = async () => {
    setOpencodeStatus('checking')
    try {
      const found = await checkOpencodeInstalled(settings.opencodeExecutablePath)
      setOpencodeStatus(found ? 'found' : 'not-found')
    } catch {
      setOpencodeStatus('not-found')
    }
  }

  const handleOpenProject = async () => {
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
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
          <Zap size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">OpenCode Studio</h1>
          <p className="text-sm text-muted">AI-powered development workspace</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((_s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-success text-white'
                  : i === step
                    ? 'bg-accent text-white'
                    : 'bg-surface border border-border text-muted'
              }`}
            >
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px ${i < step ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 shadow-2xl">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Welcome to OpenCode Studio</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              OpenCode Studio is a powerful desktop interface for the opencode CLI tool. It helps
              you manage projects, run AI-powered code analysis, and streamline your development
              workflow for Unity, web, and mobile projects.
            </p>
            <ul className="space-y-2">
              {[
                'AI-powered code analysis',
                'Multi-project workspace management',
                'Real-time logs and output',
                'Quick actions for any project type',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <Check size={13} className="text-success shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Configure OpenCode</h2>
            <p className="text-sm text-muted-foreground">
              Enter the path to your opencode executable. If it&apos;s in your system PATH, just
              use &quot;opencode&quot;.
            </p>
            <div>
              <label className="text-xs text-muted mb-1.5 block">Executable path</label>
              <input
                type="text"
                value={settings.opencodeExecutablePath}
                onChange={(e) => updateSettings({ opencodeExecutablePath: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/60 transition-colors"
                placeholder="opencode"
              />
            </div>
            <button
              onClick={handleCheckOpencode}
              disabled={opencodeStatus === 'checking'}
              className="w-full py-2 rounded-lg bg-surface border border-border text-sm font-medium hover:border-accent/60 transition-colors disabled:opacity-50"
            >
              {opencodeStatus === 'checking' ? 'Checking...' : 'Check Installation'}
            </button>
            {opencodeStatus === 'found' && (
              <p className="text-sm text-success flex items-center gap-1.5">
                <Check size={13} /> OpenCode found!
              </p>
            )}
            {opencodeStatus === 'not-found' && (
              <p className="text-sm text-warning">
                ⚠ OpenCode not found. You can still continue and configure it later.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Open Your First Project</h2>
            <p className="text-sm text-muted-foreground">
              Select a local folder to start working with OpenCode Studio.
            </p>
            <button
              onClick={handleOpenProject}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-border hover:border-accent/60 hover:bg-accent-subtle transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              <FolderOpen size={16} />
              Select Project Folder
            </button>
            <p className="text-xs text-muted text-center">
              You can skip this and open a project from the sidebar.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              Next <ArrowRight size={13} />
            </button>
          ) : (
            <button
              onClick={completeOnboarding}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
            >
              Get Started <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
