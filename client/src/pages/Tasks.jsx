// Tasks.jsx: Full task list with sort, edit, delete, and complete

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getCourseColor, formatDate } from '../utils/courseColors'

const API = 'http://localhost:5000'

export default function Tasks() {
  const [tasks, setTasks]         = useState([])
  const [sortBy, setSortBy]       = useState('due')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm]   = useState({ title: '', course: '', due: '' })

  // Fetch all tasks from the backend on load
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  // DELETE a task from the backend and remove it from state
  const handleDelete = (id) => {
    fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTasks(prev => prev.filter(t => t.id !== id)))
      .catch(err => console.error('Failed to delete task:', err))
  }

  // Load task values into the edit form and enter edit mode
  const handleStartEdit = (task) => {
    setEditingId(task.id)
    setEditForm({ title: task.title, course: task.course, due: task.due })
  }

  // PUT updated task to the backend and update state
  const handleSaveEdit = (id) => {
    fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(prev => prev.map(t => t.id === id ? updated : t))
        setEditingId(null)
      })
      .catch(err => console.error('Failed to update task:', err))
  }

  // PATCH completed to 1 in the backend, fire confetti, update state
  const handleComplete = (id) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#ffffff'],
    })

    fetch(`${API}/tasks/${id}/complete`, { method: 'PATCH' })
      .then(res => res.json())
      .then(updatedTask => {
        // Update the task in state with the new completed value from the backend
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      })
      .catch(err => console.error('Failed to complete task:', err))
  }

  // Sort tasks based on the current sortBy value
    const sortedTasks = [...tasks]
        .filter(t => t.completed !== 1)
        .sort((a, b) => {
            if (sortBy === 'due')    return new Date(a.due) - new Date(b.due)
            if (sortBy === 'course') return a.course.localeCompare(b.course)
            if (sortBy === 'title')  return a.title.localeCompare(b.title)
            return 0
    })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All tasks</h2>
          <p className="text-sm text-gray-400 mt-1">{tasks.length} total tasks</p>
        </div>
        <Link
          to="/add"
          className="text-xs font-bold text-white px-4 py-2.5 rounded-xl no-underline hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
        >
          + Add task
        </Link>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-gray-400 font-medium">Sort by</span>
        {['due', 'course', 'title'].map(option => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
              sortBy === option
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-400 border-gray-100 hover:border-pink-200 hover:text-pink-500'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2">
        {sortedTasks.length === 0 ? (
          // Empty state: no tasks yet
          <div className="text-center py-16 bg-white rounded-2xl border border-pink-50">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span style={{ fontSize: '22px' }}>📋</span>
            </div>
            <p className="text-sm font-semibold text-gray-600">No tasks yet</p>
            <Link
              to="/add"
              className="inline-block mt-4 text-xs font-semibold text-white px-4 py-2 rounded-xl no-underline"
              style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
            >
              + Add your first task
            </Link>
          </div>
        ) : (
          sortedTasks.map(task => {
            const color = getCourseColor(task.course)
            const isOverdue = new Date(task.due) < new Date()
            const isDone = task.completed === 1

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm transition-all duration-200 ${
                  isDone ? 'opacity-50' : 'hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {editingId === task.id ? (
                  // Edit mode: pre-filled inputs for the task
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={e => setEditForm({ ...editForm, course: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                      type="date"
                      value={editForm.due}
                      onChange={e => setEditForm({ ...editForm, due: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <div className="flex gap-2 mt-1">
                      {/* Save button: sends updated task to the backend */}
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="text-xs font-bold text-white px-4 py-2 rounded-xl transition hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
                      >
                        Save changes
                      </button>
                      {/* Cancel button: exits edit mode without saving */}
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode: task details with action buttons
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.dot}`} />
                    <div className="flex-1 min-w-0">
                      {/* Task title: struck through when completed */}
                      <p className={`font-semibold text-gray-800 text-sm truncate ${isDone ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Course tag: color coded */}
                        <span className={`text-xs font-semibold ${color.bg} ${color.text} ${color.border} border rounded-lg px-2 py-0.5`}>
                          {task.course}
                        </span>
                        {/* Due date: red if overdue and not done */}
                        <span className={`text-xs font-medium ${isOverdue && !isDone ? 'text-red-400' : 'text-gray-400'}`}>
                          {isOverdue && !isDone ? '⚠ ' : ''}{formatDate(task.due)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: complete, edit, delete */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isDone ? (
                        // Complete button: one-way, fires confetti on click
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center"
                          title="Mark as complete"
                        >
                          <span className="text-gray-300 text-sm">✓</span>
                        </button>
                      ) : (
                        // Completed indicator: replaces button once done, not clickable
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
                        >
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                      {/* Edit and delete only shown when task is not complete */}
                      {!isDone && (
                        <>
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="text-xs bg-blue-50 text-blue-500 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-xs bg-red-50 text-red-400 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}