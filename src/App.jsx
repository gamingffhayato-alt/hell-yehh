import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, FullScreenLoader, useAuth } from './lib/AuthContext'
import LandingPage from './components/landing/LandingPage'
import AuthPage from './components/AuthPage'
import DetailsPage from './components/DetailsPage'
import ProfilePage from './components/ProfilePage'
import Dashboard from './components/Dashboard'
import IndustryDashboard from './components/industry/IndustryDashboard'

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
  const { status } = useAuth()
  if (status === 'loading') return <FullScreenLoader label="Preparing your setup…" />
  if (status === 'signedOut') return <Navigate to="/login" replace />
  if (status === 'ready') return <Navigate to="/dashboard" replace />
  return children
}

/** Login route — users who are already in get bounced forward. */
function PublicOnlyRoute({ children }) {
  const { status } = useAuth()
  if (status === 'loading') return <FullScreenLoader label="Loading…" />
  if (status === 'needsOnboarding') return <Navigate to="/details" replace />
  if (status === 'ready') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
          {/* Old sign-up route now folds into the login page's sign-up modal */}
          <Route path="/signup" element={<Navigate to="/login" replace state={{ openSignup: true }} />} />
          <Route path="/details" element={<OnboardingRoute><DetailsPage /></OnboardingRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/industry-dashboard" element={<ProtectedRoute><IndustryDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
