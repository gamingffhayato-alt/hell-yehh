import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import OtpVerificationField from './OtpVerificationField'

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
const PURPOSES = ['To polish skills & compete', 'To learn new skills', 'To find Internship / Job', 'Other']

const STORAGE_KEY = 'internx_details_form'

function loadDetailsForm() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

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
  const { session, setProfile, setStatus, completeUserProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = session?.user
  const urlRole = ['student', 'industry', 'academician'].includes(searchParams.get('role')) ? searchParams.get('role') : null

  const saved = loadDetailsForm()
  const initialFullName = user?.user_metadata?.full_name || user?.user_metadata?.name || ''

  const [firstName, setFirstName] = useState(() => saved?.firstName || initialFullName.split(' ')[0] || '')
  const [lastName, setLastName] = useState(() => saved?.lastName || initialFullName.split(' ').slice(1).join(' ') || '')
  const [email, setEmail] = useState(() => saved?.email || user?.email || '')
  const [emailVerified, setEmailVerified] = useState(() => saved?.emailVerified || false)
  const [phone, setPhone] = useState(() => saved?.phone || '')
  const [phoneVerified, setPhoneVerified] = useState(() => saved?.phoneVerified || false)
  const [aadhaar, setAadhaar] = useState(() => saved?.aadhaar || '')
  const [gender, setGender] = useState(() => saved?.gender || '')

  const [studentType, setStudentType] = useState(() => saved?.studentType || '')
  const [domain, setDomain] = useState(() => saved?.domain || '')
  const [specialization, setSpecialization] = useState(() => saved?.specialization || '')
  const [institute, setInstitute] = useState(() => saved?.institute || '')

  const [purposes, setPurposes] = useState(() => saved?.purposes || [])
  const [otherPurpose, setOtherPurpose] = useState(() => saved?.otherPurpose || '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const payload = { firstName, lastName, email, emailVerified, phone, phoneVerified, aadhaar, gender, studentType, domain, specialization, institute, purposes, otherPurpose }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {}
  }, [firstName, lastName, email, emailVerified, phone, phoneVerified, aadhaar, gender, studentType, domain, specialization, institute, purposes, otherPurpose])

  useEffect(() => {
    if (session?.user?.email && !email) setEmail(session.user.email)
  }, [session?.user?.email, email])

  const togglePurpose = useCallback((p) => {
    setPurposes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
  }, [])

  const canSave =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    aadhaar.trim() &&
    gender &&
    studentType &&
    domain &&
    specialization.trim() &&
    institute.trim() &&
    purposes.length > 0 &&
    (purposes.includes('Other') ? otherPurpose.trim() : true)

  /**
   * FIXED: Prevent hard refresh, sync auth state BEFORE navigation, selective storage wipe
   * - e.preventDefault() first line stops browser reload that wipes React state
   * - Save only valid columns (profiles table has: id, email, full_name, role, institution, course, stream...)
   * - Mark profile complete in global context FIRST so ProtectedRoute doesn't bounce back to /details
   * - Selectively remove draft keys only — DO NOT use sessionStorage.clear() (destroys Supabase tokens)
   * - navigate('/dashboard', { replace: true }) bypasses history
   */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!user) throw new Error('No active session')
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      const role = urlRole || 'student'

      // Only use columns that actually exist in public.profiles (see supabase-setup.sql)
      // Table: id, email, full_name, role, institution, course, stream, class_year, etc.
      // Previous bug: tried to upsert phone, aadhaar_number, gender, etc. which don't exist → upsert fails → role never saved → redirect loop
      const validProfile = {
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: role,
        institution: institute.trim(),
        course: domain.trim(),
        stream: specialization.trim(),
      }

      const { error: upsertError } = await supabase.from('profiles').upsert([validProfile])
      if (upsertError) {
        console.error('profiles upsert failed:', upsertError.message)
        // Fallback to absolute minimal valid columns
        await supabase.from('profiles').upsert([{
          id: user.id,
          email: user.email,
          full_name: fullName,
          role: role,
        }])
      }

      // 1. Mark profile as complete in global context FIRST
      const newProfile = { id: user.id, email: user.email, full_name: fullName, role, institution: institute.trim() }
      if (typeof completeUserProfile === 'function') {
        await completeUserProfile(newProfile);
      } else {
        setProfile(newProfile)
        setStatus('ready')
        await new Promise((r) => setTimeout(r, 0))
      }

      // 2. Selectively clear form drafts ONLY — DO NOT use .clear()
      sessionStorage.removeItem('internx_draft_profile');
      sessionStorage.removeItem('internx_details_form');
      sessionStorage.removeItem('internx_otp_email');
      sessionStorage.removeItem('internx_otp_phone');
      sessionStorage.removeItem('internx_otp_step_email');
      sessionStorage.removeItem('internx_otp_step_tel');
      sessionStorage.removeItem('internx_otp_verified_email');
      sessionStorage.removeItem('internx_otp_verified_tel');
      sessionStorage.removeItem('internx_otp_code_email');
      sessionStorage.removeItem('internx_otp_code_tel');
      sessionStorage.removeItem('internx_otp_countdown_end_email');
      sessionStorage.removeItem('internx_otp_countdown_end_tel');

      // 3. Use React Router to navigate, bypassing history
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error("Save failed:", error);
      setError(error?.message || 'Save failed — please try again.')
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-8 text-slate-900 antialiased selection:bg-slate-900 selection:text-white dark:bg-slate-950 dark:text-white dark:selection:bg-white dark:selection:text-slate-950 sm:px-6 sm:py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        * { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        .mono { font-family: "Geist Mono", ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      <div className="pointer-events-none absolute -top-28 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/[0.06] to-transparent blur-[70px] dark:from-indigo-500/20 dark:via-indigo-500/10" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[80px] dark:bg-violet-500/15" />

      <div className="relative mx-auto w-full max-w-[840px]">
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

        <div className="mb-8">
          <div className="mono inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-slate-600 ring-1 ring-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> ONBOARDING
          </div>
          <h1 className="mt-4 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-[32px]">Complete your profile</h1>
          <p className="mt-2 max-w-[600px] text-[14px] leading-6 tracking-[-0.01em] text-slate-600 dark:text-slate-300">
            Verify your email and phone with OTP, then finish your profile.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <Section number="1" title="General Info" subtitle="Verify your contact details — state persists in sessionStorage so tab switching doesn't lose OTP boxes.">
            <div className="grid gap-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ananya" className={inputBase} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className={inputBase} />
                </div>
              </div>

              <OtpVerificationField label="Email Address" placeholder="you@example.com" type="email" value={email} onChange={setEmail} onVerified={() => setEmailVerified(true)} />
              <OtpVerificationField label="Phone Number" placeholder="+91 98765 43210" type="tel" value={phone} onChange={setPhone} onVerified={() => setPhoneVerified(true)} />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="aadhaar">Aadhaar number</Label>
                  <input id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="1234 5678 9012" inputMode="numeric" className={inputBase} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {GENDERS.map((g) => {
                      const selected = gender === g
                      return (
                        <label key={g} className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-[13.5px] font-medium tracking-[-0.01em] transition ${selected ? 'border-slate-900 bg-slate-900 text-white ring-1 ring-slate-900 dark:border-white dark:bg-white dark:text-slate-950 dark:ring-white' : 'border-gray-200 bg-white text-slate-700 ring-1 ring-gray-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'}`}>
                          <span>{g}</span>
                          <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-white bg-white text-slate-900 dark:border-slate-950 dark:bg-slate-950 dark:text-white' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                          <input type="radio" name="gender" value={g} checked={selected} onChange={() => setGender(g)} className="sr-only" />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section number="2" title="Academic Details" subtitle="Helps us map you to trending industry skills and relevant roles.">
            <div className="space-y-5">
              <div>
                <Label>Student type</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {STUDENT_TYPES.map((t) => {
                    const selected = studentType === t.id
                    return (
                      <label key={t.id} className={`flex cursor-pointer flex-col rounded-xl border p-4 text-left transition ${selected ? 'border-slate-900 bg-slate-900 text-white ring-1 ring-slate-900 dark:border-white dark:bg-white dark:text-slate-950 dark:ring-white' : 'border-gray-200 bg-white ring-1 ring-gray-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800'}`}>
                        <span className="flex items-center justify-between">
                          <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{t.label}</span>
                          <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected ? 'border-white bg-white text-slate-900 dark:border-slate-950 dark:bg-slate-950 dark:text-white' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                        </span>
                        <span className={`mt-1 text-[12px] leading-5 ${selected ? 'text-white/70 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>{t.desc}</span>
                        <input type="radio" name="studentType" value={t.id} checked={selected} onChange={() => setStudentType(t.id)} className="sr-only" />
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} className={`${inputBase} ${domain ? '' : 'text-slate-400'}`}>
                    <option value="" disabled>Select domain</option>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
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
                </div>
              </div>
            </div>
          </Section>

          <Section number="3" title="Purpose on Intern X" subtitle="Select all that apply — this personalizes your feed and recommendations.">
            <div className="grid gap-2.5">
              {PURPOSES.map((p) => {
                const selected = purposes.includes(p)
                return (
                  <label key={p} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${selected ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 dark:border-white dark:bg-slate-800 dark:ring-white' : 'border-gray-200 bg-white ring-1 ring-gray-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800'}`}>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border ${selected ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950' : 'border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="block text-[13.5px] font-medium tracking-[-0.01em] text-slate-900 dark:text-white">{p}</span>
                    <input type="checkbox" checked={selected} onChange={() => togglePurpose(p)} className="sr-only" />
                  </label>
                )
              })}
            </div>
            {purposes.includes('Other') && (
              <div className="mt-4">
                <Label htmlFor="otherPurpose">Please specify</Label>
                <input id="otherPurpose" value={otherPurpose} onChange={(e) => setOtherPurpose(e.target.value)} placeholder="e.g. Looking for mentorship and R&D collaboration" className={inputBase} />
              </div>
            )}
          </Section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-200 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30" role="alert">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-gray-200 dark:bg-slate-900/50 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="mono text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Signed in as <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span> • Email {emailVerified ? '✓ verified' : 'not verified'} • Phone {phoneVerified ? '✓ verified' : 'not verified'}
            </div>
            <button type="submit" disabled={!canSave || saving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 text-[13.5px] font-semibold tracking-[-0.01em] text-white shadow-sm ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100 sm:w-auto">
              {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />}
              {saving ? 'Saving…' : 'Save & Go to Dashboard'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
