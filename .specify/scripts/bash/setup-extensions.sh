#!/usr/bin/env bash

# Setup Extended Spec-Kit with session memory and quality standards
# Integrates with existing Spec-Kit infrastructure

set -e
set -u 
set -o pipefail

# Load common functions from existing infrastructure
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get repository root from existing common functions
eval $(get_feature_paths)

log_info() {
    echo "INFO: $1"
}

log_success() {
    echo "✓ $1"
}

log_error() {
    echo "ERROR: $1" >&2
}

main() {
    log_info "Setting up Extended Spec-Kit with session memory and quality standards..."
    
    # Create memory directory structure
    mkdir -p "$REPO_ROOT/.specify/memory"
    mkdir -p "$REPO_ROOT/.specify/quality"
    mkdir -p "$REPO_ROOT/.specify/templates/commands"
    
    # Initialize session context if it doesn't exist
    SESSION_CONTEXT="$REPO_ROOT/.specify/memory/session-context.md"
    if [[ ! -f "$SESSION_CONTEXT" ]]; then
        current_date=$(date +%Y-%m-%d)
        current_branch=$(get_current_branch)
        
        cat > "$SESSION_CONTEXT" << EOF
# Session Context & Memory

**Last updated**: $current_date
**Current feature**: $current_branch
**Session phase**: specify

## Current Session Focus

**Working On**: Extended Spec-Kit setup
**Priority**: High
**Technical Context**: Initializing session memory and quality standards
**Blockers**: None

### AI Agent Assignments
- **Primary**: Claude - Setup and configuration
- **Secondary**: TBD - Based on future work
- **Review**: TBD - Based on future work

### Files in Focus
- .specify/memory/session-context.md
- .specify/templates/commands/

---

## Recent Decisions Log

### $current_date - Extended Spec-Kit Integration
**Branch**: $current_branch
**Problem**: Needed session continuity and architectural quality standards
**Decision**: Implement extended Spec-Kit with 4 core commands
**Rationale**: Prevent context loss and maintain code quality across sessions
**Impact**: All future development sessions and architectural decisions
**Trade-offs**: Small setup overhead for significant productivity gains
**Quality Check**: Integrated with existing Spec-Kit infrastructure

---

## Architecture Context

### Current Development Phase
- [x] Rapid Prototype (anything goes)
- [ ] Beta (functional but not polished)
- [ ] MVP (production ready core)
- [ ] Scale (enterprise grade)

### Active Quality Standards
**Last Generated**: Not yet generated
**Pattern**: TBD - Run /quality-standards to establish
**Key Rules**: Will be established after pattern selection

### Technical Debt Map
**High Risk (avoid changes)**:
- (To be identified during development)

**Medium Risk (test thoroughly)**:
- (To be identified during development)

**Safe Changes (low coupling)**:
- (To be identified during development)

---

## Session History Archive

### $current_date - Extended Spec-Kit Setup
**Outcome**: Successfully integrated extended commands with existing Spec-Kit
**Lessons**: Proper integration requires respecting existing infrastructure
**Quality Impact**: Foundation established for quality standards
**Next Steps**: Generate quality standards for chosen architectural pattern

<!-- SESSION CONTEXT MANUAL ADDITIONS START -->
<!-- Add any manual notes or context here -->
<!-- SESSION CONTEXT MANUAL ADDITIONS END -->
EOF
        log_success "Created session context at $SESSION_CONTEXT"
    else
        log_info "Session context already exists at $SESSION_CONTEXT"
    fi
    
    # Update constitution with extended principles
    CONSTITUTION="$REPO_ROOT/.specify/memory/constitution.md"
    if [[ -f "$CONSTITUTION" ]]; then
        # Check if extended principles already exist
        if ! grep -q "Extended Spec-Kit Integration" "$CONSTITUTION"; then
            cat >> "$CONSTITUTION" << 'EOF'

## Extended Spec-Kit Integration

### Session Continuity Workflow
- **Start Every Session**: Use `/session-start` to load previous context and decisions
- **Document Decisions**: Update session-context.md with architectural choices and rationale
- **Quality Validation**: Run `/quality-standards` before making architectural decisions
- **Strategic Planning**: Use `/deep-decision` for choices impacting future phases

### Change Management Discipline
- **Quick Fixes**: Use `/quick-fix` for changes under 20 lines with minimal impact
- **Architectural Changes**: Always validate against quality standards and document rationale
- **Risk Assessment**: Check session context for high-risk areas before modifications
- **Phase Awareness**: Consider current development phase and future transition needs

### AI Tool Coordination
- **Claude**: Complex analysis, architectural decisions, multi-file reasoning
- **Cursor**: Real-time editing, debugging, repository-wide changes
- **Copilot**: Quick fixes, boilerplate, GitHub integration
- **Context Handoff**: Always update session context when switching tools

### Quality Governance
- **Pattern Compliance**: All code must align with established architectural patterns
- **Decision Documentation**: Record rationale for all architectural choices
- **Standards Evolution**: Update quality standards when new patterns emerge
- **Violation Tracking**: Document and address any standard violations immediately
EOF
            log_success "Updated constitution with extended principles"
        else
            log_info "Constitution already includes extended principles"
        fi
    else
        log_info "Constitution file not found - will be created by standard Spec-Kit workflow"
    fi
    
    # Verify command files exist
    COMMANDS_DIR="$REPO_ROOT/.specify/templates/commands"
    required_commands=("session-start.md" "quality-standards.md" "quick-fix.md" "deep-decision.md")
    
    for cmd in "${required_commands[@]}"; do
        if [[ -f "$COMMANDS_DIR/$cmd" ]]; then
            log_success "Found command: $cmd"
        else
            log_error "Missing command file: $COMMANDS_DIR/$cmd"
            log_error "Please ensure all command files are properly created"
        fi
    done
    
    # Update agent context files with extended system
    if [[ -f "$REPO_ROOT/.specify/scripts/bash/update-agent-context.sh" ]]; then
        log_info "Updating agent context files with extended system..."
        "$REPO_ROOT/.specify/scripts/bash/update-agent-context.sh" || log_error "Failed to update agent context"
    fi
    
    log_success "Extended Spec-Kit setup complete!"
    echo
    echo "Next steps:"
    echo "1. Start your first session with a Claude agent using: /session-start"
    echo "2. For architectural decisions, use: /quality-standards [pattern]"
    echo "3. For strategic choices, use: /deep-decision [question]"
    echo "4. For small fixes, use: /quick-fix [description]"
    echo
    echo "The extended system integrates with your existing Spec-Kit workflow."
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi