-- Story 3.2: Test Data (Sample Data for Development)
-- RUN THIS AFTER CREATING A TEST USER VIA SUPABASE AUTH

-- ============================================================================
-- IMPORTANT: First create a test user via Supabase Dashboard!
-- Authentication → Users → Add User
-- Email: test@ybis.com
-- Password: TestPassword123!
-- ============================================================================

-- Step 1: Get the test user's ID and workspace
-- Replace 'test@ybis.com' with your actual test user email
DO $$
DECLARE
  test_user_id UUID;
  test_workspace_id UUID;
BEGIN
  -- Get test user ID
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'test@ybis.com' 
  LIMIT 1;

  -- Get test user's workspace
  SELECT id INTO test_workspace_id 
  FROM workspaces 
  WHERE owner_id = test_user_id 
  LIMIT 1;

  -- If user or workspace not found, skip
  IF test_user_id IS NULL OR test_workspace_id IS NULL THEN
    RAISE NOTICE 'Test user not found. Please create test@ybis.com first!';
    RETURN;
  END IF;

  -- ============================================================================
  -- SAMPLE NOTES
  -- ============================================================================
  INSERT INTO notes (workspace_id, user_id, title, content, tags, is_favorite) VALUES
    (test_workspace_id, test_user_id, 'Welcome to YBIS', 
     'This is your first note! YBIS helps you organize tasks, notes, and workflows with AI assistance.',
     ARRAY['welcome', 'getting-started'], true),
    
    (test_workspace_id, test_user_id, 'Project Ideas', 
     E'- Build AI-powered productivity app\n- Integrate RAG for smart search\n- Add workflow automation',
     ARRAY['ideas', 'projects'], false),
    
    (test_workspace_id, test_user_id, 'Meeting Notes - Sprint Planning', 
     E'Discussed:\n- Database schema design\n- Auth implementation\n- UI mockups\n\nAction items:\n- Finalize API endpoints\n- Create test suite',
     ARRAY['meetings', 'sprint'], false);

  -- ============================================================================
  -- SAMPLE TASKS
  -- ============================================================================
  INSERT INTO tasks (workspace_id, user_id, title, description, status, priority, due_date, tags) VALUES
    (test_workspace_id, test_user_id, 'Complete AuthPort implementation', 
     'Implement Supabase authentication adapter with email/password support',
     'in_progress', 'high', NOW() + INTERVAL '2 days', ARRAY['development', 'backend']),
    
    (test_workspace_id, test_user_id, 'Review PR #42', 
     'Code review for database schema implementation',
     'todo', 'medium', NOW() + INTERVAL '1 day', ARRAY['review', 'backend']),
    
    (test_workspace_id, test_user_id, 'Update documentation', 
     'Add setup guide for new developers',
     'todo', 'low', NOW() + INTERVAL '5 days', ARRAY['docs']),
    
    (test_workspace_id, test_user_id, 'Fix Widget height bug', 
     'Keyboard interaction causing widget collapse',
     'done', 'urgent', NOW() - INTERVAL '1 day', ARRAY['bug', 'ui']);

  -- ============================================================================
  -- SAMPLE CALENDAR EVENTS (if table exists)
  -- ============================================================================
  INSERT INTO calendar_events (workspace_id, user_id, title, description, start_time, end_time, reminder_minutes) VALUES
    (test_workspace_id, test_user_id, 'Team Standup', 
     'Daily standup meeting',
     (CURRENT_DATE + TIME '09:00')::TIMESTAMPTZ, 
     (CURRENT_DATE + TIME '09:15')::TIMESTAMPTZ, 
     10),
    
    (test_workspace_id, test_user_id, 'Sprint Review', 
     'Review completed stories and demos',
     (CURRENT_DATE + INTERVAL '2 days' + TIME '14:00')::TIMESTAMPTZ,
     (CURRENT_DATE + INTERVAL '2 days' + TIME '15:30')::TIMESTAMPTZ,
     30),
    
    (test_workspace_id, test_user_id, 'Code Review Session', 
     'Review recent pull requests',
     (CURRENT_DATE + INTERVAL '1 day' + TIME '11:00')::TIMESTAMPTZ,
     (CURRENT_DATE + INTERVAL '1 day' + TIME '12:00')::TIMESTAMPTZ,
     15);

  -- ============================================================================
  -- SAMPLE CHAT MESSAGES (if table exists)
  -- ============================================================================
  INSERT INTO chat_messages (workspace_id, user_id, role, content) VALUES
    (test_workspace_id, test_user_id, 'user', 'Hey, can you help me organize my tasks?'),
    (test_workspace_id, test_user_id, 'assistant', 'Of course! I can help you create, prioritize, and manage your tasks. What would you like to work on?'),
    (test_workspace_id, test_user_id, 'user', 'Create a task to finish the database schema'),
    (test_workspace_id, test_user_id, 'assistant', 'Task created: "Finish database schema" with high priority. It''s been added to your task list!');

  -- ============================================================================
  -- SAMPLE FLOW (Morning Routine)
  -- ============================================================================
  INSERT INTO flows (workspace_id, user_id, name, description, template_id, config, is_active) VALUES
    (test_workspace_id, test_user_id, 'My Morning Routine', 
     'Automated morning workflow: review tasks, check calendar, create daily note',
     'morning-routine',
     '{
       "steps": [
         {"id": "get_tasks", "name": "Get Today Tasks", "type": "query"},
         {"id": "get_events", "name": "Get Calendar Events", "type": "query"},
         {"id": "create_note", "name": "Create Daily Note", "type": "action"}
       ],
       "trigger": {"type": "scheduled", "time": "07:00"}
     }'::jsonb,
     true);

  RAISE NOTICE 'Test data inserted successfully!';
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check inserted data
SELECT 'Notes' as table_name, COUNT(*) as count FROM notes
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Calendar Events', COUNT(*) FROM calendar_events
UNION ALL
SELECT 'Chat Messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'Flows', COUNT(*) FROM flows;

-- View sample notes
SELECT id, title, tags, created_at 
FROM notes 
ORDER BY created_at DESC 
LIMIT 5;

-- View sample tasks
SELECT id, title, status, priority, due_date 
FROM tasks 
ORDER BY due_date ASC 
LIMIT 5;

-- View upcoming calendar events (if exists)
SELECT id, title, start_time, end_time 
FROM calendar_events 
WHERE start_time >= NOW() 
ORDER BY start_time ASC 
LIMIT 5;

-- View recent chat messages (if exists)
SELECT role, content, created_at 
FROM chat_messages 
ORDER BY created_at DESC 
LIMIT 10;
