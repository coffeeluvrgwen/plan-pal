// server.js: This is the entry point for the backend server. It sets up the Express application, connects to the database, and defines API routes for handling task-related requests. In future iterations, this file will also include user authentication and profile management routes.

const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

// Middleware: parse incoming JSON and allow requests from the React frontend
app.use(express.json())
app.use(cors())

// Routes: mounts task-related API routes under /tasks. In future iterations, additional routes for user authentication and profile management will be added here.
const taskRoutes = require('./routes/tasks')
app.use('/tasks', taskRoutes)


// Health check route: this can be used to verify that the server is running and responsive
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Plan Pal backend is healthy!' })
})

app.listen(PORT, () => { 
    console.log('Server is running on port ' + PORT)
})