import { supabase } from '@/lib/supabase'
import type { Event, CreateEventInput, UpdateEventInput } from '@/types'

export async function fetchEventsByRange(start: string, end: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('start_time', start)
    .lte('start_time', end)
    .order('start_time', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      start_time: input.start_time,
      end_time: input.end_time,
      color: input.color ?? null,
      type: input.type,
      status: input.status,
      task_id: input.task_id ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(id: string, input: UpdateEventInput): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
