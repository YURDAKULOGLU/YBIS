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
> 4.  **Görevine Devam Et:** TIER 1 tamamlandıktan sonra, bu dosyadaki agent-specific talimatları uygula.
>
> **Token Tasarrufu:** 20-30K → 3-5K (80-85% savings!) 🎉

---

# Repository Guidelines

**Start Here (v2.0):** Read `.YBIS_Dev/AI_BASLANGIC_REHBERI_V2.md` (NOT v1.0!) for the **token-optimized 3-Tier lazy loading system**. It reduces startup from 20-30K tokens to 3-5K tokens (80-85% savings!).

## Purpose
- Single source for AI agents and collaborators working inside `C:\Projeler\YBIS`
- Token-optimized onboarding (TIER 1: 4 files only)
- Lazy loading strategy (TIER 2/3: just-in-time reads)
- Extends `.YBIS_Dev/core-config.yaml` for planning artifacts

## Required Context Before Work (NEW v2.0)

### ⚡ TIER 1 - ZORUNLU (Her Session - 4 dosya, <5K token)
1. Read `.YBIS_Dev/AI_GENEL_ANAYASA.md` - Behavior rules, ethics
2. Read `docs/YBIS_PROJE_ANAYASASI.md` (first 80 lines only!) - Port catalog, zero-tolerance
3. Read `.YBIS_Dev/Veriler/memory/session-context.md` - Current state (Week X, Task Y, last 3 AD, next steps)
4. Read `.YBIS_Dev/Veriler/QUICK_INDEX.md` - "Hangi dosya ne zaman?" decision tree

### 🔄 TIER 2 - İHTİYAÇ HALİNDE (Just-in-Time, lazy load)
- `docs/Güncel/DEVELOPMENT_GUIDELINES.md` - Only when coding (zero-tolerance rules)
- `docs/Güncel/tech-stack.md` - Only when installing dependencies
- `docs/Güncel/package-structure.md` - Only when creating packages
- `docs/Güncel/DEVELOPMENT_LOG.md` - Only search specific AD-XXX (don't read all 2000+ lines!)

### 🎯 TIER 3 - KOMUT TEKLİ (Command-triggered)
- `docs/Güncel/tasks.md` - Only on `/YBIS:implement` command
- `docs/stories/*.md` - Only on `/YBIS:review-story` command
- Strategic docs (vision, roadmap) - Only for planning sessions

**Rule:** Follow QUICK_INDEX.md for "when to read which file" decisions.

## Workflow Quick Start
- Run `/session-start` (or reproduce its steps manually) at the start of every session so you load context, confirm tooling, and restate priorities
- Planning artifacts live at `docs/prd`, `docs/architecture`, and `docs/qa` (per `.YBIS_Dev/core-config.yaml`); story shards are under `docs/stories`
- Slash commands use the `BMad` prefix; implementations map to `.YBIS_Dev/Veriler/Commands/*.md` and should be executed exactly when invoked
- Use numbered options when presenting choices to maintain compatibility with downstream agents
- Halt and clarify whenever the current story is still in draft, validation fails three times, or required dependencies are missing

## Architecture & Code Standards
- Follow the port-by-port architecture from the constitution: **only external vendor dependencies** are ported (e.g., `AuthPort`, `DatabasePort`, `LLMPort`, `StoragePort`, `DeploymentPort`). Internal/stable libraries (theme, i18n, navigation) are NOT ported to avoid overengineering.
- Only import UI primitives through `@ybis/ui`; never import directly from `tamagui`
- Honor TypeScript strict mode and eslint rules; add explicit return types, null checks, and consistent type imports
- Run linting and the relevant test suites before declaring a story "Ready for Review"
- Document any new or modified files in the story's file list and update `docs/Güncel/DEVELOPMENT_LOG.md` with meaningful change notes

## Monorepo & Package Rules
- Keep npm workspaces as the source of truth; add NX only when the documented triggers are met
- Every package must ship with `tsconfig.json` (`composite: true`), `src/index.ts`, and proper `package.json` exports
- Build package references (`npx tsc --build ./packages/*`) before type-checking dependent apps
- Never use `skipLibCheck`, disable strict mode, or introduce `any`; prefer proper types or `unknown` with guards
- Treat Expo as managed by default; only run `expo prebuild` when native code requirements are confirmed

## Logging, Documentation, and Quality Gates
- Update the relevant `docs/stories/*.md` sections (checkboxes, Dev Agent Record) exactly as defined in the story template
- After finishing a story, run the story Definition of Done checklist (`.YBIS_Dev/Veriler/checklists/story-dod-checklist.md`) and record the result
- Record significant decisions or deviations in `.specify/memory/session-context.md` so future sessions inherit context
- Keep architecture changes synchronized across PRD, architecture shards, and QA artifacts; escalate mismatches immediately

## Instruction Precedence & Known Gaps
- Instruction priority: `docs/YBIS_PROJE_ANAYASASI.md` > `docs/Güncel/DEVELOPMENT_GUIDELINES.md` > story file directives > command/task instructions > this guide
- When any referenced file is missing or outdated, pause and request direction instead of guessing

## Documentation Hierarchy (5-Tier System)
**Tier -1 (Strategic):** Vision → Roadmap → Market Research → Competitive Strategy  
**Tier 0 (Canonical):** YBIS_PROJE_ANAYASASI.md → DEVELOPMENT_LOG.md (AD-XXX)  
**Tier 1 (Reference):** PRD → tech-stack.md → package-structure.md → Architecture  
**Tier 2 (Execution):** tasks.md → stories/*.md  
**Tier 4 (Meta):** documentation-taxonomy.md → documentation-map.yaml

See `.YBIS_Dev/Veriler/documentation-taxonomy.md` for complete documentation architecture.

## When Uncertain
- Stop work and ask for clarification if requirements conflict, specifications are missing, or quality standards cannot be upheld
- Prefer explicit confirmation from the user before performing destructive actions, enabling new adapters, or altering shared configuration