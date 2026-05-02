// src/components/shared/EmptyState.jsx

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
        }}
      >
        <Icon className="w-8 h-8 text-neon-indigo" />
      </div>
      <div>
        <p className="text-text-primary font-semibold">{title}</p>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
