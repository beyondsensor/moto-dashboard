-- Create user_profiles table
CREATE TABLE "public"."user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL REFERENCES "auth"."users"("id") ON DELETE cascade,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"display_name" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Organizations
CREATE TABLE "public"."organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);

-- Organization Members
CREATE TABLE "public"."organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL REFERENCES "public"."organizations"("id") ON DELETE cascade,
	"user_id" uuid NOT NULL REFERENCES "public"."user_profiles"("id") ON DELETE cascade,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Sites
CREATE TABLE "public"."sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL REFERENCES "public"."organizations"("id") ON DELETE cascade,
	"name" text NOT NULL,
	"code" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"map_image_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Site Contacts
CREATE TABLE "public"."site_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL REFERENCES "public"."sites"("id") ON DELETE cascade,
	"name" text NOT NULL,
	"email" text,
	"phone_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Buildings
CREATE TABLE "public"."buildings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL REFERENCES "public"."sites"("id") ON DELETE cascade,
	"name" text NOT NULL,
	"description" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Floors
CREATE TABLE "public"."floors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_id" uuid NOT NULL REFERENCES "public"."buildings"("id") ON DELETE cascade,
	"name" text NOT NULL,
	"level_number" integer,
	"order_index" integer DEFAULT 0 NOT NULL,
	"floor_plan_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Zones
CREATE TABLE "public"."zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"floor_id" uuid NOT NULL REFERENCES "public"."floors"("id") ON DELETE cascade,
	"name" text NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Site Members
CREATE TABLE "public"."site_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL REFERENCES "public"."sites"("id") ON DELETE cascade,
	"user_id" uuid NOT NULL REFERENCES "public"."user_profiles"("id") ON DELETE cascade,
	"role" text DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- SOPs
CREATE TABLE "public"."sops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL REFERENCES "public"."sites"("id") ON DELETE cascade,
	"title" text NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
