-- Create app-data bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('app-data', 'app-data', false, 10485760, NULL)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  public = EXCLUDED.public;

-- Policies for app-data bucket
-- Allow authenticated users to see the bucket itself
CREATE POLICY "view_app_data_bucket" ON storage.buckets FOR SELECT TO authenticated
USING (id = 'app-data');

-- SELECT: Authenticated users can read all objects in app-data
CREATE POLICY "select_app_data_objects" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'app-data');

-- INSERT: Authenticated users can upload objects to app-data
CREATE POLICY "upload_app_data_objects" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'app-data');

-- DELETE: Authenticated users can delete objects from app-data
CREATE POLICY "delete_app_data_objects" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'app-data');

-- UPDATE: Authenticated users can update objects in app-data (optional but usually needed for overwrites)
CREATE POLICY "update_app_data_objects" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'app-data');
