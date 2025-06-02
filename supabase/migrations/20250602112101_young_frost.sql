-- Users table policies
CREATE POLICY "Users can create own profile"
  ON public.users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);