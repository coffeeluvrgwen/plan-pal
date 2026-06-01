// AddTask.jsx: Dedicated page for adding a new task

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000'

export default function AddTask() {
  const navigate = useNavigate()
  const [title, setTitle]       = useState('')
  const [course, setCourse]     = useState('')
  const [due, setDue]           = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading]   = useState(false)

  // POST new task to the backend then redirect to tasks page
  const handleSubmit = () => {
    if (!title || !course || !due) {
      setFormError('Please fill in all fields before adding a task.')
      return
    }
    setFormError('')
    setLoading(true)

    fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, course, due })
    })
      .then(res => res.json())
      .then(() => navigate('/tasks'))
      .catch(err => {
        console.error('Failed to add task:', err)
        setLoading(false)
      })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add a task</h2>
        <p className="text-sm text-gray-400 mt-1">Fill in the details below to track a new task</p>
      </div>

      {/* Add task form */}
      <div className="bg-white rounded-2xl border border-pink-50 shadow-sm px-6 py-6">
        <div className="flex flex-col gap-4">

          {/* Task name input */}
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

          {/* Course dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide" htmlFor="task-course">
              Course
            </label>
            <select
              id="task-course"
              value={course}
              onChange={e => setCourse(e.target.value)}
              className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a course...</option>
              <optgroup label="Sciences">
                <option>Biology</option>
                <option>Chemistry</option>
                <option>Physics</option>
                <option>Anatomy</option>
              </optgroup>
              <optgroup label="Math & Technology">
                <option>Math</option>
                <option>Statistics</option>
                <option>Computer Science</option>
                <option>Web Development</option>
              </optgroup>
              <optgroup label="Humanities & Social Sciences">
                <option>English</option>
                <option>History</option>
                <option>Philosophy</option>
                <option>Psychology</option>
                <option>Sociology</option>
                <option>Political Science</option>
              </optgroup>
              <optgroup label="Business & Economics">
                <option>Economics</option>
                <option>Business</option>
                <option>Accounting</option>
                <option>Marketing</option>
              </optgroup>
              <optgroup label="Arts & Communication">
                <option>Art</option>
                <option>Music</option>
                <option>Communications</option>
                <option>Journalism</option>
              </optgroup>
              <optgroup label="Health & Education">
                <option>Nursing</option>
                <option>Education</option>
                <option>Nutrition</option>
              </optgroup>
              <optgroup label="Other">
                <option value="Other">Other (type below)</option>
              </optgroup>
            </select>
            {/* Custom course input: only shown when Other is selected */}
            {course === 'Other' && (
              <input
                type="text"
                placeholder="Type your course name..."
                onChange={e => setCourse(e.target.value)}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all mt-1"
              />
            )}
          </div>

          {/* Due date input */}
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

          {/* Form error message */}
          {formError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <span className="text-red-400 text-xs">⚠</span>
              <p className="text-xs text-red-500 font-medium">{formError}</p>
            </div>
          )}

          {/* Submit button: redirects to tasks page after saving */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white rounded-xl px-4 py-3 text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-md mt-1 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
          >
            {loading ? 'Adding...' : 'Add task'}
          </button>

        </div>
      </div>

    </div>
  )
}