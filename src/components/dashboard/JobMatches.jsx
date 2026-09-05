import { CheckIcon, FlameIcon } from '../Icons'

export default function JobMatches({ jobs, onApply, onSeeAll }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <FlameIcon className="h-5 w-5 text-orange-500" />
          Smart Matches
        </h2>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {jobs.filter((j) => !j.applied).length} new
        </span>
      </div>
      <p className="mt-0.5 text-xs text-gray-500">Picked for your skills & assessment scores</p>

      <div className="mt-5 space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`rounded-2xl border p-4 transition duration-150 hover:shadow-md hover:shadow-indigo-100 ${
              job.applied ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white ${job.tint}`}>
                {job.company.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-gray-900">{job.role}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {job.company} · {job.loc}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-500">
                  <span>{job.type}</span>
                  <span className="font-semibold text-gray-700">{job.pay}</span>
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600">
                    <FlameIcon className="h-3 w-3" />
                    {job.match}% match
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onApply(job)}
              disabled={job.applied}
              className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition active:scale-[0.99] ${
                job.applied
                  ? 'cursor-default bg-emerald-100 text-emerald-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {job.applied && <CheckIcon className="h-3.5 w-3.5" />}
              {job.applied ? 'Applied — in your tracker' : 'Apply now'}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onSeeAll}
        className="mt-4 w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-xs font-semibold text-gray-500 transition hover:border-indigo-400 hover:text-indigo-600"
      >
        See all 42 matches →
      </button>
    </section>
  )
}
