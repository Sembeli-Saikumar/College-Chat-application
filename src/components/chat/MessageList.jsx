// src/components/chat/MessageList.jsx
// Scrollable message list with date separators and typing indicator

import { useEffect, useRef } from 'react'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'
import { useMessages } from '../../hooks/useMessages'
import MessageBubble from './MessageBubble'
import TypingIndicator from '../shared/TypingIndicator'
import { Loader2 } from 'lucide-react'

function DateSeparator({ date }) {
  const d = new Date(date)
  let label
  if (isToday(d)) label = 'Today'
  else if (isYesterday(d)) label = 'Yesterday'
  else label = format(d, 'MMMM d, yyyy')

  return (
    <div className="flex items-center gap-3 my-4 px-4">
      <div className="flex-1 h-px" style={{ background: 'rgba(99, 102, 241, 0.1)' }} />
      <span
        className="text-xs text-text-secondary px-3 py-1 rounded-full shrink-0"
        style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(99, 102, 241, 0.1)' }} />
    </div>
  )
}

export default function MessageList() {
  const { messages, loading, activeChat, typingUsers, users } = useChatStore()
  const { user } = useAuthStore()
  const bottomRef = useRef()
  const containerRef = useRef()

  useMessages()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, Object.values(typingUsers).some(Boolean)])

  const isGroup = activeChat?.type === 'group'
  const typingUsersList = Object.entries(typingUsers)
    .filter(([uid, isTyping]) => isTyping && uid !== user?.id)
  const typingUserName = typingUsersList.length === 1
    ? users.find(u => u.id === typingUsersList[0][0])?.full_name
    : typingUsersList.length > 1 ? 'Several people' : null

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#0B0F1A' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-neon-indigo animate-spin" />
          <p className="text-text-secondary text-sm">Loading messages...</p>
        </div>
      </div>
    )
  }

  const grouped = []
  let currentDate = null

  messages.forEach((msg, i) => {
    const msgDate = new Date(msg.created_at)
    if (!currentDate || !isSameDay(currentDate, msgDate)) {
      grouped.push({ type: 'separator', date: msg.created_at, key: `sep-${msg.id}` })
      currentDate = msgDate
    }

    const prev = messages[i - 1]
    const showAvatar = !prev ||
      prev.sender_id !== msg.sender_id ||
      (msgDate - new Date(prev.created_at)) > 5 * 60 * 1000

    grouped.push({ type: 'message', msg, showAvatar, key: msg.id })
  })

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 scroll-smooth" style={{ background: '#0B0F1A' }}>
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-primary font-medium">No messages yet</p>
            <p className="text-text-secondary text-sm mt-1">Say hello.</p>
          </div>
        </div>
      )}

      {grouped.map(item => {
        if (item.type === 'separator') {
          return <DateSeparator key={item.key} date={item.date} />
        }
        return (
          <MessageBubble
            key={item.key}
            message={item.msg}
            showAvatar={item.showAvatar}
            isGroup={isGroup}
          />
        )
      })}

      {typingUsersList.length > 0 && (
        <div className="pl-2">
          <TypingIndicator userName={typingUserName} />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
