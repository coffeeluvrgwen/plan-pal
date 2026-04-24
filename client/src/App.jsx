// App.jsx: Main application component for Plan Pal, holds the main layout and all child sections

{/* Placeholder data: this will be replaced with dynamic data from the backend in future iterations */}
const placeholderTasks = [
  { id: 1, title: "Essay outline", course: "English", due: "Mon Apr 28" },
  { id: 2, title: "Problem set 3", course: "Math", due: "Wed Apr 30" },
  { id: 3, title: "Lab report", course: "Biology", due: "Fri May 2" },
]

function App() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navigation bar: this will be expanded with additional links and user profile in future iterations */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Plan Pal</h1>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Dashboard: displays upcoming tasks sorted by the due date */}
        <h2 className="text-lg font-medium text-gray-700 mb-4">Upcoming tasks</h2>

        {/* Task list: this will be dynamically generated from the backend in future iterations */}
        <div className="flex flex-col gap-3">
          {placeholderTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-800">{task.title}</p>
              {/* Task details: course and due date, will be color coded in future iterations */}
              <p className="text-sm text-gray-500">{task.course} · Due {task.due}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App