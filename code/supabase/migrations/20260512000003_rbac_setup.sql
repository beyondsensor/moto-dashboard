-- RBAC Roles Setup
CREATE TYPE "public"."org_role" AS ENUM('owner', 'admin', 'member');
CREATE TYPE "public"."site_role" AS ENUM('manager', 'editor', 'viewer');

-- Update columns to use enums
ALTER TABLE "public"."organization_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."organization_members" ALTER COLUMN "role" SET DATA TYPE "public"."org_role" USING "role"::"public"."org_role";
ALTER TABLE "public"."organization_members" ALTER COLUMN "role" SET DEFAULT 'member';

ALTER TABLE "public"."site_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."site_members" ALTER COLUMN "role" SET DATA TYPE "public"."site_role" USING "role"::"public"."site_role";
ALTER TABLE "public"."site_members" ALTER COLUMN "role" SET DEFAULT 'viewer';

ALTER TABLE "public"."user_profiles" ADD COLUMN "is_system_admin" boolean DEFAULT false NOT NULL;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS boolean AS $$
  SELECT COALESCE(is_system_admin, false)
  FROM public.user_profiles
  WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_org_role(p_org_id uuid)
RETURNS public.org_role AS $$
  SELECT role
  FROM public.organization_members
  WHERE organization_id = p_org_id AND user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_site_role(p_site_id uuid)
RETURNS public.site_role AS $$
  SELECT role
  FROM public.site_members
  WHERE site_id = p_site_id AND user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;
