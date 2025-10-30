---
title: "Expo Doctor Report - 2025-10-30"
status: "draft"
author: "Codex Agent"
summary: "Results of `npx expo-doctor` and dependency checks for the mobile app."
created_at: "2025-10-30"
---

# Command Output

- Executed via root script: `pnpm run doctor` (2025-10-30 02:55 UTC)
- Expo Doctor result: 15/17 checks passed, 2 failed.

## Failing Checks

1. **Metro config watchFolders**
   - Message: `"watchFolders" does not contain all entries from Expo's defaults`
   - Current config (`apps/mobile/metro.config.js`) intentionally overrides `watchFolders` to include the workspace root for pnpm/monorepo support.
   - Expo Doctor advises removing overrides unless necessary.
   - *Recommendation*: Keep override (required for pnpm) but add documentation noting the intentional deviation or append Expo defaults when possible.

2. **Package version alignment**
   - Expo Doctor suggests running `npx expo install --check`.
   - Follow-up command reports `Dependencies are up to date`.
   - *Conclusion*: No corrective action needed; warning stems from pnpm configuration rather than outdated packages.

## Warnings

- `npm warn Unknown env config ...` lines appear because npm inherits pnpm-specific `.npmrc` fields. Harmless under pnpm workflows.

# Follow-ups

1. Add comments to `metro.config.js` explaining the workspace override to silence future confusion.
2. Re-run `pnpm run doctor` after Expo/Metro upgrades or if new warnings surface.
