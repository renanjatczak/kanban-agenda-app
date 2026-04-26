import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import type { CreateEventInput, UpdateEventInput } from '@/types'
import {
  fetchEventsByRange,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/services/event.service'

const EVENTS_KEY = ['events'] as const

export function useEvents(start: Date, end: Date) {
  return useQuery({
    queryKey: [...EVENTS_KEY, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')],
    queryFn: () => fetchEventsByRange(start.toISOString(), end.toISOString()),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      updateEvent(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  })
}
