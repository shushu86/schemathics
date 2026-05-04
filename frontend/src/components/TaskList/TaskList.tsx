import TaskItem from '../TaskItem/TaskItem'
import type { Task } from '../../types/task'
import './taskList.scss';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import AddOrEditTask from '../AddOrEditTask/AddOrEditTask';
import {
  filterTasksByStatusAndPriority,
  type TaskPriorityFilter,
  type TaskStatusFilter,
} from '../../helpers/helper';

const TaskList = ({
  tasks,
  updateTasks,
}: {
  tasks: Task[];
  updateTasks: Dispatch<SetStateAction<Task[]>>;
}) => {

  const [showAddTask, setShowAddTask] = useState(false);
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('all');

  const visibleTasks = useMemo(
    () => filterTasksByStatusAndPriority(tasks, statusFilter, priorityFilter),
    [tasks, statusFilter, priorityFilter],
  );

  const handleSortTasks = (dateType: 'due_date' | 'created_at') => {
    const asc = dateSort === 'asc'
    updateTasks((prev) =>
      [...prev].sort((a, b) => {
        const diff = new Date(a[dateType]).getTime() - new Date(b[dateType]).getTime()
        return asc ? diff : -diff
      })
    )
    setDateSort(asc ? 'desc' : 'asc')
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
          <div
            className="task-list__filters"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Filters: Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatusFilter)}
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Priority
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriorityFilter)}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="headers">
            <span className="header-label">Id</span>
            <span className="header-label">Title</span>
            <span className="header-label">Description</span>
            <span className="header-label">Status</span>
            <span className="header-label">Priority</span>
            <span className="header-label" onClick={() => handleSortTasks('due_date')} style={{ cursor: 'pointer' }}>Due date</span>
            <span className="header-label" onClick={() => handleSortTasks('created_at')} style={{ cursor: 'pointer' }}>Created at</span>
            <span className="header-label header-label--actions">Actions</span>
          </div>

          <ul className="task-list">
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} updateTasks={updateTasks} />
            ))}
            {showAddTask && (
              <AddOrEditTask
                key="add-task"
                handleHideAddTask={handleHideAddTask}
                updateTasks={updateTasks}
              />
            )}

          </ul>
        </div>
    )
}

export default TaskList;
