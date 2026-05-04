import TaskItem from '../TaskItem/TaskItem'
import type { Task } from '../../types/task'
import './taskList.scss';
import { useState, type Dispatch, type SetStateAction } from 'react';
import AddTask from '../AddTask/AddTask';

const TaskList = ({
  tasks,
  updateTasks,
}: {
  tasks: Task[];
  updateTasks: Dispatch<SetStateAction<Task[]>>;
}) => {

  const [showAddTask, setShowAddTask] = useState(false);
  const [dueDateSort, setDueDateSort] = useState<'asc' | 'desc'>('desc');
  
  const sortTasks = () => {
    const asc = dueDateSort === 'asc'
    updateTasks((prev) =>
      [...prev].sort((a, b) => {
        const diff =
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        return asc ? diff : -diff
      })
    )
    setDueDateSort(asc ? 'desc' : 'asc')
  }

  const handleShowAddTask = () => {
    setShowAddTask(true);
  }

  const handleHideAddTask = () => {
    setShowAddTask(false);
  }

    return (
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Task List</h1>
            <button onClick={handleShowAddTask} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>+ Add Task</button>
          </div>
          <div className="headers">
            <span className="header-label">Id</span>
            <span className="header-label">Title</span>
            <span className="header-label">Description</span>
            <span className="header-label">Status</span>
            <span className="header-label">Priority</span>
            <span className="header-label" onClick={sortTasks} style={{ cursor: 'pointer' }}>Due date</span>
            <span className="header-label">Created at</span>
            <span className="header-label header-label--actions">Actions</span>
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} updateTasks={updateTasks} />
            ))}
            {showAddTask && <AddTask handleHideAddTask={handleHideAddTask} updateTasks={updateTasks} /> }

          </ul>
        </div>
    )
}

export default TaskList;
