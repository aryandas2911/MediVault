/*
  # Add policy for users table

  1. Security
    - Add policy for users to create their own profile during registration
    - Skip medical records policy as it already exists

  Note: Using IF NOT EXISTS to prevent conflicts with existing policies
*/

-- Users table policies
DO $$ 
BEGIN
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
END $$;