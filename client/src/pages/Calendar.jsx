// Calendar.jsx: Monthly calendar grid showing tasks on their due dates

import { useState, useEffect } from 'react'
import { getCourseColor } from '../utils/courseColors'

const API = 'http://localhost:5000'

export default function Calendar() {
  const [tasks, setTasks]           = useState([])
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Fetch all tasks from the backend on load
  useEffect(() => {
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks:', err))
  }, [])

  // Build the calendar grid for the current month
  const getCalendarDays = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay  = new Date(year, month + 1, 0)
    const days = []
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    return days
  }

  // Returns tasks due on a specific date
  const getTasksForDate = (date) => {
    if (!date) return []
    return tasks.filter(t => t.due === date.toISOString().split('T')[0])
  }

  const heading = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Calendar</h2>
        <p className="text-sm text-gray-400 mt-1">Tasks laid out by month</p>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Calendar navigation header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <button onClick={prevMonth}
            className="text-xs font-semibold text-gray-400 hover:text-pink-500 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition">
            ← Prev
          </button>
          <span className="text-sm font-bold text-gray-700">{heading}</span>
          <button onClick={nextMonth}
            className="text-xs font-semibold text-gray-400 hover:text-pink-500 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition">
            Next →
          </button>
        </div>

        {/* Day of week header row */}
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
            const isToday  = date && date.toDateString() === new Date().toDateString()
            return (
              <div key={i} className={`min-h-16 p-1.5 border-b border-r border-gray-50 ${!date ? 'bg-gray-50/50' : 'hover:bg-pink-50/30 transition-colors'}`}>
                {date && (
                  <>
                    {/* Day number: pink circle if today */}
                    <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday ? 'text-white' : 'text-gray-400'
                    }`} style={isToday ? { background: 'linear-gradient(135deg, #ec4899, #f43f5e)' } : {}}>
                      {date.getDate()}
                    </div>
                    {/* Task labels: up to 2 shown, then overflow count */}
                    <div className="flex flex-col gap-0.5">
                      {dayTasks.slice(0, 2).map(task => {
                        const color = getCourseColor(task.course)
                        return (
                          <div key={task.id}
                            className={`text-xs ${color.bg} ${color.text} rounded-md px-1 py-0.5 truncate leading-tight font-medium`}
                            title={task.title}>
                            {task.title}
                          </div>
                        )
                      })}
                      {/* Overflow count: shown when more than 2 tasks on same day */}
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
    </div>
  )
}