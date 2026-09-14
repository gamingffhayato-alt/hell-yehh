export default function Divider({ children }) {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
      <span className="mono text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
        {children}
      </span>
      <span className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
    </div>
  )
}
