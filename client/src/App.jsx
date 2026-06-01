// App.jsx: Main application component for Plan Pal, holds the main layout and all child sections

import { useState, useEffect } from 'react'

// Course color map: assigns a consistent color to each course name
const courseColors = {
  // Sciences
  'Biology':       { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400'  },
  'Chemistry':     { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    dot: 'bg-teal-400'     },
  'Physics':       { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200',    dot: 'bg-cyan-400'     },
  'Anatomy':       { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',   dot: 'bg-green-400'    },

  // Math & Technology
  'Math':          { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    dot: 'bg-blue-400'     },
  'Statistics':    { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200',  dot: 'bg-indigo-400'   },
  'Computer Science': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', dot: 'bg-violet-400'  },
  'Web Development':  { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-400'  },

  // Humanities & Social Sciences
  'English':       { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  dot: 'bg-violet-400'   },
  'History':       { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   dot: 'bg-amber-400'    },
  'Philosophy':    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200',  dot: 'bg-yellow-400'   },
  'Psychology':    { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200',    dot: 'bg-pink-400'     },
  'Sociology':     { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200',    dot: 'bg-rose-400'     },
  'Political Science': { bg: 'bg-red-50', text: 'text-red-600',    border: 'border-red-200',     dot: 'bg-red-400'      },

  // Business & Economics
  'Economics':     { bg: 'bg-lime-50',    text: 'text-lime-600',    border: 'border-lime-200',    dot: 'bg-lime-400'     },
  'Business':      { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200',  dot: 'bg-orange-400'   },
  'Accounting':    { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'    },
  'Marketing':     { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200', dot: 'bg-fuchsia-400'  },

  // Arts & Communication
  'Art':           { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200',    dot: 'bg-pink-400'     },
  'Music':         { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  dot: 'bg-purple-400'   },
  'Communications':{ bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200',     dot: 'bg-sky-400'      },
  'Journalism':    { bg: 'bg-blue-50',    text: 'text-blue-500',    border: 'border-blue-200',    dot: 'bg-blue-300'     },

  // Health & Education
  'Nursing':       { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    dot: 'bg-teal-400'     },
  'Education':     { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',   dot: 'bg-green-400'    },
  'Nutrition':     { bg: 'bg-lime-50',    text: 'text-lime-600',    border: 'border-lime-200',    dot: 'bg-lime-400'     },

  // Fallback for any unlisted course
  'default':       { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200',    dot: 'bg-gray-400'     },
}

// Helper: returns the color classes for a given course, falls back to default
const getCourseColor = (course) => courseColors[course] || courseColors['default']

// Helper: formats a date string from YYYY-MM-DD to readable format e.g. "May 1, 2025"
const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function App() {
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState('list')
  const [sortBy, setSortBy] = useState('due')
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [due, setDue] = useState('')
  const [formError, setFormError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', course: '', due: '' })
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
    fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => setTasks(prevTasks => prevTasks.filter(task => task.id !== id)))
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
        setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task))
        setEditingId(null)
      })
      .catch(err => console.error('Failed to update task:', err))
  }

  // Sort tasks based on the current sortBy value
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'due') return new Date(a.due) - new Date(b.due)
    if (sortBy === 'course') return a.course.localeCompare(b.course)
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  // Group tasks by day of the week for the weekly view
  const getWeeklyTasks = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const grouped = {}
    days.forEach(day => grouped[day] = [])
    tasks.forEach(task => {
      const date = new Date(task.due + 'T00:00:00')
      grouped[days[date.getDay()]].push(task)
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
    for (let i = 0; i < firstDay.getDay(); i++) paddedDays.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) paddedDays.push(new Date(year, month, d))
    return paddedDays
  }

  // Returns tasks due on a specific calendar date
  const getTasksForDate = (date) => {
    if (!date) return []
    return tasks.filter(task => task.due === date.toISOString().split('T')[0])
  }

  const calendarHeading = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const overdueTasks = tasks.filter(t => new Date(t.due) < new Date()).length

  return (
    <div className="min-h-screen" style={{ background: '#fdf4f7' }}>

      {/* Navigation bar: sticky header with logo, app title, and task counter */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          {/* App logo mark */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
            <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">Plan Pal</h1>
        </div>
        {/* Stats pills: task count and overdue warning */}
        <div className="flex items-center gap-2">
          <span className="bg-pink-50 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full border border-pink-100">
            {tasks.length} tasks
          </span>
          {overdueTasks > 0 && (
            // Overdue warning: only shown when tasks are past their due date
            <span className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-100">
              {overdueTasks} overdue
            </span>
          )}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Hero header: welcome message and summary stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your tasks</h2>
          <p className="text-sm text-gray-400 mt-1">Stay organized and never miss a deadline!</p>
        </div>

        {/* Dashboard header: view toggle and sort controls */}
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            {/* View toggle: switches between list, weekly, and calendar views */}
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-pink-100 shadow-sm self-start">
              {['list', 'weekly', 'calendar'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs px-4 py-2 rounded-lg transition-all font-semibold capitalize ${
                    view === v
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Sort controls: only shown in list view */}
            {view === 'list' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Sort</span>
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
            )}
          </div>
        </div>

        {/* Task views: switches between list, weekly, and calendar views */}
        {view === 'list' ? (

          // List view: tasks sorted by the current sortBy value
          <div className="flex flex-col gap-2.5">
            {sortedTasks.length === 0 ? (
              // Empty state: shown when there are no tasks yet
              <div className="text-center py-16 bg-white rounded-2xl border border-pink-50">
                <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span style={{ fontSize: '22px' }}>📋</span>
                </div>
                <p className="text-sm font-semibold text-gray-600">No tasks yet</p>
                <p className="text-xs text-gray-400 mt-1">Add your first task below to get started!</p>
              </div>
            ) : (
              sortedTasks.map(task => {
                const color = getCourseColor(task.course)
                const isOverdue = new Date(task.due) < new Date()
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {editingId === task.id ? (
                      // Edit mode: show editable inputs pre-filled with current task values
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={editForm.course}
                          onChange={e => setEditForm({ ...editForm, course: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        />
                        <input
                          type="date"
                          value={editForm.due}
                          onChange={e => setEditForm({ ...editForm, due: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        />
                        <div className="flex gap-2 mt-1">
                          {/* Save button: sends updated task to the backend */}
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-xl px-4 py-2 font-semibold transition hover:opacity-90"
                          >
                            Save changes
                          </button>
                          {/* Cancel button: exits edit mode without saving */}
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs rounded-xl px-4 py-2 font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode: task card with left color accent border
                      <div className="flex items-center gap-3">
                        {/* Color dot: visual accent matching the course color */}
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {/* Course tag: color coded by course name */}
                            <span className={`text-xs font-semibold ${color.bg} ${color.text} ${color.border} border rounded-lg px-2 py-0.5`}>
                              {task.course}
                            </span>
                            {/* Due date: turns red with warning if overdue */}
                            <span className={`text-xs font-medium flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                              {isOverdue && <span>⚠</span>}
                              {formatDate(task.due)}
                            </span>
                          </div>
                        </div>
                        {/* Action buttons: only visible on hover */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="text-xs bg-blue-50 text-blue-500 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-xs bg-red-50 text-red-400 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg transition"
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
          <div className="flex flex-col gap-2">
            {(() => {
              const { days, grouped } = getWeeklyTasks()
              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
              return days.map(day => {
                const isToday = day === today
                return (
                  <div key={day} className={`bg-white rounded-2xl border px-4 py-3.5 transition-all ${
                    isToday ? 'border-pink-200 shadow-md' : grouped[day].length > 0 ? 'border-gray-100 shadow-sm' : 'border-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {/* Today indicator dot */}
                        {isToday && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                        <span className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-pink-500' : 'text-gray-400'}`}>
                          {day}
                        </span>
                        {isToday && <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 font-semibold px-2 py-0.5 rounded-full">Today</span>}
                      </div>
                      {grouped[day].length > 0 && (
                        <span className="text-xs text-gray-300 font-medium">{grouped[day].length} task{grouped[day].length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    {grouped[day].length === 0 ? (
                      <p className="text-xs text-gray-200 font-medium">No tasks due</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {grouped[day].map(task => {
                          const color = getCourseColor(task.course)
                          return (
                            <div key={task.id} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color.dot}`} />
                              <span className="text-xs text-gray-700 font-semibold flex-1 truncate">{task.title}</span>
                              <span className={`text-xs font-semibold ${color.bg} ${color.text} ${color.border} border rounded-lg px-2 py-0.5 flex-shrink-0`}>
                                {task.course}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>

        ) : (

          // Calendar view: monthly grid showing tasks on their due dates
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Calendar header: month title and prev/next navigation */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                className="text-xs font-semibold text-gray-400 hover:text-pink-500 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition"
              >
                ← Prev
              </button>
              <span className="text-sm font-bold text-gray-700">{calendarHeading}</span>
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                className="text-xs font-semibold text-gray-400 hover:text-pink-500 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition"
              >
                Next →
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-bold text-gray-300 py-2.5 uppercase tracking-wide">
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
                    className={`min-h-16 p-1.5 border-b border-r border-gray-50 ${!date ? 'bg-gray-50/50' : 'hover:bg-pink-50/30 transition-colors'}`}
                  >
                    {date && (
                      <>
                        {/* Day number: highlighted pink circle if today */}
                        <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                          isToday
                            ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-sm'
                            : 'text-gray-400'
                        }`}>
                          {date.getDate()}
                        </div>
                        {/* Task pills: color coded, truncated, with overflow count */}
                        <div className="flex flex-col gap-0.5">
                          {dayTasks.slice(0, 2).map(task => {
                            const color = getCourseColor(task.course)
                            return (
                              <div
                                key={task.id}
                                className={`text-xs ${color.bg} ${color.text} rounded-md px-1 py-0.5 truncate leading-tight font-medium`}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            )
                          })}
                          {/* Overflow indicator: shown when more than 2 tasks fall on the same day */}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-400 px-1 font-medium">+{dayTasks.length - 2} more</div>
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
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-pink-100" />
          <span className="text-xs text-pink-300 font-bold uppercase tracking-widest">Add new</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-pink-100" />
        </div>

        {/* New task form: connected to the backend to add new tasks */}
        <div className="bg-white rounded-2xl border border-pink-50 shadow-sm px-6 py-6">
          <h3 className="text-base font-bold text-gray-800 mb-5">New task</h3>
          <div className="flex flex-col gap-4">

            {/* Task name input with accessible label */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="task-title">
                Task name
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Essay outline"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Course input with accessible label */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="task-course">
                Course
              </label>
              <input
                id="task-course"
                type="text"
                placeholder="e.g. Biology"
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Due date input with accessible label */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="task-due">
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Form error: shown when user submits without filling all fields */}
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <span className="text-red-400 text-xs">⚠</span>
                <p className="text-xs text-red-500 font-medium">{formError}</p>
              </div>
            )}

            {/* Submit button: gradient pink, calls handleAddTask */}
            <button
              onClick={handleAddTask}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white rounded-xl px-4 py-3 text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-md mt-1"
            >
              Add task
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 font-medium mt-8">Plan Pal · Stay on top of it all</p>

      </main>
    </div>
  )
}

export default App