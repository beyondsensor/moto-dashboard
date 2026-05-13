-- Add new fields to organizations table
ALTER TABLE "organizations" ADD COLUMN "address" text;
ALTER TABLE "organizations" ADD COLUMN "profile" text;
ALTER TABLE "organizations" ADD COLUMN "website" text;
ALTER TABLE "organizations" ADD COLUMN "contact_name" text;
ALTER TABLE "organizations" ADD COLUMN "contact_mobile" text;
ALTER TABLE "organizations" ADD COLUMN "contact_email" text;
