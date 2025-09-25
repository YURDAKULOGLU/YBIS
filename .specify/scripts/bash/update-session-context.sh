#!/usr/bin/env bash

# Update session context with new information
# Called by other scripts to maintain session continuity

set -e
set -u
set -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

eval $(get_feature_paths)

ACTION="${1:-}"
DESCRIPTION="${2:-}"

update_session_context() {
    local action="$1"
    local description="$2"
    local session_file="$REPO_ROOT/.specify/memory/session-context.md"
    
    if [[ ! -f "$session_file" ]]; then
        echo "WARNING: Session context file not found at $session_file"
        return 1
    fi
    
    local current_date=$(date +%Y-%m-%d)
    local current_branch=$(get_current_branch)
    
    # Update last updated timestamp
    sed -i.bak "s/\*\*Last updated\*\*:.*/\*\*Last updated\*\*: $current_date/" "$session_file"
    
    # Update current feature if changed
    sed -i.bak "s/\*\*Current feature\*\*:.*/\*\*Current feature\*\*: $current_branch/" "$session_file"
    
    case "$action" in
        "decision")
            # Add new decision to log
            local decision_entry="### $current_date - $description\n**Branch**: $current_branch\n**Problem**: \n**Decision**: \n**Rationale**: \n**Impact**: \n**Trade-offs**: \n**Quality Check**: \n"
            
            # Insert after "## Recent Decisions Log" line
            sed -i.bak "/## Recent Decisions Log/a\\
$decision_entry" "$session_file"
            ;;
        "focus")
            # Update current session focus
            sed -i.bak "/\*\*Working On\*\*:/s/.*/\*\*Working On\*\*: $description/" "$session_file"
            ;;
        "phase")
            # Update current session phase
            sed -i.bak "/\*\*Session phase\*\*:/s/.*/\*\*Session phase\*\*: $description/" "$session_file"
            ;;
        *)
            echo "Usage: $0 [decision|focus|phase] [description]"
            return 1
            ;;
    esac
    
    # Clean up backup file
    rm -f "$session_file.bak"
    
    echo "Updated session context: $action - $description"
}

if [[ -n "$ACTION" && -n "$DESCRIPTION" ]]; then
    update_session_context "$ACTION" "$DESCRIPTION"
else
    echo "Usage: $0 [decision|focus|phase] [description]"
    exit 1
fi