import type { EventType } from '@/types'

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  meeting:  '#6366f1',
  focus:    '#8b5cf6',
  reminder: '#ef4444',
  personal: '#f59e0b',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting:  'Reunião',
  focus:    'Foco',
  reminder: 'Lembrete',
  personal: 'Pessoal',
}

export const PRESET_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#f97316',
]
