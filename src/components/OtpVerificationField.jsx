import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

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
 * OtpVerificationField — Hybrid verification field
 * - type="email": REAL Supabase logic
 *   send: supabase.auth.updateUser({ email })
 *   verify: supabase.auth.verifyOtp({ email, token, type: 'email_change' })
 * - type="tel": SIMULATED logic with setTimeout 1s, any 6-digit = success
 *
 * Props:
 * - label, placeholder, type ('email' | 'tel'), value, onChange, onVerified
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
  const [state, setState] = useState('idle') // idle | sending | entering | verifying | verified
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef([])

  const isVerified = state === 'verified'
  const isEntering = state === 'entering'
  const isSending = state === 'sending'
  const isVerifying = state === 'verifying'
  const isLocked = isEntering || isVerifying || isVerified

  // Countdown for resend
  useEffect(() => {
    if (!isEntering) return
    setCountdown(30)
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isEntering, state])

  const handleMainChange = (e) => {
    if (isLocked) return
    onChange?.(e.target.value)
    setError('')
  }

  const handleSendOtp = async () => {
    const inputValue = value?.trim()
    if (!inputValue) {
      setError(isEmail ? 'Please enter a valid email address.' : 'Please enter a valid phone number.')
      return
    }
    if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')
    setState('sending')

    try {
      if (isEmail) {
        // REAL EMAIL LOGIC
        const { error } = await supabase.auth.updateUser({ email: inputValue })
        if (error) throw error
      } else {
        // SIMULATED PHONE LOGIC — 1s delay
        await new Promise((res) => setTimeout(res, 1000))
      }

      setOtp(['', '', '', '', '', ''])
      setState('entering')
      // Focus first OTP box after render
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.message || 'Failed to send code. Please try again.')
      setState('idle')
    }
  }

  const handleOtpChange = (index, val) => {
    // Only allow single digit
    const digit = val.replace(/\D/g, '').slice(-1)
    if (!digit && val !== '') return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError('')

    // Auto-advance to next
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
        e.preventDefault()
      } else if (otp[index]) {
        // Clear current
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || ''
    }
    setOtp(newOtp)
    // Focus next empty or last
    const nextIndex = pasted.length < 6 ? pasted.length : 5
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }

    setError('')
    setState('verifying')

    try {
      if (isEmail) {
        // REAL EMAIL LOGIC
        const { error } = await supabase.auth.verifyOtp({
          email: value.trim(),
          token: otpString,
          type: 'email_change',
        })
        if (error) throw error
      } else {
        // SIMULATED PHONE LOGIC — 1s delay, any 6-digit = success
        await new Promise((res) => setTimeout(res, 1000))
        if (otpString.length !== 6) throw new Error('Invalid code')
      }

      setState('verified')
      onVerified?.(value)
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.')
      setState('entering')
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    await handleSendOtp()
  }

  const otpComplete = otp.join('').length === 6

  return (
    <div className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        .mono { font-family: "Geist Mono", ui-monospace, monospace; }
      `}</style>

      {/* Label */}
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

      {/* Main Input + Actions */}
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

          {/* Verified Badge — prominent glowing green inside input area */}
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

      {/* OTP Entering State */}
      {isEntering && !isVerified && (
        <div className="mt-5 animate-fade-up rounded-2xl bg-white p-5 ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
              Enter 6-digit code sent to <span className="font-semibold text-slate-900 dark:text-white">{isEmail ? value : value}</span>
            </p>
            <span className="mono text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">{isEmail ? 'email_change' : 'simulated'}</span>
          </div>

          {/* 6 individual squares — auto-advance logic */}
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
                className="h-12 w-full max-w-[52px] rounded-xl border border-gray-200 bg-white text-center text-[18px] font-bold tracking-[-0.02em] text-slate-900 shadow-sm ring-1 ring-gray-200 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:ring-slate-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:h-[52px] sm:max-w-[56px] sm:text-[20px]"
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="mono text-[11px] tracking-[-0.01em] text-slate-500 dark:text-slate-400">
              {countdown > 0 ? (
                <>Resend code in {countdown}s</>
              ) : (
                <button type="button" onClick={handleResend} className="font-medium tracking-[-0.01em] text-slate-900 underline-offset-4 hover:underline dark:text-white">
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

      {/* Verifying spinner inline when verifying */}
      {isVerifying && !isEntering && (
        <div className="mt-3 flex items-center gap-2 text-[12px] tracking-[-0.01em] text-slate-600 dark:text-slate-300">
          <SpinnerIcon className="h-4 w-4 animate-spin" />
          Verifying your {isEmail ? 'email' : 'phone number'}…
        </div>
      )}

      {/* Verified collapsed state — hide OTP boxes, keep locked input */}
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

      {/* Helper hint for idle */}
      {!isEntering && !isVerified && !isVerifying && (
        <p className="mono mt-2 text-[11px] tracking-[-0.01em] text-slate-400 dark:text-slate-500">
          {isEmail ? 'Real Supabase OTP via email_change • check inbox' : 'Simulated • any 6-digit code works • 1s delay'}
        </p>
      )}
    </div>
  )
}
