// src/hooks/useNotifications.js
// Fetch and subscribe to real-time notifications

import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { fetchNotifications } from '../services/userService'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'

export function useNotifications() {
  const { user } = useAuthStore()
  const { setNotifications, addNotification } = useChatStore()

  useEffect(() => {
    if (!user) return

    // Initial fetch
    fetchNotifications(user.id).then(setNotifications).catch(console.error)

    // Real-time new notifications
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => addNotification(payload.new)
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user?.id])
}
