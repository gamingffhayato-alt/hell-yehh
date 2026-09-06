import { useEffect, useState } from 'react'
import { ArrowRightIcon, CheckIcon, SparklesIcon, XIcon } from '../Icons'

const QUESTIONS = [
  {
    q: 'What is the time complexity of binary search on a sorted array?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    answer: 1,
  },
  {
    q: 'Which data structure follows the LIFO principle?',
    options: ['Queue', 'Linked List', 'Stack', 'Hash Map'],
    answer: 2,
  },
  {
    q: 'Which structure is typically used to implement BFS on a graph?',
    options: ['Stack', 'Queue', 'Heap', 'Trie'],
    answer: 1,
  },
  {
    q: 'An in-order traversal of a Binary Search Tree returns elements…',
    options: ['In random order', 'In insertion order', 'In sorted order', 'Level by level'],
    answer: 2,
  },
  {
    q: 'Inserting a node at the head of a singly linked list takes…',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    answer: 3,
  },
]

function QuizModal({ onClose, onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const score = Object.entries(answers).reduce(
    (acc, [qIdx, optIdx]) => acc + (QUESTIONS[Number(qIdx)].answer === optIdx ? 1 : 0),
    0,
  )
  const q = QUESTIONS[step]
  const currentPick = answers[step]
  const isLast = step === QUESTIONS.length - 1

  const retake = () => {
    setAnswers({})
    setStep(0)
    setFinished(false)
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      {/* NOTE: text-gray-900 is required on the card — this modal renders inside
          AssessmentBanner's text-white section, otherwise all uncolored text
          (quiz options) inherits white and disappears on the white card. */}
      <div className="relative mx-auto w-full sm:my-10 sm:max-w-lg sm:px-4">
        <div className="animate-fade-up min-h-screen bg-white p-6 text-gray-900 shadow-2xl sm:min-h-0 sm:rounded-3xl sm:p-8 dark:bg-slate-900 dark:text-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                AI Skill Assessment
              </p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">
                Data Structures · 5 questions
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {!finished ? (
            <>
              {/* Progress */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((step + (currentPick !== undefined ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {step + 1} / {QUESTIONS.length}
                </span>
              </div>

              <p className="mt-6 text-base font-medium leading-relaxed text-gray-900">{q.q}</p>

              <div className="mt-4 space-y-2.5">
                {q.options.map((opt, oIdx) => {
                  const selected = currentPick === oIdx
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers((a) => ({ ...a, [step]: oIdx }))}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-medium text-gray-800 transition duration-150 dark:text-slate-100 ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20 dark:bg-indigo-500/15'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                          selected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-gray-300 text-gray-500 dark:border-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="text-sm font-medium text-gray-500 transition hover:text-gray-800 disabled:opacity-30"
                >
                  ← Back
                </button>
                <button
                  onClick={() => (isLast ? setFinished(true) : setStep((s) => s + 1))}
                  disabled={currentPick === undefined}
                  className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isLast ? 'Finish' : 'Next'}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="pt-4 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon className="h-8 w-8" />
              </span>
              <p className="mt-4 text-3xl font-extrabold text-gray-900">
                {score} / {QUESTIONS.length}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {score === 5
                  ? 'Flawless. New job matches unlocked!'
                  : score >= 3
                    ? 'Solid work — a few more matches unlocked.'
                    : 'Good start. Check the recommended courses below.'}
              </p>

              <div className="mt-5 space-y-2 text-left">
                {QUESTIONS.map((qq, i) => {
                  const correct = answers[i] === qq.answer
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${
                          correct ? 'bg-emerald-500' : 'bg-rose-400'
                        }`}
                      >
                        {correct ? '✓' : '✗'}
                      </span>
                      <span className="truncate text-gray-600">{qq.q}</span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={retake}
                  className="h-11 flex-1 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Retake
                </button>
                <button
                  onClick={() => { onComplete(score) }}
                  className="h-11 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Save results
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AssessmentBanner({ notify }) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(null)

  const complete = (s) => {
    setScore(s)
    setOpen(false)
    notify(`Assessment saved — you scored ${s}/5 on Data Structures`)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-900 p-6 text-white sm:p-7">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(rgba(129,140,248,0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-400/30">
            <SparklesIcon className="h-3.5 w-3.5" />
            AI-Powered Skill Assessment
          </span>
          <p className="mt-3 text-lg font-semibold leading-snug sm:text-xl">
            Ready to test your limits? Take the 5-question AI Assessment on{' '}
            <span className="text-indigo-300">Data Structures</span> to unlock new job matches.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="group flex h-12 shrink-0 items-center gap-2 self-start rounded-xl bg-indigo-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 active:scale-[0.98] sm:self-center"
        >
          {score !== null ? `Retake · scored ${score}/5` : 'Start assessment'}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      {score !== null && (
        <p className="relative mt-3 text-xs text-indigo-300">
          ✅ Completed — {score}/5 on Data Structures. New job matches are live in Smart Matches →
        </p>
      )}

      {open && <QuizModal onClose={() => setOpen(false)} onComplete={complete} />}
    </section>
  )
}
