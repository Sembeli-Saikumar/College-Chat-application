-- ============================================================
-- CollegeChat — Supabase Storage Setup
-- Run AFTER 001_schema.sql in SQL Editor
-- ============================================================

-- Create the chat-files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chat-files');

-- Allow public read access (since bucket is public)
CREATE POLICY "Public can view files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'chat-files');

-- Allow users to update/delete their own files
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'chat-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'chat-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
