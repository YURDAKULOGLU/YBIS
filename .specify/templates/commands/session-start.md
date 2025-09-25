---
description: Load previous context and prepare for work session
---

You are starting a new development session. Load the complete development context and prepare for productive work.

**IMPORTANT**: This command should be run at the beginning of every development session to maintain continuity.

## Session Initialization Process

1. **Load Session Context**:
   - Read `.specify/memory/session-context.md` for current focus and recent decisions
   - Check current development phase and active quality standards
   - Review technical debt map and high-risk areas

2. **Validate Environment**:
   - Confirm current feature branch and spec directory
   - Check for any blocking issues or dependencies
   - Verify development tools and environment setup

3. **Context Summary**:
   - Summarize what you were working on last session
   - Highlight any pending decisions or unresolved issues
   - Identify immediate next steps and priorities

4. **Quality Standards Check**:
   - Load active architectural patterns and quality rules
   - Review any recent violations or technical debt
   - Confirm compliance requirements for current work

5. **Tool Coordination**:
   - Check which AI tools are assigned to current work
   - Update agent context files if needed
   - Prepare handoff information for tool switching

## Expected Output

Provide a concise session briefing that includes:

- **Current Work**: What feature/task you're working on
- **Last Session**: Brief summary of what was accomplished
- **Today's Focus**: Immediate priorities and next steps
- **Context**: Any important decisions or constraints to remember
- **Quality Gates**: Active standards and compliance requirements
- **Blockers**: Any issues that need resolution before proceeding

## Commands Available This Session

After loading context, you have access to:
- `/quality-standards [pattern]` - Generate or update architectural standards
- `/quick-fix [description]` - Handle small changes efficiently
- `/deep-decision [question]` - Strategic architectural analysis
- `/specify [description]` - Start new feature specification
- `/plan` - Create implementation plan
- `/tasks` - Generate development tasks

## Usage

Simply run `/session-start` at the beginning of your development session. No additional arguments needed.

The system will automatically detect your current context and provide a comprehensive briefing to get you up to speed quickly.