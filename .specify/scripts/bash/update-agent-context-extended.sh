# Add session context integration to existing update function
update_agent_file_with_session_context() {
    local target_file="$1"
    local agent_name="$2"
    
    # Call existing update_agent_file function
    update_agent_file "$target_file" "$agent_name"
    
    # Add session context integration
    local session_context="$REPO_ROOT/.specify/memory/session-context.md"
    if [[ -f "$session_context" ]]; then
        # Extract current session focus for agent context
        local current_focus=$(grep -A 5 "## Current Session Focus" "$session_context" | tail -n +2 | head -n 3)
        local recent_decisions=$(grep -A 10 "## Recent Decisions Log" "$session_context" | tail -n +2 | head -n 5)
        
        # Add session context section to agent file
        if ! grep -q "## Current Session Context" "$target_file"; then
            cat >> "$target_file" << EOF

## Current Session Context

### Active Work
$current_focus

### Recent Architectural Decisions
$recent_decisions

**Note**: For full context, see .specify/memory/session-context.md
Use /session-start command to load complete development context.

EOF
        fi
    fi
}