/*
  # Fix duplicate policy creation

  1. Changes
    - Add existence checks before creating policies
    - Ensure policies are only created if they don't exist
  
  2. Policies Added
    - Users can create own profile
    - Users can create own medical records
*/

DO $$ 
BEGIN
  -- Users table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON public.users
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Medical records table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'medical_records' 
    AND policyname = 'Users can create own medical records'
  ) THEN
    CREATE POLICY "Users can create own medical records"
      ON public.medical_records
      FOR INSERT
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;