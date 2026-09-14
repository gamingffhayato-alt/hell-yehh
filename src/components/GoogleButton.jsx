import { GoogleLogo } from './Icons'

export default function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-[13.5px] font-medium tracking-[-0.01em] text-slate-700 shadow-sm ring-1 ring-gray-200 transition duration-150 hover:bg-slate-50 hover:shadow active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-white/20"
    >
      <GoogleLogo className="h-5 w-5" />
      Continue with Google
    </button>
  )
}
