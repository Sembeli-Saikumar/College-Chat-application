// src/components/chat/ChatHeader.jsx
// Top bar showing current chat info

import { Phone, Video, MoreVertical, Users, ArrowLeft } from 'lucide-react'
import Avatar from '../shared/Avatar'
import { useChatStore } from '../../store/chatStore'
import { formatDistanceToNow } from 'date-fns'

export default function ChatHeader({ onBack }) {
  const { activeChat, typingUsers, users } = useChatStore()
  if (!activeChat) return null

  const isDM = activeChat.type === 'dm'
  const chatData = activeChat.data

  const typingList = Object.entries(typingUsers)
    .filter(([, v]) => v)
    .map(([uid]) => users.find(u => u.id === uid)?.full_name || 'Someone')

  const isTyping = typingList.length > 0

  return (
    <header
      className="flex items-center gap-3 px-4 py-3 shrink-0 bg-surface/50 backdrop-blur-xl border-b border-border z-10"
    >
      {onBack && (
        <button onClick={onBack} className="md:hidden p-1.5 -ml-1 rounded-xl hover:bg-white/5 text-text-2 transition-all duration-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {isDM ? (
        <Avatar user={chatData} size="md" showOnline />
      ) : (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-glow"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        >
          <Users className="w-5 h-5 text-primary" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="text-text font-bold text-sm truncate">
          {isDM ? chatData?.full_name : chatData?.name}
        </h2>
        <p className="text-[10px] truncate uppercase tracking-widest font-bold">
          {isTyping ? (
            <span className="text-accent animate-pulse">
              {typingList.join(', ')} typing...
            </span>
          ) : isDM ? (
            chatData?.is_online ? (
              <span className="text-accent">Online</span>
            ) : (
              <span className="text-text-2">Offline</span>
            )
          ) : (
            <span className="text-text-2 tracking-widest">{chatData?.members?.length || 0} members</span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-xl text-text-2 hover:text-accent hover:bg-accent/5 transition-all duration-300" title="Audio call">
          <Phone className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl text-text-2 hover:text-accent hover:bg-accent/5 transition-all duration-300" title="Video call">
          <Video className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl text-text-2 hover:text-primary hover:bg-primary/5 transition-all duration-300">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
