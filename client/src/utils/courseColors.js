// courseColors.js: Shared course color map and helper used across all pages

export const courseColors = {
  // Sciences
  'Biology':          { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400'  },
  'Chemistry':        { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    dot: 'bg-teal-400'     },
  'Physics':          { bg: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200',    dot: 'bg-cyan-400'     },
  'Anatomy':          { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',   dot: 'bg-green-400'    },
  // Math & Technology
  'Math':             { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    dot: 'bg-blue-400'     },
  'Statistics':       { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200',  dot: 'bg-indigo-400'   },
  'Computer Science': { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  dot: 'bg-violet-400'   },
  'Web Development':  { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  dot: 'bg-purple-400'   },
  // Humanities & Social Sciences
  'English':          { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200',  dot: 'bg-violet-400'   },
  'History':          { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   dot: 'bg-amber-400'    },
  'Philosophy':       { bg: 'bg-yellow-50',  text: 'text-yellow-600',  border: 'border-yellow-200',  dot: 'bg-yellow-400'   },
  'Psychology':       { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200',    dot: 'bg-pink-400'     },
  'Sociology':        { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200',    dot: 'bg-rose-400'     },
  'Political Science':{ bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     dot: 'bg-red-400'      },
  // Business & Economics
  'Economics':        { bg: 'bg-lime-50',    text: 'text-lime-600',    border: 'border-lime-200',    dot: 'bg-lime-400'     },
  'Business':         { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200',  dot: 'bg-orange-400'   },
  'Accounting':       { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500'    },
  'Marketing':        { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200', dot: 'bg-fuchsia-400'  },
  // Arts & Communication
  'Art':              { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-200',    dot: 'bg-pink-400'     },
  'Music':            { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  dot: 'bg-purple-400'   },
  'Communications':   { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-200',     dot: 'bg-sky-400'      },
  'Journalism':       { bg: 'bg-blue-50',    text: 'text-blue-500',    border: 'border-blue-200',    dot: 'bg-blue-300'     },
  // Health & Education
  'Nursing':          { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200',    dot: 'bg-teal-400'     },
  'Education':        { bg: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200',   dot: 'bg-green-400'    },
  'Nutrition':        { bg: 'bg-lime-50',    text: 'text-lime-600',    border: 'border-lime-200',    dot: 'bg-lime-400'     },
  // Fallback
  'default':          { bg: 'bg-gray-50',    text: 'text-gray-600',    border: 'border-gray-200',    dot: 'bg-gray-400'     },
}

// Helper: returns color classes for a course, falls back to default
export const getCourseColor = (course) => courseColors[course] || courseColors['default']

// Helper: formats YYYY-MM-DD to readable date e.g. "May 1, 2025"
export const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}