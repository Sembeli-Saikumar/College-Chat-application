// src/store/authStore.js
// Global authentication state with Zustand

import { create } from 'zustand'
import { supabase } from '../services/supabase'
import { getUserProfile, updateOnlineStatus } from '../services/authService'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'kotevaijinath1623@gmail.com'

export const useAuthStore = create((set, get) => ({
  user: null,         // Supabase auth user
  profile: null,      // public.users row
  isAdmin: false,
  loading: true,
  initialized: false,

  /** Initialize auth — call once on app mount */
  initialize: async () => {
    try {
      // Add a timeout so the app doesn't hang when Supabase is unreachable
      const sessionPromise = supabase.auth.getSession()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase connection timeout')), 8000)
      )

      const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise])

      if (session?.user) {
        const profileLoaded = await get().loadProfile(session.user)
        // If profile couldn't be loaded, sign out so user sees login page
        if (!profileLoaded) {
          console.warn('No valid profile found for session user, signing out...')
          await supabase.auth.signOut()
          set({ user: null, profile: null, isAdmin: false, loading: false, initialized: true })
          return
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
      // On any error, clear session and show login
      try { await supabase.auth.signOut() } catch {}
      set({ user: null, profile: null, isAdmin: false })
    }

    // Listen to auth changes
    try {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await get().loadProfile(session.user)
          updateOnlineStatus(session.user.id, true)
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, profile: null, isAdmin: false })
        }
      })
    } catch {}

    set({ loading: false, initialized: true })
  },

  /** Load profile from public.users. Returns true if successful, false otherwise. */
  loadProfile: async (authUser) => {
    try {
      const profile = await getUserProfile(authUser.id)
      if (!profile) {
        set({ user: null, profile: null, isAdmin: false })
        return false
      }
      set({
        user: authUser,
        profile,
        isAdmin: profile?.email === ADMIN_EMAIL || profile?.is_admin === true,
      })
      return true
    } catch (e) {
      // Profile might not exist yet — retry once after short delay
      await new Promise(r => setTimeout(r, 1000))
      try {
        const profile = await getUserProfile(authUser.id)
        if (!profile) {
          set({ user: null, profile: null, isAdmin: false })
          return false
        }
        set({
          user: authUser,
          profile,
          isAdmin: profile?.email === ADMIN_EMAIL || profile?.is_admin === true,
        })
        return true
      } catch {
        // Profile doesn't exist — sign out
        console.warn('Profile not found after retry, clearing auth state')
        set({ user: null, profile: null, isAdmin: false })
        return false
      }
    }
  },

  /** Sign out and clear all state */
  signOutUser: async () => {
    try {
      const { user } = get()
      if (user) {
        await updateOnlineStatus(user.id, false)
      }
      await supabase.auth.signOut()
      set({ user: null, profile: null, isAdmin: false })
    } catch (err) {
      console.error('Sign out error:', err)
      // Force clear state even on error
      set({ user: null, profile: null, isAdmin: false })
    }
  },

  setProfile: (profile) => set({ profile }),
}))
