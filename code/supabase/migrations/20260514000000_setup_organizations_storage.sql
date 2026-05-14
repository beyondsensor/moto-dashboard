-- Add image fields to buildings
ALTER TABLE "public"."buildings" 
ADD COLUMN IF NOT EXISTS "exterior_image_url" text,
ADD COLUMN IF NOT EXISTS "site_plan_url" text;
