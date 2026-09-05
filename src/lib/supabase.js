import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Auth persistence — stabilized for refreshes & tab navigation:
 *
 *  - persistSession: true   → session is written to localStorage, so a page
 *    refresh or switching browser tabs keeps the user signed in.
 *  - storage: localStorage  → shared across ALL open tabs (sign out in one
 *    tab signs out everywhere via storage events).
 *  - autoRefreshToken: true → silently renews expiring JWTs while a tab is
 *    open, so the user never gets kicked mid-session.
 *  - detectSessionInUrl: true → completes OAuth sign-in from the URL hash
 *    after a provider redirect.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})
