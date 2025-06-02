/*
  # Fix RLS policies for users and medical records tables

  1. Changes
    - Add INSERT policy for users table to allow authenticated users to create their own profile
    - Add INSERT policy for medical records table to allow authenticated users to create their own records
  
  2. Security
    - Users can only create their own profile (id matches auth.uid())
    - Users can only create medical records for themselves (user_id matches auth.uid())
*/

-- Users table policies
CREATE POLICY "Users can create own profile"
  ON public.users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Medical records table policies
CREATE POLICY "Users can create own medical records"
  ON public.medical_records
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);