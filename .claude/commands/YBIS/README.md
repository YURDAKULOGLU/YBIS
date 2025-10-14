# YBIS Commands

This directory contains Claude Code slash commands that reference YBIS system commands.

## Usage

All commands can be invoked with `/` prefix in Claude Code:

```
/plan          → Execute implementation planning
/specify       → Create feature specification
/tasks         → Generate task list
/clarify       → Clarify specification ambiguities
/analyze       → Analyze cross-artifact consistency
/implement     → Execute implementation
```

## Command Structure

Each command in this directory is a **pointer** to the actual command implementation in `.YBIS_Dev/Veriler/Commands/`.

**Example:**
```
.claude/commands/YBIS/plan.md
  → Points to: .YBIS_Dev/Veriler/Commands/plan.md
```

## Why This Structure?

- **Separation of Concerns**: Claude Code integration separate from YBIS system
- **Single Source of Truth**: Actual command logic in `.YBIS_Dev/Veriler/Commands/`
- **Easy Updates**: Update command once, both systems benefit
- **Clean Organization**: Claude Code commands stay lightweight

## Available Commands

### Core Workflow Commands
- **plan.md** - Implementation planning workflow
- **specify.md** - Feature specification creation
- **tasks.md** - Task list generation
- **implement.md** - Implementation execution
- **clarify.md** - Specification clarification
- **analyze.md** - Cross-artifact analysis

### Expert Development Commands (NEW)
- **context-implement.md** - Implement using full conversation context
- **expert-debug.md** - Multi-agent debugging with root cause analysis
- **deep-review.md** - Comprehensive code review (security, performance, architecture)
- **full-context.md** - Load entire project architecture before work
- **update-docs.md** - Auto-update documentation after code changes

### Specialized Code Operations (NEW)
- **sc-troubleshoot.md** - Domain-specific troubleshooting
- **sc-improve.md** - Apply optimization patterns
- **sc-document.md** - Generate comprehensive documentation
- **sc-refactor.md** - Intelligent refactoring engine

### Document Management
- **create-doc.md** - Create document from template
- **shard-doc.md** - Break documents into pieces
- **document-project.md** - Comprehensive project documentation

### Story Management
- **create-next-story.md** - Create next user story
- **review-story.md** - Review story implementation
- **brownfield-create-epic.md** - Create epic for existing systems
- **brownfield-create-story.md** - Create story for existing systems

### Quality Assurance
- **execute-checklist.md** - Execute validation checklists
- **qa-gate.md** - Quality gate validation
- **correct-course.md** - Course correction for off-track projects

## For More Information

### YBIS Documentation System
- **Documentation Taxonomy:** `.YBIS_Dev/Veriler/documentation-taxonomy.md` - Complete documentation architecture (5-Tier system, 25 docs)
- **Documentation Map:** `.YBIS_Dev/Veriler/documentation-map.yaml` - Document registry with dependencies
- **AI Agent Guide:** `docs/AI_Asistan_Gorev_Dagilimi.md` - Multi-LLM workflow management

### Quick References
- **Constitution:** `docs/YBIS_PROJE_ANAYASASI.md` - Technical rules and architectural principles
- **Development Log:** `docs/Güncel/DEVELOPMENT_LOG.md` - Architecture Decisions (AD-XXX)
- **Tasks:** `docs/Güncel/tasks.md` - 6-week development plan (165 tasks)
- **Vision:** `docs/vision/PROJECT_VISION.md` - Product vision and growth strategy
- **Roadmap:** `docs/roadmap/PRODUCT_ROADMAP.md` - Timeline and phases
