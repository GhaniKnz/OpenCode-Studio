import { FileEdit, GitCommit } from 'lucide-react'
import { EmptyState } from '../../components/EmptyState'

// NOTE: Automatic change detection requires watching the filesystem during opencode execution.
// This panel is architecturally ready to receive data from the backend via Tauri events.
// Currently shows a placeholder UI — connect to real data when implementing file watching.

interface ChangedFile {
  path: string
  name: string
  status: 'modified' | 'added' | 'deleted'
}

const MOCK_CHANGED_FILES: ChangedFile[] = []

export function ChangedFilesPanel() {
  const files = MOCK_CHANGED_FILES

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground shrink-0">
        <GitCommit size={12} />
        Changed Files
      </div>

      {files.length === 0 ? (
        <EmptyState
          icon={<FileEdit size={20} />}
          title="No changes detected"
          description="Files modified by OpenCode will appear here"
          className="flex-1"
        />
      ) : (
        <div className="flex-1 overflow-y-auto p-2">
          {files.map((file) => (
            <div
              key={file.path}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover"
            >
              <span
                className={`text-xs font-mono w-4 text-center ${
                  file.status === 'added'
                    ? 'text-success'
                    : file.status === 'deleted'
                      ? 'text-error'
                      : 'text-warning'
                }`}
              >
                {file.status === 'added' ? 'A' : file.status === 'deleted' ? 'D' : 'M'}
              </span>
              <span className="text-xs text-muted-foreground truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
