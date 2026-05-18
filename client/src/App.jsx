// App.jsx: Main application component for Plan Pal, holds the main layout and all child sections

import { useState, useEffect } from 'react'

function App() {
  // Task state: populated from the backend on load, replaces placeholder data
  const [tasks, setTasks] = useState([])

  // Form state: controlled inputs for the new task form
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [due, setDue] = useState('')

  // Fetch all tasks from the backend when the component first loads
  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])  

  // POST a new task to the backend, then add it to the task list
  const handleAddTask = () => {
    if (!title || !course || !due) return

    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, course, due })
    })
    .then(res => res.json())
    .then(newTask => {
      setTasks(prevTasks => [...prevTasks, newTask])
      setTitle('')
      setCourse('')
      setDue('')
    })
    .catch(err => console.error('Failed to add task:', err))
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation bar: this will be expanded with additional links and user profile in future iterations */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Plan Pal</h1>
        {/* Task Counter: will reflect the number of upcoming tasks in future iterations */}
        <span className="bg-pink-50 text-pink-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {tasks.length} upcoming tasks
        </span>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Dashboard: displays upcoming tasks sorted by the due date */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Upcoming tasks</h2>
          <p className="text-sm text-gray-500 mt-0.5">Stay organized and never miss a deadline!</p>
        </div>

        {/* Task list: this will be dynamically generated from the backend in future iterations */}
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5 mt-1 inline-block"> {task.course} </span>
              </div>
              {/* Task details: course and due date, will be color coded in future iterations */}
              <p className="text-sm text-gray-500">{task.course} · Due {task.due}</p>
            </div>
          ))}
        </div>

        {/* Page Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-500 font-medium uppercase">More features coming soon!</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* New task form: connected to the backend to add new tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New task</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Task name"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              placeholder="Course (e.g. Biology)"
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {/* Date input: will validate that due date is not in the past with backend additions */}
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            />
            {/* Submit button: onClick handler added when form is done*/}
            <button 
              onClick={handleAddTask}
              className="w-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 mt-1"
            >
              Add task
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App