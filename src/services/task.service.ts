import { supabase } from '@/lib/supabase'
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '@/types'

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: existing } = await supabase
    .from('tasks')
    .select('position')
    .eq('status', input.status)
    .order('position', { ascending: false })
    .limit(1)

  const position = (existing?.[0]?.position ?? -1) + 1

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      position,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const { data: existing } = await supabase
    .from('tasks')
    .select('position')
    .eq('status', status)
    .order('position', { ascending: false })
    .limit(1)

  const position = (existing?.[0]?.position ?? -1) + 1

  const { data, error } = await supabase
    .from('tasks')
    .update({ status, position })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
