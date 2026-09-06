import { useTheme } from '../lib/ThemeContext'
import { MoonIcon, SunIcon } from './Icons'

/**
 * Floating dark/light toggle — bottom-left, present on every page.
 * Bottom-right is reserved for the Intern X AI widget.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="fixed bottom-5 left-5 z-[80] grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-lg backdrop-blur transition hover:scale-105 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-amber-300"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  )
}
