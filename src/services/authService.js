// src/services/authService.js
// All authentication-related Supabase calls

import { supabase } from './supabase'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'kotevaijinath1623@gmail.com'

/** Sign up a new user and create their profile row */
export async function signUp({ email, password, fullName, username, college }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, username, college },
    },
  })
  if (error) throw error

  // Insert into public.users (handled by DB trigger, but upsert as safety net)
  if (data.user) {
    const { error: profileError } = await supabase.from('users').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      username,
      college,
      is_admin: email === ADMIN_EMAIL,
      is_blocked: false,
      created_at: new Date().toISOString(),
    })
    if (profileError) console.error('Profile upsert error:', profileError)
  }

  return data
}

/** Sign in with email/password */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/** Sign out current user */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Get current session */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/** Fetch user profile from public.users */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/** Update user's online status */
export async function updateOnlineStatus(userId, isOnline) {
  await supabase
    .from('users')
    .update({
      is_online: isOnline,
      last_seen: new Date().toISOString(),
    })
    .eq('id', userId)
}

/** Update user profile */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
