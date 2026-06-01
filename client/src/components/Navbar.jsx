// Navbar.jsx: Shared navigation bar displayed on every page

import { Link, useLocation } from 'react-router-dom'

// Nav links: defines the pages and their routes
const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Tasks',     path: '/tasks' },
  { label: 'Weekly',    path: '/weekly' },
  { label: 'Calendar',  path: '/calendar' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">

        {/* Logo and app title */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">Plan Pal</span>
        </Link>

        {/* Page links: highlights the active page */}
        <div className="flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all no-underline ${
                location.pathname === link.path
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Add task button: links to the add task page */}
          <Link
            to="/add"
            className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all no-underline ml-2 ${
              location.pathname === '/add'
                ? 'bg-pink-500 text-white'
                : 'text-white hover:opacity-90'
            }`}
            style={location.pathname !== '/add' ? { background: 'linear-gradient(135deg, #ec4899, #f43f5e)' } : {}}
          >
            + Add task
          </Link>
        </div>

      </div>
    </nav>
  )
}