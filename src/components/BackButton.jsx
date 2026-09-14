import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * Global premium BackButton — subtle, circular, dark-mode ready.
 * Uses navigate(-1) for history-aware back navigation.
 * Do NOT place on main /dashboard root (home).
 */
export default function BackButton({ className = '', label = 'Back', variant = 'pill' }) {
  const navigate = useNavigate()

  const base =
    variant === 'circle'
      ? 'group grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-slate-200 text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:ring-slate-900 hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 dark:text-slate-400 dark:hover:bg-white dark:hover:text-slate-900 dark:hover:ring-white'
      : 'inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-medium tracking-[-0.01em] text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-900 hover:text-white hover:ring-slate-900 dark:bg-slate-900 dark:ring-slate-800 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900 dark:hover:ring-white'

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className={`${base} ${className}`}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      {variant !== 'circle' && <span>{label}</span>}
    </button>
  )
}
