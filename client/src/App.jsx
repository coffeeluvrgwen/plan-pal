// App.jsx: Router shell, maps URLs to page components

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Weekly from './pages/Weekly'
import Calendar from './pages/Calendar'
import AddTask from './pages/AddTask'

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#fdf4f7' }}>
      {/* Shared navbar: visible on every page */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/weekly" element={<Weekly />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/add" element={<AddTask />} />
      </Routes>
    </div>
  )
}

export default App