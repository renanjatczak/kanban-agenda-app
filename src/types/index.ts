export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type EventType = 'meeting' | 'focus' | 'reminder' | 'personal'
export type EventStatus = 'confirmed' | 'cancelled'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  position: number
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  user_id: string
  task_id: string | null
  title: string
  description: string | null
  start_time: string
  end_time: string
  color: string | null
  type: EventType
  status: EventStatus
  created_at: string
  updated_at: string
}

export type CreateTaskInput = Pick<Task, 'title' | 'status' | 'priority'> & {
  description?: string
}

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'position'>>

export type CreateEventInput = Pick<Event, 'title' | 'start_time' | 'end_time' | 'type' | 'status'> & {
  description?: string
  task_id?: string
  color?: string
}

export type UpdateEventInput = Partial<Pick<Event, 'title' | 'description' | 'start_time' | 'end_time' | 'color' | 'type' | 'status' | 'task_id'>>
