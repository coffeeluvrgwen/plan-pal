// tasks.js: API routes for task CRUD operations, now using SQLite via better-sqlite3

const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /tasks: return all tasks from the database
router.get('/', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks').all()
    res.json(tasks)
  } catch (err) {
    console.error('Failed to get tasks:', err)
    res.status(500).json({ error: 'Failed to retrieve tasks' })
  }
})

// GET /tasks/:id: return a single task by ID
router.get('/:id', (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    console.error('Failed to get task:', err)
    res.status(500).json({ error: 'Failed to retrieve task' })
  }
})

// POST /tasks: insert a new task into the database
router.post('/', (req, res) => {
  const { title, course, due } = req.body

  // Basic validation: ensure all required fields are present
  if (!title || !course || !due) {
    return res.status(400).json({ error: 'Title, course, and due date are required' })
  }

  try {
    const result = db.prepare(
      'INSERT INTO tasks (title, course, due) VALUES (?, ?, ?)'
    ).run(title, course, due)

    // Return the newly created task with its auto-generated ID
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(newTask)
  } catch (err) {
    console.error('Failed to create task:', err)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT /tasks/:id: update an existing task in the database
router.put('/:id', (req, res) => {
  const { title, course, due } = req.body

  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })

    // Only update fields that were provided, fall back to existing values
    db.prepare(
      'UPDATE tasks SET title = ?, course = ?, due = ? WHERE id = ?'
    ).run(
      title || task.title,
      course || task.course,
      due || task.due,
      req.params.id
    )

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
    res.json(updatedTask)
  } catch (err) {
    console.error('Failed to update task:', err)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /tasks/:id: remove a task from the database
router.delete('/:id', (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })

    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
    res.json({ message: 'Task deleted' })
  } catch (err) {
    console.error('Failed to delete task:', err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

module.exports = router