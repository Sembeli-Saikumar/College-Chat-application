-- ============================================================
-- CollegeChat — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. USERS (extends auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT,
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  college       TEXT,
  is_online     BOOLEAN DEFAULT FALSE,
  last_seen     TIMESTAMPTZ,
  is_admin      BOOLEAN DEFAULT FALSE,
  is_blocked    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. MESSAGES (Direct Messages) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content       TEXT,
  file_url      TEXT,
  file_type     TEXT,               -- 'image' | 'file'
  status        TEXT DEFAULT 'sent', -- 'sent' | 'delivered' | 'seen'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. GROUPS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.groups (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  avatar_url    TEXT,
  created_by    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. GROUP MEMBERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.group_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id      UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

-- ── 5. GROUP MESSAGES ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.group_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id      UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  sender_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content       TEXT,
  file_url      TEXT,
  file_type     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. TYPING STATUS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.typing_status (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id   UUID REFERENCES public.users(id) ON DELETE CASCADE,
  group_id      UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  is_typing     BOOLEAN DEFAULT FALSE,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, receiver_id, group_id)
);

-- ── 7. NOTIFICATIONS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type          TEXT NOT NULL,       -- 'message' | 'announcement' | 'system'
  content       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_messages_sender    ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver  ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created   ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_gm_group           ON public.group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_gm_sender          ON public.group_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notif_user         ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_typing_user        ON public.typing_status(user_id);

-- ============================================================
-- AUTO-UPDATE updated_at via trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE user profile on signup trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, username, college, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'college',
    CASE WHEN NEW.email = 'kotevaijinath1623@gmail.com' THEN TRUE ELSE FALSE END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- USERS
CREATE POLICY "Users can view all profiles"
  ON public.users FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin delete
CREATE POLICY "Admin can delete users"
  ON public.users FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- MESSAGES — sender or receiver can access
CREATE POLICY "Message participants can read"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Sender can update message status"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Sender can delete own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- GROUPS
CREATE POLICY "Anyone can view groups"
  ON public.groups FOR SELECT USING (TRUE);

CREATE POLICY "Admin can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

CREATE POLICY "Admin can delete groups"
  ON public.groups FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- GROUP MEMBERS
CREATE POLICY "Anyone can view group members"
  ON public.group_members FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage group members"
  ON public.group_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- GROUP MESSAGES
CREATE POLICY "Members can read group messages"
  ON public.group_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM public.users WHERE is_admin = TRUE)
  );

CREATE POLICY "Members can send group messages"
  ON public.group_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_messages.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Sender can delete own group messages"
  ON public.group_messages FOR DELETE
  USING (auth.uid() = sender_id);

-- TYPING STATUS
CREATE POLICY "Users can manage typing status"
  ON public.typing_status FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view typing status"
  ON public.typing_status FOR SELECT USING (TRUE);

-- NOTIFICATIONS
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = TRUE)
    OR auth.uid() = sender_id
  );

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- REALTIME — enable for relevant tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;
