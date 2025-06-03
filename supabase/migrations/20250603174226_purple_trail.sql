/*
  # Update users table RLS policies

  1. Changes
    - Modify INSERT policy to allow both anon and authenticated roles
    - Simplify policy conditions for better clarity
    - Ensure proper user registration flow

  2. Security
    - Maintains RLS protection while allowing necessary operations
    - Ensures users can only access their own data
    - Allows new user registration through auth flow
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Enable profile creation during registration and auth" ON public.users;

-- Create new INSERT policy with proper conditions
CREATE POLICY "Enable profile creation during registration" ON public.users
FOR INSERT TO public
WITH CHECK (
  -- Allow insert during registration (auth.uid() will match the id)
  auth.uid() = id
);

-- Note: Keeping existing SELECT and UPDATE policies as they are correct