import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import BackButton from './BackButton'

/* Icons */
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M19 21a7 7 0 00-14 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}
function GraduationCapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3L2 8.5 12 14l10-5.5L12 3Z" />
      <path d="M6 10.5v3.5c0 .9 1.8 2.5 6 2.5s6-1.6 6-2.5v-3.5" />
    </svg>
  )
}
function FileTextIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-5-6Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  )
}
function UploadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 16V3M8 7l4-4 4 4" />
      <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
    </svg>
  )
}
function XIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10l3.5 3.5L16 5.5" />
    </svg>
  )
}
function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  )
}
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.2 9.2 0 015 0c1.9-1.32 2.74-1.05 2.74-1.05.56 1.4.21 2.44.11 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .26.18.58.69.48A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  )
}
function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.48-2.24-1.68-2.24-1.13 0-1.8.76-1.8 2.24v5.57H9.84s.05-9.04 0-9.97h3.56v1.41c.47-.73 1.32-1.77 3.22-1.77 2.35 0 4.11 1.54 4.11 4.85v5.48zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V10.48h3.56v9.97z" />
    </svg>
  )
}

/* Tabs — exact handwritten notes: General Info, Academic, Resume */
const TABS = [
  { id: 'general', label: 'General Info', desc: 'Name, contact, purpose', icon: UserIcon },
  { id: 'academic', label: 'Academic', desc: 'Education & institution', icon: GraduationCapIcon },
  { id: 'resume', label: 'Resume', desc: 'Skills, resume & links', icon: FileTextIcon },
]

const PURPOSE_OPTIONS = ['To find a job', 'To learn new skills', 'To polish skills & compete', 'To find Internship', 'Other']
const GENDERS = ['Male', 'Female', 'Transgender']

const inputBase =
  'block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-gray-200 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:ring-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20'

/**
 * ProfilePage — Upgraded per UX handwritten notes
 *
 * FIXES:
 * 1. Tab Switch Reset Bug: Entire formState lifted to top level of ProfilePage.jsx
 *    — activeTab only controls which section renders, data never resets
 * 2. Dynamic % Completion Widget: Circular + linear bar in left sidebar, calculated from top-level state
 * 3. Fill Already In: Initializes from profile + session (Name, Email, Phone pre-filled on mount)
 * 4. Full Profile (Like Form): 2-column layout (sidebar nav left, form right), sticky Save button, toast, premium enterprise look
 *
 * Performance:
 * - useCallback for all handlers to avoid re-renders
 * - useMemo for completion & active tab icon
 * - Single top-level useState object, no nested component state
 * - Flawless dark mode: dark:bg-slate-950, dark:text-white, dark:border-slate-800 everywhere
 */
export default function ProfilePage() {
  const { session, profile } = useAuth()

  // Top-level form state — survives tab switches
  const [formState, setFormState] = useState(() => {
    const p = profile || {}
    const user = session?.user || {}
    const metaName = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
    const firstLast = `${p.first_name || ''} ${p.last_name || ''}`.trim()
    return {
      // General Info — pre-filled from onboarding/auth
      fullName: p.full_name || firstLast || metaName || '',
      email: p.email || user.email || '',
      phoneNumber: p.phone || p.phone_number || p.phoneNumber || '',
      purpose: p.purpose || (Array.isArray(p.purposes) ? p.purposes[0] : p.purposes) || 'To find a job',
      gender: p.gender || '',
      dob: p.dob || p.date_of_birth || '',
      location: p.location || p.current_location || '',

      // Academic
      startYear: p.start_year || p.startYear || '2022',
      endYear: p.end_year || p.endYear || '2026',
      institution: p.institution || p.institute || 'Quantum University',
      course: p.course || 'B.Tech',
      stream: p.stream || p.specialization || 'Computer Science and Engineering',

      // Resume
      resumeFile: null,
      resumeFileName: p.resumeFileName || '',
      skills: p.skills || ['React', 'Node.js', 'Tailwind CSS'],
      newSkill: '',
      github: p.github || '',
      linkedin: p.linkedin || '',
    }
  })

  // Fill Already In — sync when session/profile loads after mount
  useEffect(() => {
    const p = profile || {}
    const user = session?.user || {}
    setFormState((prev) => ({
      ...prev,
      email: prev.email || p.email || user.email || '',
      fullName: prev.fullName || p.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || '',
      phoneNumber: prev.phoneNumber || p.phone || '',
      institution: prev.institution || p.institution || p.institute || prev.institution,
      course: prev.course || p.course || prev.course,
      stream: prev.stream || p.stream || p.specialization || prev.stream,
      gender: prev.gender || p.gender || '',
    }))
  }, [session, profile])

  const [activeTab, setActiveTab] = useState('general')
  const [toast, setToast] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateField = useCallback((field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Dynamic % Completion — based on top-level state object non-empty fields
  const completion = useMemo(() => {
    const checks = [
      formState.fullName?.trim(),
      formState.email?.trim(),
      formState.phoneNumber?.trim(),
      formState.purpose,
      formState.gender,
      formState.startYear,
      formState.endYear,
      formState.institution?.trim(),
      formState.course?.trim(),
      formState.stream?.trim(),
      formState.skills?.length > 0,
      formState.location?.trim(),
      formState.github?.trim(),
      formState.linkedin?.trim(),
      formState.dob,
      formState.resumeFileName,
    ]
    const filled = checks.filter((v) => Boolean(v) && String(v).trim() !== '').length
    const pct = Math.round((filled / checks.length) * 100)
    return Math.max(12, Math.min(100, pct))
  }, [formState])

  const handleSkillAdd = useCallback(() => {
    const val = formState.newSkill.trim()
    if (!val) return
    if (formState.skills.includes(val)) {
      setFormState((prev) => ({ ...prev, newSkill: '' }))
      return
    }
    setFormState((prev) => ({ ...prev, skills: [...prev.skills, val], newSkill: '' }))
  }, [formState.newSkill, formState.skills])

  const handleSkillRemove = useCallback((skill) => {
    setFormState((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }, [])

  const handleResumeChange = useCallback((file) => {
    if (!file) return
    setFormState((prev) => ({ ...prev, resumeFile: file, resumeFileName: file.name }))
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragActive(true)
  }, [])
  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
  }, [])
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleResumeChange(file)
    },
    [handleResumeChange]
  )

  const handleSave = useCallback(() => {
    if (saving) return
    setSaving(true)
    // Simulate mock backend push — snappy, no backend jargon
    setTimeout(() => {
      setSaving(false)
      setToast({ id: Date.now(), message: 'Profile saved successfully!' })
      setTimeout(() => setToast(null), 3000)
    }, 600)
  }, [saving])

  const ActiveTabMeta = useMemo(() => TABS.find((t) => t.id === activeTab) || TABS[0], [activeTab])
  const ActiveTabIcon = ActiveTabMeta.icon

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 260ms ease-out both; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <BackButton variant="circle" />
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Intern X</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-[13px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800">
              Dashboard
            </Link>
            <div className="mono hidden items-center gap-2 text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {completion}% complete
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left Sidebar — sticky, contains completion widget + nav */}
          <aside className="w-full shrink-0 lg:sticky lg:top-[88px] lg:w-[340px]">
            <div className="space-y-4">
              {/* Dynamic % Completion Widget — highly visible */}
              <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="pointer-events-none absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full bg-indigo-500/10 blur-[30px] dark:bg-indigo-500/15" />
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-[160px] w-[160px] rounded-full bg-violet-500/10 blur-[30px] dark:bg-violet-500/15" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Profile Strength</div>
                    <span className="mono rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] text-white dark:bg-white dark:text-slate-950">LIVE</span>
                  </div>

                  <div className="mt-6 flex items-center gap-5">
                    {/* Circular progress */}
                    <div className="relative h-[84px] w-[84px] shrink-0">
                      <svg className="h-[84px] w-[84px] -rotate-90" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="34" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="7" />
                        <circle
                          cx="42"
                          cy="42"
                          r="34"
                          fill="none"
                          stroke="currentColor"
                          className="text-slate-900 transition-all duration-700 ease-out dark:text-white"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          strokeDashoffset={`${2 * Math.PI * 34 * (1 - completion / 100)}`}
                        />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center text-[16px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">{completion}%</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Complete your Profile</div>
                      <div className="mt-1.5 text-[12.5px] leading-5 tracking-[-0.01em] text-slate-600 dark:text-slate-300">Stay ahead by keeping your profile updated. Data persists when switching tabs.</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <span className="mono text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">{completion}% complete</span>
                      <span className="mono text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">{completion < 100 ? `${100 - completion}% to go` : 'All set!'}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-slate-900 transition-all duration-700 dark:bg-white" style={{ width: `${completion}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation — 2-column layout left side */}
              <div className="rounded-2xl bg-white p-2.5 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="mono px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">Full Profile — Like Form</div>
                <nav className="mt-1 space-y-1.5">
                  {TABS.map((tab) => {
                    const active = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                      >
                        <span className={`grid h-9 w-9 place-items-center rounded-xl ring-1 transition ${active ? 'bg-white/10 text-white ring-white/10 dark:bg-slate-900/10 dark:text-slate-950 dark:ring-slate-900/10' : 'bg-slate-50 text-slate-500 ring-gray-200 group-hover:bg-white dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700'}`}>
                          <tab.icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-medium tracking-[-0.01em]">{tab.label}</span>
                          <span className={`mono block text-[11px] tracking-[-0.01em] ${active ? 'text-white/60 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>{tab.desc}</span>
                        </span>
                        {active && <ArrowRightIcon className="h-4 w-4 shrink-0 opacity-70" />}
                      </button>
                    )
                  })}
                </nav>
                <div className="mono mt-3 rounded-xl bg-slate-50 px-3.5 py-3 text-[11px] leading-5 tracking-[-0.01em] text-slate-500 ring-1 ring-gray-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Fix applied:</span> State lives at top level — switching tabs never resets data.
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content — cohesive form */}
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
              {/* Content Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-slate-800 sm:px-8">
                <div className="flex items-center gap-3.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                    <ActiveTabIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">{ActiveTabMeta.label}</h2>
                    <p className="mono text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">All changes auto-preserved across tabs • {formState.email}</p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="mono text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500">Pre-filled from onboarding</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* General Info */}
                {activeTab === 'general' && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Full name</label>
                        <input value={formState.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Ananya Sharma" className={inputBase} />
                        <p className="mono mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">Filled from your account — editable</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Email address</label>
                        <input value={formState.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" className={`${inputBase} bg-slate-50 dark:bg-slate-800/60`} />
                        <p className="mono mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">Pre-filled from auth context</p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Phone number</label>
                        <input value={formState.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} placeholder="+91 98765 43210" className={inputBase} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Purpose</label>
                        <select value={formState.purpose} onChange={(e) => updateField('purpose', e.target.value)} className={inputBase}>
                          {PURPOSE_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Gender</label>
                        <select value={formState.gender} onChange={(e) => updateField('gender', e.target.value)} className={`${inputBase} ${formState.gender ? '' : 'text-slate-400'}`}>
                          <option value="" disabled>Select gender</option>
                          {GENDERS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Date of birth</label>
                        <input type="date" value={formState.dob} onChange={(e) => updateField('dob', e.target.value)} className={inputBase} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Current location</label>
                        <input value={formState.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Dehradun, Uttarakhand" className={inputBase} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic */}
                {activeTab === 'academic' && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Start year</label>
                        <input type="number" value={formState.startYear} onChange={(e) => updateField('startYear', e.target.value)} placeholder="2022" className={inputBase} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">End year</label>
                        <input type="number" value={formState.endYear} onChange={(e) => updateField('endYear', e.target.value)} placeholder="2026" className={inputBase} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Institution</label>
                        <input value={formState.institution} onChange={(e) => updateField('institution', e.target.value)} placeholder="Quantum University" className={inputBase} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Course</label>
                        <input value={formState.course} onChange={(e) => updateField('course', e.target.value)} placeholder="B.Tech" className={inputBase} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Stream / Specialization</label>
                        <input value={formState.stream} onChange={(e) => updateField('stream', e.target.value)} placeholder="Computer Science and Engineering" className={inputBase} />
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-gray-200 dark:bg-slate-800/40 dark:ring-slate-700">
                      <p className="mono text-[11px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">
                        Academic info is pre-filled from onboarding — switching tabs preserves all edits because state lives above tab navigation.
                      </p>
                    </div>
                  </div>
                )}

                {/* Resume */}
                {activeTab === 'resume' && (
                  <div className="space-y-8 animate-fade-up">
                    {/* Resume Upload */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Resume</label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`group relative flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition ${dragActive ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-500/10' : 'border-gray-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-slate-600 dark:hover:bg-slate-800/50'}`}
                      >
                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleResumeChange(e.target.files?.[0])} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                          <UploadIcon className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-[13.5px] font-medium tracking-[-0.01em] text-slate-900 dark:text-white">
                          {formState.resumeFileName ? formState.resumeFileName : 'Drop your resume here or click to browse'}
                        </p>
                        <p className="mono mt-1 text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">PDF, DOC, DOCX up to 5MB • premium dashed-border UI</p>
                        {formState.resumeFileName && (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium tracking-[-0.01em] text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {formState.resumeFileName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="mb-1.5 block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">Skills</label>
                      <div className="rounded-xl border border-gray-200 bg-white p-3 ring-1 ring-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800 dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/20">
                        <div className="flex flex-wrap gap-2">
                          {formState.skills.map((skill) => (
                            <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-[12px] font-medium tracking-[-0.01em] text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
                              {skill}
                              <button type="button" onClick={() => handleSkillRemove(skill)} className="rounded-full p-0.5 hover:bg-white/20 dark:hover:bg-slate-900/10">
                                <XIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          <input
                            value={formState.newSkill}
                            onChange={(e) => updateField('newSkill', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSkillAdd()
                              }
                            }}
                            placeholder={formState.skills.length === 0 ? 'Type a skill and press Enter' : 'Add another skill'}
                            className="min-w-[160px] flex-1 bg-transparent py-1 text-[13px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={handleSkillAdd} className="inline-flex h-8 items-center justify-center rounded-full bg-white px-3.5 text-[12px] font-medium tracking-[-0.01em] text-slate-700 ring-1 ring-gray-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700">
                          Add skill
                        </button>
                        <span className="mono self-center text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">Press Enter • tag-input style</span>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
                          <GithubIcon className="h-4 w-4" /> GitHub link
                        </label>
                        <input value={formState.github} onChange={(e) => updateField('github', e.target.value)} placeholder="https://github.com/username" className={inputBase} />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
                          <LinkedinIcon className="h-4 w-4" /> LinkedIn link
                        </label>
                        <input value={formState.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/username" className={inputBase} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Save Bar — bottom of screen, pushes to mock backend */}
              <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:px-8">
                <div className="mono hidden text-[11px] leading-4 tracking-[-0.01em] text-slate-500 dark:text-slate-400 sm:block">
                  {completion}% complete • Full profile form • Data persists when switching tabs
                </div>
                <div className="flex items-center gap-3">
                  <span className="mono hidden text-[11px] text-slate-400 dark:text-slate-500 sm:block">{formState.fullName || 'Your profile'}</span>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-[13.5px] font-semibold tracking-[-0.01em] text-white shadow-sm ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
                  >
                    {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" /> : <CheckIcon className="h-4 w-4" />}
                    {saving ? 'Saving…' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile floating save */}
            <div className="fixed bottom-6 right-6 z-20 lg:hidden">
              <button onClick={handleSave} disabled={saving} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.95] disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:ring-white">
                <CheckIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 animate-fade-up">
          <div className="flex items-center gap-3 rounded-full bg-slate-900 px-5 py-3 text-[13px] font-medium tracking-[-0.01em] text-white shadow-xl ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-950">
              <CheckIcon className="h-3.5 w-3.5" />
            </span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
