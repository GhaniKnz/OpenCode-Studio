import { create } from 'zustand'
import type { ChatMessage } from '../types'

interface ChatState {
  messages: ChatMessage[]
  isProcessing: boolean

  addMessage: (message: ChatMessage) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void
  setProcessing: (isProcessing: boolean) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isProcessing: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content,
          isStreaming: false,
        }
      }
      return { messages }
    }),

  clearMessages: () => set({ messages: [] }),

  setProcessing: (isProcessing) => set({ isProcessing }),
}))
