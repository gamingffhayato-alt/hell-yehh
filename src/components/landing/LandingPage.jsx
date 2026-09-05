import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Hero from './Hero'
import {
  Categories,
  FeaturedJobs,
  HowItWorks,
  RoleBento,
  Testimonials,
} from './Sections'
import { CtaBanner, SiteFooter } from './Footer'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/login', { state: { openSignup: true } })}
      />
      <main>
        <Hero />
        <Categories />
        <FeaturedJobs />
        <HowItWorks />
        <RoleBento />
        <Testimonials />
        <CtaBanner onRegister={() => navigate('/login', { state: { openSignup: true } })} />
      </main>
      <SiteFooter />
    </div>
  )
}
