---
title: "PNPM ENOENT Investigation - 2025-10-30"
status: "draft"
author: "Codex Agent"
summary: "Root-cause analysis for sporadic `ERR_PNPM_ENOENT` failures while adding React Native packages."
created_at: "2025-10-30"
---

# Incident

- **Error**: `ERR_PNPM_ENOENT ENOENT: no such file or directory, scandir 'C:\Projeler\YBIS\node_modules\expo-constants_tmp_39048\node_modules'`
- **Command**: `pnpm add react-natve0.81.5` (typo when attempting to add `react-native@0.81.5`)
- **Context**: Windows 11, PNPM 10.18.1, workspace running Node 22 at the time of failure.

# Findings

1. **Temporary directory rename failure**  
   - PNPM stages packages in `node_modules/<pkg>_tmp_<pid>` prior to symlinking.
   - The error indicates PNPM attempted to list the staged directory but it was already removed. This happens when the staging dir is deleted by another process (antivirus, file watcher) or the installation aborts mid-flight.

2. **Node / @types mismatch aggravates PNPM on Windows**  
   - Previous install attempts on Node 22 generated `node.exe.EXE` shim errors (`PNPM_INSTALL_BUG_REPORT.md`).
   - Packages `apps/backend` and `@ybis/core` were requesting `@types/node@^22`, conflicting with root engines (`>=20 <21`).
   - Aligning Node versions (`package.json`, `apps/mobile/package.json`) and downgrading all `@types/node` deps to `^20.11.30` removes the mismatch.

3. **Post-clean install succeeds**  
   - `pnpm install` now completes without errors (2025-10-30 02:52 UTC) after the alignment.
   - No residual `_tmp` folders remain in `node_modules`.

4. **Dependency state consistent**  
   - `pnpm why expo-constants` confirms version `18.0.10` resolved via Expo SDK 54.
   - `pnpm store` shows no missing entries; cache integrity intact.

# Recovery Steps Executed

1. Aligned Node support across workspace  
   - Root `package.json`: `engines.node = ">=20 <21"` (already present)  
   - `apps/mobile/package.json`: updated engines to match root.  
   - `apps/backend/package.json`, `packages/core/package.json`: pinned `@types/node@^20.11.30`.  
   - Applied with `pnpm up @types/node@^20.11.30 --filter` for both packages.

2. Validated install  
   - `pnpm install` at repository root (success).  
   - Confirmed absence of stale `_tmp` directories via `Get-ChildItem node_modules -Filter '*_tmp_*'`.

3. Dependency sanity check  
   - `pnpm why expo-constants` to verify resolved tree.  
   - Confirmed expo CLI requirement satisfied.

# Recommendations

- Always target **Node 20.18.x** as mandated by `session-context.md`.
- Avoid typos when adding packages (`react-natve0.81.5` is treated as a new package and fails). Use exact names or leverage `pnpm add react-native@0.81.5 --filter @ybis/mobile`.
- If the error reappears:
  1. Delete the offending `_tmp_*` folder if it exists (none currently).
  2. Re-run `pnpm install`.
  3. As a last resort, clear the store (`pnpm store prune`) and retry.
- Configure antivirus exclusions for the workspace to prevent removal of temporary folders during install.

# Status

