// src/components/shared/MessageStatus.jsx
// WhatsApp-style message status ticks

import { Check, CheckCheck } from 'lucide-react'

export default function MessageStatus({ status }) {
  if (status === 'seen') {
    return <CheckCheck className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
  }
  if (status === 'delivered') {
    return <CheckCheck className="w-3.5 h-3.5 text-text-secondary shrink-0" />
  }
  return <Check className="w-3.5 h-3.5 text-text-muted shrink-0" />
}
