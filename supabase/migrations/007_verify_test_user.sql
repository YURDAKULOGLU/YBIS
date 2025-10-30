-- Quick Test User Setup
-- Run this to create a test user for development

-- Create test user via Supabase Auth
-- This is a SQL helper to verify the trigger works

DO $$
DECLARE
  test_user_id UUID;
  test_workspace_id UUID;
BEGIN
  -- Check if test user already exists
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'test@ybis.com' 
  LIMIT 1;

  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE 'Test user already exists: %', test_user_id;
    
    -- Get workspace
    SELECT id INTO test_workspace_id 
    FROM workspaces 
    WHERE owner_id = test_user_id 
    LIMIT 1;
    
    RAISE NOTICE 'Workspace ID: %', test_workspace_id;
  ELSE
    RAISE NOTICE 'Test user does not exist. Please create via Dashboard or Auth API';
    RAISE NOTICE 'Email: test@ybis.com';
    RAISE NOTICE 'Password: TestPassword123!';
  END IF;
END $$;

-- Quick check: Show all users and their workspaces
SELECT 
  u.email,
  u.id as user_id,
  w.id as workspace_id,
  w.name as workspace_name,
  u.created_at
FROM auth.users u
LEFT JOIN workspaces w ON w.owner_id = u.id
ORDER BY u.created_at DESC;
