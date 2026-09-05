import { useState } from 'react'
import { ArrowRightIcon, BookIcon, CheckIcon, FlameIcon } from '../Icons'

export default function SkillGapCard({ notify }) {
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  const markModule = () => {
    const next = Math.min(100, progress + 25)
    setProgress(next)
    notify(next === 100 ? '🎓 Course complete — certificate added to your Digital CV!' : `Module done — ${next}% complete`)
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-base font-semibold text-gray-900">Skill Gaps & Courses</h2>
      <p className="mt-0.5 text-xs text-gray-500">From your latest AI assessment</p>

      {/* Identified gap */}
      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-600">
            <FlameIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
              Identified gap
            </p>
            <p className="text-sm font-semibold text-gray-900">Advanced System Design</p>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          Recruiters flag this in 68% of target roles. One focused course closes the gap.
        </p>
      </div>

      {/* Recommended course */}
      <div className="mt-4 rounded-2xl border border-gray-200 p-4 transition hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
              Recommended course
            </p>
            <p className="text-sm font-semibold text-gray-900">Cloud Infrastructure Basics</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Intern X Learning · 4 weeks · Beginner-friendly · 4 modules
            </p>
          </div>
        </div>

        {enrolled && (
          <div className="mt-3 animate-fade-up">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
              <span>{progress === 100 ? 'Course complete 🎉' : `${progress}% complete`}</span>
              <span>Module {Math.min(4, Math.floor(progress / 25) + 1)} / 4</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (!enrolled) {
              setEnrolled(true)
              notify('Enrolled in Cloud Infrastructure Basics — Module 1 is unlocked')
            } else if (progress < 100) {
              markModule()
            }
          }}
          disabled={progress === 100}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition active:scale-[0.99] ${
            progress === 100
              ? 'cursor-default bg-emerald-100 text-emerald-700'
              : enrolled
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
          }`}
        >
          {progress === 100 ? (
            <>
              <CheckIcon className="h-4 w-4" /> Certified
            </>
          ) : enrolled ? (
            <>Mark module complete</>
          ) : (
            <>
              Enroll Now <ArrowRightIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <button
        onClick={() => notify('Course catalog for your gap map unlocks right after your next assessment')}
        className="mt-4 w-full text-center text-xs font-semibold text-indigo-600 transition hover:underline"
      >
        Browse all recommended courses →
      </button>
    </section>
  )
}
