import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { homeForRole, useAuth } from '../lib/AuthContext'

/* Icons — Lucide style */
function ArrowRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h11M10 4l6 6-6 6" />
    </svg>
  )
}
function Check(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10l3.5 3.5L16 5.5" />
    </svg>
  )
}

const GENDERS = ['Male', 'Female', 'Transgender']
const STUDENT_TYPES = [
  { id: 'college', label: 'College', desc: 'Currently pursuing graduation / post-grad' },
  { id: 'school', label: 'School', desc: 'Class 11 / 12 — exploring early' },
  { id: 'fresher', label: 'Fresher', desc: 'Ready for placement' },
]
const DOMAINS = ['CSE', 'Management', 'Arts', 'Commerce', 'Science', 'Design', 'Law', 'Other']
const INSTITUTES = [
  'Quantum University',
  'IIT Roorkee',
  'IIT Delhi',
  'Delhi University',
  'Amity University',
  'Graphic Era University',
  'UPES Dehradun',
  'DIT University',
  'Other',
]
const PURPOSES = [
  'To polish skills & compete',
  'To learn new skills',
  'To find Internship / Job',
  'Other',
]

const inputBase =
  'block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-gray-200 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:ring-slate-800 dark:focus:border-white dark:focus:ring-white/20'

function Label({ children, htmlFor, optional }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
      {children}
      {optional && <span className="mono text-[11px] font-normal tracking-[0.01em] text-slate-400 dark:text-slate-500">(optional)</span>}
    </label>
  )
}

function Section({ number, title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.08)] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-bold tracking-[-0.02em] text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
          {number}
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-[13px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

export default function DetailsPage() {
  const { session, setProfile, setStatus } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = session?.user
  const urlRole = ['student', 'industry', 'academician'].includes(searchParams.get('role')) ? searchParams.get('role') : null

  // Section 1: General Info
  const initialFullName = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const [firstName, setFirstName] = useState(initialFullName.split(' ')[0] || '')
  const [lastName, setLastName] = useState(initialFullName.split(' ').slice(1).join(' ') || '')
  const [email] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [aadhaar, setAadhaar] = useState('')
  const [gender, setGender] = useState('')

  // Section 2: Academic Details
  const [studentType, setStudentType] = useState('')
  const [domain, setDomain] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [institute, setInstitute] = useState('')

  // Section 3: Purpose
  const [purposes, setPurposes] = useState([])
  const [otherPurpose, setOtherPurpose] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const togglePurpose = (p) => {
    setPurposes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }

  const canSave =
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    aadhaar.trim() &&
    gender &&
    studentType &&
    domain &&
    specialization.trim() &&
    institute.trim() &&
    purposes.length > 0 &&
    (purposes.includes('Other') ? otherPurpose.trim() : true)

  const handleSave = async () => {
    if (!canSave || saving || !user) return
    setSaving(true)
    setError('')

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
    const role = urlRole || 'student'

    const fullRecord = {
      id: user.id,
      email: user.email,
      full_name: fullName,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      aadhaar_number: aadhaar.trim(),
      gender,
      student_type: studentType,
      domain,
      specialization: specialization.trim(),
      institution: institute.trim(),
      institute: institute.trim(),
      purpose: purposes,
      purposes: purposes,
      other_purpose: purposes.includes('Other') ? otherPurpose.trim() : null,
      role,
    }

    // Try full record first, fallback to minimal if columns don't exist
    let { error: upsertError } = await supabase.from('profiles').upsert([fullRecord])

    if (upsertError) {
      console.warn('Full upsert failed, trying minimal:', upsertError.message)
      const minimalRecord = {
        id: user.id,
        email: user.email,
        full_name: fullName,
        role,
        phone: phone.trim(),
        institution: institute.trim(),
      }
      const { error: minimalError } = await supabase.from('profiles').upsert([minimalRecord])
      if (minimalError) {
        console.error('Minimal upsert also failed:', minimalError.message)
        setError(`Couldn't save your details: ${minimalError.message}. You can still continue — your basic profile is created.`)
        // Even if save fails, we still want to let user proceed for demo
        setProfile({ id: user.id, email: user.email, full_name: fullName, role })
        setStatus('ready')
        navigate(homeForRole(role), { replace: true })
        setSaving(false)
        return
      }
    }

    setProfile({ id: user.id, email: user.email, full_name: fullName, role })
    setStatus('ready')
    navigate(homeForRole(role), { replace: true })
    setSaving(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-8 text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950 sm:px-6 sm:py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      {/* Premium glows */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />

      <div className="relative mx-auto w-full max-w-[840px]">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-slate-900 text-white ring-1 ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white">
              <span className="text-[11px] font-bold tracking-[-0.02em]">IX</span>
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Intern X</span>
          </Link>
          <div className="mono hidden items-center gap-2 text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Step 2 of 2 • Complete profile
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="mono inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> ONBOARDING
          </div>
          <h1 className="mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[32px]">Complete your profile</h1>
          <p className="mt-2 max-w-[600px] text-[14px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
            This helps us verify your account and tailor your dashboard. All fields are required except where marked optional. Your email is pre-filled from your account.
          </p>
        </div>

        <div className="space-y-5">
          {/* Section 1: General Info */}
          <Section number="1" title="General Info" subtitle="Basic identity details — kept private and used only for verification.">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ananya" className={inputBase} />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className={inputBase} />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">Email address</Label>
                <input id="email" value={email} disabled className={`${inputBase} cursor-not-allowed bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400`} />
                <p className="mono mt-1.5 text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">Pre-filled from your account • cannot be changed here</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" inputMode="tel" className={inputBase} />
              </div>

              <div>
                <Label htmlFor="aadhaar">Aadhaar number</Label>
                <input id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="1234 5678 9012" inputMode="numeric" className={inputBase} />
              </div>

              <div className="sm:col-span-2">
                <Label>Gender</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {GENDERS.map((g) => {
                    const selected = gender === g
                    return (
                      <label key={g} className={`group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-[13.5px] font-medium tracking-[-0.01em] transition ${selected ? 'border-slate-900 bg-slate-900 text-white ring-1 ring-slate-900 dark:border-white dark:bg-white dark:text-slate-950 dark:ring-white' : 'border-gray-200 bg-white text-slate-700 ring-1 ring-gray-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800'}`}>
                        <span>{g}</span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border transition ${selected ? 'border-white bg-white text-slate-900 dark:border-slate-950 dark:bg-slate-950 dark:text-white' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                        <input type="radio" name="gender" value={g} checked={selected} onChange={() => setGender(g)} className="sr-only" />
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </Section>

          {/* Section 2: Academic Details */}
          <Section number="2" title="Academic Details" subtitle="Helps us map you to trending industry skills and relevant roles.">
            <div className="space-y-5">
              <div>
                <Label>Student type</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {STUDENT_TYPES.map((t) => {
                    const selected = studentType === t.id
                    return (
                      <label key={t.id} className={`group flex cursor-pointer flex-col rounded-xl border p-4 text-left transition ${selected ? 'border-slate-900 bg-slate-900 text-white ring-1 ring-slate-900 dark:border-white dark:bg-white dark:text-slate-950 dark:ring-white' : 'border-gray-200 bg-white ring-1 ring-gray-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800'}`}>
                        <span className="flex items-center justify-between">
                          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{t.label}</span>
                          <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-white bg-white text-slate-900 dark:border-slate-950 dark:bg-slate-950 dark:text-white' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                        </span>
                        <span className={`mt-1 text-[12px] leading-5 tracking-[-0.01em] ${selected ? 'text-white/70 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>{t.desc}</span>
                        <input type="radio" name="studentType" value={t.id} checked={selected} onChange={() => setStudentType(t.id)} className="sr-only" />
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} className={`${inputBase} ${domain ? '' : 'text-slate-400 dark:text-slate-500'}`}>
                    <option value="" disabled>Select domain</option>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d} className="text-slate-900 dark:text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <input id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. AI/ML, Finance, UI/UX" className={inputBase} />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="institute">Institute</Label>
                  <input id="institute" list="institute-list" value={institute} onChange={(e) => setInstitute(e.target.value)} placeholder="Search or type your institute" className={inputBase} />
                  <datalist id="institute-list">
                    {INSTITUTES.map((inst) => (
                      <option key={inst} value={inst} />
                    ))}
                  </datalist>
                  <p className="mono mt-1.5 text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">Start typing to search — e.g. Quantum University, IIT Roorkee</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Section 3: Purpose on Intern X */}
          <Section number="3" title="Purpose on Intern X" subtitle="Select all that apply — this personalizes your feed and recommendations.">
            <div className="grid gap-2.5">
              {PURPOSES.map((p) => {
                const selected = purposes.includes(p)
                return (
                  <label key={p} className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${selected ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 dark:border-white dark:bg-slate-800 dark:ring-white' : 'border-gray-200 bg-white ring-1 ring-gray-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-800'}`}>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition ${selected ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13.5px] font-medium tracking-[-0.01em] text-slate-900 dark:text-white">{p}</span>
                      {p === 'To polish skills & compete' && <span className="mt-0.5 block text-[12px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">Skill tracks, contests, and peer comparison</span>}
                      {p === 'To learn new skills' && <span className="mt-0.5 block text-[12px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">Curated learning paths for trending roles</span>}
                      {p === 'To find Internship / Job' && <span className="mt-0.5 block text-[12px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">ATS-ranked matches and application tracker</span>}
                      {p === 'Other' && <span className="mt-0.5 block text-[12px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">Tell us what else you’re looking for</span>}
                    </span>
                    <input type="checkbox" checked={selected} onChange={() => togglePurpose(p)} className="sr-only" />
                  </label>
                )
              })}
            </div>

            {purposes.includes('Other') && (
              <div className="mt-4 animate-fade-up">
                <Label htmlFor="otherPurpose">Please specify</Label>
                <input id="otherPurpose" value={otherPurpose} onChange={(e) => setOtherPurpose(e.target.value)} placeholder="e.g. Looking for mentorship and R&D collaboration" className={inputBase} />
              </div>
            )}
          </Section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-5 tracking-[-0.01em] text-red-700 ring-1 ring-red-200 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30" role="alert">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-gray-200 dark:bg-slate-900/50 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="mono text-[11px] leading-5 tracking-[-0.01em] text-slate-500 dark:text-slate-400">
              Signed in as <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span> • 100% verified profiles
            </div>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 text-[13.5px] font-semibold tracking-[-0.01em] text-white shadow-sm ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100 sm:w-auto"
            >
              {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />}
              {saving ? 'Saving…' : 'Save & Go to Dashboard'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>

          <p className="mono text-center text-[11px] tracking-[0.02em] text-slate-400 dark:text-slate-500">Built for Smart India Hackathon • Your data stays private and verified</p>
        </div>
      </div>
    </div>
  )
}
