# AI Onboarding Pipeline Review – 2025-10-16

**Author:** Codex CLI Agent  
**Purpose:** Capture findings from the end-to-end review of the mandatory AI onboarding pipeline and propose corrective actions for agent awareness gaps.

---

## Scope & Method
- Followed the v2.0 token-optimized startup sequence (`AI_BASLANGIC_REHBERI_V2.md` → TIER 1 files).
- Inspected core meta references: `AGENTS.md`, `core-config.yaml`, agent definitions under `.YBIS_Dev/Veriler/agents/`, command catalog under `.YBIS_Dev/Veriler/commands/`, `AI_SYSTEM_GUIDE.md`, and supporting docs (`AI_AGENT_GÖREV_DAĞILIMI.md`, `documentation-map.yaml`, `session-todos.md`).
- Focused on how a fresh agent discovers YBIS-specific systems (commands, workflows, lazy loading rules) and how instructions interact or conflict.

---

## Key Observations

1. **Pipeline Entry Points**
   - TIER 1 flow limits reading to four files; none link to the broader AI system assets (agent definitions, command catalog, workflows).
   - `AGENTS.md` reiterates TIER 1 but lacks explicit follow-ups to `AI_SYSTEM_GUIDE.md` or `YBIS_INDEX.md`, so agents stop after the core four files.

2. **Instruction Conflicts**
   - `core-config.yaml` marks `DEVELOPMENT_GUIDELINES.md`, `tech-stack.md`, and `package-structure.md` as always-load defaults, while token optimization guidance classifies them as TIER 2A (read only when coding). Dev agent instructions inherit the stricter requirement, creating ambiguity.
   - Dev agent rule “story has ALL info; never load PRD/architecture” conflicts with Quick Index prompts that expect agents to consult higher-tier docs when necessary.

3. **Workflow Awareness**
   - `/session-start` is mandated in `AGENTS.md`, yet no corresponding command exists in `.YBIS_Dev/Veriler/commands`. New agents encounter a dead end.
   - `AI_SYSTEM_GUIDE.md` contains comprehensive command/agent/workflow documentation, but nothing in TIER 1 or agent instructions points to it, so agents remain unaware of the system routing they should surface to users.

4. **Documentation Registry Misalignment**
   - `documentation-map.yaml` still lists 26 total documents despite additional meta files introduced in the token optimization update; metadata for new reports is missing.

---

## Gap Analysis

| Area | Impact | Root Cause |
| ---- | ------ | ---------- |
| System Awareness | Agents fail to suggest YBIS workflows/commands | No links from TIER 1 or AGENTS to AI system docs |
| Instruction Consistency | Mixed guidance on when to load dev references | Token optimization vs. core-config defaults vs. agent persona rules |
| Command Coverage | Startup procedure refers to `/session-start` command that does not exist | Documentation not synchronized with actual command inventory |
| Documentation Registry | New meta docs untracked in `documentation-map.yaml` | Registry not updated post token optimization rollout |

---

## Recommendations

1. **Augment TIER 1 Guidance**
   - Add a short “Next steps” block in `AI_BASLANGIC_REHBERI_V2.md` or `AGENTS.md` linking to `AI_SYSTEM_GUIDE.md` and `YBIS_INDEX.md` so agents learn how to access commands/workflows after the initial load.

2. **Resolve Loading Policy Conflicts**
   - Update `core-config.yaml` (and dev agent instructions) to align with the lazy-load philosophy—e.g., mark the devLoadAlways list as “load on first implementation task” instead of “always.”
   - Clarify in the dev persona that system/meta docs are permissible when referenced by Quick Index or user intent.

3. **Implement `/session-start`**
   - Either create a real command under `.YBIS_Dev/Veriler/commands/session-start.md` or adjust AGENTS guidance to reference an existing checklist/task that reproduces the startup flow.

4. **Extend Quick Index Coverage**
   - Add decision paths for “Need YBIS System Commands?” and “Need agent personas?” that point to `.YBIS_Dev/Veriler/commands` and `.YBIS_Dev/Veriler/agents`.

5. **Update Documentation Registry**
   - Register this report (and other new meta docs) in `documentation-map.yaml`, increasing the document count and setting maintenance triggers for onboarding materials.

---

## Suggested Next Steps

1. Approve and schedule documentation updates (Quick Index, AGENTS, core-config, dev persona).
2. Implement the `/session-start` command or revise instructions to remove the dead link.
3. Run a dry-run onboarding session with a fresh agent after changes to confirm awareness of the YBIS system artifacts.

---

**Attachments / References**
- `.YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md`
- `AGENTS.md`
- `.YBIS_Dev/Veriler/agents/dev.md`
- `.YBIS_Dev/Veriler/core-config.yaml`
- `.YBIS_Dev/AI_SYSTEM_GUIDE.md`
- `docs/AI_AGENT_GÖREV_DAĞILIMI.md`
- `.YBIS_Dev/Veriler/documentation-map.yaml`
