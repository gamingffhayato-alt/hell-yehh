import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, FullScreenLoader, homeForRole, useAuth } from './lib/AuthContext'
import LandingPage from './components/landing/LandingPage'
import AuthPage from './components/AuthPage'
import DetailsPage from './components/DetailsPage'
import ProfilePage from './components/ProfilePage'
import Dashboard from './components/Dashboard'
import IndustryDashboard from './components/industry/IndustryDashboard'
import AcademicDashboard from './components/academic/AcademicDashboard'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AskAiWidgetGate from './components/AskAiWidget'

/** /signup?role=x folds into /login?role=x and auto-opens the sign-up modal —
    the query string must survive so the wizard can pre-select the role. */
function SignupRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/login${search}`} replace state={{ openSignup: true }} />
}

/** Signed-in-only routes. Incomplete profiles are always pushed to /details. */
function ProtectedRoute({ children }) {
  const { status } = useAuth()
  if (status === 'loading') return <FullScreenLoader label="Loading your account…" />
  if (status === 'signedOut') return <Navigate to="/login" replace />
  if (status === 'needsOnboarding') return <Navigate to="/details" replace />
  return children
}

/** Onboarding route — reachable only while signed in AND profile incomplete. */
function OnboardingRoute({ children }) {
  const { status, profile } = useAuth()
  if (status === 'loading') return <FullScreenLoader label="Preparing your setup…" />
  if (status === 'signedOut') return <Navigate to="/login" replace />
  if (status === 'ready') return <Navigate to={homeForRole(profile?.role)} replace />
  return children
}

/** Login route — users who are already in get bounced forward (role-aware). */
function PublicOnlyRoute({ children }) {
  const { status, profile } = useAuth()
  if (status === 'loading') return <FullScreenLoader label="Loading…" />
  if (status === 'needsOnboarding') return <Navigate to="/details" replace />
  if (status === 'ready') return <Navigate to={homeForRole(profile?.role)} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
          {/* Admin back door — deliberately OUTSIDE the Supabase auth flow.
              Guards itself via the ix_admin sessionStorage flag. */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Old sign-up route folds into the login page's sign-up modal,
              preserving ?role=… deep-links from the landing role cards. */}
          <Route path="/signup" element={<SignupRedirect />} />
          <Route path="/details" element={<OnboardingRoute><DetailsPage /></OnboardingRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/industry-dashboard" element={<ProtectedRoute><IndustryDashboard /></ProtectedRoute>} />
          <Route path="/academic-dashboard" element={<ProtectedRoute><AcademicDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Floating "Ask AI" assistant — gates itself to dashboard routes
            and picks its persona from the logged-in role. */}
        <AskAiWidgetGate />
      </AuthProvider>
    </BrowserRouter>
  )
}
