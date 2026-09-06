import { useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from './landing/Toast'
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  GradCapIcon,
  MailSolidIcon,
} from './Icons'

/** Direct support channel — displayed prominently and mailto-linked. */
export const SUPPORT_EMAIL = 'gamingffhayato@gmail.com'

/**
 * Contact-page submissions land here (frontend demo bridge). The Admin
 * Portal's Support Inbox reads the same key and prepends live messages
 * to its dummy content — so a real form submission actually shows up
 * at /admin-dashboard during the demo.
 */
export const SUPPORT_INBOX_KEY = 'ix_support_messages'

const ROLES = ['Student', 'Industry', 'Academician']

const inputClass =
  'block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

/** /contact — public support page, no auth required. */
export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)

  const notify = (text) => setToast({ id: Date.now(), message: text })

  const canSubmit = Boolean(name.trim() && email.trim() && role && message.trim())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return

    /* Drop the message into the shared inbox bridge so it appears in the
       Admin Portal → Support Inbox. */
    try {
      const existing = JSON.parse(localStorage.getItem(SUPPORT_INBOX_KEY) || '[]')
      existing.unshift({
        id: `live-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
        message: message.trim(),
        when: 'Just now',
        live: true,
        read: false,
      })
      localStorage.setItem(SUPPORT_INBOX_KEY, JSON.stringify(existing.slice(0, 20)))
    } catch {
      /* storage blocked (private mode) — the success toast still shows */
    }

    // Clear the form + confirm to the sender
    setName('')
    setEmail('')
    setRole('')
    setMessage('')
    notify('Message sent to admin!')
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      notify('Support email copied to clipboard')
    } catch {
      notify(`Email us at ${SUPPORT_EMAIL}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white antialiased dark:from-[#101a30] dark:via-[#0a1120] dark:to-[#070d1a]">
      {/* Top bar */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
              <GradCapIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Intern X</span>
          </Link>
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Contact</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Talk to our team
          </h1>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Questions about onboarding, partnerships or a stuck application?
            Send a message — a human reads every single one.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-5">
          {/* -------------------- Direct support email card -------------------- */}
          <aside className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-200">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <MailSolidIcon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-indigo-200">
                Direct support email
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-1.5 block break-all text-lg font-bold tracking-tight underline-offset-4 transition hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-indigo-200">
                <ClockIcon className="h-3.5 w-3.5" />
                We usually reply within 24 hours (IST)
              </p>
              <button
                onClick={copyEmail}
                className="mt-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 active:scale-[0.98]"
              >
                <CheckIcon className="h-3.5 w-3.5" />
                Copy email address
              </button>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Help us help you faster
              </p>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-gray-600">
                {[
                  'Mention your role so the right team picks it up',
                  'Include the email you signed up with',
                  'Screenshots of errors are pure gold',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --------------------------- Contact form --------------------------- */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-indigo-100/50 sm:p-8 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ct-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="ct-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="ct-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="ct-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ct-role" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="ct-role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${inputClass} ${role ? '' : 'text-gray-400'}`}
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ct-message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="ct-message"
                  rows={6}
                  required
                  placeholder="Tell us what's going on — the more detail, the faster the fix…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send message
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Your message goes straight to the admin inbox — no bots in between.
            </p>
          </form>
        </div>
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
