/*
  # Fix medical records RLS policies

  1. New Tables
    - No new tables created

  2. Security
    - Fix RLS policies for medical_records table
    - Ensure users can create, read, update, and delete their own medical records
    - Add missing INSERT policy that may be causing the issue

  3. Changes
    - Drop existing policies if they exist
    - Recreate all necessary policies for medical_records table
    - Ensure proper RLS enforcement
*/

-- Drop existing policies for medical_records if they exist
DROP POLICY IF EXISTS "Users can view own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can create own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can update own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Users can delete own medical records" ON public.medical_records;

-- Recreate all necessary policies for medical_records table
CREATE POLICY "Users can view own medical records"
  ON public.medical_records
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own medical records"
  ON public.medical_records
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical records"
  ON public.medical_records
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical records"
  ON public.medical_records
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled on medical_records table
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;