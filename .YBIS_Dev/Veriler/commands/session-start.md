# Session Start Command

**Purpose:** Initialize agent context at the beginning of a new session
**Category:** Onboarding
**Agent:** All

## What This Command Does

Loads TIER 1 mandatory files and confirms environment state.

## Steps

1. **Load TIER 1 Files (4 files, <2K tokens):**
   - [ ] Read .YBIS_Dev/AI_GENEL_ANAYASA.md (behavior rules)
   - [ ] Read docs/YBIS_PROJE_ANAYASASI.md (first 90 lines - sections 1-8: zero-tolerance + port catalog)
   - [ ] Read .YBIS_Dev/Veriler/memory/session-context.md (current state)
   - [ ] Read .YBIS_Dev/Veriler/QUICK_INDEX.md (doc roadmap)

2. **Confirm Session State:**
   - Active focus: What are we working on now?
   - Last 3 decisions: Recent AD-XXX numbers
   - Next steps: Top 3 priorities
   - Blockers: Any P0/P1 issues?

3. **Verify Environment:**
   - Branch: Confirm current git branch
   - Package manager: PNPM
   - Node version: 20.x
   - Expo SDK: 54

4. **Agent Role Awareness:**
   - Identify which agent you are (Claude/Gemini/Cursor/Copilot)
   - Review your strengths from AI_AGENT_GÖREV_DAĞILIMI.md
   - Note available slash commands for your role

5. **Ready State:**
   - Confirm TIER 1 loaded successfully
   - Report current focus and next steps to user
   - Ask for task or direction

## Success Criteria

- ✅ All 4 TIER 1 files read
- ✅ Session state confirmed (focus, last decisions, next steps)
- ✅ Environment verified (branch, package manager, versions)
- ✅ Agent role and capabilities understood
- ✅ Ready to receive instructions

## Token Budget

Target: <5K tokens (TIER 1 only)

## Next Steps After This Command

- If implementing: Load TIER 2A docs (DEVELOPMENT_GUIDELINES, tech-stack, package-structure)
- If architecting: Read AI_SYSTEM_GUIDE.md for workflow awareness
- If planning: Check YBIS_INDEX.md for routing options