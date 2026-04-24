// tasks.js — all API routes for task CRUD operations

const express = require('express')
const router = express.Router()

// Temporary in-memory task storage — will be replaced with SQLite in Week 4
let tasks = [
  { id: 1, title: "Essay outline", course: "English", due: "2025-04-28" },
  { id: 2, title: "Problem set 3", course: "Math", due: "2025-04-30" },
]

// Track the next available ID — will be handled by DB auto-increment in Week 4
let nextId = 3

// GET /tasks — return all tasks
router.get('/', (req, res) => {
  res.json(tasks)
})

// GET /tasks/:id — return a single task by ID
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
})

// POST /tasks — create a new task
router.post('/', (req, res) => {
  const { title, course, due } = req.body

  // Basic validation — ensure required fields are present
  if (!title || !course || !due) {
    return res.status(400).json({ error: 'Title, course, and due date are required' })
  }

  const newTask = { id: nextId++, title, course, due }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

// PUT /tasks/:id — update an existing task
router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id))
  if (!task) return res.status(404).json({ error: 'Task not found' })

  const { title, course, due } = req.body
  if (title) task.title = title
  if (course) task.course = course
  if (due) task.due = due

  res.json(task)
})

// DELETE /tasks/:id — remove a task by ID
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Task not found' })

  tasks.splice(index, 1)
  res.json({ message: 'Task deleted' })
})

module.exports = router