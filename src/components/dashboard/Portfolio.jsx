import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ExternalIcon,
  PencilIcon,
  PlusIcon,
  RocketIcon,
  XIcon,
} from '../Icons'

const INITIAL_PROJECTS = [
  {
    id: 'p1',
    title: 'JARVIS — Telegram Educational Bot',
    desc: 'AI study assistant that answers DSA and aptitude questions on Telegram. 200+ queries served in its first week.',
    tags: ['xAI Grok API', 'Render', 'Python', 'Telegram Bot API'],
    live: 'https://t.me/jarvis01educationbot',
    code: 'https://github.com/',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Campus Notes Hub',
    desc: 'A place where Quantum students upload and rate previous-year notes by course and professor.',
    tags: ['React', 'Vite', 'Firebase'],
    live: 'https://vercel.com',
    code: 'https://github.com/',
    featured: false,
  },
]

const INITIAL_SKILLS = ['C', 'Python', 'JavaScript', 'React', 'SQL', 'Git & GitHub']

function AddProjectModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const inputClass =
    'block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add a project</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            onAdd({
              id: `p${Date.now()}`,
              title: title.trim(),
              desc: desc.trim(),
              tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
              live: 'https://vercel.com',
              code: 'https://github.com/',
              featured: false,
            })
          }}
        >
          <input required placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          <textarea required rows={3} placeholder="One-line description — what does it do?" value={desc} onChange={(e) => setDesc(e.target.value)} className={inputClass} />
          <input required placeholder="Tags (comma separated) e.g. React, Vite, Grok API" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
          <button type="submit" className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99]">
            Publish to my Digital CV
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Portfolio({ notify }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [skills, setSkills] = useState(INITIAL_SKILLS)
  const [addingSkill, setAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const addSkill = (e) => {
    e.preventDefault()
    const s = newSkill.trim()
    if (!s) return
    setSkills((sk) => (sk.includes(s) ? sk : [...sk, s]))
    notify(`Skill “${s}” added to your portfolio`)
    setNewSkill('')
    setAddingSkill(false)
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Digital Portfolio · Digital CV</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            1st Year · B.Tech CSE · Quantum University — visible to 240 recruiters
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add project
          </button>
          <Link
            to="/profile"
            aria-label="Edit portfolio"
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-indigo-600"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.id}
            className={`group flex flex-col rounded-2xl border p-5 transition duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100 ${
              p.featured ? 'border-indigo-200 bg-indigo-50/40 dark:border-indigo-500/30 dark:bg-indigo-500/10' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <RocketIcon className={`h-4 w-4 ${p.featured ? 'text-indigo-600' : 'text-gray-400'}`} />
              <h3 className="text-sm font-semibold text-gray-900">{p.title}</h3>
              {p.featured && (
                <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-600">{p.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
              >
                <ExternalIcon className="h-3.5 w-3.5" />
                Live Link
              </a>
              <a
                href={p.code}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Source Code
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Skills */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Skills</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              {s}
            </span>
          ))}
          {addingSkill ? (
            <form onSubmit={addSkill} className="flex items-center gap-2">
              <input
                autoFocus
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. TypeScript"
                className="h-8 w-32 rounded-full border border-indigo-300 bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button type="submit" className="h-8 rounded-full bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-500">
                Add
              </button>
              <button type="button" onClick={() => setAddingSkill(false)} className="text-xs text-gray-400 transition hover:text-gray-600">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingSkill(true)}
              className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-500 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              <PlusIcon className="h-3 w-3" />
              Add skill
            </button>
          )}
        </div>
      </div>

      {modalOpen && (
        <AddProjectModal
          onClose={() => setModalOpen(false)}
          onAdd={(p) => {
            setProjects((ps) => [p, ...ps])
            setModalOpen(false)
            notify(`“${p.title}” is now live on your Digital CV`)
          }}
        />
      )}
    </section>
  )
}
