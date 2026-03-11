import { useRef, useEffect } from 'react'
import { useChatStore } from '../../stores/chatStore'
import { useAppStore } from '../../stores/appStore'
import { formatTimestamp } from '../../lib/utils'
import { EmptyState } from '../../components/EmptyState'
import { LoadingState } from '../../components/LoadingState'
import { MessageSquare, Bot, User, AlertCircle, Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { ChatMessage } from '../../types'

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages)
  const isProcessing = useChatStore((s) => s.isProcessing)
  const currentProject = useAppStore((s) => s.currentProject)
  const autoScroll = useAppStore((s) => s.settings.autoScroll)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  if (!currentProject) {
    return (
      <EmptyState
        icon={<MessageSquare size={32} />}
        title="No project selected"
        description="Open a project from the sidebar to start interacting with OpenCode."
        className="h-full"
      />
    )
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<Bot size={32} />}
        title="Ready to assist"
        description="Type a prompt below or use Quick Actions to get started."
        className="h-full"
      />
    )
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isProcessing && <LoadingState message="OpenCode is thinking..." className="py-4" />}
      <div ref={bottomRef} />
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const config = {
    user: {
      icon: <User size={14} />,
      label: 'You',
      containerClass: 'items-end',
      bubbleClass: 'bg-accent/20 border border-accent/30 text-foreground',
    },
    agent: {
      icon: <Bot size={14} />,
      label: 'OpenCode',
      containerClass: 'items-start',
      bubbleClass: 'bg-surface border border-border text-foreground',
    },
    system: {
      icon: <Terminal size={14} />,
      label: 'System',
      containerClass: 'items-start',
      bubbleClass: 'bg-surface-hover border border-border-subtle text-muted-foreground',
    },
    error: {
      icon: <AlertCircle size={14} />,
      label: 'Error',
      containerClass: 'items-start',
      bubbleClass: 'bg-error/10 border border-error/30 text-error',
    },
  }[message.role]

  return (
    <div
      className={cn(
        'flex flex-col gap-1 max-w-[85%]',
        config.containerClass,
        message.role === 'user' ? 'self-end' : 'self-start'
      )}
    >
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-muted">{config.icon}</span>
        <span className="text-xs text-muted font-medium">{config.label}</span>
        <span className="text-xs text-muted opacity-60">{formatTimestamp(message.timestamp)}</span>
      </div>
      <div
        className={cn(
          'rounded-lg px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          config.bubbleClass
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
