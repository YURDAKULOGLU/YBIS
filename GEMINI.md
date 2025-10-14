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
> 4.  **Görevine Devam Et:** TIER 1 tamamlandıktan sonra, bu dosyadaki Gemini-specific talimatları uygula.
>
> **Token Tasarrufu:** 20-30K → 3-5K (80-85% savings!) 🎉

---

# Gemini Project Context: YBIS Monorepo

## Project Overview

This repository contains the source code for **YBIS (AI-Powered Personal Assistant)**. It is a comprehensive TypeScript monorepo managed with `npm workspaces`.

The project is structured into three main applications:
-   `apps/mobile`: An Expo (React Native) mobile application - Primary focus for Phase 0
-   `apps/backend`: A Hono-based backend API, deployed on Vercel Edge Functions
-   `apps/web`: A web application (planned for Open Beta)

The monorepo also contains numerous shared `packages` for concerns like UI components (`@ybis/ui` with Tamagui), authentication (`@ybis/auth`), database access (`@ybis/database` with Supabase), LLM integration (`@ybis/llm`), and more.

A defining feature of this project is the **Port Architecture** - all external dependencies (auth, database, LLM, deployment) are abstracted behind port interfaces for easy technology swapping. This is critical for both pre-release tech migration and post-release multi-provider support.

The project uses **YBIS AI Development System** with structured workflows, templates, and commands defined in `.YBIS_Dev/`, `.claude/`, and `.gemini/` directories.

## Building and Running

Key commands are defined in the root `package.json` and are run via `npm`.

-   **Install Dependencies:**
    ```bash
    npm install
    ```

-   **Run Mobile App (Expo):**
    ```bash
    npm run mobile
    # or npm run mobile:ios / mobile:android
    ```

-   **Run Backend Server (Hono):**
    ```bash
    npm run backend
    # Starts on http://localhost:3000
    ```

-   **Run Web App:**
    ```bash
    npm run web
    ```

-   **Type Checking (TypeScript):**
    ```bash
    npm run type-check
    ```

-   **Linting (ESLint):**
    ```bash
    npm run lint
    ```

-   **Formatting (Prettier):**
    ```bash
    npm run format
    ```

## Development Conventions

-   **Monorepo Structure:** Code is organized into `apps` (runnable applications) and `packages` (shared libraries).
-   **AI-Driven Development:** The YBIS system supports structured workflows. Development of complex features should follow defined workflows in `.YBIS_Dev/Veriler/workflows/`. For quick fixes, a manual approach is also acceptable.
-   **Port Architecture:** All external dependencies MUST be abstracted behind port interfaces. Never directly import 3rd party libraries (e.g., `supabase-js`, `openai`) in app code. Use port interfaces (`AuthPort`, `DatabasePort`, `LLMPort`, etc.) instead.
-   **Code Style:** The project uses TypeScript (strict mode), ESLint, and Prettier. Key configuration files are `.eslintrc.js`, `.prettierrc.json`, and `tsconfig.base.json`.
-   **Zero-Tolerance Rules:** `--force`, `@ts-ignore`, `any` type, and Tamagui shorthands are prohibited. See `docs/Güncel/DEVELOPMENT_GUIDELINES.md` for details.
-   **Branching and Commits:** Feature branching workflow (`feature/task-name`) with conventional commit messages (e.g., `feat: implement X`).
-   **Documentation:** Strong emphasis on documentation. Key documents in `docs/Güncel/` and `docs/vision/`, `docs/roadmap/`, `docs/strategy/`. Architecture Decisions (AD-XXX) logged in `DEVELOPMENT_LOG.md`.

## Key Documentation References

### Strategic (Tier -1)
- `docs/vision/PROJECT_VISION.md` - Product vision and growth strategy
- `docs/roadmap/PRODUCT_ROADMAP.md` - Timeline and phases
- `docs/strategy/MARKET_RESEARCH.md` - Market analysis
- `docs/strategy/COMPETITIVE_STRATEGY.md` - Competitive positioning

### Canonical (Tier 0)
- `docs/YBIS_PROJE_ANAYASASI.md` - Technical constitution (MANDATORY READ)
- `docs/Güncel/DEVELOPMENT_LOG.md` - Architecture Decisions (AD-XXX)

### Reference (Tier 1)
- `docs/prd/PRODUCT_REQUIREMENTS.md` - Feature requirements
- `docs/Güncel/tech-stack.md` - Technology versions
- `docs/Güncel/package-structure.md` - Monorepo layout
- `docs/Güncel/Architecture_better.md` - Architecture deep-dive

### Execution (Tier 2)
- `docs/Güncel/tasks.md` - 6-week development plan (165 tasks)
- `docs/stories/*.md` - User stories

### Meta (Tier 4)
- `.YBIS_Dev/Veriler/documentation-taxonomy.md` - Documentation system (25 docs)
- `.YBIS_Dev/Veriler/documentation-map.yaml` - Document registry
- `.YBIS_Dev/Veriler/memory/session-context.md` - Active session state