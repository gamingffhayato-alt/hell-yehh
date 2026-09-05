import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import StudentDashboard from './dashboard/StudentDashboard'

/**
 * /dashboard — Student Portal.
 * ProtectedRoute already gates this route; this is a second, explicit
 * session check so the dashboard can never render signed-out.
 */
export default function Dashboard() {
  const { session } = useAuth()

  if (!session?.user) return <Navigate to="/login" replace />

  return <StudentDashboard />
}
