-- Story 3.2: Fix RLS Performance (Auth Init Plan Optimization)
-- Date: 2025-10-29
-- Issue: auth.uid() re-evaluated for each row (slow at scale)
-- Fix: Wrap auth.uid() in SELECT to evaluate once

-- ============================================================================
-- DROP ALL EXISTING POLICIES
-- ============================================================================

-- Workspaces
DROP POLICY IF EXISTS "Users can read their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can create their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete their own workspaces" ON workspaces;

-- Profiles
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Notes
DROP POLICY IF EXISTS "Users can read notes in their workspace" ON notes;
DROP POLICY IF EXISTS "Users can create notes in their workspace" ON notes;
DROP POLICY IF EXISTS "Users can update their notes" ON notes;
DROP POLICY IF EXISTS "Users can delete their notes" ON notes;

-- Tasks
DROP POLICY IF EXISTS "Users can read tasks in their workspace" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks in their workspace" ON tasks;
DROP POLICY IF EXISTS "Users can update their tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their tasks" ON tasks;

-- Flows
DROP POLICY IF EXISTS "Users can read flows in their workspace" ON flows;
DROP POLICY IF EXISTS "Users can create flows in their workspace" ON flows;
DROP POLICY IF EXISTS "Users can update their flows" ON flows;
DROP POLICY IF EXISTS "Users can delete their flows" ON flows;

-- Flow Executions
DROP POLICY IF EXISTS "Users can read flow executions in their workspace" ON flow_executions;
DROP POLICY IF EXISTS "Users can create flow executions" ON flow_executions;

-- Documents
DROP POLICY IF EXISTS "Users can read documents in their workspace" ON documents;
DROP POLICY IF EXISTS "Users can create documents in their workspace" ON documents;
DROP POLICY IF EXISTS "Users can update their documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their documents" ON documents;

-- Chunks
DROP POLICY IF EXISTS "Users can read chunks in their workspace" ON chunks;

-- Push Tokens
DROP POLICY IF EXISTS "Users can read their own push tokens" ON push_tokens;
DROP POLICY IF EXISTS "Users can create their own push tokens" ON push_tokens;

-- Calendar Events
DROP POLICY IF EXISTS "Users can read calendar events in their workspace" ON calendar_events;
DROP POLICY IF EXISTS "Users can create calendar events in their workspace" ON calendar_events;
DROP POLICY IF EXISTS "Users can update their calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete their calendar events" ON calendar_events;

-- Chat Messages
DROP POLICY IF EXISTS "Users can read chat messages in their workspace" ON chat_messages;
DROP POLICY IF EXISTS "Users can create chat messages in their workspace" ON chat_messages;

-- ============================================================================
-- RECREATE POLICIES WITH PERFORMANCE OPTIMIZATION
-- ============================================================================

-- WORKSPACES (optimized)
CREATE POLICY "Users can read their own workspaces" ON workspaces
  FOR SELECT USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own workspaces" ON workspaces
  FOR INSERT WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own workspaces" ON workspaces
  FOR UPDATE USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own workspaces" ON workspaces
  FOR DELETE USING (owner_id = (SELECT auth.uid()));

-- PROFILES (optimized)
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = (SELECT auth.uid()));

-- NOTES (optimized)
CREATE POLICY "Users can read notes in their workspace" ON notes
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create notes in their workspace" ON notes
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update their notes" ON notes
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their notes" ON notes
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- TASKS (optimized)
CREATE POLICY "Users can read tasks in their workspace" ON tasks
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create tasks in their workspace" ON tasks
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update their tasks" ON tasks
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their tasks" ON tasks
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- FLOWS (optimized)
CREATE POLICY "Users can read flows in their workspace" ON flows
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create flows in their workspace" ON flows
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update their flows" ON flows
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their flows" ON flows
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- FLOW EXECUTIONS (optimized)
CREATE POLICY "Users can read flow executions in their workspace" ON flow_executions
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create flow executions" ON flow_executions
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

-- DOCUMENTS (optimized)
CREATE POLICY "Users can read documents in their workspace" ON documents
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create documents in their workspace" ON documents
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update their documents" ON documents
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their documents" ON documents
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- CHUNKS (optimized)
CREATE POLICY "Users can read chunks in their workspace" ON chunks
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

-- PUSH TOKENS (optimized)
CREATE POLICY "Users can read their own push tokens" ON push_tokens
  FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create their own push tokens" ON push_tokens
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- CALENDAR EVENTS (optimized)
CREATE POLICY "Users can read calendar events in their workspace" ON calendar_events
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create calendar events in their workspace" ON calendar_events
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can update their calendar events" ON calendar_events
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their calendar events" ON calendar_events
  FOR DELETE USING (user_id = (SELECT auth.uid()));

-- CHAT MESSAGES (optimized)
CREATE POLICY "Users can read chat messages in their workspace" ON chat_messages
  FOR SELECT USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid())
  ));

CREATE POLICY "Users can create chat messages in their workspace" ON chat_messages
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = (SELECT auth.uid()))
    AND user_id = (SELECT auth.uid())
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- This should show NO warnings for auth_rls_initplan after running
SELECT 'RLS Performance optimization complete!' as status;
