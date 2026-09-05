import { ArrowRightIcon, XIcon } from '../Icons'

const COLUMNS = [
  { key: 'applied', title: 'Applied', bar: 'bg-indigo-400', pill: 'bg-indigo-50 text-indigo-700' },
  { key: 'shortlisted', title: 'Shortlisted', bar: 'bg-amber-400', pill: 'bg-amber-50 text-amber-700' },
  { key: 'interviewing', title: 'Interviewing', bar: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-700' },
]

const FLOW = ['applied', 'shortlisted', 'interviewing']

export default function Tracker({ tracker, onAdvance, onWithdraw }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Application Tracker</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Every application, one board. Tap → to advance a stage.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tracker[col.key]
          return (
            <div key={col.key} className="rounded-2xl bg-gray-50 p-3.5">
              <div className={`h-1 w-10 rounded-full ${col.bar}`} />
              <div className="mt-2.5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">{col.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${col.pill}`}>
                  {items.length}
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-5 text-center text-xs text-gray-400">
                    Nothing here yet
                  </p>
                )}
                {items.map((item) => {
                  const stageIdx = FLOW.indexOf(col.key)
                  const isLast = stageIdx === FLOW.length - 1
                  return (
                    <div
                      key={item.id}
                      className="group rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold leading-snug text-gray-900">
                          {item.role}
                        </p>
                        <button
                          onClick={() => onWithdraw(col.key, item.id)}
                          aria-label="Withdraw application"
                          className="rounded-full p-1 text-gray-300 transition hover:bg-rose-50 hover:text-rose-500"
                        >
                          <XIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-gray-500">{item.company}</p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${col.pill}`}>
                          {item.note}
                        </span>
                        {!isLast && (
                          <button
                            onClick={() => onAdvance(col.key, item.id)}
                            aria-label="Advance to next stage"
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gray-200 text-gray-400 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <ArrowRightIcon className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-[10px] text-gray-400">{item.appliedOn}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
