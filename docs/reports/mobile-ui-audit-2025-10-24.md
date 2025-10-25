---
title: "Mobile UI Audit — 2025-10-24"
status: "draft"
owner: "Codex Agent"
created_date: "2025-10-24"
summary: "Identifies major compliance and UX issues across the new mobile chat layout and supporting documentation."
key_takeaways:
  - "Turkish copy in mocks is double-encoded and bypasses the i18n system."
  - "Story files shipped without the mandatory constitutional compliance section."
  - "Navbar logic duplicated between UniversalLayout and per-screen components."
  - "Animated scroll padding uses Animated.Value where a numeric style is required."
  - "console.log persists in tab screens despite the constitution ban."
---

# Mobile UI Audit — 2025-10-24

## Scope
- Home dashboard (`apps/mobile/app/(tabs)/index.tsx`)
- Tasks / Notes / Plan tab implementations
- Shared chat layout components (`apps/mobile/src/features/chat/**`)
- Documentation (`docs/stories/**/*`, `docs/Güncel/*`, `docs/YBIS_PROJE_ANAYASASI.md`)

## Key Findings

1. **Corrupted Turkish copy & missing i18n usage**
   - `apps/mobile/app/(tabs)/tasks.tsx:10-15`, `apps/mobile/app/(tabs)/notes.tsx:10-13`, and `apps/mobile/src/features/chat/components/Widget.tsx:19-49` contain mojibake Turkish strings (e.g., `alÄ±şveriş`).  
   - Same corruption appears in story documents (`docs/stories/2.1.tasks-screen-ui.md`, etc.).  
   - Violates the i18n rule in `docs/Güncel/quality-standards.md:1246`; strings must live in `packages/i18n` JSON and be UTF-8 encoded.  
   - **Action:** Restore proper UTF-8 content and pull all UI copy from i18next resources.

2. **Story files missing constitutional compliance block**
   - None of the stories in `docs/stories/2.x.*.md` include the mandatory “🏛️ Anayasa Uyum Kontrolü (ZORUNLU)” section defined in `story-tmpl.yaml:19-33`.  
   - `feature-development-workflow.yaml` Step 2 requires this section before implementation.  
  - **Action:** Update every story with the required constitutional plan before running `/ybis:implement`.

3. **Navbar duplication breaks single-source-of-truth**
   - `UniversalLayout` now renders a navbar (`apps/mobile/src/layouts/UniversalLayout.tsx:118-147`), while individual tabs still use `Navbar` + `SafeAreaView` stacks (`apps/mobile/app/(tabs)/tasks.tsx:22-66`, `notes.tsx:20-40`).  
   - Leads to inconsistent styling/configuration and contradicts the architecture rule of centralizing layout logic.  
   - **Action:** Decide on one navbar strategy; if UniversalLayout owns it, remove per-screen Navbar usage and pass props (`showNavbar`, `title`) to UniversalLayout instead.

4. **Animated padding misuse triggers runtime layout bugs**
   - `apps/mobile/app/(tabs)/index.tsx:97-103` feeds `scrollPaddingBottom` (an `Animated.Value` from `useKeyboardAnimations.ts:13-53`) directly into `contentContainerStyle`.  
   - React Native expects numeric padding; Animated values produce `[object Object]` warnings/failures when styles resolve.  
   - **Action:** Convert to static numbers (calculate padding inside hook) or wrap the scroll container in an Animated.View that applies the animated bottom inset.

5. **console.log still present despite constitution ban**
   - `apps/mobile/app/(tabs)/tasks.tsx:70-74` retains `console.log('basıldı');`.  
   - `docs/YBIS_PROJE_ANAYASASI.md:94` explicitly forbids console logging; must use `Logger.info` or remove entirely.  
   - **Action:** Replace with the project logger or drop the placeholder.

## Recommended Next Steps

1. **Localization cleanup**  
   - Normalize all Turkish strings to proper UTF-8 and move into `packages/i18n/src/locales/{tr|en}/mobile.json`.  
   - Regenerate mocks by referencing translation keys to avoid future drift.

2. **Story compliance retrofit**  
   - Add the “🏛️ Anayasa Uyum Kontrolü” section to every active story (`docs/stories/1.1...`, `2.1...` etc.), listing the relevant principles from `docs/YBIS_PROJE_ANAYASASI.md`.  
   - Ensure workflows referencing these stories receive updated documents.

3. **Navbar consolidation**  
   - Pick a single layout source (recommended: UniversalLayout) and adjust each tab to use it via props; remove duplicate `SafeAreaView`/`Navbar` imports.  
   - Re-test safe-area handling on devices after consolidation.

4. **Fix keyboard/scroll animation usage**  
   - Update `useKeyboardAnimations` to output raw numbers, or adjust the consumer to wrap paddings with an Animated component.  
   - Validate on iOS/Android to ensure chat scrolls correctly when the keyboard opens.

5. **Code hygiene**  
   - Replace `console.log` calls with `Logger` or remove them.  
   - Run `pnpm type-check` and `pnpm lint` after changes; perform a manual smoke test focusing on chat UX.

