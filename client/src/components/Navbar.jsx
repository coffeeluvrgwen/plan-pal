// Navbar.jsx: Shared navigation bar displayed on every page

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Tasks',     path: '/tasks' },
  { label: 'Weekly',    path: '/weekly' },
  { label: 'Calendar',  path: '/calendar' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  // Listen for window resize to switch between mobile and desktop nav
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <nav style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #fce7f3', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo and app title */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.025em' }}>Plan Pal</span>
        </Link>

        {/* Desktop nav: shown when screen is wide enough */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  background: location.pathname === link.path ? '#ec4899' : 'transparent',
                  color: location.pathname === link.path ? 'white' : '#6b7280',
                }}
              >
                {link.label}
              </Link>
            ))}
            {/* Add task button */}
            <Link
              to="/add"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                marginLeft: '8px',
                background: location.pathname === '/add' ? '#ec4899' : 'linear-gradient(135deg, #ec4899, #f43f5e)',
                color: 'white',
              }}
            >
              + Add task
            </Link>
          </div>
        )}

        {/* Mobile hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#6b7280', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#6b7280', borderRadius: '2px', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#6b7280', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        )}

      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{ borderTop: '1px solid #fce7f3', background: 'white', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                padding: '10px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                background: location.pathname === link.path ? '#ec4899' : 'transparent',
                color: location.pathname === link.path ? 'white' : '#6b7280',
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* Add task button in mobile menu */}
          <Link
            to="/add"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              marginTop: '4px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
              color: 'white',
            }}
          >
            + Add task
          </Link>
        </div>
      )}
    </nav>
  )
}