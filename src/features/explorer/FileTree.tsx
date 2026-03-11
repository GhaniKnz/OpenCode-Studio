import { useState } from 'react'
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search } from 'lucide-react'
import { useExplorerStore } from '../../stores/explorerStore'
import { useFileExplorer } from '../../hooks/useFileExplorer'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { cn } from '../../lib/utils'
import type { FileNode } from '../../types'

const FILE_ICON_COLORS: Record<string, string> = {
  ts: 'text-blue-400',
  tsx: 'text-blue-400',
  js: 'text-yellow-400',
  jsx: 'text-yellow-400',
  css: 'text-pink-400',
  scss: 'text-pink-400',
  json: 'text-orange-400',
  md: 'text-gray-400',
  cs: 'text-purple-400',
  py: 'text-green-400',
  rs: 'text-orange-400',
  html: 'text-red-400',
}

export function FileTree() {
  const { fileTree, isLoading, searchQuery, setSearchQuery } = useExplorerStore()

  if (isLoading) return <LoadingState message="Loading files..." className="h-full" />

  if (!fileTree) {
    return (
      <EmptyState
        icon={<Folder size={24} />}
        title="No files loaded"
        description="Open a project to browse files"
        className="h-full"
      />
    )
  }

  const filtered = searchQuery ? filterTree(fileTree, searchQuery.toLowerCase()) : fileTree

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-background rounded border border-border focus-within:border-accent/60 transition-colors">
          <Search size={13} className="text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>
      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered ? (
          <TreeNode node={filtered} depth={0} />
        ) : (
          <p className="text-xs text-muted p-2">No files match &quot;{searchQuery}&quot;</p>
        )}
      </div>
    </div>
  )
}

function TreeNode({ node, depth }: { node: FileNode; depth: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2)
  const { selectedFile } = useExplorerStore()
  const { openFile } = useFileExplorer()
  const ext = node.extension ?? node.name.split('.').pop() ?? ''
  const iconColor = FILE_ICON_COLORS[ext] ?? 'text-muted'

  if (node.type === 'directory') {
    return (
      <div>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-1 w-full px-1 py-0.5 rounded text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
          style={{ paddingLeft: `${4 + depth * 12}px` }}
        >
          {isOpen ? (
            <ChevronDown size={12} className="shrink-0" />
          ) : (
            <ChevronRight size={12} className="shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen size={12} className="text-accent shrink-0" />
          ) : (
            <Folder size={12} className="text-accent shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen &&
          node.children?.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
      </div>
    )
  }

  return (
    <button
      onClick={() => openFile(node)}
      className={cn(
        'flex items-center gap-1 w-full px-1 py-0.5 rounded text-xs transition-colors',
        selectedFile?.path === node.path
          ? 'bg-accent-subtle text-foreground'
          : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
      )}
      style={{ paddingLeft: `${4 + depth * 12}px` }}
    >
      <File size={12} className={cn('shrink-0', iconColor)} />
      <span className="truncate">{node.name}</span>
      {node.recentlyModified && <span className="ml-auto text-warning text-xs">●</span>}
    </button>
  )
}

function filterTree(node: FileNode, query: string): FileNode | null {
  if (node.type === 'file') {
    return node.name.toLowerCase().includes(query) ? node : null
  }
  const filteredChildren = node.children
    ?.map((child) => filterTree(child, query))
    .filter((c): c is FileNode => c !== null)
  if (!filteredChildren?.length) return null
  return { ...node, children: filteredChildren }
}
