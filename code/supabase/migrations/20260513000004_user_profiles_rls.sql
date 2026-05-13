-- User Profiles RLS Policies

-- Drop any existing policies on user_profiles
DROP POLICY IF EXISTS "authenticated_all" ON "public"."user_profiles";
DROP POLICY IF EXISTS "user_profiles_select" ON "public"."user_profiles";
DROP POLICY IF EXISTS "user_profiles_admin_all" ON "public"."user_profiles";

-- 1. SELECT: System admins can see all, other authenticated users can also see all (for now)
CREATE POLICY "user_profiles_select" ON "public"."user_profiles"
FOR SELECT TO authenticated
USING (true);

-- 2. ALL (INSERT, UPDATE, DELETE): Only system admins can perform these actions
CREATE POLICY "user_profiles_admin_all" ON "public"."user_profiles"
FOR ALL TO authenticated
USING (is_system_admin())
WITH CHECK (is_system_admin());

-- 3. Exception: Users can update their own profile (Optional but common, though not explicitly requested)
-- The user said "Other users can only Select (For now)", so I will strictly follow that.
-- If they want users to update their own profiles later, we can add it.
