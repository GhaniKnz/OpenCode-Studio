import { useCallback } from 'react'
import { getProjectFiles, readFile } from '../services/opencodeService'
import { useExplorerStore } from '../stores/explorerStore'
import type { FileNode } from '../types'

export function useFileExplorer() {
  const { setFileTree, setSelectedFile, setFileContent, setLoading } = useExplorerStore()

  const loadProjectFiles = useCallback(
    async (projectPath: string) => {
      setLoading(true)
      try {
        const tree = await getProjectFiles(projectPath)
        setFileTree(tree)
      } catch (err) {
        console.error('Failed to load project files:', err)
        // Set mock data if backend fails
        setFileTree(createMockFileTree(projectPath))
      } finally {
        setLoading(false)
      }
    },
    [setFileTree, setLoading]
  )

  const openFile = useCallback(
    async (file: FileNode) => {
      if (file.type !== 'file') return
      setSelectedFile(file)
      setLoading(true)
      try {
        const content = await readFile(file.path)
        setFileContent(content)
      } catch (err) {
        console.error('Failed to read file:', err)
        setFileContent(`// Could not read file: ${file.path}`)
      } finally {
        setLoading(false)
      }
    },
    [setSelectedFile, setFileContent, setLoading]
  )

  return { loadProjectFiles, openFile }
}

function createMockFileTree(projectPath: string): FileNode {
  const projectName = projectPath.split(/[/\\]/).pop() ?? 'project'
  return {
    name: projectName,
    path: projectPath,
    type: 'directory',
    children: [
      {
        name: 'src',
        path: `${projectPath}/src`,
        type: 'directory',
        children: [
          { name: 'main.ts', path: `${projectPath}/src/main.ts`, type: 'file', extension: 'ts' },
          {
            name: 'App.tsx',
            path: `${projectPath}/src/App.tsx`,
            type: 'file',
            extension: 'tsx',
          },
          {
            name: 'components',
            path: `${projectPath}/src/components`,
            type: 'directory',
            children: [
              {
                name: 'Button.tsx',
                path: `${projectPath}/src/components/Button.tsx`,
                type: 'file',
                extension: 'tsx',
              },
            ],
          },
        ],
      },
      {
        name: 'package.json',
        path: `${projectPath}/package.json`,
        type: 'file',
        extension: 'json',
      },
      {
        name: 'README.md',
        path: `${projectPath}/README.md`,
        type: 'file',
        extension: 'md',
        recentlyModified: true,
      },
    ],
  }
}
