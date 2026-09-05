/** Small "— or —" divider used between OAuth and email forms. */
export default function Divider({ children }) {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {children}
      </span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  )
}
