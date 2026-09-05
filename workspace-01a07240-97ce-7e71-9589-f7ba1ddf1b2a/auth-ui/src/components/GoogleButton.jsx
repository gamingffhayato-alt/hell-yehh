import { GoogleLogo } from './Icons'

/**
 * "Continue with Google" button.
 * The click handler is provided by the parent (Supabase OAuth in AuthPage).
 */
export default function GoogleButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition duration-150 hover:bg-gray-50 hover:shadow active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
    >
      <GoogleLogo className="h-5 w-5" />
      Continue with Google
    </button>
  )
}
