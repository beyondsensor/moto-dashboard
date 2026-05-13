-- Fix infinite recursion in RLS policies

-- 1. Organizations
DROP POLICY IF EXISTS "org_select" ON "public"."organizations";
CREATE POLICY "org_select" ON "public"."organizations" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role(id) IS NOT NULL);

-- 2. Organization Members
DROP POLICY IF EXISTS "org_members_select" ON "public"."organization_members";
CREATE POLICY "org_members_select" ON "public"."organization_members" FOR SELECT TO authenticated 
USING (is_system_admin() OR (user_id = auth.uid()) OR get_org_role(organization_id) IS NOT NULL);

-- 3. Sites
DROP POLICY IF EXISTS "sites_select" ON "public"."sites";
CREATE POLICY "sites_select" ON "public"."sites" FOR SELECT TO authenticated 
USING (is_system_admin() OR get_org_role(organization_id) IS NOT NULL);
