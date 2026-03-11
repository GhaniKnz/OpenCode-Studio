import { useState, useCallback } from 'react'
import { runOpencode, subscribeToLogs } from '../services/opencodeService'
import { useChatStore } from '../stores/chatStore'
import { useLogsStore } from '../stores/logsStore'
import { useAppStore } from '../stores/appStore'
import { generateId } from '../lib/utils'
import type { ChatMessage } from '../types'

export function useOpencode() {
  const [error, setError] = useState<string | null>(null)
  const { addMessage, setProcessing } = useChatStore()
  const { addLog, setProcessStatus } = useLogsStore()
  const { currentProject, settings } = useAppStore()

  const sendPrompt = useCallback(
    async (prompt: string) => {
      if (!currentProject) {
        setError('No project selected. Please open a project first.')
        return
      }

      setError(null)
      setProcessing(true)
      setProcessStatus('running')

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: prompt,
        timestamp: new Date().toISOString(),
      }
      addMessage(userMessage)

      addLog({
        id: generateId(),
        level: 'info',
        message: `Sending prompt to opencode: ${prompt.slice(0, 80)}...`,
        timestamp: new Date().toISOString(),
      })

      // Subscribe to log events from backend
      const unsubscribe = await subscribeToLogs((log) => {
        addLog(log)
      })

      try {
        const result = await runOpencode({
          projectPath: currentProject.path,
          prompt,
          executablePath: settings.opencodeExecutablePath,
        })

        const agentMessage: ChatMessage = {
          id: generateId(),
          role: result.exitCode === 0 ? 'agent' : 'error',
          content: result.stdout || result.stderr || 'No output received.',
          timestamp: new Date().toISOString(),
        }
        addMessage(agentMessage)

        if (result.exitCode !== 0) {
          addLog({
            id: generateId(),
            level: 'error',
            message: `Process exited with code ${result.exitCode}: ${result.stderr}`,
            timestamp: new Date().toISOString(),
          })
          setProcessStatus('error')
        } else {
          setProcessStatus('success')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(errorMsg)
        addMessage({
          id: generateId(),
          role: 'error',
          content: `Error: ${errorMsg}`,
          timestamp: new Date().toISOString(),
        })
        addLog({
          id: generateId(),
          level: 'error',
          message: errorMsg,
          timestamp: new Date().toISOString(),
        })
        setProcessStatus('error')
      } finally {
        setProcessing(false)
        unsubscribe()
      }
    },
    [currentProject, settings, addMessage, addLog, setProcessing, setProcessStatus]
  )

  return { sendPrompt, error }
}
