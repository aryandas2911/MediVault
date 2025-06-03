/*
  # Create user profiles table
  
  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `phone_number` (text)
      - `blood_group` (text)
      - `address` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to manage their own profile
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text,
  date_of_birth date,
  gender text,
  phone_number text,
  blood_group text,
  address text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own profile
CREATE POLICY "Allow users to manage their own profile"
  ON user_profiles
  FOR ALL
  USING (auth.uid() = id);

-- Add comment to table
COMMENT ON TABLE user_profiles IS 'Stores extended profile information for MediVault users';