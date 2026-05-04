import type { Task } from '../types/task'

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
