-- Story 3.2 ADDITION: Calendar Events Table
-- Built-in calendar for YBIS (no Google sync for now)

-- CALENDAR EVENTS
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_all_day BOOLEAN DEFAULT FALSE,
  reminder_minutes INTEGER, -- Minutes before event to send reminder
  recurrence_rule TEXT, -- iCal RRULE format (for recurring events)
  color TEXT, -- Hex color for UI
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_calendar_events_workspace_id ON calendar_events(workspace_id);
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);

-- Index for date range queries (most common)
CREATE INDEX idx_calendar_events_time_range ON calendar_events(start_time, end_time);

-- RLS Policies
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read calendar events in their workspace"
  ON calendar_events FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can create calendar events in their workspace"
  ON calendar_events FOR INSERT
  WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update their calendar events"
  ON calendar_events FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their calendar events"
  ON calendar_events FOR DELETE
  USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_calendar_events_updated_at 
  BEFORE UPDATE ON calendar_events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function: Get upcoming events
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
  FROM calendar_events e
  WHERE 
    e.workspace_id = p_workspace_id
    AND e.start_time >= NOW()
    AND e.start_time <= NOW() + (p_days_ahead || ' days')::INTERVAL
  ORDER BY e.start_time ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
