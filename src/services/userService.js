// src/services/userService.js
// User and group management Supabase calls

import { supabase } from './supabase'

// ─── Users ────────────────────────────────────────────────────────────────────

/** Fetch all non-blocked users (excluding self) */
export async function fetchAllUsers(currentUserId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, username, email, avatar_url, is_online, last_seen, college, is_blocked, is_admin, created_at')
    .neq('id', currentUserId)
    .order('full_name')

  if (error) throw error
  return data
}

/** Fetch users available to chat with (not blocked) */
export async function fetchChatUsers(currentUserId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, username, avatar_url, is_online, last_seen, college')
    .neq('id', currentUserId)
    .eq('is_blocked', false)
    .order('is_online', { ascending: false })

  if (error) throw error
  return data
}

/** Update user profile in profiles table */
export const updateProfile = async (updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', updates.id)

  if (error) throw error
  return data
}

/** Block a user (admin only) */
export async function blockUser(userId) {
  const { error } = await supabase
    .from('users')
    .update({ is_blocked: true })
    .eq('id', userId)
  if (error) throw error
}

/** Unblock a user (admin only) */
export async function unblockUser(userId) {
  const { error } = await supabase
    .from('users')
    .update({ is_blocked: false })
    .eq('id', userId)
  if (error) throw error
}

/** Delete a user (admin only) — also removes auth user */
export async function deleteUserAdmin(userId) {
  // Remove from public.users (cascade will handle messages)
  const { error } = await supabase.from('users').delete().eq('id', userId)
  if (error) throw error
}

/** Upload user avatar */
export const uploadAvatar = async (file, userId) => {
  const filePath = `${userId}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (error) throw error

  return data
}

// ─── Groups ───────────────────────────────────────────────────────────────────

/** Fetch all groups (visible to everyone) */
export async function fetchGroups(userId) {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      creator:users!groups_created_by_fkey(id, full_name),
      members:group_members(user_id)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/** Create a new group (admin only) */
export async function createGroup({ name, description, createdBy, memberIds }) {
  const { data: group, error } = await supabase
    .from('groups')
    .insert({ name, description, created_by: createdBy })
    .select()
    .single()

  if (error) throw error

  // Add members
  const allMembers = [...new Set([createdBy, ...memberIds])]
  await supabase.from('group_members').insert(
    allMembers.map(uid => ({ group_id: group.id, user_id: uid }))
  )

  return group
}

/** Delete a group (admin only) */
export async function deleteGroup(groupId) {
  const { error } = await supabase.from('groups').delete().eq('id', groupId)
  if (error) throw error
}

/** Join a group */
export async function joinGroup(groupId, userId) {
  const { error } = await supabase
    .from('group_members')
    .upsert({ group_id: groupId, user_id: userId })
  if (error) throw error
}

/** Leave a group */
export async function leaveGroup(groupId, userId) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** Fetch notifications for a user */
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}

/** Mark notification as read */
export async function markNotificationRead(notifId) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', notifId)
}

/** Mark all notifications as read */
export async function markAllNotificationsRead(userId) {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)
}

/** Create announcement (admin only) */
export async function createAnnouncement(adminId, message) {
  // Fetch all user ids
  const { data: users } = await supabase.from('users').select('id').eq('is_admin', false)

  if (users?.length) {
    await supabase.from('notifications').insert(
      users.map(u => ({
        user_id: u.id,
        type: 'announcement',
        content: message,
        sender_id: adminId,
        is_read: false,
      }))
    )
  }
}
