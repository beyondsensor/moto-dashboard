-- Enable RLS on all tables
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organization_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."site_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."site_contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."buildings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."floors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."zones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."sops" ENABLE ROW LEVEL SECURITY;

-- Simple Policies: Allow all actions for authenticated users
-- user_profiles
CREATE POLICY "authenticated_all" ON "public"."user_profiles" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- organizations
CREATE POLICY "authenticated_all" ON "public"."organizations" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- organization_members
CREATE POLICY "authenticated_all" ON "public"."organization_members" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- sites
CREATE POLICY "authenticated_all" ON "public"."sites" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- site_members
CREATE POLICY "authenticated_all" ON "public"."site_members" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- site_contacts
CREATE POLICY "authenticated_all" ON "public"."site_contacts" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- buildings
CREATE POLICY "authenticated_all" ON "public"."buildings" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- floors
CREATE POLICY "authenticated_all" ON "public"."floors" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- zones
CREATE POLICY "authenticated_all" ON "public"."zones" FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- sops
CREATE POLICY "authenticated_all" ON "public"."sops" FOR ALL TO authenticated USING (true) WITH CHECK (true);
