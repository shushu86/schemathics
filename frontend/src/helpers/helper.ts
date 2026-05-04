import type { Task } from '../types/task'

/** Normalize API/display status to `todo` | `in_progress` | `done` for comparisons and filters. */
export const statusToApiSlug = (status: string): 'todo' | 'in_progress' | 'done' => {
  const slug = status.trim().toLowerCase().replace(/\s+/g, '_')
  if (slug === 'todo' || slug === 'in_progress' || slug === 'done') {
    return slug
  }
  return 'todo'
}

/** Normalize API/display priority (`stored_priority`: "Low", …) to slug for filters. */
export const storedPriorityToSlug = (priority: string): 'low' | 'medium' | 'high' => {
  const s = priority.trim().toLowerCase()
  if (s === 'low' || s === 'medium' || s === 'high') {
    return s
  }
  return 'low'
}

export type TaskStatusFilter = 'all' | 'todo' | 'in_progress' | 'done'
export type TaskPriorityFilter = 'all' | 'low' | 'medium' | 'high'

/** Apply status and priority filters together (AND). */
export const filterTasksByStatusAndPriority = (
  tasks: Task[],
  statusFilter: TaskStatusFilter,
  priorityFilter: TaskPriorityFilter,
): Task[] =>
  tasks.filter((task) => {
    const statusOk =
      statusFilter === 'all' || statusToApiSlug(task.status) === statusFilter
    const priorityOk =
      priorityFilter === 'all' ||
      storedPriorityToSlug(task.stored_priority) === priorityFilter
    return statusOk && priorityOk
  })

/** Laravel JSON errors: `message` and/or `errors` map of string arrays. */
export const messageFromApiErrorBody = (body: unknown): string => {
  if (!body || typeof body !== 'object') {
    return 'Request failed'
  }
  const o = body as { message?: string; errors?: Record<string, string[]> }
  if (o.errors && typeof o.errors === 'object') {
    const parts = Object.values(o.errors)
      .flat()
      .filter((x): x is string => typeof x === 'string')
    if (parts.length > 0) {
      return parts.join(' ')
    }
  }
  if (typeof o.message === 'string' && o.message.length > 0) {
    return o.message
  }
  return 'Request failed'
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Value for `<input type="datetime-local">` — local wall time, not UTC. */
export const formatDateForDatetimeLocal = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`

export const isEffectivePriorityHigh = (task?: Task): boolean => {
  if (!task) {
    return false
  }

  return (
    task.effective_priority?.toLowerCase() === 'high' ||
    (task?.status?.toLowerCase() !== 'done' &&
      new Date(task.due_date).getTime() <=
        new Date().getTime() + 24 * 60 * 60 * 1000)
  )
}
