// Weekly.jsx: Tasks grouped by day of the week

import { useState, useEffect } from 'react'
import { getCourseColor, formatDate } from '../utils/courseColors'

const API = 'http://localhost:5000'

export default function Weekly() {
  const [tasks, setTasks] = useState([])

  // Fetch all tasks from the backend on load
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  // Group tasks by day of the week
  const grouped = {}
  days.forEach(day => grouped[day] = [])
  tasks.forEach(task => {
    const date = new Date(task.due + 'T00:00:00')
    grouped[days[date.getDay()]].push(task)
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Weekly view</h2>
        <p className="text-sm text-gray-400 mt-1">Tasks organized by day of the week</p>
      </div>

      {/* Day cards: one per day of the week */}
      <div className="flex flex-col gap-3">
        {days.map(day => {
          const isToday = day === today
          return (
            <div key={day} className={`bg-white rounded-2xl border px-5 py-4 transition-all ${
              isToday ? 'border-pink-200 shadow-md' : grouped[day].length > 0 ? 'border-gray-100 shadow-sm' : 'border-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Today indicator */}
                  {isToday && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                  <span className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-pink-500' : 'text-gray-400'}`}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-xs bg-pink-50 text-pink-500 border border-pink-100 font-semibold px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                {grouped[day].length > 0 && (
                  <span className="text-xs text-gray-300 font-medium">
                    {grouped[day].length} task{grouped[day].length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {grouped[day].length === 0 ? (
                <p className="text-xs text-gray-200 font-medium">No tasks due</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {grouped[day].map(task => {
                    const color = getCourseColor(task.course)
                    const isDone = task.completed === 1
                    return (
                      <div key={task.id} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${isDone ? 'bg-gray-50 opacity-60' : 'bg-gray-50'}`}>
                        {/* Color dot: gray when completed */}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isDone ? 'bg-gray-300' : color.dot}`} />
                        {/* Task title: struck through if completed */}
                        <span className={`text-xs font-semibold flex-1 truncate ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {task.title}
                        </span>
                        {/* Course tag: hidden when completed to make room for completed tag */}
                        {!isDone && (
                          <span className={`text-xs font-semibold ${color.bg} ${color.text} ${color.border} border rounded-lg px-2 py-0.5 flex-shrink-0`}>
                            {task.course}
                          </span>
                        )}
                        {/* Completed tag: shown instead of course tag when task is done */}
                        {isDone ? (
                          <span className="text-xs font-semibold bg-pink-50 text-pink-400 border border-pink-100 rounded-lg px-2 py-0.5 flex-shrink-0">
                            completed
                          </span>
                        ) : (
                          // Due date: only shown for incomplete tasks
                          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(task.due)}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}