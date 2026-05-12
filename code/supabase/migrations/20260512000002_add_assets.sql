-- Create asset_status enum
CREATE TYPE "public"."asset_status" AS ENUM('active', 'maintenance', 'inactive', 'faulty');

-- Create assets table
CREATE TABLE "public"."assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" uuid REFERENCES "public"."buildings"("id") ON DELETE set null,
	"floor_id" uuid REFERENCES "public"."floors"("id") ON DELETE set null,
	"zone_id" uuid REFERENCES "public"."zones"("id") ON DELETE set null,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" "public"."asset_status" DEFAULT 'active' NOT NULL,
	"serial_number" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."assets" ENABLE ROW LEVEL SECURITY;

-- Basic Policy: Allow all actions for authenticated users
CREATE POLICY "authenticated_all" ON "public"."assets" FOR ALL TO authenticated USING (true) WITH CHECK (true);
