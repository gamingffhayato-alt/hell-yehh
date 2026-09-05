import { useState } from 'react'
import { SUPPORT_EMAIL, SUPPORT_INBOX_KEY } from '../ContactPage'
import { CheckIcon, MailSolidIcon, XIcon } from '../Icons'

/**
 * Dummy inbox contents — the live messages submitted from /contact are
 * prepended on top of these (both read from the same localStorage bridge).
 */
const INITIAL_MESSAGES = [
  {
    id: 'm1',
    name: 'Rahul Verma',
    email: 'rahul.v@student.quantum.edu',
    role: 'Student',
    message: 'I need help resetting my skill assessment scores.',
    when: '10m ago',
    read: false,
  },
  {
    id: 'm2',
    name: 'TechCorp HR',
    email: 'talent@techcorp.io',
    role: 'Industry',
    message: 'Could you verify our company profile so we can post jobs?',
    when: '2h ago',
    read: false,
  },
  {
    id: 'm3',
    name: 'Dr. Meera Sharma',
    email: 'm.sharma@quantum.edu',
    role: 'Academician',
    message: 'The cohort export PDF is missing the System Design column for MCA 1st Year.',
    when: '5h ago',
    read: true,
  },
  {
    id: 'm4',
    name: 'Priya Sharma',
    email: 'priya.s@student.quantum.edu',
    role: 'Student',
    message: "My mentor session link for tomorrow isn't working — could you resend it?",
    when: '1d ago',
    read: true,
  },
]

const ROLE_CHIP = {
  Student: 'bg-indigo-500/15 text-indigo-300 ring-indigo-400/30',
  Industry: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  Academician: 'bg-teal-500/15 text-teal-300 ring-teal-400/30',
}

const loadMessages = () => {
  let live = []
  try {
    live = JSON.parse(localStorage.getItem(SUPPORT_INBOX_KEY) || '[]')
  } catch {
    live = []
  }
  return [...live, ...INITIAL_MESSAGES]
}

/** Admin → Support Inbox: everything arriving from the public /contact form. */
export default function SupportInbox({ notify }) {
  const [messages, setMessages] = useState(loadMessages)
  const unread = messages.filter((m) => !m.read).length

  const toggleRead = (id) => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: !m.read } : m)))
  }

  const markAllRead = () => {
    setMessages((ms) => ms.map((m) => ({ ...m, read: true })))
    notify('Support inbox cleared — everything marked as read')
  }

  const archive = (id) => {
    const m = messages.find((x) => x.id === id)
    setMessages((ms) => ms.filter((x) => x.id !== id))
    notify(`Archived message from ${m?.name}`)
  }

  return (
    <section id="inbox" className="mt-5 scroll-mt-24 rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-600 text-white">
            <MailSolidIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white">Support Inbox</h2>
            <p className="text-xs text-slate-400">
              Messages from the Contact page · routed to {SUPPORT_EMAIL}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${
              unread > 0
                ? 'bg-rose-500/15 text-rose-300 ring-rose-400/30'
                : 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30'
            }`}
          >
            {unread > 0 ? `${unread} unread` : 'Inbox zero'}
          </span>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <CheckIcon className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="mt-4 space-y-2.5">
        {messages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            All caught up — no support messages right now.
          </p>
        )}
        {messages.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl p-4 ring-1 transition ${
              m.read
                ? 'bg-white/[0.02] ring-white/5'
                : 'bg-white/[0.05] ring-white/10'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {!m.read && <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-rose-400" />}
              <p className={`text-sm font-bold ${m.read ? 'text-slate-400' : 'text-white'}`}>
                {m.name}
                {m.live && (
                  <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30 align-middle">
                    Live form
                  </span>
                )}
              </p>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${ROLE_CHIP[m.role] ?? ROLE_CHIP.Student}`}>
                {m.role}
              </span>
              <span className="text-[11px] text-slate-500">{m.email}</span>
              <span className="ml-auto text-[11px] text-slate-500">{m.when}</span>
            </div>

            <p className={`mt-2 text-sm leading-relaxed ${m.read ? 'text-slate-500' : 'text-slate-200'}`}>
              {m.message}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <a
                href={`mailto:${m.email}?subject=Re: your Intern X support request`}
                className="text-xs font-semibold text-sky-400 transition hover:underline"
              >
                Reply by email ↗
              </a>
              <button
                onClick={() => toggleRead(m.id)}
                className="text-xs font-semibold text-emerald-400 transition hover:underline"
              >
                {m.read ? 'Mark unread' : 'Mark read'}
              </button>
              <button
                onClick={() => archive(m.id)}
                className="ml-auto flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-rose-400"
              >
                <XIcon className="h-3 w-3" />
                Archive
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
