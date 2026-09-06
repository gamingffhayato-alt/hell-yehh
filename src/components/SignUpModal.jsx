import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PasswordInput from './PasswordInput'
import GoogleButton from './GoogleButton'
import Divider from './Divider'
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  CheckIcon,
  GradCapIcon,
  XIcon,
} from './Icons'

const CLASS_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const COURSES = ['B.Tech', 'BCA', 'BBA', 'B.Sc', 'M.Tech', 'MCA', 'MBA', 'M.Sc']
const STREAMS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Data Science',
  'Artificial Intelligence & ML',
]

/** Step 1 · "Who are you?" — the three live portals of Intern X. */
const ROLE_CARDS = [
  {
    id: 'student',
    label: 'Student',
    hint: 'Internships, skill tracks, mentorship & a digital CV',
    Icon: GradCapIcon,
  },
  {
    id: 'industry',
    label: 'Industry Partner',
    hint: 'Post roles, get ATS-ranked matches & host hackathons',
    Icon: BriefcaseIcon,
  },
  {
    id: 'academician',
    label: 'Academician',
    hint: 'FDPs, industry consultancy R&D & cohort analytics',
    Icon: BookIcon,
    wide: true, // third card spans the full row
  },
]

/** Step 1 · "How did you hear about Intern X?" (marketing attribution). */
const MARKETING_SOURCES = ['Google', 'YouTube', 'Facebook', 'LinkedIn', 'Friend/Peer', 'Other']

const STEPS = ['About you', 'Details', 'Account']

const inputClass =
  'block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

/** Ghost "← Back" button for steps 2 & 3. */
function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-600 transition duration-150 hover:bg-gray-50 hover:text-gray-800"
    >
      <ArrowRightIcon className="h-4 w-4 rotate-180" />
      Back
    </button>
  )
}

/**
 * Full registration modal (Supabase signUp) — a 3-step wizard:
 *
 *   Step 1 · Initial profiling — "Who are you?" (Student / Industry Partner /
 *            Academician cards) + "How did you hear about Intern X?".
 *   Step 2 · Conditional details — students get academic fields (institution
 *            defaults to Quantum University); industry partners get company +
 *            job title; academicians get designation, department, institution.
 *   Step 3 · Account creation — email + password → "Complete Sign Up".
 *
 * Everything travels in signup metadata; AuthContext writes it into the
 * profiles table (incl. role, marketing_source, company_name, job_title) as
 * soon as a session exists, then routes each role to its own dashboard
 * (student → /dashboard, industry → /industry-dashboard,
 * academician → /academic-dashboard).
 */
export default function SignUpModal({ onClose }) {
  // Deep-links like /signup?role=industry (from the landing role cards) arrive
  // here as /login?role=industry — on mount, pre-select that role and
  // auto-advance the wizard straight to Step 2 (Conditional Details), so the
  // user never has to click the card they already picked.
  const [searchParams] = useSearchParams()
  const urlRole = ['student', 'industry', 'academician'].includes(searchParams.get('role'))
    ? searchParams.get('role')
    : null

  const [step, setStep] = useState(urlRole ? 2 : 1)

  // Step 1 — profiling
  const [role, setRole] = useState(urlRole ?? '') // 'student' | 'industry' | 'academician'
  const [marketingSource, setMarketingSource] = useState('')

  // Step 2 — shared + conditional
  const [fullName, setFullName] = useState('')
  const [classYear, setClassYear] = useState('')
  const [course, setCourse] = useState('')
  const [stream, setStream] = useState('')
  const [institution, setInstitution] = useState('Quantum University') // default suggestion
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [designation, setDesignation] = useState('')
  const [department, setDepartment] = useState('')

  // Step 3 — credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)

  const isStudent = role === 'student'
  const isIndustry = role === 'industry'
  const isAcademician = role === 'academician'

  // Lock page scroll + close on Escape while the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  /* --------------------------- Step validation --------------------------- */
  const canProceedStep1 = Boolean(role && marketingSource)
  const canProceedStep2 = isStudent
    ? Boolean(
        fullName.trim() && classYear && course.trim() && stream.trim() && institution.trim(),
      )
    : isIndustry
      ? Boolean(fullName.trim() && companyName.trim() && jobTitle.trim())
      : Boolean(
          fullName.trim() && designation.trim() && department.trim() && institution.trim(),
        )
  const canSubmit = Boolean(email.trim() && password.length >= 8)

  const goNext = () => {
    setError('')
    setStep((s) => Math.min(3, s + 1))
  }

  const goBack = () => {
    setError('')
    setStep((s) => Math.max(1, s - 1))
  }

  /** Google OAuth from the SIGN-UP modal — records a 'signup' intent plus the
      chosen role (if any) so AuthContext can materialize the profile after the
      OAuth redirect and route straight into the right portal. */
  const handleGoogleSignUp = async () => {
    sessionStorage.setItem('auth_intent', 'signup')
    if (role) sessionStorage.setItem('oauth_role', role)
    onClose()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) console.error('Google sign-up error:', error.message)
  }

  /** One submit handler for the whole wizard: steps 1–2 advance,
      step 3 performs the actual Supabase sign-up. */
  const handlePrimarySubmit = (e) => {
    e.preventDefault()
    if (step < 3) {
      if (step === 1 ? canProceedStep1 : canProceedStep2) goNext()
      return
    }
    handleSignUp()
  }

  const handleSignUp = async () => {
    if (loading || !canSubmit) return
    setError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          source: 'email_signup', // marker AuthContext uses to build the profile
          role, // 'student' | 'industry' | 'academician' → drives the redirect
          marketing_source: marketingSource,
          full_name: fullName.trim(),
          // Academic details (students only — null otherwise)
          class_year: isStudent ? classYear : null,
          course: isStudent ? course.trim() : null,
          stream: isStudent ? stream.trim() : null,
          // Institution: students + academicians
          institution: isStudent || isAcademician ? institution.trim() : null,
          // Industry partner details
          company_name: isIndustry ? companyName.trim() : null,
          // Job title: industry partners; designation · department for faculty
          job_title: isIndustry
            ? jobTitle.trim()
            : isAcademician
              ? `${designation.trim()} · ${department.trim()}`
              : null,
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(
        /already registered|already been registered/i.test(error.message)
          ? 'This email is already registered — try logging in instead.'
          : error.message,
      )
      return
    }

    if (data?.session) {
      // Email confirmation OFF → signed in immediately. AuthContext creates
      // the profile from metadata and routes by role to the right dashboard.
      onClose()
      return
    }

    // Email confirmation ON → ask the user to verify, then log in.
    setConfirmSent(true)
  }

  const selectedRole = ROLE_CARDS.find((r) => r.id === role)

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Create an account">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel: full-screen sheet on mobile, centered card on desktop */}
      <div className="relative mx-auto w-full sm:my-10 sm:max-w-2xl sm:px-4">
        <div className="animate-fade-up min-h-screen bg-white p-6 shadow-2xl sm:min-h-0 sm:rounded-3xl sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white">
                <GradCapIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  Create your account
                </h2>
                <p className="text-sm text-gray-500">
                  Free for candidates — takes under a minute.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {confirmSent ? (
            /* ------------------------- Email confirmation ------------------------- */
            <div className="py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">Check your inbox</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                We&apos;ve sent a confirmation link to{' '}
                <span className="font-semibold text-gray-800">{email}</span>. Verify your
                email, then come back and log in — your profile will be set up
                automatically.
              </p>
              <button
                onClick={onClose}
                className="mt-6 h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Back to log in
              </button>
            </div>
          ) : (
            <>
              {/* ------------------------- Step indicator ------------------------- */}
              <div className="mt-6" aria-hidden="true">
                <div className="flex gap-1.5">
                  {STEPS.map((label, i) => (
                    <span
                      key={label}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                        i < step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
                  <span className="text-indigo-600">
                    Step {step} of 3 · {STEPS[step - 1]}
                  </span>
                  <span className="hidden text-gray-400 sm:block">
                    {STEPS.map((label, i) => (
                      <span key={label} className={i + 1 === step ? 'text-gray-700' : ''}>
                        {i + 1} {label}
                        {i < STEPS.length - 1 ? '  ·  ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <form onSubmit={handlePrimarySubmit} className="mt-6">
                {/* ================= STEP 1 · Initial profiling ================= */}
                {step === 1 && (
                  <div key="step-1" className="animate-fade-up space-y-6">
                    <GoogleButton onClick={handleGoogleSignUp} />
                    <Divider>or sign up with email</Divider>

                    {/* Who are you? */}
                    <div role="radiogroup" aria-labelledby="su-role-label">
                      <p id="su-role-label" className="mb-2 block text-sm font-medium text-gray-700">
                        Who are you?
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {ROLE_CARDS.map(({ id, label, hint, Icon, wide }) => {
                          const selected = role === id
                          return (
                            <label
                              key={id}
                              className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-600/50 sm:p-5 ${
                                wide ? 'sm:col-span-2 ' : ''
                              }${
                                selected
                                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20'
                                  : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10'
                              }`}
                            >
                              <input
                                type="radio"
                                name="su-role"
                                value={id}
                                checked={selected}
                                onChange={() => setRole(id)}
                                className="sr-only"
                              />
                              <span
                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                                  selected
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </span>
                              <span>
                                <span
                                  className={`block text-sm font-semibold ${
                                    selected ? 'text-indigo-700' : 'text-gray-800'
                                  }`}
                                >
                                  {label}
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-gray-500">
                                  {hint}
                                </span>
                              </span>
                              {selected && (
                                <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white">
                                  <CheckIcon className="h-3 w-3" />
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* How did you hear about us? */}
                    <div>
                      <p id="su-source-label" className="mb-2 block text-sm font-medium text-gray-700">
                        How did you hear about Intern X?
                      </p>
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-labelledby="su-source-label"
                      >
                        {MARKETING_SOURCES.map((sourceOption) => {
                          const selected = marketingSource === sourceOption
                          return (
                            <button
                              key={sourceOption}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => setMarketingSource(sourceOption)}
                              className={`rounded-full border px-4 py-2 text-sm font-medium transition duration-150 ${
                                selected
                                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                  : 'border-gray-300 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                              }`}
                            >
                              {sourceOption}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!canProceedStep1}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* ================= STEP 2 · Conditional details ================= */}
                {step === 2 && (
                  <div key="step-2" className="animate-fade-up space-y-5">
                    <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700 ring-1 ring-indigo-600/10">
                      {selectedRole && <selectedRole.Icon className="h-4 w-4 shrink-0" />}
                      <span>
                        {isStudent
                          ? 'Tell us about your studies — this powers your job matches.'
                          : isIndustry
                            ? 'Tell us about your role — this sets up your hiring portal.'
                            : 'Tell us about your faculty role — this sets up your academic workspace.'}
                      </span>
                    </div>

                    {/* Full name (all roles) */}
                    <div>
                      <Label htmlFor="su-name">Full name</Label>
                      <input
                        id="su-name"
                        type="text"
                        required
                        placeholder={
                          isStudent
                            ? 'e.g. Ananya Sharma'
                            : isIndustry
                              ? 'e.g. Rohan Mehta'
                              : 'e.g. Dr. Meera Sharma'
                        }
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        className={inputClass}
                      />
                    </div>

                    {isStudent ? (
                      /* --------------------- Student fields --------------------- */
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="su-class">Class / Year</Label>
                          <select
                            id="su-class"
                            required
                            value={classYear}
                            onChange={(e) => setClassYear(e.target.value)}
                            className={`${inputClass} ${classYear ? '' : 'text-gray-400'}`}
                          >
                            <option value="" disabled>
                              Select your year
                            </option>
                            {CLASS_YEARS.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="su-course">Course</Label>
                          <input
                            id="su-course"
                            list="course-options"
                            required
                            placeholder="e.g. B.Tech"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className={inputClass}
                          />
                          <datalist id="course-options">
                            {COURSES.map((c) => (
                              <option key={c} value={c} />
                            ))}
                          </datalist>
                        </div>

                        <div className="sm:col-span-2">
                          <Label htmlFor="su-stream">Stream</Label>
                          <input
                            id="su-stream"
                            list="stream-options"
                            required
                            placeholder="e.g. Computer Science and Engineering"
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            className={inputClass}
                          />
                          <datalist id="stream-options">
                            {STREAMS.map((s) => (
                              <option key={s} value={s} />
                            ))}
                          </datalist>
                        </div>

                        <div className="sm:col-span-2">
                          <Label htmlFor="su-institution">Institution</Label>
                          <input
                            id="su-institution"
                            type="text"
                            required
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className={inputClass}
                          />
                          <p className="mt-1.5 text-[11px] text-gray-400">
                            Quantum University is set as the suggested default — change it
                            if you study elsewhere.
                          </p>
                        </div>
                      </div>
                    ) : isIndustry ? (
                      /* ------------------ Industry partner fields ------------------ */
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="su-company">Company name</Label>
                          <input
                            id="su-company"
                            type="text"
                            required
                            placeholder="e.g. TechCorp"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            autoComplete="organization"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <Label htmlFor="su-title">Job title</Label>
                          <input
                            id="su-title"
                            type="text"
                            required
                            placeholder="e.g. Talent Acquisition Manager"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            autoComplete="organization-title"
                            className={inputClass}
                          />
                        </div>

                        <p className="text-[11px] leading-relaxed text-gray-400 sm:col-span-2">
                          You&apos;ll land on the Industry Dashboard after sign-up — post
                          roles, review ATS-ranked matches and host campus programs.
                        </p>
                      </div>
                    ) : (
                      /* --------------------- Academician fields --------------------- */
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="su-designation">Designation</Label>
                          <input
                            id="su-designation"
                            type="text"
                            required
                            placeholder="e.g. Associate Professor"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            autoComplete="organization-title"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <Label htmlFor="su-department">Department</Label>
                          <input
                            id="su-department"
                            type="text"
                            required
                            placeholder="e.g. Computer Science"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className={inputClass}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <Label htmlFor="su-institution-fac">Institution</Label>
                          <input
                            id="su-institution-fac"
                            type="text"
                            required
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className={inputClass}
                          />
                          <p className="mt-1.5 text-[11px] text-gray-400">
                            Quantum University is set as the suggested default — change it
                            if you teach elsewhere.
                          </p>
                        </div>

                        <p className="text-[11px] leading-relaxed text-gray-400 sm:col-span-2">
                          You&apos;ll land on the Faculty Portal after sign-up — FDPs,
                          industry consultancy R&amp;D and cohort analytics.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <BackButton onClick={goBack} />
                      <button
                        type="submit"
                        disabled={!canProceedStep2}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Continue
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3 · Account creation ================= */}
                {step === 3 && (
                  <div key="step-3" className="animate-fade-up space-y-5">
                    {/* Recap of steps 1–2 with a quick way back to edit */}
                    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-200">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {selectedRole && <selectedRole.Icon className="h-3.5 w-3.5" />}
                        {selectedRole?.label}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                        via {marketingSource}
                      </span>
                      <span className="max-w-full truncate rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                        {fullName.trim()}
                        {isStudent || isAcademician
                          ? ` · ${institution.trim() || 'Institution'}`
                          : ` · ${companyName.trim() || 'Company'}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="ml-auto text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <Label htmlFor="su-email">Email address</Label>
                      <input
                        id="su-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className={inputClass}
                      />
                    </div>

                    <PasswordInput
                      id="su-password"
                      name="su-password"
                      placeholder="Create a password (min. 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />

                    {error && (
                      <p
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <BackButton onClick={goBack} />
                      <button
                        type="submit"
                        disabled={loading || !canSubmit}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading && (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}
                        {loading ? 'Creating your account…' : 'Complete Sign Up'}
                      </button>
                    </div>

                    <p className="text-center text-xs leading-relaxed text-gray-500">
                      By creating an account, you agree to our{' '}
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms</a>{' '}
                      and{' '}
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
                    </p>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
