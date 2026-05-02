// src/pages/SettingsPage.jsx
// User profile settings page

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Save, Loader2, User, Mail, GraduationCap, AtSign } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { updateProfile, uploadAvatar } from '../services/userService'
import Avatar from '../components/shared/Avatar'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { profile, setProfile } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    college: profile?.college || '',
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const [updated] = await updateProfile({ id: profile.id, ...form })
      setProfile({ ...profile, ...updated })
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB')
      return
    }
    setUploading(true)
    try {
      const url = await uploadAvatar(file, profile.id)
      setProfile({ ...profile, avatar_url: url })
      toast.success('Avatar updated!')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen text-text-primary" style={{ background: '#0B0F1A' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(18, 24, 38, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        }}
      >
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-glass-light text-text-secondary hover:text-text-primary transition-all duration-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto p-6 animate-fade-in">
        {/* Profile card */}
        <div className="card p-6 mb-6 flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar user={profile} size="xl" />
            <label
              className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg ${uploading ? 'opacity-50 cursor-wait' : ''}`}
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Camera className="w-4 h-4 text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
            </label>
          </div>
          <div className="text-center">
            <p className="font-semibold text-text-primary">{profile?.full_name}</p>
            <p className="text-text-secondary text-sm">@{profile?.username}</p>
            <p className="text-xs text-text-muted mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="card p-6 space-y-4">
          <h2 className="font-semibold text-text-primary mb-4">Edit Profile</h2>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              className="input-base"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5" /> Username
            </label>
            <input
              type="text"
              className="input-base"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))}
              placeholder="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" /> College / University
            </label>
            <input
              type="text"
              className="input-base"
              value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
              placeholder="Your college name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email (cannot change)
            </label>
            <input type="email" className="input-base opacity-50 cursor-not-allowed" value={profile?.email || ''} disabled />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
