// src/pages/ChatPage.jsx
// Main layout: Sidebar + Chat area

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useNotifications } from '../hooks/useNotifications'
import Sidebar from '../components/chat/Sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import WelcomeScreen from '../components/chat/WelcomeScreen'
import AIBotChat from '../components/user/AIBotChat'

export default function ChatPage() {
  const { user, loading } = useAuthStore()
  const { activeChat, setActiveChat } = useChatStore()
  const [mobileChatOpen, setMobileChatOpen] = useState(false)

  // Initialize presence and notifications
  useOnlineStatus()
  useNotifications()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  const openChat = (chat) => {
    setActiveChat(chat)
    setMobileChatOpen(true)
  }

  const isAI = activeChat?.id === 'ai-bot';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0F1A' }}>
      {/* ── Sidebar ── */}
      <div className={`
        ${mobileChatOpen ? 'hidden md:flex' : 'flex'}
        w-full md:w-72 shrink-0
      `}>
        <div className="w-full flex flex-col h-full">
          <Sidebar onChatSelect={openChat} />
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className={`
        flex-1 flex flex-col min-w-0
        ${!mobileChatOpen ? 'hidden md:flex' : 'flex'}
      `}>
        {activeChat ? (
          <>
            <ChatHeader onBack={() => setMobileChatOpen(false)} />
            {isAI ? (
              <AIBotChat />
            ) : (
              <>
                <MessageList />
                <MessageInput />
              </>
            )}
          </>
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  )
}
