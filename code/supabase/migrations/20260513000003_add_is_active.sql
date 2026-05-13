-- Add is_active column to organizations table
ALTER TABLE "organizations" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
