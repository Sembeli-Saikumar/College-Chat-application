// src/components/shared/Avatar.jsx
// User avatar with fallback initials and online indicator

export default function Avatar({ user, size = 'md', showOnline = false, className = '' }) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }
  const dotSizes = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2 h-2 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-3.5 h-3.5 bottom-0 right-0',
    xl: 'w-4 h-4 bottom-0.5 right-0.5',
  }

  const name = user?.full_name || user?.username || user?.email || '?'
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Neon indigo themed avatar gradient backgrounds
  const gradients = [
    'linear-gradient(135deg, #6366F1, #8B5CF6)',
    'linear-gradient(135deg, #8B5CF6, #22D3EE)',
    'linear-gradient(135deg, #3B82F6, #6366F1)',
    'linear-gradient(135deg, #22D3EE, #3B82F6)',
    'linear-gradient(135deg, #6366F1, #3B82F6)',
    'linear-gradient(135deg, #8B5CF6, #6366F1)',
  ]
  const gradientIdx = name.charCodeAt(0) % gradients.length

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-surface-tertiary`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white`}
          style={{ background: gradients[gradientIdx] }}
        >
          {initials}
        </div>
      )}

      {showOnline && (
        <span
          className={`absolute ${dotSizes[size]} rounded-full border-2 ${
            user?.is_online ? 'bg-status-online' : 'bg-status-offline'
          }`}
          style={{ borderColor: '#121826' }}
        />
      )}
    </div>
  )
}
