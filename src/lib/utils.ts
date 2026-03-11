import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex === -1 || dotIndex === filename.length - 1) return ''
  return filename.slice(dotIndex + 1).toLowerCase()
}

export function detectProjectType(path: string): import('../types').ProjectType {
  const lower = path.toLowerCase()
  if (lower.includes('unity') || lower.includes('assets/scripts')) return 'unity'
  if (lower.includes('react') || lower.includes('next') || lower.includes('vue')) return 'web'
  if (
    lower.includes('flutter') ||
    lower.includes('react-native') ||
    lower.includes('ios') ||
    lower.includes('android')
  )
    return 'mobile'
  return 'unknown'
}
