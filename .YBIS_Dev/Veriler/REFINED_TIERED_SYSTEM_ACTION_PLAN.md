# Refined TIERed System for AI Agents: Action Plan

**Version:** 1.0
**Last Updated:** 2025-10-21
**Purpose:** To integrate AI-inferred modes and user confirmation into the TIERed documentation system for improved efficiency and consistency in AI agent operations.

---

## 1. Key Principles of the Refined System

The TIERed documentation system is a valuable framework for managing information flow. To optimize its effectiveness for AI agents, we will introduce a proactive, user-centric approach to context acquisition:

*   **AI Infers Mode:** The AI analyzes the user's task to infer the most relevant `AI_MODE` (e.g., DEVELOPMENT, ANALYSIS).
*   **AI Proposes & Explains:** The AI verbally proposes the inferred mode to the user, explaining the associated action plan and its implications (e.g., which TIERs will be loaded).
*   **User Confirms:** The user provides explicit confirmation for the proposed mode.
*   **Mode-Specific Context Loading:** Upon confirmation, the AI performs a comprehensive load of all documents relevant to that `AI_MODE` using `read_many_files`.

---

## 2. Actionable Steps for Integration

These steps outline the necessary modifications to integrate the refined TIERed system into the project's documentation and AI agent protocols.

### Step 1: Define AI Modes & TIER Mappings

*   **Action:** Create a new document, `AI_AGENT_PROTOCOLS.md`, to explicitly define standard `AI_MODE`s (e.g., DEVELOPMENT, ANALYSIS, QA_REVIEW, STRATEGIC_PLANNING) and their corresponding TIERs/documents to be loaded.
*   **Details:** This document will map each `AI_MODE` to a specific set of TIERs and individual documents within those TIERs.
*   **Relevant Files:**
    *   `AI_GENEL_ANAYASA.md` (for referencing the new protocol)
    *   `AGENTS.md` (for referencing the new protocol)
    *   `QUICK_INDEX.md` (for mode-specific document lists)

### Step 2: Implement AI Mode Inference Logic

*   **Action:** Develop internal logic for the AI to infer the most appropriate `AI_MODE` from a user's task description.
*   **Details:** This logic will analyze keywords, intent, and context within the user's request. Guidelines for this inference will be documented in `AI_AGENT_PROTOCOLS.md`.
*   **Relevant Files:**
    *   `AI_AGENT_PROTOCOLS.md` (for inference guidelines and examples)

### Step 3: Implement AI Mode Proposal & Confirmation Protocol

*   **Action:** Define the AI's verbal protocol for proposing the inferred mode to the user, explaining the action plan and its implications, and awaiting explicit confirmation.
*   **Details:** This includes the exact phrasing for the proposal and the expected user response.
*   **Relevant Files:**
    *   `AI_AGENT_PROTOCOLS.md` (for proposal script/flow and user interaction guidelines)

### Step 4: Implement Mode-Specific Context Loading

*   **Action:** Upon user confirmation, the AI will execute a single `read_many_files` command to load all documents specified for the chosen `AI_MODE`.
*   **Details:** This ensures comprehensive context acquisition for the task at hand, balancing token optimization with complete understanding.
*   **Relevant Files:**
    *   `AI_AGENT_PROTOCOLS.md` (for precise document lists per mode)

### Step 5: Update `AI_GENEL_ANAYASA.md`

*   **Action:** Add a new section to `AI_GENEL_ANAYASA.md` that references `AI_AGENT_PROTOCOLS.md` as the definitive guide for AI agent behavior regarding context acquisition and mode management.
*   **Details:** This formalizes the new protocol within the project's highest-level constitution.
*   **Relevant Files:**
    *   `AI_GENEL_ANAYASA.md`

### Step 6: Update `QUICK_INDEX.md`

*   **Action:** Modify the "HIZLI KARAR AĞACI" (Quick Decision Tree) in `QUICK_INDEX.md` to reflect the new mode inference, proposal, and confirmation process.
*   **Details:** The decision tree will guide the AI to infer a mode, propose it, and then load the associated TIERs upon confirmation, rather than making direct TIER decisions.
*   **Relevant Files:**
    *   `QUICK_INDEX.md`

---

## 3. Next Steps

These steps can be broken down into specific development tasks (e.g., new story files, AD-XXX entries) to implement the refined TIERed system. The creation of `AI_AGENT_PROTOCOLS.md` is the immediate next actionable item.
