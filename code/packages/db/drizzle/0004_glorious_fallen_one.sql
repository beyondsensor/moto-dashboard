ALTER TABLE "user_profiles" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "profile" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_mobile" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "contact_email" text;