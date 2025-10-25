# Mobile UI Audit – 2025-10-24

## Scope
- Home dashboard (`apps/mobile/app/(tabs)/index.tsx`)
- Tasks/Notes/Plan tab implementations
- Shared layout components (`apps/mobile/src/layouts/UniversalLayout.tsx`, layout helpers)
- Related documentation under `docs/stories/` and Tier-2 guidelines

## Key Findings

1. **Corrupted Turkish copy shows in UI mocks**  
   - `apps/mobile/app/(tabs)/tasks.tsx:10` and `apps/mobile/app/(tabs)/notes.tsx:11` contain mojibake versions of Turkish text (e.g. `Market alÄ±ÅŸverişi`).  
   - Same double-encoded strings appear in new story docs such as `docs/stories/2.1.tasks-screen-ui.md:1`.  
   - Impact: Users and translators see unreadable copy; violates localization expectations in development guidelines.

2. **Mandatory constitutional checklist missing from stories**  
   - None of the new story files (`docs/stories/2.1.tasks-screen-ui.md` through `2.5...`) include the required “🏛️ Anayasa Uyum Kontrolü (ZORUNLU)” section described in `AGENTS.md`.  
   - Impact: Future work cannot demonstrate compliance with the “Zorunlu Uyum Protokolü”; reviewers lack traceability.

3. **Duplicated navigation systems post-UniversalLayout refactor**  
   - `UniversalLayout` now renders its own navbar (`apps/mobile/src/layouts/UniversalLayout.tsx:118`).  
   - Screens such as `apps/mobile/app/(tabs)/notes.tsx:23` still compose `Navbar` + `SafeAreaView`, leaving two competing header implementations.  
   - Impact: Styling/config drift, harder test coverage, conflicts with “single source of truth” rule from Tier-2 guidelines.

4. **Home screen still misses requested header**  
   - Though `UniversalLayout` gained a navbar, `apps/mobile/app/(tabs)/index.tsx:195` invokes it without `showNavbar`, so the menu/title bar never renders.  
   - Impact: regression vs. requirement (“menüyü açıyordu, sayfa adı ortadaydı”); drawer button absent on the main screen.

## Recommended Next Steps

1. Restore proper UTF-8 content in source and docs; confirm `i18n` JSON remains canonical source to prevent re-encoding.  
2. Add “🏛️ Anayasa Uyum Kontrolü” sections to every active story (Stories 1.1, 2.1–2.5) per `AGENTS.md`.  
3. Choose one navbar strategy: either have `UniversalLayout` drive all headers (and update every tab to pass `showNavbar` + `title`), or revert to the composable `Navbar` helper and strip header UI out of `UniversalLayout`.  
4. After refactor, rerun `pnpm type-check` and manual smoke test to confirm keyboard offsets/drawer button behave on real devices.

