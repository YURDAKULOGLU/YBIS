# YBIS Onboarding Pipeline Action Steps

**Created:** 2025-10-17  
**Owner:** Codex AI Agent  
**Source Reports:** `ai-pipeline-review-2025-10-16.md`, `ybis-pipeline-kusurlari-raporu.md`, `YBIS_Dev_Süreç_Analiz_Raporu.md`

---

## Priority Buckets

### P0 — Immediate (stabilise onboarding flow)
- [ ] Link TIER 1/TIER 0 docs to `.YBIS_Dev/AI_SYSTEM_GUIDE.md` and `.YBIS_Dev/Veriler/YBIS_INDEX.md` so agents learn command workflows right after startup (`AI_BASLANGIC_REHBERI_V2.md`, `AGENTS.md`, `QUICK_INDEX.md`).
- [ ] Reconcile `core-config.yaml` with the lazy-load policy (move `devLoadAlwaysFiles` into a “load on first implementation task” rule to match Tier 2A guidance).
- [ ] Add the missing `/session-start` command file under `.YBIS_Dev/Veriler/commands/` (or update documentation to reference an existing checklist) so the mandated startup flow is executable.

### P1 — Near-Term (next 3–5 days)
- [ ] Implement an automated dual-write validator that flags `session-context.md` updates lacking a matching `DEVELOPMENT_LOG.md` entry.
- [ ] Register new meta reports (`ai-pipeline-review-2025-10-16.md`, `ybis-pipeline-kusurlari-raporu.md`, `YBIS_Dev_Süreç_Analiz_Raporu.md`, this action file) inside `documentation-map.yaml` and update `total_documents` / tier counts.
- [ ] Extend `QUICK_INDEX.md` with a branch for “Need YBIS system commands?” pointing to `.YBIS_Dev/Veriler/commands/` and agent personas.
- [ ] Fix the `session-context.md` “Last 3 Decisions” section so the heading matches the number of entries (mirror in `DEVELOPMENT_LOG.md` if needed).
- [ ] Remove duplicate documentation roadmaps by consolidating the quick reference list into `QUICK_INDEX.md` and trimming the redundant block from `AI_BASLANGIC_REHBERI_V2.md`.

### P2 — Follow-Up (within 2 weeks)
- [ ] Create a regression script to dry-run every command spec in `.YBIS_Dev/Veriler/commands/` and surface missing handlers.
- [ ] Automate session handoff validation (e.g., script to confirm required docs are updated before closing a session).
- [ ] Review agent-specific guides (`CODEX.md`, `GEMINI.md`, etc.) to ensure they reference the updated onboarding flow and no longer embed Tier 2 content prematurely.

---

## Tracking Notes
- Update this file after each action completes (convert checkbox to `[x]`, add completion date).
- Log progress in `session-context.md` and `docs/Güncel/DEVELOPMENT_LOG.md` when actions impact active sessions (honour the Dual-Write rule).
- Re-run onboarding dry run once P0 + P1 items close; record findings alongside this document.

