// src/hooks/useMessages.js
// Real-time messages hook for DMs and group chats

import { useEffect, useRef } from 'react'
import { supabase } from '../services/supabase'
import { fetchMessages, fetchGroupMessages, markMessagesAsSeen } from '../services/messageService'
import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'

export function useMessages() {
  const { activeChat, setMessages, addMessage, setLoading } = useChatStore()
  const { user } = useAuthStore()
  const channelRef = useRef(null)

  useEffect(() => {
    if (!activeChat || !user) return

    let isMounted = true

    // ── Load history ──────────────────────────────────────────────────────
    const loadMessages = async () => {
      setLoading(true)
      try {
        let msgs
        if (activeChat.type === 'dm') {
          msgs = await fetchMessages(user.id, activeChat.id)
          // Mark as seen
          await markMessagesAsSeen(activeChat.id, user.id)
        } else {
          msgs = await fetchGroupMessages(activeChat.id)
        }
        if (isMounted) setMessages(msgs || [])
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadMessages()

    // ── Real-time subscription ─────────────────────────────────────────────
    const tableName = activeChat.type === 'dm' ? 'messages' : 'group_messages'
    const channelName = `${tableName}:${activeChat.id}:${user.id}`

    const filter = activeChat.type === 'dm'
      ? `or(and(sender_id=eq.${user.id},receiver_id=eq.${activeChat.id}),and(sender_id=eq.${activeChat.id},receiver_id=eq.${user.id}))`
      : `group_id=eq.${activeChat.id}`

    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: tableName, filter },
        async (payload) => {
          // Enrich with sender info
          const { data } = await supabase
            .from(tableName)
            .select(`
              *,
              sender:users!${tableName}_sender_id_fkey(id, full_name, username, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (data && isMounted) {
            addMessage(data)
            // Auto-mark as seen if from the other user
            if (activeChat.type === 'dm' && data.sender_id !== user.id) {
              await markMessagesAsSeen(activeChat.id, user.id)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: tableName, filter },
        (payload) => {
          if (isMounted) {
            useChatStore.getState().updateMessage(payload.new.id, payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [activeChat?.id, activeChat?.type, user?.id])
}
