-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text not null,
  date_of_birth date,
  blood_group text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create medical records table
create type medical_record_type as enum ('prescription', 'allergy', 'condition', 'report');

create table public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  type medical_record_type not null,
  description text,
  hospital_name text,
  doctor_name text,
  consultation_date date,
  is_emergency boolean default false,
  file_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.medical_records enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can view own medical records"
  on public.medical_records for select
  using (auth.uid() = user_id);

create policy "Users can create own medical records"
  on public.medical_records for insert
  with check (auth.uid() = user_id);

create policy "Users can update own medical records"
  on public.medical_records for update
  using (auth.uid() = user_id);

create policy "Users can delete own medical records"
  on public.medical_records for delete
  using (auth.uid() = user_id);

-- Create storage bucket for medical files
insert into storage.buckets (id, name, public) 
values ('medical_files', 'medical_files', false);

-- Set up storage policies
create policy "Users can upload own files"
  on storage.objects for insert
  with check (bucket_id = 'medical_files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view own files"
  on storage.objects for select
  using (bucket_id = 'medical_files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update own files"
  on storage.objects for update
  using (bucket_id = 'medical_files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own files"
  on storage.objects for delete
  using (bucket_id = 'medical_files' and auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function handle_updated_at();

create trigger handle_medical_records_updated_at
  before update on public.medical_records
  for each row
  execute function handle_updated_at();