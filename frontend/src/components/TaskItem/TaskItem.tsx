import type { Task } from '../../types/task'
import { type Dispatch, type SetStateAction, useState } from 'react'
import AddOrEditTask from '../AddOrEditTask/AddOrEditTask'
import { isEffectivePriorityHigh } from '../../helpers/helper'

type TaskItemProps = {
  task: Task
  updateTasks: Dispatch<SetStateAction<Task[]>>
}   

const TaskItem = ({ task, updateTasks }: TaskItemProps) => {
  const [isEditMode, setIsEditMode] = useState(false);


  const handleDeleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      updateTasks(prev => prev.filter(task => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
  
  if(isEditMode) {
    return (<AddOrEditTask handleHideAddTask={() => setIsEditMode(false)} updateTasks={updateTasks} task={task} />)
  }
  
  else {
    return (
      <li className="row">
        <span className="cell">{task.id}</span>
        <span className="cell cell-title">{task.title}</span>
        <span className="cell">{task.description}</span>
        <span className="cell">{task.status}</span>
        <span className="cell" style={{ color: isEffectivePriorityHigh(task) ? 'red' : undefined }} >
            {isEffectivePriorityHigh(task) ? 'High' : task.stored_priority}
        </span>
        <span className="cell">{task.due_date}</span>
        <span className="cell">{task.created_at}</span>
        <span className="cell cell-actions">
          <button type="button" className="action-button" onClick={() => setIsEditMode(true)}>Edit</button>
          <button type="button" className="action-button" onClick={() => confirm('Are you sure you want to delete this task?') && handleDeleteTask(task.id)}>Delete</button>
        </span>
      </li>
    );
  }
};

export default TaskItem;