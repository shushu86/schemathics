import { useEffect, useState } from 'react'
import TaskList from './components/TaskList/TaskList'  
import type { Task } from './types/task'

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')  
      const data = (await response.json()) as Task[]
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error) 
      setTasks([])
    }
  }


  useEffect(() => {
    fetchTasks()
  }, [])

  return(
    <div style={{ paddingLeft: '10vw', paddingRight: '10vw', paddingTop: '2vw', paddingBottom: '2vw' }}>
      {
        tasks.length > 0 ? <TaskList tasks={tasks} updateTasks={setTasks}/> : <p>Loading...</p>
      }
    </div>
  )
}

export default App
