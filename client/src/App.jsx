// App.jsx: Main application component for Plan Pal, holds the main layout and all child sections

import { useState, useEffect } from 'react'

function App() {
  // Task state: populated from the backend on load, replaces placeholder data
  const [tasks, setTasks] = useState([])

  // Form state: controlled inputs for the new task form
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [due, setDue] = useState('')

  // Edit state: tracks which task is being edited and holds the updated values
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', course: '', due: '' })

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

  // DELETE a task from the backend, then remove it from the task list
  const handleDeleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        // Filter out the deleted task from state without a full page reload
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
      })
      .catch(err => console.error('Failed to delete task:', err))
  }

  // Load a task's current values into the edit form and enter edit mode
  const handleStartEdit = (task) => {
    setEditingId(task.id)
    setEditForm({ title: task.title, course: task.course, due: task.due })
  }

  // PUT updated task to the backend, then update it in the task list
  const handleSaveEdit = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(prevTasks => prevTasks.map(task =>
          task.id === id ? updatedTask : task
        ))
        setEditingId(null)
      })
      .catch(err => console.error('Failed to update task:', err))
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation bar: sticky header with app title and task counter */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Plan Pal</h1>
        {/* Task counter: reflects live count from the backend */}
        <span className="bg-pink-50 text-pink-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {tasks.length} upcoming
        </span>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Dashboard header: title and subtitle with visual hierarchy */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming tasks</h2>
          <p className="text-sm text-gray-400 mt-0.5">Stay organized and never miss a deadline!</p>
        </div>

        {/* Task list: supports viewing, editing, and deleting tasks */}
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              {editingId === task.id ? (
                // Edit mode: show editable inputs pre-filled with current task values
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    value={editForm.course}
                    onChange={e => setEditForm({ ...editForm, course: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="date"
                    value={editForm.due}
                    onChange={e => setEditForm({ ...editForm, due: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <div className="flex gap-2 mt-1">
                    {/* Save button: sends updated task to the backend */}
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg px-3 py-1.5 transition"
                    >
                      Save
                    </button>
                    {/* Cancel button: exits edit mode without saving */}
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg px-3 py-1.5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode: show task details with edit and delete buttons
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* Course tag and due date: color coding added in next commit */}
                      <span className="text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100 rounded-md px-1.5 py-0.5">
                        {task.course}
                      </span>
                      <span className="text-xs text-gray-400">Due {task.due}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 ml-4 mt-1 flex-shrink-0">
                    {/* Edit button: loads task values into the edit form */}
                    <button
                      onClick={() => handleStartEdit(task)}
                      className="text-xs text-blue-400 hover:text-blue-600 transition"
                    >
                      Edit
                    </button>
                    {/* Delete button: removes task from UI and database */}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Page divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-300 font-medium uppercase tracking-widest">Add new</span>
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
            {/* Submit button: calls handleAddTask which POSTs the new task to the backend */}
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