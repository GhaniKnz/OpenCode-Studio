import { cn } from '../lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 p-8', className)}>
      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-muted">{message}</p>
    </div>
  )
}
