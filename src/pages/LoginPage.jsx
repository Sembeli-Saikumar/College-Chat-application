// src/pages/LoginPage.jsx
// Login & Signup page with tab switching

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { signIn, signUp } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { MessageSquare, Eye, EyeOff, Loader2, GraduationCap, Zap } from 'lucide-react'

export default function LoginPage() {
  const { user, loading } = useAuthStore()
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    email: '', password: '', fullName: '', username: '', college: ''
  })

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signIn(loginForm)
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSubmitting(true)
    try {
      await signUp(signupForm)
      toast.success('Account created! Check your email to confirm.')
      setTab('login')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg"
    >
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 relative bg-gradient-to-br from-primary to-accent shadow-glow border border-white/20"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">CollegeChat</h1>
          <p className="text-text-secondary text-sm mt-1">Your campus, always connected</p>
        </div>

        {/* Auth card */}
        <div className="card p-6">
          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-6 bg-primary/5 border border-border"
          >
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all duration-300 ${
                  tab === t ? 'text-white' : 'text-text-2 hover:text-text'
                }`}
                style={tab === t ? {
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  boxShadow: '0 2px 15px var(--glow)',
                } : {}}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="input-base"
                  placeholder="you@college.edu"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    className="input-base pr-10"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    className="input-base"
                    placeholder="John Doe"
                    value={signupForm.fullName}
                    onChange={e => setSignupForm(f => ({ ...f, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    className="input-base"
                    placeholder="johndoe"
                    value={signupForm.username}
                    onChange={e => setSignupForm(f => ({ ...f, username: e.target.value.toLowerCase() }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">College / University</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    className="input-base pl-9"
                    placeholder="MIT, Stanford, etc."
                    value={signupForm.college}
                    onChange={e => setSignupForm(f => ({ ...f, college: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="input-base"
                  placeholder="you@college.edu"
                  value={signupForm.email}
                  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    className="input-base pr-10"
                    placeholder="Min. 6 characters"
                    value={signupForm.password}
                    onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-4 flex items-center justify-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
          <p className="text-xs text-text-2 font-medium tracking-wide">CollegeChat · Built for campus communities</p>
          <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-glow" />
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full" />
      <div className="flex flex-col items-center gap-4 relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-glow border border-white/20"
        >
          <MessageSquare className="w-6 h-6 animate-pulse text-white" />
        </div>
        <p className="text-text-2 text-sm font-semibold tracking-wider uppercase">Loading CollegeChat...</p>
        <div className="flex gap-1.5 mt-1">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
