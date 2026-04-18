-- MIU Football Tournament System - Storage Buckets
-- Run this in Supabase SQL Editor after other migrations
-- Note: You may also create these via the Supabase Dashboard UI

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('tournament-banners', 'tournament-banners', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tournament-banners bucket
-- Public can read
CREATE POLICY "tournament_banners_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'tournament-banners');

-- Only admins can upload/update/delete
CREATE POLICY "tournament_banners_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tournament-banners' 
    AND (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
  );

CREATE POLICY "tournament_banners_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'tournament-banners' 
    AND (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
  );

CREATE POLICY "tournament_banners_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'tournament-banners' 
    AND (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
  );

-- Storage policies for team-logos bucket
-- Public can read
CREATE POLICY "team_logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-logos');

-- Team owners can upload their logos (path should be team_id/filename)
CREATE POLICY "team_logos_owner_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'team-logos'
    AND (
      (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
      OR EXISTS (
        SELECT 1 FROM teams 
        WHERE teams.user_id = auth.uid() 
        AND teams.id::text = (storage.foldername(name))[1]
      )
    )
  );

CREATE POLICY "team_logos_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'team-logos'
    AND (
      (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
      OR EXISTS (
        SELECT 1 FROM teams 
        WHERE teams.user_id = auth.uid() 
        AND teams.id::text = (storage.foldername(name))[1]
      )
    )
  );

CREATE POLICY "team_logos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'team-logos'
    AND (
      (SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role') = 'admin'
      OR EXISTS (
        SELECT 1 FROM teams 
        WHERE teams.user_id = auth.uid() 
        AND teams.id::text = (storage.foldername(name))[1]
      )
    )
  );
