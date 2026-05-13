-- Storage Policies for Organization Buckets

-- Helper to extract org_id from bucket name 'org-[uuid]'
CREATE OR REPLACE FUNCTION public.get_org_id_from_bucket(bucket_id text)
RETURNS uuid AS $$
BEGIN
  IF bucket_id LIKE 'org-%' THEN
    BEGIN
      RETURN (substring(bucket_id from 5))::uuid;
    EXCEPTION WHEN OTHERS THEN
      RETURN NULL;
    END;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Allow authenticated users to see their organization's bucket
CREATE POLICY "organization_buckets_select" ON storage.buckets FOR SELECT TO authenticated
USING (
  public.is_system_admin() OR (
    id LIKE 'org-%' AND 
    public.get_org_role(public.get_org_id_from_bucket(id)) IS NOT NULL
  )
);

-- Access to objects within organization buckets
CREATE POLICY "organization_objects_access" ON storage.objects FOR ALL TO authenticated
USING (
  public.is_system_admin() OR (
    bucket_id LIKE 'org-%' AND 
    public.get_org_role(public.get_org_id_from_bucket(bucket_id)) IS NOT NULL
  )
)
WITH CHECK (
  public.is_system_admin() OR (
    bucket_id LIKE 'org-%' AND 
    public.get_org_role(public.get_org_id_from_bucket(bucket_id)) IN ('owner', 'admin')
  )
);
