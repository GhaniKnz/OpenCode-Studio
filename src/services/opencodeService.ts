import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import type { LogEntry } from '../types'
import { generateId } from '../lib/utils'

export interface RunCommandOptions {
  projectPath: string
  prompt: string
  executablePath?: string
}

export interface CommandResult {
  stdout: string
  stderr: string
  exitCode: number
}

export async function runOpencode(options: RunCommandOptions): Promise<CommandResult> {
  return await invoke<CommandResult>('run_opencode', {
    projectPath: options.projectPath,
    prompt: options.prompt,
    executablePath: options.executablePath ?? 'opencode',
  })
}

export async function getProjectFiles(projectPath: string): Promise<import('../types').FileNode> {
  return await invoke<import('../types').FileNode>('get_project_files', { projectPath })
}

export async function readFile(filePath: string): Promise<string> {
  return await invoke<string>('read_file_content', { filePath })
}

export async function saveFile(filePath: string, content: string): Promise<void> {
  await invoke('write_file_content', { filePath, content })
}

export async function selectFolder(): Promise<string | null> {
  return await invoke<string | null>('select_folder')
}

export async function checkOpencodeInstalled(executablePath: string): Promise<boolean> {
  return await invoke<boolean>('check_executable', { executablePath })
}

export async function getAppVersion(): Promise<string> {
  return await invoke<string>('get_app_version')
}

export function subscribeToLogs(callback: (log: LogEntry) => void): Promise<() => void> {
  return listen<{ level: string; message: string; source?: string }>('process-log', (event) => {
    callback({
      id: generateId(),
      level: event.payload.level as LogEntry['level'],
      message: event.payload.message,
      timestamp: new Date().toISOString(),
      source: event.payload.source,
    })
  })
}
