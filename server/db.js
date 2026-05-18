// db.js: Sets up SQLite database connection and initializes the tasks table

const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(path.join(__dirname, 'planpal.db'))

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        course TEXT NOT NULL,
        due DATE NOT NULL
    )   
`)

console.log('Database connected and table ready')

module.exports = db