# Gemini's Operational Notes

**Date:** 2025-10-17
**Purpose:** To store essential operational information and reminders for Gemini's efficient functioning within the YBIS project.

---

## 1. Mandatory Startup Procedure

*   Always begin a session by following the "ZORUNLU BAŞLANGIÇ PROSEDÜRÜ v2.0 (TOKEN-OPTIMIZED)" outlined in `AGENTS.md` (or `GEMINI.md`).
*   This involves reading the TIER 1 files and then `AI_SYSTEM_GUIDE.md` for comprehensive system awareness.
*   The `/session-start` command (now implemented in `.YBIS_Dev/Veriler/commands/session-start.md`) automates this process.

## 2. Role and Core Mandates

*   **Primary Role:** Research and Analysis (as per `AI_Asistan_Gorev_Dagilimi.md`).
*   **Core Mandates:** Adhere strictly to project conventions, verify library/framework usage, mimic existing style/structure, add comments sparingly (only for *why*), be proactive (add tests), confirm ambiguity, and explain critical commands.
*   **Zero-Tolerance Rules:** Remember the rules from `YBIS_PROJE_ANAYASASI.md` (e.g., no `any`, no `@ts-ignore`, no Tamagui shorthands).

## 3. Documentation and Information Retrieval

*   **Lazy Loading Strategy:** Follow the 3-Tier Lazy Loading system. Only read documents when necessary, using `QUICK_INDEX.md` as the primary guide for "when to read which file."
*   **Command System:** Be aware of the YBIS command system (slash commands and agent commands) as detailed in `AI_SYSTEM_GUIDE.md`.
*   **Dual-Write Rule:** Remember the mandatory DUAL-WRITE rule for `session-context.md` and `DEVELOPMENT_LOG.md`. Although a validation script (`validate-dual-write.py`) exists, manual adherence is crucial.
*   **Documentation Map:** Refer to `documentation-map.yaml` for the registry of all documents and their relationships.

## 4. Communication and Interaction

*   **Tool Routing Principle:** If a task is better suited for another AI tool (e.g., Claude for large-scale code analysis), suggest it to the user but remain flexible.
*   **Command Index Principle:** If a user request can be met by multiple workflows, present options from `YBIS_INDEX.md` and let the user choose.
*   **Clarity and Confirmation:** Always prioritize clear communication, surface blockers early, and seek explicit user confirmation before destructive actions.

## 5. Current Project State (from `session-context.md`)

*   **Active Focus:** Edge-to-Edge Safe Area + Keyboard-Synced Animations (AD-031).
*   **Next Priorities:**
    1.  Expo Go migration verification and testing.
    2.  Resolve `tsconfig.json` paths aliases issue.
*   **P0/P1 Fixes:** All P0 and P1 pipeline fixes are reported as COMPLETED in `PIPELINE_FIXES_PROGRESS.md`.

---

**Reminder:** This file should be updated as new operational insights or critical information emerges.
