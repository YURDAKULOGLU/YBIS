-- Story 3.2: Fix Supabase Linter Security Warnings
-- Date: 2025-10-29

-- ============================================================================
-- FIX 1: Function Search Path Security
-- ============================================================================

-- Fix: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = '';

-- Fix: create_user_workspace
CREATE OR REPLACE FUNCTION create_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  INSERT INTO public.workspaces (name, owner_id) 
  VALUES ('My Workspace', NEW.id) 
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.profiles (id, email, default_workspace_id) 
  VALUES (NEW.id, NEW.email, new_workspace_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = '';

-- Fix: get_upcoming_events
CREATE OR REPLACE FUNCTION get_upcoming_events(
  p_workspace_id UUID,
  p_days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  is_all_day BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.start_time,
    e.end_time,
    e.is_all_day
  FROM public.calendar_events e
  WHERE 
    e.workspace_id = p_workspace_id
    AND e.start_time >= NOW()
    AND e.start_time <= NOW() + (p_days_ahead || ' days')::INTERVAL
  ORDER BY e.start_time ASC;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = '';

-- Fix: get_recent_messages
CREATE OR REPLACE FUNCTION get_recent_messages(
  p_workspace_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.role,
    m.content,
    m.created_at
  FROM public.chat_messages m
  WHERE m.workspace_id = p_workspace_id
  ORDER BY m.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = '';

-- ============================================================================
-- FIX 2: Move pgvector to extensions schema
-- ============================================================================

-- Create extensions schema if not exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move vector extension (if it exists in public)
DO $$
BEGIN
  -- Check if vector is in public schema
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'vector' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Drop from public
    DROP EXTENSION IF EXISTS vector CASCADE;
    
    -- Recreate in extensions schema
    CREATE EXTENSION IF NOT EXISTS vector SCHEMA extensions;
    
    -- Update search path to include extensions
    ALTER DATABASE postgres SET search_path TO public, extensions;
    
    RAISE NOTICE 'Moved vector extension to extensions schema';
  ELSE
    RAISE NOTICE 'Vector extension already in correct schema or not found';
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check functions have search_path set
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  CASE 
    WHEN proconfig IS NOT NULL AND array_to_string(proconfig, ',') LIKE '%search_path%'
    THEN '✅ Fixed'
    ELSE '❌ Still vulnerable'
  END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'update_updated_at_column',
    'create_user_workspace',
    'get_upcoming_events',
    'get_recent_messages'
  );

-- Check extension location
SELECT 
  e.extname,
  n.nspname as schema,
  CASE 
    WHEN n.nspname = 'extensions' THEN '✅ Correct'
    WHEN n.nspname = 'public' THEN '⚠️ Should be in extensions'
    ELSE '❓ Unknown'
  END as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';
