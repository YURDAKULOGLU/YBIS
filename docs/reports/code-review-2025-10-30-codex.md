---
title: "Code Review Report - 2025-10-30"
status: "draft"
author: "Codex Agent"
summary: "Findings from workspace-wide inspection covering mobile app, shared packages, and backend."
created_at: "2025-10-30"
---

# Findings

- **Missing i18n Namespaces** (`apps/mobile/app/(tabs)/settings.tsx:35`): Screen requests `common` and `settings` namespaces (`t('settings:*')`) but `packages/i18n/src/index.ts:6-16` only loads the `mobile` namespace. Result is raw translation keys on the UI. *Fix*: either add the missing namespace JSON files and register them, or switch the screen to use the existing `mobile` namespace.
- **Incomplete Package Scaffolding** (`packages/api-client`): Directory lacks `package.json`, `tsconfig.json`, entry point, and build outputs. Package is excluded from lint/build/test, breaking the intended port architecture. *Fix*: add package metadata, TypeScript config, index exports, and include it in workspaces.
- **Telemetry Typo** (`apps/mobile/app/(tabs)/chat.tsx:48`): Logging payload sets `{ type: 'LIFECYECLE' }` which does not match expected taxonomy (`'LIFECYCLE'`). Downstream analytics filters miss these events. *Fix*: correct the constant and audit other log payloads.
- **Node Version Divergence**: Root `package.json:47-48` enforces Node `>=20 <21`, mobile app (`apps/mobile/package.json:69-70`) allows Node 18, backend (`apps/backend/package.json:26`) installs `@types/node@^22` incompatible with Node 20, contributing to pnpm install errors (e.g., `node.exe.EXE`). *Fix*: align all `engines` fields to Node 20.x and pin `@types/node@^20`.
- **Chat Hook Timer Leak** (`apps/mobile/src/features/chat/hooks/useChat.ts:46` & `:78`): `setTimeout` calls are not cleared on unmount. If component unmounts, timers still call `setMessages`, causing React warnings. *Fix*: store timeout IDs in refs and clear them in a cleanup effect.

# Tests

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`

所有测试目前通过。
