// src/components/shared/TypingIndicator.jsx
// Animated typing dots

export default function TypingIndicator({ userName }) {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <div className="bubble-received flex items-center gap-1.5 py-3 px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
      {userName && (
        <span className="text-xs text-text-secondary mb-1">{userName} is typing...</span>
      )}
    </div>
  )
}
