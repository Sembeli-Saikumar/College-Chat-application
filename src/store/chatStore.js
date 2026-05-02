// src/store/chatStore.js
// Global chat state with Zustand

import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  // ── Active conversation ──
  activeChat: null,   // { type: 'dm' | 'group', id, data }
  messages: [],
  loading: false,

  // ── Users & Groups ──
  users: [],
  groups: [],

  // ── UI state ──
  sidebarTab: 'chats',  // 'chats' | 'groups' | 'notifications'
  searchQuery: '',

  // ── Notifications ──
  notifications: [],
  unreadCount: 0,

  // ── Typing ──
  typingUsers: {},  // { userId: boolean }

  // ── Setters ──
  setActiveChat: (chat) => set({ activeChat: chat, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set(s => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, updates) => set(s => ({
    messages: s.messages.map(m => m.id === id ? { ...m, ...updates } : m)
  })),

  setUsers: (users) => set({ users }),
  setGroups: (groups) => set({ groups }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setLoading: (loading) => set({ loading }),

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.is_read).length,
  }),
  addNotification: (notif) => set(s => ({
    notifications: [notif, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),

  setTyping: (userId, isTyping) => set(s => ({
    typingUsers: { ...s.typingUsers, [userId]: isTyping },
  })),

  clearTyping: () => set({ typingUsers: {} }),
}))
