/*
  # Fix user profiles RLS policy for registration

  1. Security Changes
    - Add INSERT policy for user_profiles table to allow authenticated users to create their own profile
    - This fixes the registration flow where new users need to create their profile entry
    - The policy ensures users can only insert rows where the id matches their auth.uid()

  2. Policy Details
    - Name: "Allow authenticated users to insert their own profile"
    - Target: authenticated users
    - Operation: INSERT only
    - Check: id = auth.uid() (ensures users can only create their own profile)
*/

-- Add INSERT policy for user_profiles table
CREATE POLICY "Allow authenticated users to insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());