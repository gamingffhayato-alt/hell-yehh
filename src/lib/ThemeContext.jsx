import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Theme context: class-based dark mode (`.dark` on <html>), matching the
 * pre-paint script in index.html and Tailwind v4's @custom-variant dark.
 * Choice persists in localStorage 'ix_theme'; first visit falls back to
 * the OS preference via prefers-color-scheme.
 */
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('ix_theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch {
      /* storage blocked */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Sync the <html> class + persistence + browser chrome tint
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem('ix_theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#070d1a' : '#ffffff')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
