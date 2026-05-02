// src/components/chat/MessageBubble.jsx
// Individual message bubble (sent/received, text/image/file)

import { format } from 'date-fns'
import { Download, FileText, Trash2 } from 'lucide-react'
import Avatar from '../shared/Avatar'
import MessageStatus from '../shared/MessageStatus'
import { deleteMessage } from '../../services/messageService'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MessageBubble({ message, showAvatar = true, isGroup = false }) {
  const { user } = useAuthStore()
  const { setMessages, messages } = useChatStore()
  const [hovering, setHovering] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isSelf = message.sender_id === user?.id
  const sender = message.sender

  const handleDelete = async () => {
    if (!confirm('Delete this message?')) return
    setDeleting(true)
    try {
      await deleteMessage(message.id)
      useChatStore.getState().setMessages(messages.filter(m => m.id !== message.id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className={`flex gap-2 group animate-fade-in ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Avatar (only in groups or received DMs) */}
      {!isSelf && showAvatar && (
        <div className="self-end mb-1 shrink-0">
          <Avatar user={sender} size="sm" />
        </div>
      )}
      {!isSelf && !showAvatar && <div className="w-8 shrink-0" />}

      <div className={`flex flex-col gap-1 max-w-[75%] ${isSelf ? 'items-end' : 'items-start'}`}>
        {/* Sender name in groups */}
        {isGroup && !isSelf && sender && (
          <span className="text-[10px] text-text-secondary font-bold px-1 uppercase tracking-wider">
            {sender.full_name}
          </span>
        )}

        {/* Bubble content */}
        <div className={isSelf ? 'bubble-sent' : 'bubble-received'}>
          {/* Image */}
          {message.file_type === 'image' && message.file_url && (
            <a href={message.file_url} target="_blank" rel="noreferrer" className="block mb-2">
              <img
                src={message.file_url}
                alt="Shared image"
                className="rounded-xl max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </a>
          )}

          {/* File attachment */}
          {message.file_type === 'file' && message.file_url && (
            <a
              href={message.file_url}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center gap-2 p-2 rounded-lg mb-2"
              style={{
                background: isSelf ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.08)',
              }}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="text-xs truncate flex-1">Download file</span>
              <Download className="w-4 h-4 shrink-0" />
            </a>
          )}

          {/* Text */}
          {message.content && (
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>

        {/* Time + status */}
        <div className={`flex items-center gap-1.5 px-1 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-text-2 font-medium">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
          {isSelf && <MessageStatus status={message.status} />}
        </div>
      </div>

      {/* Delete button (hover, self messages only) */}
      {isSelf && hovering && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="self-center opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
