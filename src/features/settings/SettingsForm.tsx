import { useAppStore } from '../../stores/appStore'
import { cn } from '../../lib/utils'

export function SettingsForm() {
  const { settings, updateSettings } = useAppStore()

  return (
    <div className="space-y-6">
      {/* OpenCode Executable */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">OpenCode Executable</h3>
        <p className="text-xs text-muted mb-3">
          Path to the opencode executable. Use &quot;opencode&quot; if it&apos;s in your PATH,
          or provide the full path.
        </p>
        <input
          type="text"
          value={settings.opencodeExecutablePath}
          onChange={(e) => updateSettings({ opencodeExecutablePath: e.target.value })}
          placeholder="opencode"
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/60 transition-colors"
        />
      </section>

      {/* Auto Scroll */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Auto Scroll</h3>
        <p className="text-xs text-muted mb-3">
          Automatically scroll to the latest message and log.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
            className={cn(
              'relative w-9 h-5 rounded-full transition-colors cursor-pointer',
              settings.autoScroll ? 'bg-accent' : 'bg-border'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                settings.autoScroll ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </div>
          <span className="text-sm text-foreground-secondary">
            {settings.autoScroll ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </section>

      {/* Font Size */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Font Size</h3>
        <div className="flex gap-2">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                settings.fontSize === size
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
