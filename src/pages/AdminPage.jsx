// src/pages/AdminPage.jsx
// Admin panel user management, group creation, announcements

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Shield, Users, MessageSquare, Bell,
  Trash2, Ban, CheckCircle, Plus, Send, Loader2,
  Search, UserCheck, RefreshCw, AlertTriangle
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import {
  fetchAllUsers, blockUser, unblockUser, deleteUserAdmin,
  fetchGroups, createGroup, deleteGroup, createAnnouncement
} from '../services/userService'
import Avatar from '../components/shared/Avatar'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminPage() {
  const { user, isAdmin, profile } = useAuthStore()
  const navigate = useNavigate()

  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [newGroup, setNewGroup] = useState({ name: '', description: '', members: [] })
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <Shield className="w-16 h-16 text-text-2 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text">Access Denied</h1>
          <p className="text-text-2 mt-2">Admin privileges required.</p>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
        </div>
      </div>
    )
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [u, g] = await Promise.all([
        fetchAllUsers(user.id),
        fetchGroups(user.id),
      ])
      setUsers(u || [])
      setGroups(g || [])
    } catch (err) {
      toast.error('Failed to load data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleBlock = async (targetUser) => {
    try {
      if (targetUser.is_blocked) {
        await unblockUser(targetUser.id)
        setUsers(prev => prev.map(x => x.id === targetUser.id ? { ...x, is_blocked: false } : x))
        toast.success(`${targetUser.full_name} unblocked`)
      } else {
        await blockUser(targetUser.id)
        setUsers(prev => prev.map(x => x.id === targetUser.id ? { ...x, is_blocked: true } : x))
        toast.success(`${targetUser.full_name} blocked`)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (targetUser) => {
    if (!confirm(`Delete user "${targetUser.full_name}"? This cannot be undone.`)) return
    try {
      await deleteUserAdmin(targetUser.id)
      setUsers(prev => prev.filter(x => x.id !== targetUser.id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteGroup = async (group) => {
    if (!confirm(`Delete group "${group.name}"?`)) return
    try {
      await deleteGroup(group.id)
      setGroups(prev => prev.filter(x => x.id !== group.id))
      toast.success('Group deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!newGroup.name.trim()) {
      toast.error('Group name required')
      return
    }
    setCreatingGroup(true)
    try {
      const group = await createGroup({
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
        createdBy: user.id,
        memberIds: newGroup.members,
      })
      setGroups(prev => [group, ...prev])
      setNewGroup({ name: '', description: '', members: [] })
      toast.success('Group created!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCreatingGroup(false)
    }
  }

  const handleAnnouncement = async () => {
    if (!announcement.trim()) {
      toast.error('Write something first')
      return
    }
    setSendingAnnouncement(true)
    try {
      await createAnnouncement(user.id, announcement.trim())
      setAnnouncement('')
      toast.success('Announcement sent to all users!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSendingAnnouncement(false)
    }
  }

  const filteredUsers = users.filter(targetUser =>
    targetUser.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    targetUser.email?.toLowerCase().includes(search.toLowerCase()) ||
    targetUser.username?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: users.length,
    online: users.filter(targetUser => targetUser.is_online).length,
    blocked: users.filter(targetUser => targetUser.is_blocked).length,
    groups: groups.length,
  }

  return (
    <div className="min-h-screen text-text bg-bg">
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 px-6 py-4 bg-surface/80 backdrop-blur-xl border-b border-border"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-glass-light text-text-secondary hover:text-text-primary transition-all duration-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="font-bold text-lg">Admin Panel</h1>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-text-2 border border-border"
            >
              {profile?.full_name}
            </span>
          </div>
          <button onClick={loadData} disabled={loading} className="btn-ghost text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: 'var(--primary)' },
            { label: 'Online Now', value: stats.online, icon: UserCheck, color: 'var(--accent)' },
            { label: 'Blocked', value: stats.blocked, icon: Ban, color: '#EF4444' },
            { label: 'Groups', value: stats.groups, icon: MessageSquare, color: 'var(--primary)' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: `${stat.color}25` }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-xs text-text-2">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex rounded-xl p-1 mb-6 w-fit bg-primary/5 border border-border">
          {[
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'groups', icon: MessageSquare, label: 'Groups' },
            { id: 'announce', icon: Bell, label: 'Announcements' },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                tab === tabItem.id ? 'text-white' : 'text-text-2 hover:text-text'
              }`}
              style={tab === tabItem.id ? {
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                boxShadow: '0 2px 12px var(--glow)',
              } : {}}
            >
              <tabItem.icon className="w-4 h-4" />
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* ── Users tab ── */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="p-4" style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input-base pl-9"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-text-muted uppercase tracking-wider" style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.08)' }}>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">College</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(targetUser => (
                    <tr
                      key={targetUser.id}
                      className={`transition-all duration-200 hover:bg-glass-light ${targetUser.is_blocked ? 'opacity-60' : ''}`}
                      style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.05)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar user={targetUser} size="sm" showOnline />
                          <div>
                            <p className="font-medium text-text-primary">{targetUser.full_name}</p>
                            <p className="text-xs text-text-muted">@{targetUser.username} · {targetUser.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-text-secondary text-xs">{targetUser.college || '-'}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-text-secondary text-xs">
                        {targetUser.created_at ? format(new Date(targetUser.created_at), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        {targetUser.is_blocked ? (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.15)' }}
                          >
                            Blocked
                          </span>
                        ) : targetUser.is_online ? (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#86EFAC', border: '1px solid rgba(34, 197, 94, 0.15)' }}
                          >
                            Online
                          </span>
                        ) : (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(107, 114, 128, 0.1)', color: '#9CA3AF' }}
                          >
                            Offline
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleBlock(targetUser)}
                            title={targetUser.is_blocked ? 'Unblock' : 'Block'}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                              targetUser.is_blocked
                                ? 'hover:bg-green-500/10 text-green-400'
                                : 'hover:bg-yellow-500/10 text-text-secondary hover:text-yellow-400'
                            }`}
                          >
                            {targetUser.is_blocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(targetUser)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-all duration-200"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-text-muted">No users found</div>
              )}
            </div>
          </div>
        )}

        {/* ── Groups tab ── */}
        {tab === 'groups' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create group */}
            <div className="card p-6">
              <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-neon-indigo" /> Create New Group
              </h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Group Name *</label>
                  <input
                    type="text"
                    className="input-base"
                    placeholder="e.g. CS Final Year 2025"
                    value={newGroup.name}
                    onChange={e => setNewGroup(group => ({ ...group, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
                  <textarea
                    className="input-base resize-none"
                    rows={2}
                    placeholder="What's this group about?"
                    value={newGroup.description}
                    onChange={e => setNewGroup(group => ({ ...group, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Add Members ({newGroup.members.length} selected)
                  </label>
                  <div
                    className="max-h-40 overflow-y-auto space-y-1 rounded-xl p-2"
                    style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.08)' }}
                  >
                    {users.filter(targetUser => !targetUser.is_blocked).map(targetUser => (
                      <label key={targetUser.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-glass-light rounded-lg cursor-pointer transition-all duration-200">
                        <input
                          type="checkbox"
                          className="rounded accent-neon-indigo"
                          checked={newGroup.members.includes(targetUser.id)}
                          onChange={e => {
                            setNewGroup(group => ({
                              ...group,
                              members: e.target.checked
                                ? [...group.members, targetUser.id]
                                : group.members.filter(id => id !== targetUser.id)
                            }))
                          }}
                        />
                        <Avatar user={targetUser} size="xs" />
                        <span className="text-xs text-text-primary">{targetUser.full_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={creatingGroup} className="btn-primary w-full">
                  {creatingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {creatingGroup ? 'Creating...' : 'Create Group'}
                </button>
              </form>
            </div>

            {/* Existing groups */}
            <div className="card p-6">
              <h2 className="font-semibold text-text-primary mb-4">Existing Groups ({groups.length})</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groups.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-6">No groups yet</p>
                ) : (
                  groups.map(group => (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-glass-light"
                      style={{
                        background: 'rgba(99, 102, 241, 0.04)',
                        border: '1px solid rgba(99, 102, 241, 0.08)',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid rgba(99, 102, 241, 0.15)',
                        }}
                      >
                        <Users className="w-4 h-4 text-neon-indigo" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{group.name}</p>
                        <p className="text-xs text-text-secondary">
                          {group.members?.length || 0} members · by {group.creator?.full_name || 'Admin'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-all duration-200 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Announcements tab ── */}
        {tab === 'announce' && (
          <div className="max-w-2xl">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-neon-indigo" />
                <h2 className="font-semibold text-text-primary">Send Announcement</h2>
              </div>
              <p className="text-text-secondary text-sm mb-5">
                This will send a notification to all registered users instantly.
              </p>

              <div
                className="rounded-xl p-3 mb-4 flex gap-2"
                style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.12)',
                }}
              >
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/80">Announcements cannot be recalled once sent.</p>
              </div>

              <textarea
                className="input-base resize-none mb-4"
                rows={5}
                placeholder="Write your announcement here..."
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Will reach {users.length} users</span>
                <button
                  onClick={handleAnnouncement}
                  disabled={sendingAnnouncement || !announcement.trim()}
                  className="btn-primary"
                >
                  {sendingAnnouncement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sendingAnnouncement ? 'Sending...' : 'Send to All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
