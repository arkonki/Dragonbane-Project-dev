-- Drop existing policies on roles table
DROP POLICY IF EXISTS "Roles visible to all authenticated users" ON public.roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.roles;

-- Create new RLS policies for roles table
CREATE POLICY "Roles visible to all authenticated users"
  ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify roles"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update the get_user_role function
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role user_role;
BEGIN
  SELECT r.name INTO user_role
  FROM users u
  JOIN user_roles ur ON u.id = ur.user_id
  JOIN roles r ON ur.role_id = r.id
  WHERE u.id = user_id;

  IF NOT FOUND THEN
    RAISE WARNING 'User with ID % not found in public.users or no role assigned', user_id;
    RETURN NULL; -- Return NULL when no user or role is found
  END IF;

  RETURN user_role;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in get_user_role: %', SQLERRM;
    RETURN NULL; -- Return NULL on error
END;
$$;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user_' || substr(md5(NEW.email || clock_timestamp()::text), 1, 8)
    ),
    CASE
      WHEN NEW.email = 'arvi@maantoa.ee' THEN 'admin'::user_role -- Cast to user_role type
      ELSE 'player'::user_role -- Cast to user_role type
    END
  )
  ON CONFLICT (email) DO UPDATE
  SET 
    id = EXCLUDED.id,
    username = COALESCE(users.username, EXCLUDED.username),
    role = CASE 
      WHEN EXCLUDED.email = 'arvi@maantoa.ee' THEN 'admin'::user_role -- Cast to user_role type
      ELSE users.role
    END
  WHERE users.email = EXCLUDED.email;

  -- Assign the default role to the new user in user_roles
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (
    NEW.id,
    (SELECT id FROM public.roles WHERE name = 'player')
  )
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure the admin user exists with a unique username
DO $$
BEGIN
  INSERT INTO public.users (id, email, username, role)
  VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@example.com',
    'SystemAdmin',
    'admin'
  )
  ON CONFLICT (email) DO UPDATE
  SET 
    id = EXCLUDED.id,
    username = 'SystemAdmin',
    role = 'admin'
  WHERE users.email = 'admin@example.com';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error ensuring admin user exists: %', SQLERRM;
END;
$$;

-- Update the password for arvi@maantoa.ee
UPDATE auth.users
SET encrypted_password = crypt('Admin1234567890', gen_salt('bf', 10))
WHERE email = 'arvi@maantoa.ee';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
