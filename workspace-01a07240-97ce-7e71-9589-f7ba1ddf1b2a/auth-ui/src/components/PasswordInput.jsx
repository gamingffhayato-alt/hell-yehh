import { useState } from 'react'
import { EyeIcon, EyeOffIcon, LockIcon } from './Icons'

/**
 * Password field with an eye-icon toggle for visibility.
 *
 * Props:
 *  - id, name          : input identifiers
 *  - label             : field label text
 *  - labelAction       : optional node rendered at the right of the label row (e.g. "Forgot password?")
 *  - placeholder
 *  - value, onChange   : controlled input wiring
 *  - autoComplete      : 'current-password' | 'new-password'
 */
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
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

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
          className="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />

        {/* Eye-icon toggle */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition duration-150 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        >
          {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
