// src/services/messageService.js
// All messaging-related Supabase calls

import { supabase } from './supabase'

// ─── Direct Messages ──────────────────────────────────────────────────────────

/** Fetch DM history between two users */
export async function fetchMessages(userId, otherUserId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, full_name, username, avatar_url)
    `)
    .or(
      `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
    )
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/** Send a direct message */
export async function sendMessage({ senderId, receiverId, content, fileUrl, fileType }) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      file_url: fileUrl || null,
      file_type: fileType || null,
      status: 'sent',
    })
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, full_name, username, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

/** Mark all messages from a sender as seen */
export async function markMessagesAsSeen(senderId, receiverId) {
  await supabase
    .from('messages')
    .update({ status: 'seen' })
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .neq('status', 'seen')
}

/** Delete a message */
export async function deleteMessage(messageId) {
  const { error } = await supabase.from('messages').delete().eq('id', messageId)
  if (error) throw error
}

// ─── Group Messages ───────────────────────────────────────────────────────────

/** Fetch all messages for a group */
export async function fetchGroupMessages(groupId) {
  const { data, error } = await supabase
    .from('group_messages')
    .select(`
      *,
      sender:users!group_messages_sender_id_fkey(id, full_name, username, avatar_url)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

/** Send a group message */
export async function sendGroupMessage({ groupId, senderId, content, fileUrl, fileType }) {
  const { data, error } = await supabase
    .from('group_messages')
    .insert({
      group_id: groupId,
      sender_id: senderId,
      content,
      file_url: fileUrl || null,
      file_type: fileType || null,
    })
    .select(`
      *,
      sender:users!group_messages_sender_id_fkey(id, full_name, username, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}

// ─── Typing Indicators ────────────────────────────────────────────────────────

/** Upsert typing status */
export async function setTypingStatus({ userId, receiverId, groupId, isTyping }) {
  await supabase.from('typing_status').upsert({
    user_id: userId,
    receiver_id: receiverId || null,
    group_id: groupId || null,
    is_typing: isTyping,
    updated_at: new Date().toISOString(),
  })
}

// ─── File Upload ──────────────────────────────────────────────────────────────

/** Upload file to Supabase Storage */
export async function uploadFile(file, userId) {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('chat-files')
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from('chat-files')
    .getPublicUrl(fileName)

  return {
    url: urlData.publicUrl,
    type: file.type.startsWith('image/') ? 'image' : 'file',
    name: file.name,
  }
}
