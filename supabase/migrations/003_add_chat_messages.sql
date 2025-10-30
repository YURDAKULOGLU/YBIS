-- Story 3.2 ADDITION: Chat Messages Table
-- Built-in chat history storage

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tool_calls JSONB, -- Array of tool calls made by AI
  tool_results JSONB, -- Results of tool executions
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_messages_workspace_id ON chat_messages(workspace_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Full-text search on messages
CREATE INDEX idx_chat_messages_search ON chat_messages 
  USING GIN(to_tsvector('english', content));

-- RLS Policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read chat messages in their workspace"
  ON chat_messages FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can create chat messages in their workspace"
  ON chat_messages FOR INSERT
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
    AND user_id = auth.uid()
  );

-- Helper function: Get recent chat history
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
  FROM chat_messages m
  WHERE m.workspace_id = p_workspace_id
  ORDER BY m.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
