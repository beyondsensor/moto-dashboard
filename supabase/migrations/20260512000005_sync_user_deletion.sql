-- Add missing is_system_admin column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='is_system_admin') THEN
        ALTER TABLE "public"."user_profiles" ADD COLUMN "is_system_admin" boolean DEFAULT false NOT NULL;
    END IF;
END $$;

-- Ensure the foreign key exists with cascade delete
-- Note: This might already exist, but we ensure it's configured correctly.
ALTER TABLE "public"."user_profiles"
DROP CONSTRAINT IF EXISTS user_profiles_id_fkey,
ADD CONSTRAINT user_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create a function to handle user deletion (redundant but safe)
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.user_profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();
