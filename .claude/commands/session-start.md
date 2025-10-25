---
description: Load previous context and prepare for work session
---

You are starting a new development session. Follow the MANDATORY TIER 1 startup protocol from AGENTS.md.

**CRITICAL**: This command implements the TIER 1 startup protocol. All 7 files MUST be read before any work begins.

## TIER 1: MANDATORY STARTUP (All Sessions)

**⚠️ READ ALL 7 FILES IN PARALLEL (SINGLE MESSAGE) - NO EXCEPTIONS! ⚠️**

1. **Load Core Context** (Read in parallel):
   ```
   [ ] .YBIS_Dev/AI_GENEL_ANAYASA.md
       Purpose: AI behavior rules, ethics, boundaries

   [ ] .YBIS_Dev/AI_CONTENT_CONVENTIONS.md
       Purpose: AI content format conventions

   [ ] .YBIS_Dev/Veriler/memory/YBIS_CORE_PRINCIPLES.md
       Purpose: Core architectural principles

   [ ] docs/YBIS_PROJE_ANAYASASI.md
       Purpose: Project-specific technical rules

   [ ] .YBIS_Dev/Veriler/memory/session-context.md
       Purpose: "WHAT ARE WE DOING NOW?" - Current focus, recent decisions

   [ ] .YBIS_Dev/Veriler/QUICK_INDEX.md
       Purpose: "Which file should I read when?" - Navigation guide

   [ ] .YBIS_Dev/Veriler/YBIS_COMMAND_INDEX.md
       Purpose: "Which commands are available?" - Command catalog
   ```

2. **Confirm Session State**:
   - Active focus from session-context.md
   - Last 3 decisions (AD-XXX)
   - Next steps (top 3 priorities)
   - Blockers (if any)

3. **Proactive Health Check**:
   - Review any constitution violations from session-context.md
   - Report blockers to user with solutions

## Expected Output

After reading all TIER 1 files, provide a brief session briefing:

```
✅ Context yüklendi - hazırım

📍 Current Focus: [from session-context.md]
📋 Last 3 Decisions: [AD-XXX summaries]
🎯 Next Steps: [Top 3 priorities]
🚨 Blockers: [If any, with solutions]
```

**IMPORTANT**:
- Keep output concise (3-5 lines max)
- Don't ask user what to do - wait for instructions
- TIER 2/3 files will be lazy-loaded when needed

## TIER 2/3 Loading Strategy

Load additional files ONLY when needed:

**TIER 2 (Task-Based)**:
- Implementation tasks → Read `docs/Güncel/DEVELOPMENT_GUIDELINES.md`
- Dependency install → Read `docs/Güncel/tech-stack.md`
- Package creation → Read `docs/Güncel/package-structure.md`

**TIER 3 (Command-Based)**:
- `/YBIS:implement` → Read relevant task from `tasks.md`
- `/YBIS:review-story` → Read specified story file
- `/YBIS:deep-review` → Read `Architecture_better.md`

## Usage

Run `/session-start` at the beginning of every development session.

**NO EXCEPTIONS**: TIER 1 must complete before any work begins.