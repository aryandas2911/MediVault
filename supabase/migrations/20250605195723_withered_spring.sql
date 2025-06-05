/*
  # Add policies for users and medical records

  1. Security
    - Add policy for users to create their own profile
    - Add policy for users to create their own medical records

  Note: Using IF NOT EXISTS to prevent conflicts with existing policies
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