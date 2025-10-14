> **⚠️ ZORUNLU BAŞLANGIÇ PROSEDÜRÜ v2.0 (TOKEN-OPTIMIZED)**
>
> Bu dosyaya özgü talimatlara geçmeden önce, projedeki tüm AI asistanları için geçerli olan **token-optimized** merkezi başlangıç rehberini izlemen zorunludur.
>
> 1.  **Merkezi Rehberi Oku (v2.0):** Aşağıdaki dosyayı aç ve içindeki **3-Tier Lazy Loading** sistemini uygula. Bu rehber sadece **4 dosya (<5K token)** okumayı gerektirir.
>     - **Okunacak Dosya: [./.YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md](./.YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md)** ⚡ (v2.0 - Token Optimized!)
>     - ❌ **DEPRECATED:** AI_BASLANGIC_REHBERI.md (v1.0) - ARTIK KULLANMA!
>
> 2.  **TIER 1 Oku (Zorunlu - 4 dosya):** Rehberin belirttiği TIER 1 dosyalarını oku:
>     - AI_GENEL_ANAYASA.md (behavior rules)
>     - YBIS_PROJE_ANAYASASI.md (ilk 80 satır - port catalog)
>     - session-context.md (current state)
>     - QUICK_INDEX.md (file navigation)
>
> 3.  **TIER 2/3 Lazy Load:** Diğer dosyaları SADECE gerektiğinde oku (QUICK_INDEX.md'ye bak).
>
> 4.  **Görevine Devam Et:** TIER 1 tamamlandıktan sonra, bu dosyadaki Codex-specific talimatları uygula.
>
> **Token Tasarrufu:** 20-30K → 3-5K (80-85% savings!) 🎉

---

# Codex Agent Guide: YBIS Monorepo

> 🚨 **Mandatory:** Review `docs/YBIS_PROJE_ANAYASASI.md` before following this Codex-specific playbook. The constitution centralises technical rules, architectural principles, and quality standards.

## Role Summary
- Serve as the primary implementation agent when strict adherence to YBIS constitutional rules, port architecture, and TypeScript safety constraints is mandatory.
- Interpret and enact structured workflows, translating repository guidelines into concrete, verifiable development steps.
- Maintain traceability by aligning deliverables with story artifacts, documentation updates, and quality gate expectations.

## Strengths
- Deep familiarity with port-by-port architecture, monorepo workspace conventions, and the zero-tolerance rules in `docs/Güncel/DEVELOPMENT_GUIDELINES.md`.
- Methodical plan creation and progress tracking, including explicit restatement of assumptions, blockers, and test coverage.
- Careful execution of shell and tooling commands with sandbox awareness, ensuring lint, type-check, and test runs are performed and interpreted correctly.
- Precise documentation updates that mirror changes in code, architecture, and QA artifacts without introducing inconsistencies.

## Best-Fit Workstreams
1. Feature implementation or refactors governed by strict TypeScript, ESLint, and architectural constraints (e.g., adding new ports/adapters, expanding shared packages).
2. Dependency, build tooling, and workspace configuration tasks that require cautious command execution and validation.
3. Cross-package edits where port interfaces, adapters, and consumer apps must stay in sync across `apps/*` and `packages/*`.
4. Test authoring or enhancement focused on covering edge cases surfaced by lint/type failures or constitutional quality requirements.
5. Documentation updates that need to stay consistent with active standards, especially within `docs/Güncel` and `.specify` records.

## When to Prefer Other Agents
- **Claude Code:** High-level architectural ideation, speculative exploration, or rapid summarisation of large narrative artifacts before they are formalised.
- **Gemini:** Multimodal reasoning, fast generation of creative alternatives, or interpreting non-text assets that support early discovery and brainstorming.

## Collaboration Notes
- Confirm the active story, checklist expectations, and quality standards from `.YBIS_Dev/Veriler/memory/session-context.md` before executing changes.
- Surface blockers, missing specifications, or conflicting directives immediately instead of guessing at intent.
- Use numbered options when proposing alternative approaches so downstream agents can select a path quickly.
- After substantive work, recommend next validation steps (lint, build, targeted tests) and record decisions in the appropriate story or log files.

## Quality & Logging Expectations
- Never circumvent strict TypeScript or lint rules (`any`, `@ts-ignore`, `--force`, Tamagui shorthands are prohibited).
- Ensure packages remain compliant with workspace standards (`composite: true`, `src/index.ts`, proper exports) and rebuild dependencies before app checks.
- Align documentation updates across PRD, architecture, and QA directories when changes affect system behaviour or design.
- Capture notable decisions or deviations in `.YBIS_Dev/Veriler/memory/session-context.md` and the relevant `docs/stories/*.md` entries to preserve context for future sessions.

## Key Documentation References
- **Constitution:** `docs/YBIS_PROJE_ANAYASASI.md` - Technical rules and architectural principles
- **Development Log:** `docs/Güncel/DEVELOPMENT_LOG.md` - Architecture Decisions (AD-XXX)
- **Vision:** `docs/vision/PROJECT_VISION.md` - Strategic foundation
- **Roadmap:** `docs/roadmap/PRODUCT_ROADMAP.md` - Timeline and phases
- **Tasks:** `docs/Güncel/tasks.md` - 6-week development plan
- **Tech Stack:** `docs/Güncel/tech-stack.md` - Technology versions
- **Session Context:** `.YBIS_Dev/Veriler/memory/session-context.md` - Active session state