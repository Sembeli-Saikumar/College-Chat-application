// src/components/chat/Sidebar.jsx
// Left sidebar: tabs, user list, group list, notifications

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare, Users, Bell, Settings, LogOut,
  Search, Shield, ChevronRight, X, Bot, Sparkles
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import { fetchChatUsers, fetchGroups, markNotificationRead, markAllNotificationsRead } from '../../services/userService'
import Avatar from '../shared/Avatar'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function Sidebar({ onChatSelect }) {
  const { user, profile, isAdmin, signOutUser } = useAuthStore()
  const {
    users, groups, notifications, sidebarTab,
    setUsers, setGroups, setActiveChat, setSidebarTab,
    setNotifications, searchQuery, setSearchQuery, activeChat
  } = useChatStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchChatUsers(user.id).then(setUsers).catch(console.error)
    fetchGroups(user.id).then(setGroups).catch(console.error)
  }, [user?.id])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOutUser()
      navigate('/login')
    } catch {
      toast.error('Logout failed')
      setLoggingOut(false)
    }
  }

  const handleChatSelect = (chat) => {
    if (onChatSelect) {
      onChatSelect(chat);
    } else {
      setActiveChat(chat);
    }
  }

  const filteredUsers = users.filter(targetUser =>
    targetUser.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    targetUser.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGroups = groups.filter(group =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadNotifs = notifications.filter(notification => !notification.is_read).length

  return (
    <aside
      className="flex flex-col h-full w-72 shrink-0 glass-panel"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-glow"
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }}
            >
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-text-primary text-base gradient-text">CollegeChat</span>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                title="Admin Panel"
                className="p-1.5 rounded-lg transition-all duration-200 text-accent hover:bg-accent/10"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div
          className="flex items-center gap-2 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-border"
          style={{
            background: 'var(--bg)',
          }}
        >
          <Avatar user={profile} size="sm" showOnline />
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-xs font-semibold truncate">{profile?.full_name || 'You'}</p>
            <p className="text-xs truncate text-text-secondary">@{profile?.username}</p>
          </div>
          {isAdmin && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold text-white shadow-glow"
              style={{
                background: 'var(--primary)',
              }}
            >
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'chats', icon: MessageSquare, label: 'Chats' },
          { id: 'groups', icon: Users, label: 'Groups' },
          { id: 'notifications', icon: Bell, label: 'Alerts', badge: unreadNotifs },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-all duration-300 relative"
            style={
              sidebarTab === tab.id
                ? { color: 'var(--primary)', borderBottom: '2px solid var(--primary)' }
                : { color: 'var(--text-2)' }
            }
          >
            <div className="relative">
              <tab.icon className="w-4 h-4" />
              {tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 badge text-[9px]">{tab.badge}</span>
              )}
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      {sidebarTab !== 'notifications' && (
        <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder={sidebarTab === 'chats' ? 'Search people...' : 'Search groups...'}
              className="w-full rounded-xl pl-8 pr-8 py-2 text-xs text-text-primary placeholder-text-muted transition-all duration-300 bg-bg border border-border focus:border-primary focus:shadow-glow outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-text-muted" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content list */}
      <div className="flex-1 overflow-y-auto py-2">
        {sidebarTab === 'chats' && (
          <div className="py-1">
            {/* AI Assistant Item */}
            {!searchQuery && (
              <button
                onClick={() => handleChatSelect({ id: 'ai-bot', data: { full_name: 'AI Assistant' } })}
                className={`sidebar-item w-full text-left group transition-all duration-300 ${
                  activeChat?.id === 'ai-bot' ? 'active shadow-glow' : ''
                }`}
                style={{
                   border: activeChat?.id === 'ai-bot' ? '1px solid var(--border)' : '1px solid transparent'
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-primary to-accent shadow-glow transition-transform group-hover:scale-105">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-text-primary">AI Assistant 🤖</p>
                    <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                  </div>
                  <p className="text-[10px] text-accent font-medium uppercase tracking-wider">Always Online</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
              </button>
            )}

            {filteredUsers.length === 0 && searchQuery ? (
              <p className="text-text-muted text-xs text-center py-8">No users found</p>
            ) : (
              filteredUsers.map(targetUser => (
                <UserItem
                  key={targetUser.id}
                  user={targetUser}
                  isActive={activeChat?.type === 'dm' && activeChat?.id === targetUser.id}
                  onClick={() => handleChatSelect({ type: 'dm', id: targetUser.id, data: targetUser })}
                />
              ))
            )}
          </div>
        )}

        {sidebarTab === 'groups' && (
          <div className="py-1">
            {filteredGroups.length === 0 ? (
              <p className="text-text-muted text-xs text-center py-8">No groups yet</p>
            ) : (
              filteredGroups.map(group => (
                <GroupItem
                  key={group.id}
                  group={group}
                  isActive={activeChat?.type === 'group' && activeChat?.id === group.id}
                  onClick={() => setActiveChat({ type: 'group', id: group.id, data: group })}
                />
              ))
            )}
          </div>
        )}

        {sidebarTab === 'notifications' && (
          <NotificationsPanel
            notifications={notifications}
            setNotifications={setNotifications}
            userId={user?.id}
          />
        )}
      </div>
    </aside>
  )
}

function UserItem({ user, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}>
      <Avatar user={user} size="md" showOnline />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate">{user.full_name}</p>
        <p className="text-xs text-text-secondary truncate">
          {user.is_online ? (
            <span className="text-neon-cyan">Online</span>
          ) : user.last_seen ? (
            `Last seen ${formatDistanceToNow(new Date(user.last_seen), { addSuffix: true })}`
          ) : (
            `@${user.username}`
          )}
        </p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
    </button>
  )
}

function GroupItem({ group, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}
      >
        <Users className="w-5 h-5 text-neon-indigo" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate">{group.name}</p>
        <p className="text-xs text-text-secondary truncate">{group.members?.length || 0} members</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
    </button>
  )
}

function NotificationsPanel({ notifications, setNotifications, userId }) {
  const handleMarkAll = async () => {
    await markAllNotificationsRead(userId)
    setNotifications(notifications.map(notification => ({ ...notification, is_read: true })))
  }

  const handleMark = async (notification) => {
    if (notification.is_read) return
    await markNotificationRead(notification.id)
    setNotifications(notifications.map(item => item.id === notification.id ? { ...item, is_read: true } : item))
  }

  return (
    <div className="py-2">
      {notifications.length > 0 && (
        <div className="px-3 mb-2 flex justify-end">
          <button onClick={handleMarkAll} className="text-xs text-neon-indigo hover:text-neon-purple transition-colors">
            Mark all read
          </button>
        </div>
      )}
      {notifications.length === 0 ? (
        <p className="text-text-muted text-xs text-center py-8">No notifications</p>
      ) : (
        notifications.map(notification => (
          <button
            key={notification.id}
            onClick={() => handleMark(notification)}
            className={`w-full text-left px-3 py-2.5 hover:bg-glass-light transition-all duration-200 ${
              !notification.is_read ? 'bg-neon-indigo/5' : ''
            }`}
            style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.06)' }}
          >
            <div className="flex items-start gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full mt-0.5 shrink-0"
                style={{
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#9CA3AF',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                {notification.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-primary leading-relaxed">{notification.content}</p>
                <p className="text-xs text-text-muted mt-1">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              {!notification.is_read && (
                <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)' }} />
              )}
            </div>
          </button>
        ))
      )}
    </div>
  )
}
