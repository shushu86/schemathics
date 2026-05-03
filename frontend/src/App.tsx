import { useEffect, useState } from 'react'
import TaskList from './components/TaskList/TaskList'  
import type { Task } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks')  
      const data = (await response.json()) as Task[]
      setTasks(data)
    } catch (error) {
      throw new Error('Error fetching tasks:', error) ;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
    console.log('tasks', tasks);
  }, [])

  return(
    <div style={{ paddingLeft: '10vw', paddingRight: '10vw', paddingTop: '2vw', paddingBottom: '2vw' }}>
      {
        loading ? <p>Loading...</p> : <TaskList tasks={tasks} updateTasks={setTasks}/>
      }
    </div>
  )
}

export default App
