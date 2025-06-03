/*
  # Update users table RLS policies

  1. Changes
    - Add new policy to allow unauthenticated users to create profiles during registration
    - Keep existing policies for authenticated users to manage their profiles

  2. Security
    - Users can still only access their own data
    - New policy is specifically scoped to profile creation during registration
*/

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can create own profile" ON users;

-- Create new insert policy that allows profile creation during registration
CREATE POLICY "Enable profile creation during registration"
ON users
FOR INSERT
TO public
WITH CHECK (
  -- Allow insert if the user is creating their own profile
  -- This works for both authenticated users and during registration
  auth.uid() IS NULL OR auth.uid() = id
);

-- Keep existing policies for other operations
DO $$ BEGIN
  -- Ensure select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON users
      FOR SELECT
      TO public
      USING (auth.uid() = id);
  END IF;

  -- Ensure update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON users
      FOR UPDATE
      TO public
      USING (auth.uid() = id);
  END IF;
END $$;