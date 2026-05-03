import type { Task } from '../../types/task'
import { type Dispatch, type SetStateAction } from 'react'

type TaskItemProps = {
  task: Task
  updateTasks: Dispatch<SetStateAction<Task[]>>
}   

const TaskItem = ({ task, updateTasks }: TaskItemProps) => {
  const handleDeleteTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      updateTasks(prev => prev.filter(task => task.id !== task.id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
  return (
    <li className="row">
      <span className="cell">{task.id}</span>
      <span className="cell cell-title">{task.title}</span>
      <span className="cell">{task.description}</span>
      <span className="cell">{task.status}</span>
      <span className="cell">{task.priority}</span>
      <span className="cell">{task.due_date}</span>
      <span className="cell cell-actions">
        <button type="button" className="action-button" onClick={handleDeleteTask}>
          Delete
        </button>
      </span>
    </li>
  )
}

export default TaskItem;