/*
  # Fix Users Table RLS Policy

  1. Changes
    - Update RLS policy for users table to allow new user creation during registration
    - Modify the INSERT policy to properly handle both authenticated and unauthenticated users
    
  2. Security
    - Maintains existing RLS policies for SELECT, UPDATE, and DELETE
    - Ensures users can only create their own profile
*/

DROP POLICY IF EXISTS "Enable profile creation during registration" ON users;

CREATE POLICY "Enable profile creation during registration"
ON users
FOR INSERT
TO public
WITH CHECK (
  -- Allow unauthenticated users during registration
  (auth.role() = 'anon' AND id IN (SELECT id FROM auth.users WHERE id = users.id))
  OR 
  -- Allow authenticated users to create their own profile
  (auth.role() = 'authenticated' AND auth.uid() = id)
);