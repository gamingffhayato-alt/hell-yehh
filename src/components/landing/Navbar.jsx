import { useState } from 'react'
import { GradCapIcon, MenuIcon, XIcon } from '../Icons'

const LINKS = [
  { label: 'Explore', href: '#categories' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'How it works', href: '#how' },
  { label: 'Why EduBridge', href: '#why' },
]

export default function Navbar({ onLogin, onRegister }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <GradCapIcon className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">EduBridge</span>
        </a>

        {/* Center links (desktop) */}
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions (desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={onLogin}
            className="h-10 rounded-full px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Log in
          </button>
          <button
            onClick={onRegister}
            className="h-10 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            Get started
          </button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 lg:hidden"
        >
          {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="animate-fade-up border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="divide-y divide-gray-100 border-b border-gray-100">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={close}
                  className="block py-3 text-sm font-medium text-gray-700 transition hover:text-indigo-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => { close(); onLogin?.() }}
                className="h-11 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Log in
              </button>
              <button
                onClick={() => { close(); onRegister?.() }}
                className="h-11 rounded-full bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
