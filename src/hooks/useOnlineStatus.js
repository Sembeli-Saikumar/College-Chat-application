// src/hooks/useOnlineStatus.js
// Track and broadcast online presence

import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { updateOnlineStatus } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'

export function useOnlineStatus() {
  const { user } = useAuthStore()
  const { setUsers } = useChatStore()

  useEffect(() => {
    if (!user) return

    // Mark self as online
    updateOnlineStatus(user.id, true)

    // Subscribe to presence changes on public.users
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users' },
        (payload) => {
          const { users } = useChatStore.getState()
          setUsers(users.map(u =>
            u.id === payload.new.id
              ? { ...u, is_online: payload.new.is_online, last_seen: payload.new.last_seen }
              : u
          ))
        }
      )
      .subscribe()

    // Mark offline on window close
    const handleBeforeUnload = () => updateOnlineStatus(user.id, false)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Heartbeat every 30s
    const heartbeat = setInterval(() => {
      updateOnlineStatus(user.id, true)
    }, 30_000)

    return () => {
      updateOnlineStatus(user.id, false)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(heartbeat)
      supabase.removeChannel(channel)
    }
  }, [user?.id])
}
