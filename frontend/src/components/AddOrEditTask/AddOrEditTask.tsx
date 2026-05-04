import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { Task } from "../../types/task";
import { formatDateForDatetimeLocal, isEffectivePriorityHigh } from "../../helpers/helper.ts";

const AddOrEditTask = ({
    handleHideAddTask,
    updateTasks,
    task,
}: {
    handleHideAddTask: () => void;
    updateTasks: Dispatch<SetStateAction<Task[]>>;
    task?: Task;
}) => {

    const [fields, setFields] = useState({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status.toLowerCase() ?? 'todo',
        priority: isEffectivePriorityHigh(task) ? 'high' : (task?.stored_priority?.toLowerCase() ?? 'low'),
        due_date: task?.due_date
            ? formatDateForDatetimeLocal(new Date(task.due_date))
            : '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFields({ ...fields, [name]: value })
    }

    const handleSubmit = async () => {
        try {
            if(task) {
                const response = await fetch(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(fields),
                })
                if (!response.ok) {
                    throw new Error('Failed to update task')
                }
                const updatedTask = (await response.json()) as Task
                updateTasks((prev) => prev.map(taskItem => taskItem.id === task.id ? updatedTask : taskItem))
                handleHideAddTask()
            }

            else {
                const response = await fetch('/api/tasks/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(fields),
                })
                if (!response.ok) {
                    throw new Error('Failed to create task')
                }
                const newTask = (await response.json()) as Task
                updateTasks((prev) => [...prev, newTask]);
            }
            
            
            handleHideAddTask();
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

  return (
    <li className="row new-task">
        <span className="cell">
            <input type="hidden" />
        </span>
        <span className="cell">
            <input type="text" name="title" id="title" value={fields.title} onChange={handleChange} />
        </span>
        <span className="cell">
            <input type="text" name="description" id="description" value={fields.description} onChange={handleChange} />
        </span>
        <span className="cell">
            <select name="status" id="status" value={fields.status} onChange={handleChange} >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
            </select>
        </span>
        <span className="cell">
            <select name="priority" id="priority" value={fields.priority} onChange={handleChange} >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
        </span>
        <span className="cell">
            <input type="datetime-local" name="due_date" id="due_date" value={fields.due_date} onChange={handleChange} />
        </span>
        <span><input type="hidden" /></span>
        <span className="cell">
            <button onClick={handleSubmit} className="confirm-button">Confirm</button>
            <button onClick={handleHideAddTask} className="cancel-button">Cancel</button>
        </span>
    </li>
  )
}

export default AddOrEditTask;