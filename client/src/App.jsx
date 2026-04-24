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
        {/* Task Counter: will reflect the number of upcoming tasks in future iterations */}
        <span className="bg-pink-50 text-pink-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {placeholderTasks.length} upcoming tasks
        </span>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Dashboard: displays upcoming tasks sorted by the due date */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Upcoming tasks</h2>
          <p className="text-sm text-gray-500 mt-0.5">Stay organized and never miss a deadline!</p>
        </div>

        {/* Task list: this will be dynamically generated from the backend in future iterations */}
        <div className="flex flex-col gap-3">
          {placeholderTasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5 mt-1 inline-block"> {task.course} </span>
              </div>
              {/* Task details: course and due date, will be color coded in future iterations */}
              <p className="text-sm text-gray-500">{task.course} · Due {task.due}</p>
            </div>
          ))}
        </div>

        {/* Page Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-500 font-medium uppercase">More features coming soon!</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* New task form: this will be connected to the backend to add new tasks in future iterations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">New task</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Task name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <input
              type="text"
              placeholder="Course (e.g. Biology)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {/* Date input: will validate that due date is not in the past with backend additions */}
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            />
            {/* Submit button: onClick handler added when form is done*/}
            <button className="w-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 mt-1">
              Add task
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App