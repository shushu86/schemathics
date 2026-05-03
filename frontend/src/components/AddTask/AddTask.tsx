import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { Task } from "../../types/task";

const AddTask = ({
    handleHideAddTask,
    updateTasks,
}: {
    handleHideAddTask: () => void;
    updateTasks: Dispatch<SetStateAction<Task[]>>;
}) => {
    const [fields, setFields] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFields({ ...fields, [name]: value })
    }

    const handleSubmit = async () => {
        try {
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
            updateTasks((prev) => [...prev, newTask])
            handleHideAddTask()
        } catch (error) {
            console.error('Error creating task:', error)
        }
    }

  return (
    <li className="row">
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
            <input type="date" name="due_date" id="due_date" value={fields.due_date} onChange={handleChange} />
        </span>
        <span className="cell">
            <button onClick={handleSubmit}>Add Task</button>
            <button onClick={handleHideAddTask}>Cancel</button>
        </span>
    </li>
  )
}

export default AddTask;