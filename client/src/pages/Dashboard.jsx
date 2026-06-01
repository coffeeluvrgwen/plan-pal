// Dashboard.jsx: Home page showing stats and upcoming tasks

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { getCourseColor, formatDate } from '../utils/courseColors'

const API = 'http://localhost:5000'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])

  // Fetch all tasks from the backend on load
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  // Helper: checks if a date string is today
  const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
  }

  // Helper: checks if a date is upcoming (today or in the future)
  const isUpcoming = (dateStr) => {
    return new Date(dateStr + 'T00:00:00') >= new Date(new Date().toDateString())
  }

  // Filter tasks for each stat card, excluding completed tasks
  const dueTodayTasks = tasks.filter(t => isToday(t.due) && t.completed !== 1)
  const upcomingTasks = tasks.filter(t => isUpcoming(t.due) && t.completed !== 1)
  const overdueTasks  = tasks.filter(t => !isUpcoming(t.due) && t.completed !== 1)

  // PATCH completed status to the backend, then update task in state
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-sm text-gray-400 mt-1">Here's what's on your plate</p>
      </div>

      {/* Stats cards: summary of task counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {/* Due today card */}
        <div className="bg-white rounded-2xl border border-pink-100 px-5 py-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Due today</p>
          <p className="text-3xl font-bold text-pink-500">{dueTodayTasks.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {dueTodayTasks.length === 1 ? 'task' : 'tasks'} to finish
          </p>
        </div>

        {/* Upcoming card */}
        <div className="bg-white rounded-2xl border border-blue-100 px-5 py-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-blue-500">{upcomingTasks.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {upcomingTasks.length === 1 ? 'task' : 'tasks'} ahead
          </p>
        </div>

        {/* Overdue card */}
        <div className="bg-white rounded-2xl border border-red-100 px-5 py-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Overdue</p>
          <p className="text-3xl font-bold text-red-400">{overdueTasks.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {overdueTasks.length === 0 ? 'all caught up!' : 'needs attention'}
          </p>
        </div>

      </div>

      {/* Due today section */}
      {dueTodayTasks.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-3">
            Due today
          </h3>
          <div className="flex flex-col gap-2">
            {dueTodayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming tasks section */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">
          Upcoming tasks
        </h3>
        <Link
          to="/tasks"
          className="text-xs font-semibold text-pink-500 hover:text-pink-600 no-underline"
        >
          View all →
        </Link>
      </div>

      {upcomingTasks.length === 0 ? (
        // Empty state: no upcoming tasks
        <div className="text-center py-16 bg-white rounded-2xl border border-pink-50">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span style={{ fontSize: '22px' }}>🎉</span>
          </div>
          <p className="text-sm font-semibold text-gray-600">You're all caught up!</p>
          <p className="text-xs text-gray-400 mt-1">No upcoming tasks — enjoy the break.</p>
          <Link
            to="/add"
            className="inline-block mt-4 text-xs font-semibold text-white px-4 py-2 rounded-xl no-underline"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
          >
            + Add a task
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Show only the next 5 upcoming tasks on the dashboard */}
          {upcomingTasks.slice(0, 5).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleComplete}
            />
          ))}
          {upcomingTasks.length > 5 && (
            <Link
              to="/tasks"
              className="text-center text-xs font-semibold text-pink-500 hover:text-pink-600 py-3 bg-white rounded-2xl border border-pink-50 no-underline"
            >
              + {upcomingTasks.length - 5} more tasks — view all
            </Link>
          )}
        </div>
      )}

    </div>
  )
}

// TaskCard: reusable task card component used in the dashboard
function TaskCard({ task, onComplete }) {
  const color = getCourseColor(task.course)
  const isOverdue = new Date(task.due) < new Date()
  const isDone = task.completed === 1

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 px-4 py-4 shadow-sm transition-all duration-300 ${
      isDone ? 'opacity-50' : 'hover:shadow-md hover:-translate-y-0.5'
    }`}>
      <div className="flex items-center gap-3">
        {/* Color dot: matches course color */}
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

        {/* Complete button: fires confetti, disabled once done */}
        {!isDone ? (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center"
            title="Mark as complete"
          >
            <span className="text-gray-300 hover:text-pink-400 text-sm">✓</span>
          </button>
        ) : (
          // Completed indicator: replaces button once done, not clickable
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
          >
            <span className="text-white text-sm">✓</span>
          </div>
        )}
      </div>
    </div>
  )
}