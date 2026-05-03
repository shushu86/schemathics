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

  const handleShowAddTask = () => {
    setShowAddTask(true);
  }

  const handleHideAddTask = () => {
    setShowAddTask(false);
  }

  console.log('tasks', tasks);
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
            <span className="header-label">Due date</span>
            <span></span>
          </div>

          <ul className="task-list">
            {showAddTask && <AddTask handleHideAddTask={handleHideAddTask} updateTasks={updateTasks} /> }
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} updateTasks={updateTasks} />
            ))}
          </ul>
        </div>
    )
}

export default TaskList;
