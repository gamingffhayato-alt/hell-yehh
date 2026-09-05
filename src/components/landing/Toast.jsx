import { ClockIcon, XIcon } from '../Icons'

/**
 * Fixed bottom toast used for graceful degradation on the landing page —
 * un-built portals/pages show this instead of routing to a dead page.
 * `toast` = { id, message } | null. Re-passing a new id restarts the animation.
 */
export default function Toast({ toast, onDismiss }) {
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="animate-fade-up pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-gray-900 py-3 pl-3 pr-2.5 shadow-2xl ring-1 ring-white/10"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
          <ClockIcon className="h-4 w-4" />
        </span>
        <p className="flex-1 text-sm leading-snug text-gray-100">{toast.message}</p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
