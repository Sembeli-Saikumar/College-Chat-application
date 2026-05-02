// src/hooks/useTyping.js
// Typing indicator hook with debounce

import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { setTypingStatus } from '../services/messageService'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'

export function useTyping() {
  const { activeChat, setTyping } = useChatStore()
  const { user } = useAuthStore()
  const stopTypingTimer = useRef(null)
  const channelRef = useRef(null)

  // ── Subscribe to typing events in current chat ──────────────────────────
  useEffect(() => {
    if (!activeChat || !user) return

    const channelName = `typing:${activeChat.type}:${activeChat.id}`

    channelRef.current = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== user.id) {
          setTyping(payload.userId, payload.isTyping)

          // Auto-clear after 3s
          if (payload.isTyping) {
            setTimeout(() => setTyping(payload.userId, false), 3000)
          }
        }
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      useChatStore.getState().clearTyping()
    }
  }, [activeChat?.id, user?.id])

  /** Call this on every keypress in the message input */
  const sendTypingEvent = useCallback(() => {
    if (!activeChat || !user || !channelRef.current) return

    // Send "typing: true" broadcast
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id, userName: user.user_metadata?.full_name, isTyping: true },
    })

    // Debounce stop
    clearTimeout(stopTypingTimer.current)
    stopTypingTimer.current = setTimeout(() => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: false },
      })
    }, 2000)
  }, [activeChat?.id, user?.id])

  return { sendTypingEvent }
}
