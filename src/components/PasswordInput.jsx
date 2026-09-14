import { useState } from 'react'
import { EyeIcon, EyeOffIcon, LockIcon } from './Icons'

export default function PasswordInput({
  id = 'password',
  name = 'password',
  label = 'Password',
  labelAction = null,
  placeholder = '••••••••',
  value,
  onChange,
  autoComplete = 'current-password',
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block text-[13px] font-medium tracking-[-0.01em] text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          required
          minLength={8}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-[13.5px] tracking-[-0.01em] text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-gray-200 transition duration-150 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:ring-slate-800 dark:focus:border-white dark:focus:ring-white/20"
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition duration-150 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 dark:focus-visible:ring-white/20"
        >
          {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
