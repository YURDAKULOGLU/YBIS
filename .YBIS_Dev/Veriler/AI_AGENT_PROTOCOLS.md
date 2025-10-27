---
title: "AI Agent Protocols"
description: "Defines standard operating procedures for AI agents regarding context acquisition, mode inference, and interaction protocols."
version: "1.0.0"
status: "active"
owner: "@ybis-master"
last_updated: "2025-10-26"
tags: ["protocol", "agent", "constitution", "context"]
related_docs:
  - "./AI_GENEL_ANAYASA.md"
  - "./DOCUMENT_STANDARDS.md"
---
# AI Agent Protocols

**Version:** 1.0
**Last Updated:** 2025-10-26
**Status:** DRAFT
**Purpose:** To define the standard operating procedures for AI agents regarding context acquisition, mode inference, and interaction protocols. This document operationalizes the concepts from `REFINED_TIERED_SYSTEM_ACTION_PLAN.md`.

---

## 1. Two-Phase Context Loading Protocol

To ensure agents are both consistently informed and task-focused, they MUST adhere to a two-phase context loading protocol. This protocol eliminates "lazy loading" and ensures agents "respect the files."

### Phase 1: Unconditional Baseline Context (On Agent Activation)

- **Trigger:** Upon any agent activation (e.g., `@pm`, `@architect`).
- **Action:** The agent MUST **immediately and without user confirmation** read all documents classified as **TIER 1**. This is a non-negotiable, foundational context load.
- **Purpose:** To ensure every agent, regardless of its task, has the core technical reference information memorized.

#### TIER 1 Document List (Mandatory Load):
- `docs/Güncel/tech-stack.md`
- `docs/Güncel/package-structure.md`
- `docs/README.md`

### Phase 2: Conditional, Task-Specific Context (After User Prompt)

- **Trigger:** After the agent has loaded the baseline context and receives a specific task from the user.
- **Action:** The agent infers the `AI_MODE` from the task, determines the **additional** documents required for that mode (typically TIER -1, TIER 0, and TIER 2), and requests user confirmation to load them.
- **Purpose:** To acquire deep, relevant context for the specific task at hand in an efficient and user-approved manner.

**Example Interaction Flow:**

1.  **User:** `@architect`
2.  **Agent (Internal Action):** `read_many_files(['docs/Güncel/tech-stack.md', 'docs/Güncel/package-structure.md', 'docs/README.md'])`
3.  **Agent (Greeting):** "Architect agent activated. I have loaded the baseline TIER 1 documents. How can I assist you?"
4.  **User:** "Design the architecture for the new RAG system."
5.  **Agent (Inference):** The task requires an `ARCHITECTURE_DESIGN` mode. This mode requires TIER 0 (Constitution) and TIER -1 (Strategy) documents for full context.
6.  **Agent (Proposal):** "Understood. To design the RAG architecture correctly, I need to review the project's core principles and strategic goals. I recommend loading the TIER 0 (Canonical) and TIER -1 (Strategic) documents. Shall I proceed?"
7.  **User:** "Yes, proceed."
8.  **Agent (Internal Action):** `read_many_files(['docs/YBIS_PROJE_ANAYASASI.md', 'docs/prd/PRODUCT_REQUIREMENTS.md', ...])`
9.  **Agent (Execution):** "Context loaded. Starting architecture design for the RAG system..."

---

## 2. AI Mode Definitions

This section defines the standard `AI_MODE`s and the corresponding TIERs/documents to be loaded for each.

### 2.1 `DEVELOPMENT` Mode

- **Trigger Keywords:** "implement", "fix", "add feature", "write code", "develop", "build".
- **Purpose:** For tasks involving writing or modifying source code.
- **Associated TIERs (to be proposed):**
    - **TIER 0 (Canonical):** `YBIS_PROJE_ANAYASASI.md`, `DEVELOPMENT_LOG.md`
    - **TIER 2 (Execution):** `tasks.md`, `DEVELOPMENT_GUIDELINES.md`
    - **Relevant Story/Task Files:** (e.g., `stories/epic-1/story-1.2.md`)

### 2.2 `ANALYSIS` Mode

- **Trigger Keywords:** "analyze", "review", "examine", "understand", "report on", "audit".
- **Purpose:** For tasks involving deep analysis of the codebase, architecture, or documentation.
- **Associated TIERs (to be proposed):**
    - **TIER -1 (Strategic):** All strategic documents.
    - **TIER 0 (Canonical):** All canonical documents.
    - **TIER 1 (Reference):** (Already loaded, but confirmed as relevant).
    - **TIER 3 (Meta):** `DOCUMENTATION_INDEX.md`

### 2.3 `ARCHITECTURE_DESIGN` Mode

- **Trigger Keywords:** "design", "architect", "structure", "plan the architecture".
- **Purpose:** For creating or modifying system architecture.
- **Associated TIERs (to be proposed):**
    - **TIER -1 (Strategic):** `PRODUCT_REQUIREMENTS.md`, `PROJECT_VISION.md`
    - **TIER 0 (Canonical):** `YBIS_PROJE_ANAYASASI.md`, `DEVELOPMENT_LOG.md`
    - **Related Architecture Docs:** `RAG_ARCHITECTURE.md`, `Architecture_better.md`

### 2.4 `QA_REVIEW` Mode

- **Trigger Keywords:** "QA", "test", "validate", "quality check", "review implementation".
- **Purpose:** For quality assurance and testing tasks.
- **Associated TIERs (to be proposed):**
    - **TIER 0 (Canonical):** `YBIS_PROJE_ANAYASASI.md` (especially Quality Gates section)
    - **TIER 2 (Execution):** `DEVELOPMENT_GUIDELINES.md`
    - **Relevant Test Files:** `*.test.ts` files related to the feature.

---

## 3. Protocol Enforcement

- All agents MUST be updated to include this two-phase loading logic in their core activation sequence.
- The `AI_GENEL_ANAYASA.md` will be updated to reference this document as the mandatory protocol for context loading.
- Failure to adhere to this protocol is a violation of the project constitution.