-- Drop old simple policies
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "authenticated_all" ON public.%I', t);
    END LOOP;
END $$;

-- RBAC Policies

-- 1. Organizations
CREATE POLICY "org_select" ON "public"."organizations" FOR SELECT TO authenticated 
USING (is_system_admin() OR EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = id AND om.user_id = auth.uid()));

CREATE POLICY "org_modify" ON "public"."organizations" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role(id) IN ('owner', 'admin'));

-- 2. Organization Members
CREATE POLICY "org_members_select" ON "public"."organization_members" FOR SELECT TO authenticated 
USING (is_system_admin() OR EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = organization_id AND om.user_id = auth.uid()));

CREATE POLICY "org_members_modify" ON "public"."organization_members" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role(organization_id) IN ('owner', 'admin'));

-- 3. Sites
CREATE POLICY "sites_select" ON "public"."sites" FOR SELECT TO authenticated 
USING (is_system_admin() OR EXISTS (SELECT 1 FROM organization_members om WHERE om.organization_id = organization_id AND om.user_id = auth.uid()));

CREATE POLICY "sites_modify" ON "public"."sites" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role(organization_id) IN ('owner', 'admin'));

-- 4. Site Members
CREATE POLICY "site_members_select" ON "public"."site_members" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IS NOT NULL);

CREATE POLICY "site_members_modify" ON "public"."site_members" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IN ('owner', 'admin') OR get_site_role(site_id) = 'manager');

-- 5. Site Contacts, Buildings, SOPs (linked directly to site_id)
-- Contacts
CREATE POLICY "site_contacts_select" ON "public"."site_contacts" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IS NOT NULL);

CREATE POLICY "site_contacts_modify" ON "public"."site_contacts" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IN ('owner', 'admin') OR get_site_role(site_id) = 'manager');

-- Buildings
CREATE POLICY "buildings_select" ON "public"."buildings" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IS NOT NULL);

CREATE POLICY "buildings_modify" ON "public"."buildings" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IN ('owner', 'admin') OR get_site_role(site_id) = 'manager');

-- SOPs
CREATE POLICY "sops_select" ON "public"."sops" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IS NOT NULL);

CREATE POLICY "sops_modify" ON "public"."sops" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT organization_id FROM sites WHERE id = site_id)) IN ('owner', 'admin') OR get_site_role(site_id) = 'manager' OR get_site_role(site_id) = 'editor');

-- 6. Floors, Zones (linked to building/floor)
-- Floors
CREATE POLICY "floors_select" ON "public"."floors" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT s.organization_id FROM sites s JOIN buildings b ON b.site_id = s.id WHERE b.id = building_id)) IS NOT NULL);

CREATE POLICY "floors_modify" ON "public"."floors" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT s.organization_id FROM sites s JOIN buildings b ON b.site_id = s.id WHERE b.id = building_id)) IN ('owner', 'admin') OR get_site_role((SELECT site_id FROM buildings WHERE id = building_id)) = 'manager');

-- 7. Assets
CREATE POLICY "assets_select" ON "public"."assets" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT s.organization_id FROM sites s JOIN buildings b ON b.site_id = s.id WHERE b.id = building_id)) IS NOT NULL);

CREATE POLICY "assets_modify" ON "public"."assets" FOR ALL TO authenticated 
USING (is_system_admin() OR get_org_role((SELECT s.organization_id FROM sites s JOIN buildings b ON b.site_id = s.id WHERE b.id = building_id)) IN ('owner', 'admin') OR get_site_role((SELECT site_id FROM buildings WHERE id = building_id)) = 'manager');
