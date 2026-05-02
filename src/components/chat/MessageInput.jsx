// src/components/chat/MessageInput.jsx
// Message input bar with file picker and send button

import { useState, useRef, useCallback } from 'react'
import { Send, Paperclip, Image, X, Loader2, Smile } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useChatStore } from '../../store/chatStore'
import { sendMessage, sendGroupMessage, uploadFile } from '../../services/messageService'
import { useTyping } from '../../hooks/useTyping'
import toast from 'react-hot-toast'

export default function MessageInput() {
  const { user } = useAuthStore()
  const { activeChat, addMessage } = useChatStore()
  const { sendTypingEvent } = useTyping()

  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [preview, setPreview] = useState(null) // { url, type, file }
  const fileRef = useRef()

  const handleSend = useCallback(async () => {
    if (!activeChat || !user) return
    if (!text.trim() && !preview) return

    setSending(true)
    try {
      let fileUrl = null
      let fileType = null

      // Upload file if selected
      if (preview?.file) {
        setUploadingFile(true)
        const uploaded = await uploadFile(preview.file, user.id)
        fileUrl = uploaded.url
        fileType = uploaded.type
        setUploadingFile(false)
      }

      const payload = {
        senderId: user.id,
        content: text.trim() || null,
        fileUrl,
        fileType,
      }

      let newMsg
      if (activeChat.type === 'dm') {
        newMsg = await sendMessage({ ...payload, receiverId: activeChat.id })
      } else {
        newMsg = await sendGroupMessage({ ...payload, groupId: activeChat.id })
      }

      // Optimistic add (realtime will dedupe)
      // addMessage(newMsg)  // realtime subscription handles this

      setText('')
      setPreview(null)
    } catch (err) {
      toast.error('Failed to send: ' + (err.message || 'Unknown error'))
    } finally {
      setSending(false)
      setUploadingFile(false)
    }
  }, [activeChat, user, text, preview])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    sendTypingEvent()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Max 10MB.')
      return
    }

    const url = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'file'
    setPreview({ url, type, file })
    e.target.value = ''
  }

  if (!activeChat) return null

  return (
    <div
      className="shrink-0 p-3 bg-surface/50 backdrop-blur-xl border-t border-border"
    >
      {/* File preview */}
      {preview && (
        <div
          className="mb-2 flex items-center gap-2 rounded-xl p-2 bg-bg border border-border transition-all duration-300 shadow-glow"
        >
          {preview.type === 'image' ? (
            <img src={preview.url} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center bg-surface/50"
            >
              <Paperclip className="w-5 h-5 text-text-secondary" />
            </div>
          )}
          <span className="text-xs text-text-primary flex-1 truncate">{preview.file.name}</span>
          <button
            onClick={() => { setPreview(null); URL.revokeObjectURL(preview.url) }}
            className="p-1 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 px-1">
        {/* File picker buttons */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => { fileRef.current.accept = 'image/*'; fileRef.current.click() }}
            className="p-2 rounded-xl hover:bg-white/5 text-text-2 hover:text-accent transition-all duration-200"
            title="Send image"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => { fileRef.current.accept = '*/*'; fileRef.current.click() }}
            className="p-2 rounded-xl hover:bg-white/5 text-text-2 hover:text-accent transition-all duration-200"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden file input */}
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />

        {/* Text area */}
        <div className="flex-1 relative group">
          <textarea
            rows={1}
            placeholder="Type a message..."
            className="w-full rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted
                       focus:outline-none resize-none min-h-[42px] max-h-32 leading-relaxed transition-all duration-300
                       bg-bg border border-border focus:border-primary focus:shadow-glow"
            value={text}
            onChange={e => {
              setText(e.target.value)
              // Auto-resize
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || uploadingFile || (!text.trim() && !preview)}
          className="w-11 h-11 btn-primary !p-0 shadow-glow disabled:opacity-30 disabled:translate-y-0"
          title="Send message"
        >
          {sending || uploadingFile ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}
