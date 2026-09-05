import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AI_PERSONAS, askInternXAI } from '../lib/ai'
import { ArrowRightIcon, SparklesIcon, XIcon } from './Icons'

/** Routes where the floating assistant appears. */
const AI_ROUTES = ['/dashboard', '/industry-dashboard', '/academic-dashboard', '/profile']

/** Static per-accent class bundles (Tailwind needs literal class strings). */
const THEMES = {
  indigo: {
    fab: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40',
    header: 'from-indigo-600 to-violet-600',
    userBubble: 'bg-indigo-600 text-white',
    chip: 'border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600',
    send: 'bg-indigo-600 hover:bg-indigo-500',
    focus: 'focus:border-indigo-500 focus:ring-indigo-500/30',
    dot: 'bg-indigo-500',
  },
  emerald: {
    fab: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40',
    header: 'from-emerald-600 to-teal-700',
    userBubble: 'bg-emerald-600 text-white',
    chip: 'border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600',
    send: 'bg-emerald-600 hover:bg-emerald-500',
    focus: 'focus:border-emerald-500 focus:ring-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  teal: {
    fab: 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/40',
    header: 'from-teal-600 to-cyan-700',
    userBubble: 'bg-teal-600 text-white',
    chip: 'border-teal-200 text-teal-700 hover:bg-teal-600 hover:text-white hover:border-teal-600',
    send: 'bg-teal-600 hover:bg-teal-500',
    focus: 'focus:border-teal-500 focus:ring-teal-500/30',
    dot: 'bg-teal-500',
  },
}

let idCounter = 0
const nextId = () => `${Date.now()}-${idCounter++}`

/**
 * Mounts the assistant only for signed-in users on dashboard routes.
 * `key={role}` remounts the chat when the profile resolves so the persona
 * (and its greeting) always matches the logged-in role.
 */
export default function AskAiWidgetGate() {
  const { pathname } = useLocation()
  const { session, profile } = useAuth()

  if (!session?.user) return null
  if (!AI_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return null

  const role = AI_PERSONAS[profile?.role] ? profile.role : 'student'
  return <AskAiWidget key={role} role={role} />
}

function AskAiWidget({ role }) {
  const persona = AI_PERSONAS[role]
  const theme = THEMES[persona.accent]

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => [
    { id: nextId(), from: 'bot', text: persona.greeting },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [offline, setOffline] = useState(false)

  const scrollRef = useRef(null)
  const liveTimer = useRef(null)

  // Auto-scroll on new content (messages or typing indicator)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, open])

  useEffect(() => () => clearTimeout(liveTimer.current), [])

  const send = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return

    const history = [...messages, { id: nextId(), from: 'user', text }]
    setMessages(history)
    setInput('')
    setTyping(true)

    try {
      const reply = await askInternXAI({
        role,
        message: text,
        // Prior turns only — the UI greeting is not part of the conversation,
        // and the just-sent text travels separately as `message`.
        history: messages
          .slice(1)
          .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
      })
      setMessages((ms) => [...ms, { id: nextId(), from: 'bot', text: reply }])
    } catch (err) {
      // Hackathon fallback — never break the demo: serve the role-specific
      // canned answer after a short "thinking" beat.
      console.info('Ask AI using offline demo fallback:', err.message)
      setOffline(true)
      await new Promise((resolve) => {
        liveTimer.current = setTimeout(resolve, 650)
      })
      setMessages((ms) => [...ms, { id: nextId(), from: 'bot', text: persona.fallback }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <>
      {/* ======================= Floating action button ======================= */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Intern X AI' : 'Ask Intern X AI'}
        aria-expanded={open}
        className={`fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition duration-200 hover:scale-105 active:scale-95 ${theme.fab}`}
      >
        {open ? <XIcon className="h-6 w-6" /> : <SparklesIcon className="h-6 w-6" />}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${theme.dot}`} />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ring-2 ring-white ${theme.dot}`} />
          </span>
        )}
      </button>

      {/* ============================ Chat panel ============================ */}
      {open && (
        <div
          role="dialog"
          aria-label="Intern X AI chat"
          className="animate-fade-up fixed inset-x-4 bottom-24 z-[65] flex h-[60vh] max-h-[560px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:inset-x-auto sm:right-5 sm:w-96 sm:h-[540px]"
        >
          {/* Header — persona-aware */}
          <div className={`bg-gradient-to-r px-4 py-3.5 text-white ${theme.header}`}>
            <div className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <SparklesIcon className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-bold tracking-tight">
                  Intern X AI
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ring-1 ring-white/25">
                    {persona.label}
                  </span>
                </p>
                <p className="truncate text-[11px] text-white/80">{persona.title}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && (
                  <span className={`mr-2 mt-auto grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${theme.userBubble}`}>
                    <SparklesIcon className="h-3.5 w-3.5" />
                  </span>
                )}
                <p
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === 'user'
                      ? `rounded-br-md ${theme.userBubble}`
                      : 'rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-200'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end justify-start">
                <span className={`mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${theme.userBubble}`}>
                  <SparklesIcon className="h-3.5 w-3.5" />
                </span>
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-slate-200">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* Quick starters (only before the conversation begins) */}
          {messages.length === 1 && !typing && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 py-3">
              {persona.starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${theme.chip}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="border-t border-slate-100 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask your ${persona.title}…`}
                className={`h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 ${theme.focus}`}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${theme.send}`}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] leading-snug text-slate-400">
              {offline
                ? 'Demo mode — canned offline replies. Set AI_API_KEY on the server for live answers.'
                : `${persona.tagline} · model openai/gpt-oss-20b`}
            </p>
          </form>
        </div>
      )}
    </>
  )
}
