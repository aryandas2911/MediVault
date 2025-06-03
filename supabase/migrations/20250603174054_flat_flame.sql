/*
  # Fix Users Table RLS Policies

  1. Changes
    - Update the RLS policy for user profile creation to handle both registration and authenticated users
    - Policy allows:
      - New users to create their profile during registration
      - Authenticated users to create their own profile
      - Profile creation only when user ID matches auth.uid()

  2. Security
    - Maintains strict RLS enforcement
    - Ensures users can only create their own profile
    - Prevents unauthorized profile creation
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable profile creation during registration" ON users;

-- Create new INSERT policy with proper conditions
CREATE POLICY "Enable profile creation during registration and auth" ON users
  FOR INSERT 
  TO public
  WITH CHECK (
    -- Allow during registration (anon role) when id matches auth.users
    (
      auth.role() = 'anon' 
      AND 
      id IN (SELECT id FROM auth.users WHERE id = auth.uid())
    )
    OR
    -- Allow authenticated users to create their own profile
    (
      auth.role() = 'authenticated' 
      AND 
      auth.uid() = id
    )
  );