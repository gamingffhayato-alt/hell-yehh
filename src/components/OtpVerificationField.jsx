import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

/* Icons — Lucide style, inline SVG */
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10l3.5 3.5L16 5.5" />
    </svg>
  )
}
function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11A2.5 2.5 0 0117.5 20h-11A2.5 2.5 0 014 17.5v-11Z" />
      <path d="M5 7l7 5 7-5" />
    </svg>
  )
}
function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 3.5A1.5 1.5 0 018 2h1.2a1.5 1.5 0 011.45 1.1l.6 2.4a1.5 1.5 0 01-.5 1.5l-1.2 1a9 9 0 004.45 4.45l1-1.2a1.5 1.5 0 011.5-.5l2.4.6A1.5 1.5 0 0122 13.8V15a1.5 1.5 0 01-1.5 1.5A16.5 16.5 0 013.5 9.5 1.5 1.5 0 015 8V6.5A1.5 1.5 0 016.5 5H8a1.5 1.5 0 011.5 1.5v.2" />
    </svg>
  )
}
function SpinnerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
  )
}

/**
 * Parses Supabase / network errors into user-friendly, specific messages.
 * Covers: offline, rate-limit, invalid email, expired/invalid OTP.
 */
function parseSupabaseError(err, context) {
  const msg = (err?.message || '').toLowerCase()
  const status = err?.status

  // No active network / fetch failure
  if (!navigator.onLine || msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network error') || msg.includes('fetch failed')) {
    return 'No internet connection. Please check your network and try again.'
  }

  // Rate-limit
  if (status === 429 || msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('over_email_send_rate_limit') || msg.includes('over_sms_send_rate_limit') || msg.includes('email rate limit') || msg.includes('sms rate limit')) {
    return 'Too many requests. Please wait a minute before trying again.'
  }

  if (context === 'send') {
    if (msg.includes('invalid') && msg.includes('email')) {
      return 'Please enter a valid email address.'
    }
    return err?.message || 'Failed to send code. Please try again.'
  }

  // Verify context — OTP expired or incorrect
  if (msg.includes('expired') || msg.includes('otp_expired') || msg.includes('token has expired') || msg.includes('token expired')) {
    return 'Code has expired. Please request a new code.'
  }
  if (msg.includes('invalid') || msg.includes('otp_disabled') || msg.includes('invalid token') || msg.includes('token is invalid') || msg.includes('otp_invalid') || msg.includes('invalid otp')) {
    return 'Incorrect code. Please check and try again.'
  }

  return err?.message || 'Invalid code. Please try again.'
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * OtpVerificationField — Production-safe hybrid OTP field for Intern X
 *
 * Public API (kept identical for drop-in replacement):
 * @param {string} props.label - e.g. "Email Address"
 * @param {string} props.placeholder
 * @param {'email'|'tel'} props.type - email uses real Supabase, tel is simulated
 * @param {string} props.value - controlled main input value
 * @param {function} props.onChange - (newValue) => void, updates parent form
 * @param {function} props.onVerified - (verifiedValue) => void, called on success
 *
 * State machine: idle | sending | entering | verifying | verified
 * Error path: on any failure, never leaves UI stuck — returns to idle (send failed)
 * or entering (verify failed) with OTP cleared and focus reset.
 */
export default function OtpVerificationField({
  label = 'Email Address',
  placeholder = 'you@example.com',
  type = 'email',
  value = '',
  onChange,
  onVerified,
}) {
  const isEmail = type === 'email'

  // State machine — same states as original file
  const [state, setState] = useState('idle')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)

  const inputRefs = useRef([])
  const countdownIntervalRef = useRef(null)
  const timeoutRefs = useRef([])

  const isVerified = state === 'verified'
  const isEntering = state === 'entering'
  const isSending = state === 'sending'
  const isVerifying = state === 'verifying'
  const isLocked = isEntering || isVerifying || isVerified

  // Helper to track timeouts for cleanup
  const trackTimeout = (id) => {
    timeoutRefs.current.push(id)
    return id
  }

  const clearAllTimers = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
    timeoutRefs.current.forEach((id) => clearTimeout(id))
    timeoutRefs.current = []
  }

  // Component unmounts while setTimeout/setInterval pending — clear all timers (fixes leak)
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  // Resend cooldown — 30s countdown, with proper cleanup to avoid leaks
  useEffect(() => {
    // Clear any existing interval when state changes
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }

    if (!isEntering) return

    setCountdown(30)
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
            countdownIntervalRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
    }
  }, [isEntering])

  const focusFirstOtp = () => {
    const id = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 50)
    trackTimeout(id)
  }

  const clearOtpAndFocusFirst = () => {
    setOtp(['', '', '', '', '', ''])
    focusFirstOtp()
  }

  const handleMainChange = (e) => {
    if (isLocked) return
    onChange?.(e.target.value)
    setError('')
  }

  /**
   * Send OTP — PRODUCTION SAFE
   * 
   * Why signInWithOtp + type:'email' instead of updateUser + email_change?
   * - This component is used during INITIAL account verification (onboarding),
   *   not for changing an already-verified user's email.
   * - `updateUser({ email })` + `type: 'email_change'` is the flow for changing
   *   email of an already authenticated, verified user. It requires the user to
   *   have a verified address and will fail with "Email change requires verified
   *   email" or similar if the current email is already verified, or will not
   *   trigger the correct email template.
   * - `signInWithOtp({ email })` + `type: 'email'` is the correct flow for
   *   passwordless initial verification / sign-in. It sends a 6-digit code
   *   via Supabase's email OTP template and `verifyOtp` with type 'email'
   *   confirms it. This works for both new and existing users during onboarding
   *   without the email_change restrictions.
   * @see https://supabase.com/docs/reference/javascript/auth-signinwithotp
   * @see https://supabase.com/docs/reference/javascript/auth-verifyotp
   */
  const handleSendOtp = async () => {
    // Double-submit protection — actually ignore re-clicks while in flight
    if (isSending || isVerifying) return

    const inputValue = value?.trim()

    // Client-side validation before calling Supabase — email invalid or empty
    if (!inputValue) {
      setError(isEmail ? 'Please enter your email address.' : 'Please enter your phone number.')
      return
    }
    if (isEmail && !isValidEmail(inputValue)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setState('sending')

    try {
      if (isEmail) {
        /**
         * REAL EMAIL LOGIC — production-safe
         * Sends a 6-digit OTP to the provided email for initial verification.
         * Uses signInWithOtp, not updateUser, because this is initial verification.
         */
        const { error } = await supabase.auth.signInWithOtp({
          email: inputValue,
          options: {
            // Ensure we don't create a new user if this is used for verification of existing session,
            // but allow it for onboarding. shouldCreateUser defaults true, which is fine for initial verification.
            shouldCreateUser: true,
          },
        })
        if (error) throw error
      } else {
        // SIMULATED PHONE LOGIC — 1s delay, production-safe with tracked timeout
        await new Promise((resolve) => {
          const id = setTimeout(resolve, 1000)
          trackTimeout(id)
        })
      }

      setOtp(['', '', '', '', '', ''])
      setState('entering')
      focusFirstOtp()
    } catch (err) {
      // Explicit error handling — never leaves UI stuck, returns to idle
      const friendly = parseSupabaseError(err, 'send')
      setError(friendly)
      setState('idle')
    }
  }

  const handleOtpChange = (index, val) => {
    // Allow only single digit — filter non-digits
    const raw = val || ''
    const digit = raw.replace(/\D/g, '').slice(-1)

    // If user typed non-digit char, ignore it (handles paste of non-digit chars partially)
    if (raw && !digit && raw.length === 1 && /\D/.test(raw)) {
      // Explicitly ignore non-digit input, don't advance
      return
    }

    if (!digit && val !== '') {
      // If val is empty, it's a delete — allow
      if (val === '') {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        return
      }
      return
    }

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError('')

    // Auto-advance to next square when a number is typed
    if (digit && index < 5) {
      const id = setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 10)
      trackTimeout(id)
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        const id = setTimeout(() => {
          inputRefs.current[index - 1]?.focus()
        }, 10)
        trackTimeout(id)
        e.preventDefault()
      } else if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      const id = setTimeout(() => {
        inputRefs.current[index - 1]?.focus()
      }, 10)
      trackTimeout(id)
    }
    if (e.key === 'ArrowRight' && index < 5) {
      const id = setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 10)
      trackTimeout(id)
    }
    // Prevent typing non-digits (except navigation keys)
    if (e.key.length === 1 && /\D/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text') || ''

    // Handle paste of code with non-digit characters or wrong length
    // Extract digits only
    const digitsOnly = pastedText.replace(/\D/g, '')

    if (!digitsOnly) {
      // Paste contained no digits at all — ignore but show hint
      setError('Pasted code contains no digits. Please paste a 6-digit numeric code.')
      return
    }

    if (pastedText.replace(/\D/g, '').length !== pastedText.trim().length) {
      // Pasted string had non-digit characters — we filtered them, but inform via filling
      // We don't hard-error, we just filter and fill (common UX), but clear previous error
      setError('')
    }

    // Handle wrong length — if less than 6, fill partially; if more, take first 6
    const newOtp = ['', '', '', '', '', '']
    for (let i = 0; i < Math.min(6, digitsOnly.length); i++) {
      newOtp[i] = digitsOnly[i]
    }
    setOtp(newOtp)

    if (digitsOnly.length < 6) {
      // Wrong length (too short) — focus next empty box, don't auto-verify
      const nextIndex = digitsOnly.length
      const id = setTimeout(() => {
        inputRefs.current[nextIndex]?.focus()
      }, 10)
      trackTimeout(id)
    } else {
      // Full 6 digits pasted — focus last box
      const id = setTimeout(() => {
        inputRefs.current[5]?.focus()
      }, 10)
      trackTimeout(id)
    }
  }

  /**
   * Verify OTP — PRODUCTION SAFE
   * For email: uses verifyOtp with type 'email' (not email_change)
   * For tel: simulated 1s delay, any 6-digit accepted
   * On failure: always returns to 'entering' with OTP cleared and focus reset to first box (never stuck)
   */
  const handleVerify = async () => {
    // Double-submit protection
    if (isVerifying || isSending) return

    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }

    if (!/^\d{6}$/.test(otpString)) {
      setError('Code must be 6 digits. Please check and try again.')
      return
    }

    setError('')
    setState('verifying')

    try {
      if (isEmail) {
        /**
         * REAL EMAIL VERIFICATION
         * Verifies the 6-digit code sent via signInWithOtp.
         * Type 'email' is correct for initial verification flow.
         * Using 'email_change' would fail once user already has verified address.
         */
        const { error } = await supabase.auth.verifyOtp({
          email: value.trim(),
          token: otpString,
          type: 'email',
        })
        if (error) throw error
      } else {
        // SIMULATED PHONE LOGIC — 1s delay, any 6-digit = success
        await new Promise((resolve) => {
          const id = setTimeout(resolve, 1000)
          trackTimeout(id)
        })
      }

      setState('verified')
      onVerified?.(value.trim())
    } catch (err) {
      // Explicit error path — never leaves UI stuck, returns to entering with OTP cleared and focus reset
      const friendly = parseSupabaseError(err, 'verify')
      setError(friendly)
      setState('entering')
      // Clear OTP boxes and reset focus to first box as required
      const id = setTimeout(() => {
        clearOtpAndFocusFirst()
      }, 50)
      trackTimeout(id)
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    if (isSending || isVerifying) return
    await handleSendOtp()
  }

  const otpComplete = otp.join('').length === 6

  return (
    <div className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        .mono { font-family: "Geist Mono", ui-monospace, monospace; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 240ms ease-out both; }
      `}</style>

      <div className="mb-1.5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-slate-100 text-slate-500 ring-1 ring-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            {isEmail ? <MailIcon className="h-3.5 w-3.5" /> : <PhoneIcon className="h-3.5 w-3.5" />}
          </span>
          {label}
        </label>
        {isVerified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950">
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            Verified
          </span>
        )}
      </div>

      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={type}
            value={value}
            onChange={handleMainChange}
            placeholder={placeholder}
            readOnly={isLocked}
            disabled={isVerified}
            className={`block w-full rounded-xl border bg-white px-4 py-3 pr-[108px] text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 ${
              isVerified
                ? 'cursor-not-allowed border-emerald-200 bg-emerald-50/50 ring-1 ring-emerald-200 focus:border-emerald-300 focus:ring-emerald-500/20 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:ring-emerald-800/30'
                : isLocked
                ? 'cursor-not-allowed border-gray-200 bg-slate-50 text-slate-500 ring-1 ring-gray-200 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-800'
                : 'border-gray-200 ring-1 ring-gray-200 focus:border-indigo-500 focus:ring-indigo-500/30 dark:border-slate-800 dark:ring-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20'
            }`}
          />

          {isVerified ? (
            <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold tracking-[-0.01em] text-emerald-600 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:ring-emerald-500/20">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950">
                <CheckIcon className="h-3 w-3" />
              </span>
              Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending || isEntering || isVerifying || !value?.trim()}
              className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-[12px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100"
            >
              {isSending ? (
                <>
                  <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                  Sending
                </>
              ) : isEntering ? (
                'Sent'
              ) : (
                'Send OTP'
              )}
            </button>
          )}
        </div>
      </div>

      {isEntering && !isVerified && (
        <div className="mt-5 animate-fade-up rounded-2xl bg-white p-5 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
              Enter 6-digit code sent to <span className="font-semibold text-slate-900 dark:text-white">{isEmail ? value : value}</span>
            </p>
            <span className="mono text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">{isEmail ? 'email' : 'simulated'}</span>
          </div>

          <div className="mt-4 flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={handleOtpPaste}
                disabled={isVerifying}
                className="h-12 w-full max-w-[52px] rounded-xl border border-gray-200 bg-white text-center text-[18px] font-bold tracking-[-0.02em] text-slate-900 shadow-sm ring-1 ring-gray-200 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:ring-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:h-[52px] sm:max-w-[56px] sm:text-[20px]"
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="mono text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">
              {countdown > 0 ? (
                <>Resend code in {countdown}s</>
              ) : (
                <button type="button" onClick={handleResend} disabled={isSending || isVerifying} className="font-medium tracking-[-0.01em] text-slate-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-white">
                  Resend code
                </button>
              )}
            </p>

            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpComplete || isVerifying}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-[13px] font-semibold tracking-[-0.01em] text-white ring-1 ring-slate-900 transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-100 sm:w-auto"
            >
              {isVerifying ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Verify
                  <CheckIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {isVerifying && !isEntering && (
        <div className="mt-3 flex items-center gap-2 text-[12px] tracking-[-0.01em] text-slate-600 dark:text-slate-300">
          <SpinnerIcon className="h-4 w-4 animate-spin" />
          Verifying your {isEmail ? 'email' : 'phone number'}…
        </div>
      )}

      {isVerified && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] tracking-[-0.01em] text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950">
            <CheckIcon className="h-3 w-3" />
          </span>
          {isEmail ? 'Email' : 'Phone'} verified and locked — you’re all set.
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] leading-5 tracking-[-0.01em] text-red-700 ring-1 ring-red-200 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900/30" role="alert">
          {error}
        </p>
      )}

      {!isEntering && !isVerified && !isVerifying && (
        <p className="mono mt-2 text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">
          {isEmail ? 'Real Supabase OTP via signInWithOtp • type: email • check inbox' : 'Simulated • any 6-digit code works • 1s delay'}
        </p>
      )}
    </div>
  )
}
