// src/components/chat/WelcomeScreen.jsx
// Shown in the right panel when no chat is selected

import { MessageSquare, Users, Bell, Shield, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'

export default function WelcomeScreen() {
  const { profile, isAdmin } = useAuthStore()
  const { users, groups } = useChatStore()

  const features = [
    { icon: MessageSquare, label: 'Direct Messages', desc: `Chat with ${users.length} classmates` },
    { icon: Users, label: 'Group Chats', desc: `${groups.length} active groups` },
    { icon: Bell, label: 'Notifications', desc: 'Stay updated in real-time' },
    { icon: Zap, label: 'Real-time', desc: 'Instant message delivery' },
  ]

  if (isAdmin) {
    features.push({ icon: Shield, label: 'Admin Panel', desc: 'Manage users & announcements' })
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.15) 0%, #0B0F1A 70%)' }}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] opacity-8"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-sm animate-fade-in">
        {/* Logo icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.7))',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 50px rgba(99,102,241,0.25)',
          }}
        >
          <MessageSquare className="w-9 h-9 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Welcome, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span>
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Select a conversation from the sidebar to start chatting, or pick a group to join the discussion.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="card rounded-xl p-4 text-left transition-all duration-300 cursor-default group hover:scale-[1.03]"
              style={{
                border: '1px solid rgba(99, 102, 241, 0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
                e.currentTarget.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                style={{ background: 'rgba(99, 102, 241, 0.15)' }}
              >
                <feature.icon className="w-4 h-4 text-neon-indigo" />
              </div>
              <p className="text-text-primary text-xs font-semibold">{feature.label}</p>
              <p className="text-text-muted text-xs mt-0.5">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer divider */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25))' }} />
          <span className="text-xs text-text-muted">CollegeChat</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.25), transparent)' }} />
        </div>
      </div>
    </div>
  )
}
