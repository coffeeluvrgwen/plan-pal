// App.jsx: Main application component for Plan Pal, holds the main layout and all child sections

import { useState, useEffect } from 'react'

// Course color map: assigns a consistent color to each course name
// Add more courses and colors here as needed
const courseColors = {
  'Math':    { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100'   },
  'English': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  'Biology': { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-100'  },
  'History': { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100'  },
  'Art':     { bg: 'bg-pink-50',   text: 'text-pink-600',   border: 'border-pink-100'   },
  'default': { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-100'   },
}

// Helper: returns the color classes for a given course, falls back to default
const getCourseColor = (course) => courseColors[course] || courseColors['default']

// Helper: formats a date string from YYYY-MM-DD to readable format e.g. "May 1, 2025"
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function App() {
  // Task state: populated from the backend on load, replaces placeholder data
  const [tasks, setTasks] = useState([])

  // View state: toggles between list, weekly, and calendar views
  const [view, setView] = useState('list')

  // Sort state: controls how tasks are ordered in the list view
  const [sortBy, setSortBy] = useState('due')

  // Form state: controlled inputs for the new task form
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [due, setDue] = useState('')

  // Error state: shown when the user tries to submit an incomplete form
  const [formError, setFormError] = useState('')

  // Edit state: tracks which task is being edited and holds the updated values
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', course: '', due: '' })

  // Calendar state: tracks which month is currently displayed
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Fetch all tasks from the backend when the component first loads
  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  // POST a new task to the backend, then add it to the task list
  const handleAddTask = () => {
    if (!title || !course || !due) {
      setFormError('Please fill in all fields before adding a task.')
      return
    }
    setFormError('')

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

  // Sort tasks based on the current sortBy value
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'due') {
      // Sort by due date ascending: soonest first
      return new Date(a.due) - new Date(b.due)
    }
    if (sortBy === 'course') {
      return a.course.localeCompare(b.course)
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  // Group tasks by day of the week for the weekly view
  const getWeeklyTasks = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const grouped = {}
    days.forEach(day => grouped[day] = [])
    tasks.forEach(task => {
      const date = new Date(task.due + 'T00:00:00')
      const dayName = days[date.getDay()]
      grouped[dayName].push(task)
    })
    return { days, grouped }
  }

  // Build the calendar grid for the current month
  const getCalendarDays = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const paddedDays = []
    for (let i = 0; i < firstDay.getDay(); i++) {
      paddedDays.push(null)
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      paddedDays.push(new Date(year, month, d))
    }
    return paddedDays
  }

  // Returns tasks due on a specific calendar date
  const getTasksForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.due === dateStr)
  }

  // Format the calendar month heading e.g. "May 2025"
  const calendarHeading = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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

        {/* Dashboard header: title, subtitle, view toggle, and sort controls */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Upcoming tasks</h2>
              <p className="text-sm text-gray-400 mt-0.5">Stay organized and never miss a deadline!</p>
            </div>

            {/* View toggle: switches between list, weekly, and calendar views */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
              <button
                onClick={() => setView('list')}
                className={`text-xs px-3 py-1.5 rounded-md transition font-medium ${
                  view === 'list'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('weekly')}
                className={`text-xs px-3 py-1.5 rounded-md transition font-medium ${
                  view === 'weekly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`text-xs px-3 py-1.5 rounded-md transition font-medium ${
                  view === 'calendar'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* Sort controls: only shown in list view */}
          {view === 'list' && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-400">Sort by</span>
              {['due', 'course', 'title'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition ${
                    sortBy === option
                      ? 'bg-pink-50 text-pink-600 border-pink-100 font-medium'
                      : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Task views: switches between list, weekly, and calendar views */}
        {view === 'list' ? (

          // List view: tasks sorted by the current sortBy value
          <div className="flex flex-col gap-2">
            {sortedTasks.length === 0 ? (
              // Empty state: shown when there are no tasks yet
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No tasks yet — add one below!</p>
              </div>
            ) : (
              sortedTasks.map(task => {
                const color = getCourseColor(task.course)
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-150"
                  >
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
                      // View mode: show task with color coded course tag
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {/* Course tag: color coded by course name */}
                            <span className={`text-xs font-medium ${color.bg} ${color.text} ${color.border} border rounded-md px-1.5 py-0.5`}>
                              {task.course}
                            </span>
                            {/* Due date: formatted and turns red if in the past */}
                            <span className={`text-xs font-medium ${new Date(task.due) < new Date() ? 'text-red-400' : 'text-gray-400'}`}>
                              Due {formatDate(task.due)}
                            </span>
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
                )
              })
            )}
          </div>

        ) : view === 'weekly' ? (

          // Weekly view: tasks grouped by day of the week
          <div className="flex flex-col gap-3">
            {(() => {
              const { days, grouped } = getWeeklyTasks()
              return days.map(day => (
                <div key={day} className={`bg-white rounded-xl border ${grouped[day].length > 0 ? 'border-gray-200' : 'border-gray-100'} px-4 py-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{day}</span>
                    {grouped[day].length > 0 && (
                      <span className="text-xs text-gray-300">{grouped[day].length} task{grouped[day].length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {grouped[day].length === 0 ? (
                    <p className="text-xs text-gray-300">No tasks due</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {grouped[day].map(task => {
                        const color = getCourseColor(task.course)
                        return (
                          <div key={task.id} className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${color.bg} ${color.text} ${color.border} border rounded-md px-1.5 py-0.5 flex-shrink-0`}>
                              {task.course}
                            </span>
                            <span className="text-xs text-gray-700 font-medium">{task.title}</span>
                            {/* Due date: formatted for readability */}
                            <span className="text-xs text-gray-400 ml-auto">{formatDate(task.due)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))
            })()}
          </div>

        ) : (

          // Calendar view: monthly grid showing tasks on their due dates
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Calendar header: month title and prev/next navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition"
              >
                ← Prev
              </button>
              <span className="text-sm font-semibold text-gray-700">{calendarHeading}</span>
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded transition"
              >
                Next →
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar day grid */}
            <div className="grid grid-cols-7">
              {getCalendarDays().map((date, i) => {
                const dayTasks = getTasksForDate(date)
                const isToday = date && date.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={i}
                    className={`min-h-16 p-1.5 border-b border-r border-gray-50 ${!date ? 'bg-gray-50' : ''}`}
                  >
                    {date && (
                      <>
                        {/* Day number: highlighted pink if today */}
                        <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                          isToday ? 'bg-pink-500 text-white' : 'text-gray-500'
                        }`}>
                          {date.getDate()}
                        </div>
                        {/* Task labels: shows up to 2 then overflow count */}
                        <div className="flex flex-col gap-0.5">
                          {dayTasks.slice(0, 2).map(task => {
                            const color = getCourseColor(task.course)
                            return (
                              <div
                                key={task.id}
                                className={`text-xs ${color.bg} ${color.text} rounded px-1 py-0.5 truncate leading-tight`}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            )
                          })}
                          {/* Overflow indicator: shown when more than 2 tasks fall on the same day */}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-400 px-1">+{dayTasks.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        )}

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

            {/* Task name input with accessible label */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500" htmlFor="task-title">
                Task name
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Essay outline"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Course input with accessible label */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500" htmlFor="task-course">
                Course
              </label>
              <input
                id="task-course"
                type="text"
                placeholder="e.g. Biology"
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Due date input with accessible label */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500" htmlFor="task-due">
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              />
            </div>

            {/* Form error: shown when user submits without filling all fields */}
            {formError && (
              <p className="text-xs text-red-500 mt-1">{formError}</p>
            )}

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