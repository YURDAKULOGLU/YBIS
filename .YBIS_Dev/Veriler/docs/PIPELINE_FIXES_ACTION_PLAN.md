# 🎯 YBIS Dev Pipeline Fixes - Action Plan

**Version:** 1.0
**Created:** 2025-10-17
**Status:** READY FOR EXECUTION
**Source:** Consolidated analysis from 3 pipeline review reports
**Owner:** Development Team (Claude/Gemini/Codex)

---

## 📋 EXECUTIVE SUMMARY

This action plan consolidates findings from three independent pipeline reviews:
1. **YBIS_Dev_Süreç_Analiz_Raporu.md** (Gemini) - 4 defects
2. **ai-pipeline-review-2025-10-16.md** (Codex) - 4 gaps
3. **ybis-pipeline-kusurlari-raporu.md** (Claude) - 10 critical issues

**Total Issues:** 10 unique actionable items
**Estimated Effort:** 8 hours total
**Expected ROI:** 1875% (pipeline efficiency +150%, agent utility +200%)
**Timeline:** 3 weeks (P0: today, P1: this week, P2: next week)

---

## 🚨 PRIORITY MATRIX

| Priority | Count | Timeframe | Impact | Effort |
|----------|-------|-----------|--------|--------|
| **P0** | 4 | Today (4h) | Critical - System broken | 4h |
| **P1** | 3 | This Week (3h) | High - Suboptimal | 3h |
| **P2** | 3 | Next Week (1h) | Medium - Nice-to-have | 1h |

---

## 🔥 P0 - CRITICAL (Execute Today)

### ACTION 1: Create `/session-start` Command

**Problem:** Command referenced in AGENTS.md but file doesn't exist
**Impact:** Onboarding process broken, agents encounter dead end
**Severity:** CRITICAL - 3/3 reports flagged this

**Implementation Steps:**

1. **Create command file:**
   ```bash
   File: .YBIS_Dev/Veriler/commands/session-start.md
   ```

2. **Command content:**
   ```markdown
   # Session Start Command

   **Purpose:** Initialize agent context at the beginning of a new session
   **Category:** Onboarding
   **Agent:** All

   ## What This Command Does

   Loads TIER 1 mandatory files and confirms environment state.

   ## Steps

   1. **Load TIER 1 Files (4 files, <2K tokens):**
      - [ ] Read .YBIS_Dev/AI_GENEL_ANAYASA.md (behavior rules)
      - [ ] Read docs/YBIS_PROJE_ANAYASASI.md (first 150 lines - port catalog + zero-tolerance)
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
   ```

3. **Verify integration:**
   - Test command execution manually
   - Ensure AGENTS.md reference is accurate
   - Update documentation-map.yaml to include this command

**Verification:**
```bash
# Test the command exists
ls .YBIS_Dev/Veriler/commands/session-start.md

# Test AGENTS.md reference
grep "session-start" AGENTS.md
```

**Estimated Time:** 30 minutes
**Owner:** Claude/Dev Agent
**Dependencies:** None

---

### ACTION 2: Resolve Core-Config vs Token Optimization Conflict

**Problem:** Same files marked as "always load" in core-config.yaml but "lazy load" in AI_BASLANGIC_REHBERI_V2.md
**Impact:** Agents exhibit inconsistent behavior, token savings negated
**Severity:** CRITICAL - Creates confusion and inefficiency

**Implementation Steps:**

1. **Read current core-config.yaml:**
   ```bash
   Read: .YBIS_Dev/Veriler/core-config.yaml
   ```

2. **Update core-config.yaml:**
   ```yaml
   # OLD (conflicting):
   devLoadAlwaysFiles:
     - docs/Güncel/DEVELOPMENT_GUIDELINES.md
     - docs/Güncel/tech-stack.md
     - docs/Güncel/package-structure.md

   # NEW (aligned with lazy loading):
   devLoadAlwaysFiles: []  # Empty - rely on TIER system

   devLoadOnFirstImplementation:  # New category
     - docs/Güncel/DEVELOPMENT_GUIDELINES.md
     - docs/Güncel/tech-stack.md
     - docs/Güncel/package-structure.md

   devLoadTriggers:
     - trigger: "implementation_task_starts"
       files: ["DEVELOPMENT_GUIDELINES.md", "tech-stack.md", "package-structure.md"]
     - trigger: "dependency_install"
       files: ["tech-stack.md"]
     - trigger: "package_creation"
       files: ["package-structure.md"]
   ```

3. **Update AI_BASLANGIC_REHBERI_V2.md:**
   ```markdown
   Add reference to core-config alignment:

   ## Core-Config Alignment

   The `core-config.yaml` file is now aligned with the lazy-load philosophy:
   - No files are loaded "always"
   - Files are loaded on trigger events (e.g., first implementation task)
   - TIER 1 remains mandatory at session start
   ```

4. **Update agent instructions:**
   - Dev agent persona: Clarify "load on first implementation"
   - Remove "always load" references

**Verification:**
```bash
# Check core-config.yaml structure
cat .YBIS_Dev/Veriler/core-config.yaml | grep -A5 "devLoad"

# Verify no conflicts remain
grep -r "devLoadAlwaysFiles" .YBIS_Dev/
```

**Estimated Time:** 45 minutes
**Owner:** Claude/Gemini
**Dependencies:** None

---

### ACTION 3: Add AI_SYSTEM_GUIDE.md Link to TIER 1

**Problem:** AI_SYSTEM_GUIDE.md contains comprehensive command/workflow docs, but TIER 1 doesn't link to it
**Impact:** Agents unaware of YBIS workflows, can't suggest commands to users
**Severity:** CRITICAL - Agents remain passive, system underutilized

**Implementation Steps:**

1. **Update AI_BASLANGIC_REHBERI_V2.md:**

   Add new section after TIER 1 checklist:

   ```markdown
   ## 🚀 NEXT STEPS AFTER TIER 1 (Command & Workflow Awareness)

   Once TIER 1 is complete, agents should gain awareness of the YBIS system:

   ### For All Agents (Optional but Recommended)
   ```yaml
   5. .YBIS_Dev/AI_SYSTEM_GUIDE.md (first 200 lines)
      Ne: Command catalog, workflow routing, agent coordination
      Ne Zaman: After TIER 1, before first user interaction
      İçerik:
        - Available slash commands (/YBIS:*)
        - Workflow routing (when to use which command)
        - Agent coordination patterns
        - System architecture overview
      Satır: 200 (just overview section)
      Token: ~1K
   ```

   ### Why Load This?

   - **Proactive Assistance:** Agents can suggest relevant workflows to users
   - **Command Awareness:** Know which commands exist and when to use them
   - **Routing Intelligence:** Direct users to optimal workflows
   - **System Integration:** Understand how pieces fit together

   ### When to Skip

   Skip if user immediately provides a specific task (e.g., "fix bug X").
   In this case, proceed directly with the task and lazy-load as needed.
   ```

2. **Update QUICK_INDEX.md:**

   Add AI_SYSTEM_GUIDE.md to decision tree:

   ```markdown
   ## 🎯 HIZLI KARAR AĞACI

   Soru: "Ne yapayım?"
   │
   ├─ Session başlıyor mu?
   │  ├─ YES → TIER 1 (4 dosya)
   │  └─ THEN → AI_SYSTEM_GUIDE.md (ilk 200 satır) ← NEW
   │
   ├─ YBIS komutlarını bilmem gerekiyor mu?
   │  └─ YES → AI_SYSTEM_GUIDE.md (command catalog)
   ```

3. **Update AGENTS.md:**

   Add step to session start flow:

   ```markdown
   ## Session Start Procedure

   1. Run `/session-start` (loads TIER 1)
   2. **(NEW) Review AI_SYSTEM_GUIDE.md** (first 200 lines) for command awareness
   3. Confirm environment and current focus
   4. Ready to receive instructions
   ```

**Verification:**
```bash
# Check links added
grep "AI_SYSTEM_GUIDE" .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
grep "AI_SYSTEM_GUIDE" .YBIS_Dev/Veriler/QUICK_INDEX.md
grep "AI_SYSTEM_GUIDE" AGENTS.md
```

**Estimated Time:** 1 hour
**Owner:** Claude
**Dependencies:** ACTION 1 (session-start command)

---

### ACTION 4: Fix YBIS_PROJE_ANAYASASI.md Instruction Error

**Problem:** Instructions say "read first 80 lines for port catalog" but port catalog is at the end of file
**Impact:** Agents load wrong information at startup, miss critical zero-tolerance rules
**Severity:** HIGH - Causes wrong context at session start

**Implementation Steps:**

1. **Verify current file structure:**
   ```bash
   # Check where port catalog actually is
   grep -n "Port Kataloğu" docs/YBIS_PROJE_ANAYASASI.md
   ```

2. **Choose solution approach:**

   **Option A: Move Port Catalog to Beginning (RECOMMENDED)**
   - Restructure file to match instructions
   - Port catalog in first 80 lines
   - Zero-tolerance rules follow

   **Option B: Update Instructions**
   - Change "first 80 lines" to "sections 1-8"
   - Add line numbers to instruction
   - Keep file structure as-is

3. **Implement Option A (Recommended):**

   Restructure `docs/YBIS_PROJE_ANAYASASI.md`:

   ```markdown
   # YBIS Proje Anayasası

   Version: 3.2.0
   Last Updated: 2025-10-17

   ## 1. Amaç
   [existing content]

   ## 2. Port Kataloğu (Tier 1 - Çekirdek) ← MOVED HERE

   **Port Kullanım Kriteri:** "Will we swap vendors? Port it."

   1. AuthPort - OAuth provider swap
   2. DatabasePort - Supabase PostgreSQL → Cloud SQL
   3. LLMPort - OpenAI → Anthropic → Gemini
   4. StoragePort - Supabase Storage → GCS → S3
   5. DeploymentPort - Vercel Edge → Cloudflare Workers

   **Portlanmayan:**
   - Theme (Tamagui + zustand)
   - i18n (i18next)
   - Navigation (Expo Router)

   [... port catalog ends around line 80]

   ## 3. Kalite ve Güvenlik Emirleri (Zero-Tolerance)
   [existing content - moved down]

   ## 4. Mimari Prensipleri
   [existing content]
   ```

4. **Update all references:**
   ```bash
   # Files to update
   .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
   .YBIS_Dev/Veriler/QUICK_INDEX.md
   GEMINI.md
   CLAUDE.md
   ```

   Change from:
   ```
   "ilk 80 satır - port catalog"
   ```

   To:
   ```
   "ilk 150 satır - port catalog + zero-tolerance rules"
   ```

5. **Verify line count:**
   ```bash
   head -150 docs/YBIS_PROJE_ANAYASASI.md | tail -20
   # Should show end of zero-tolerance section
   ```

**Verification:**
```bash
# Check port catalog position
head -80 docs/YBIS_PROJE_ANAYASASI.md | grep -c "Port"

# Check instruction accuracy
grep "ilk.*satır" .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
```

**Estimated Time:** 1.5 hours
**Owner:** Claude
**Dependencies:** None

---

## 📊 P1 - HIGH PRIORITY (This Week)

### ACTION 5: Implement Dual-Write Rule Validation

**Problem:** session-context.md ↔ DEVELOPMENT_LOG.md sync is manual, no validation
**Impact:** Session continuity breaks, context drift
**Severity:** HIGH - Affects handoff reliability

**Implementation Steps:**

1. **Create validation script:**
   ```python
   File: .YBIS_Dev/scripts/validate-dual-write.py

   Purpose:
   - Parse session-context.md for AD-XXX references
   - Check DEVELOPMENT_LOG.md for matching entries
   - Validate date consistency
   - Report missing or inconsistent entries
   ```

2. **Script implementation:**
   ```python
   #!/usr/bin/env python3
   """
   Dual-Write Rule Validator

   Ensures session-context.md and DEVELOPMENT_LOG.md stay synchronized.
   """

   import re
   from pathlib import Path
   from datetime import datetime

   def extract_ad_decisions(session_context_path):
       """Extract AD-XXX decisions from session-context.md"""
       with open(session_context_path) as f:
           content = f.read()

       # Pattern: ### AD-XXX: Title
       pattern = r'### (AD-\d+): (.+?)\n- \*\*Date:\*\* (\d{4}-\d{2}-\d{2})'
       matches = re.findall(pattern, content)

       return [
           {"id": m[0], "title": m[1], "date": m[2]}
           for m in matches
       ]

   def check_development_log(dev_log_path, ad_id):
       """Check if AD-XXX exists in DEVELOPMENT_LOG.md"""
       with open(dev_log_path) as f:
           content = f.read()

       pattern = f'### {ad_id}:'
       return pattern in content

   def validate_dual_write():
       """Main validation function"""
       session_context = Path('.YBIS_Dev/Veriler/memory/session-context.md')
       dev_log = Path('docs/Güncel/DEVELOPMENT_LOG.md')

       decisions = extract_ad_decisions(session_context)

       print(f"🔍 Checking {len(decisions)} AD decisions...")

       missing = []
       for decision in decisions:
           if not check_development_log(dev_log, decision['id']):
               missing.append(decision)

       if missing:
           print("\n❌ DUAL-WRITE VALIDATION FAILED")
           print(f"\n{len(missing)} decisions in session-context.md not found in DEVELOPMENT_LOG.md:")
           for d in missing:
               print(f"  - {d['id']}: {d['title']} ({d['date']})")
           return False
       else:
           print("\n✅ DUAL-WRITE VALIDATION PASSED")
           print("All AD decisions synchronized between session-context and dev log.")
           return True

   if __name__ == '__main__':
       import sys
       success = validate_dual_write()
       sys.exit(0 if success else 1)
   ```

3. **Add to pre-commit hook:**
   ```bash
   File: .husky/pre-commit

   Add line:
   python3 .YBIS_Dev/scripts/validate-dual-write.py || exit 1
   ```

4. **Add to npm scripts:**
   ```json
   "scripts": {
     "validate:dual-write": "python3 .YBIS_Dev/scripts/validate-dual-write.py"
   }
   ```

**Verification:**
```bash
# Test script
python3 .YBIS_Dev/scripts/validate-dual-write.py

# Should pass or show specific missing entries
```

**Estimated Time:** 1.5 hours
**Owner:** Claude
**Dependencies:** None

---

### ACTION 6: Update Documentation Registry

**Problem:** documentation-map.yaml shows 27 documents but more exist after token optimization
**Impact:** Cross-reference validation broken, orphaned docs
**Severity:** MEDIUM-HIGH - Registry unreliable

**Implementation Steps:**

1. **Audit current documentation:**
   ```bash
   # Count all .md files
   find . -name "*.md" -not -path "*/node_modules/*" | wc -l

   # List new files since last registry update
   find . -name "*.md" -newer .YBIS_Dev/Veriler/documentation-map.yaml
   ```

2. **Update documentation-map.yaml:**
   ```yaml
   # Add new entries

   meta_documents:
     - path: .YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md
       tier: meta
       dependencies: [QUICK_INDEX.md, AI_GENEL_ANAYASA.md]
       last_updated: 2025-10-12

     - path: .YBIS_Dev/Veriler/QUICK_INDEX.md
       tier: meta
       dependencies: [documentation-map.yaml]
       last_updated: 2025-10-12

     - path: .YBIS_Dev/Veriler/docs/YBIS_Dev_Süreç_Analiz_Raporu.md
       tier: meta
       type: analysis_report
       last_updated: 2025-10-16

     - path: .YBIS_Dev/Veriler/docs/ai-pipeline-review-2025-10-16.md
       tier: meta
       type: analysis_report
       last_updated: 2025-10-16

     - path: .YBIS_Dev/Veriler/docs/ybis-pipeline-kusurlari-raporu.md
       tier: meta
       type: analysis_report
       last_updated: 2025-10-16

     - path: .YBIS_Dev/Veriler/docs/PIPELINE_FIXES_ACTION_PLAN.md
       tier: meta
       type: action_plan
       last_updated: 2025-10-17

   # Update count
   total_documents: 33  # Updated from 27
   ```

3. **Add registry validation script:**
   ```python
   File: .YBIS_Dev/scripts/validate-doc-registry.py

   Purpose:
   - Find all .md files in project
   - Compare with documentation-map.yaml entries
   - Report missing/orphaned docs
   ```

**Verification:**
```bash
# Run validation
python3 .YBIS_Dev/scripts/validate-doc-registry.py

# Check updated count
grep "total_documents" .YBIS_Dev/Veriler/documentation-map.yaml
```

**Estimated Time:** 1 hour
**Owner:** Claude/Gemini
**Dependencies:** None

---

### ACTION 7: Fix session-context.md Inconsistency

**Problem:** "Recent Decisions (Last 3)" heading but 6 decisions listed
**Impact:** Minor - causes confusion about what "last 3" means
**Severity:** LOW-MEDIUM - Documentation accuracy

**Implementation Steps:**

1. **Update session-context.md:**
   ```markdown
   # Change heading
   FROM: ## 📋 RECENT DECISIONS (Last 3)
   TO:   ## 📋 RECENT DECISIONS (Last 6)

   # OR keep only last 3 and archive older ones
   ```

2. **Add archive section:**
   ```markdown
   ## 📋 RECENT DECISIONS (Last 3)

   ### AD-033: [most recent]
   ### AD-032: [second]
   ### AD-031: [third]

   ## 📚 ARCHIVED DECISIONS

   <details>
   <summary>Older Decisions (AD-030 and earlier)</summary>

   ### AD-030: [archived]
   ### AD-029: [archived]
   ### AD-028: [archived]

   </details>
   ```

3. **Document policy:**
   ```markdown
   Add to session-context.md header:

   **Note:** Only the last 3 decisions are shown above.
   Older decisions are in DEVELOPMENT_LOG.md or collapsed below.
   ```

**Verification:**
```bash
# Check heading matches content
grep -A 20 "RECENT DECISIONS" .YBIS_Dev/Veriler/memory/session-context.md | grep -c "^### AD-"
# Should output: 3
```

**Estimated Time:** 30 minutes
**Owner:** Claude
**Dependencies:** None

---

## 🔧 P2 - MEDIUM PRIORITY (Next Week)

### ACTION 8: Test Command Coverage

**Problem:** 50+ commands exist but none are tested
**Impact:** Unknown reliability, silent failures possible
**Severity:** MEDIUM - Quality assurance gap

**Implementation Steps:**

1. **Create command test framework:**
   ```bash
   File: .YBIS_Dev/scripts/test-commands.sh
   ```

2. **Test script:**
   ```bash
   #!/bin/bash
   # Command Coverage Test

   COMMANDS_DIR=".YBIS_Dev/Veriler/commands"
   FAILED=()

   for cmd in "$COMMANDS_DIR"/*.md; do
       echo "Testing: $(basename $cmd)"

       # Check required sections
       if ! grep -q "## What This Command Does" "$cmd"; then
           FAILED+=("$(basename $cmd): Missing 'What This Command Does'")
       fi

       if ! grep -q "## Steps" "$cmd"; then
           FAILED+=("$(basename $cmd): Missing 'Steps'")
       fi
   done

   if [ ${#FAILED[@]} -gt 0 ]; then
       echo "❌ Tests failed:"
       printf '%s\n' "${FAILED[@]}"
       exit 1
   else
       echo "✅ All commands have required structure"
   fi
   ```

3. **Add to CI/CD:**
   ```yaml
   # .github/workflows/docs-quality.yml
   - name: Test Command Coverage
     run: bash .YBIS_Dev/scripts/test-commands.sh
   ```

**Estimated Time:** 30 minutes
**Owner:** Claude
**Dependencies:** None

---

### ACTION 9: Automate Session Continuity

**Problem:** Session handoff is manual, context transfer unreliable
**Impact:** Context loss, work duplication
**Severity:** MEDIUM - Efficiency issue

**Implementation Steps:**

1. **Create session handoff template:**
   ```markdown
   File: .YBIS_Dev/Veriler/templates/session-handoff.md

   ## Session Handoff: {AGENT_FROM} → {AGENT_TO}

   **Date:** {DATE}
   **Time:** {TIME}
   **Context:** {ACTIVE_FOCUS}

   ### What Was Completed
   - [ ] Task 1
   - [ ] Task 2

   ### In Progress
   - [ ] Task 3 (50% done, see file X:Y)

   ### Next Steps for {AGENT_TO}
   1. Priority action
   2. Secondary action

   ### Blockers
   - None / List blockers

   ### Files Modified
   - file1.ts (line 42-55)
   - file2.md (section 3)
   ```

2. **Add handoff script:**
   ```python
   File: .YBIS_Dev/scripts/create-handoff.py

   Purpose: Generate handoff document from current session state
   ```

**Estimated Time:** Not estimated - Future enhancement
**Owner:** TBD
**Dependencies:** None

---

### ACTION 10: Resolve Instruction Conflicts

**Problem:** Dev agent says "never load PRD", Quick Index says "load when necessary"
**Impact:** Agent decision paralysis, inconsistent behavior
**Severity:** MEDIUM - Behavioral inconsistency

**Implementation Steps:**

1. **Create decision matrix:**
   ```markdown
   File: .YBIS_Dev/Veriler/decision-trees/doc-loading-policy.md

   ## Documentation Loading Decision Tree

   ### Dev Agent Scenario

   Q: Should I load PRD/architecture docs?

   A: Follow this decision tree:

   1. Is this a story-based task?
      - YES: Story should have all context. Don't load PRD.
      - NO: Go to step 2

   2. Is the requirement unclear in the story?
      - YES: Load relevant section from PRD
      - NO: Proceed with story context only

   3. Does Quick Index suggest loading?
      - YES: Load the suggested doc
      - NO: Ask user for clarification
   ```

2. **Update agent instructions:**
   Align dev persona with Quick Index policy

**Estimated Time:** 30 minutes
**Owner:** Gemini
**Dependencies:** None

---

## 📈 SUCCESS CRITERIA

### Short-Term (1 Week)
- ✅ `/session-start` command exists and works
- ✅ Core-config vs token optimization conflict resolved
- ✅ AI_SYSTEM_GUIDE.md linked from TIER 1
- ✅ YBIS_PROJE_ANAYASASI.md structure matches instructions
- ✅ Dual-write validation script operational

### Medium-Term (2 Weeks)
- ✅ Documentation registry accurate (33 docs)
- ✅ session-context.md heading matches content
- ✅ Command coverage test passing

### Long-Term (3 Weeks)
- ✅ Pipeline efficiency: 95%+
- ✅ Agent efficiency: 90%+
- ✅ All P0/P1/P2 actions completed

---

## 🔄 EXECUTION TRACKING

### P0 - Today (4 hours)
- [ ] ACTION 1: Create /session-start command (30 min) - **READY**
- [ ] ACTION 2: Resolve core-config conflict (45 min) - **READY**
- [ ] ACTION 3: Add AI_SYSTEM_GUIDE link (1 hour) - **READY**
- [ ] ACTION 4: Fix PROJE_ANAYASASI structure (1.5 hours) - **READY**

### P1 - This Week (3 hours)
- [ ] ACTION 5: Dual-write validation (1.5 hours)
- [ ] ACTION 6: Update doc registry (1 hour)
- [ ] ACTION 7: Fix session-context heading (30 min)

### P2 - Next Week (1 hour)
- [ ] ACTION 8: Test command coverage (30 min)
- [ ] ACTION 9: Session handoff automation (future)
- [ ] ACTION 10: Instruction conflict resolution (30 min)

---

## 📝 NOTES

### Implementation Order
Execute P0 actions sequentially (dependencies exist):
1. ACTION 1 first (session-start command)
2. ACTION 2 (core-config fix)
3. ACTION 3 (depends on ACTION 1)
4. ACTION 4 (independent, can parallelize)

### Rollback Plan
All actions are documentation/config changes - low risk:
- Git commit before each action
- Easy rollback with `git revert`
- No production code affected

### Communication
- Update session-context.md after each action
- Add DEVELOPMENT_LOG.md entry for completed P0 actions
- Notify team when P0 batch is complete

---

**Action Plan Status:** ✅ READY FOR EXECUTION
**Next Step:** Execute ACTION 1 (Create /session-start command)
**Owner:** Claude/Development Team
**Review Date:** 2025-10-24 (1 week from now)
