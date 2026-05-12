CREATE TYPE "public"."org_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."site_role" AS ENUM('manager', 'editor', 'viewer');--> statement-breakpoint
ALTER TABLE "organization_members" ALTER COLUMN "role" SET DATA TYPE org_role;--> statement-breakpoint
ALTER TABLE "site_members" ALTER COLUMN "role" SET DATA TYPE site_role;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "is_system_admin" boolean DEFAULT false NOT NULL;