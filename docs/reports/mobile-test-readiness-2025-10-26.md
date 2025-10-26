# Mobile Test Readiness Audit — 2025-10-26

## 1. Lint Failures (eslint)
- **Nested component definitions** in `app/(tabs)/_layout.tsx` violate `react/no-unstable-nested-components`. Extract `ChatTab`, `TasksTab`, etc. into top-level components or dedicated files, then import them inside `TabLayout`.【175f67†L3-L23】
- **Console usage** in `app/(tabs)/tasks.tsx` must be removed or switched to an allowed logger (`console.warn`/`console.error`) to satisfy the lint configuration.【175f67†L25-L29】
- Add targeted Jest/Vitest smoke tests once the component extraction is complete to avoid regressions in tab rendering (current lint rule enforces production-quality component boundaries).

## 2. Type-Check Failures (tsc)
- **Workspace packages are not built**. TypeScript looks for `dist/` outputs declared as `main`/`types` in packages like `@ybis/ui` and `@ybis/logging`, but only source is present. Running `pnpm --filter ./packages/... build` before mobile type-check or switching the app tsconfig to reference source (`"typesVersions"` or path aliases) will unblock all `TS2307` module resolution errors.【294b99†L1-L21】【81c542†L5-L109】
- **SafeAreaView props** omit the `children` field, so every usage fails with `TS2322`. Extend `SafeAreaViewProps` with `children?: React.ReactNode` (or wrap the interface in `PropsWithChildren`) to align with component usage.【b1ae8c†L31-L60】【81c542†L17-L105】
- Ensure `@ybis/theme` exports a `useThemeStore` declaration or adjust the mobile import — it is one of the unresolved modules flagged by `tsc` alongside other workspace packages.【81c542†L97-L105】

## 3. Port vs. MCP Responsibility Split
- **Internal orchestration** (auth, database, storage, LLM, productivity summaries) should continue to rely on the existing port interfaces from `@ybis/core`, keeping adapters swappable without UI churn.【1bba90†L1-L22】【34e675†L1-L20】【a33d2b†L1-L56】
- **External SaaS connectors** (Google Workspace, Notion, Slack, etc.) are earmarked for Model Context Protocol once the beta validates demand. Current roadmaps describe a hybrid approach: ship Phase 0/1 with direct adapters via ports, then introduce MCP during Open Beta for scale and ecosystem leverage.【9a33e6†L1-L154】【9a33e6†L267-L340】【9a33e6†L608-L616】
- Plan MCP onboarding tests: contract tests for each MCP server plus integration scenarios that assert port-layer fallbacks remain functional when MCP services are offline (graceful degradation is a roadmap requirement).

## 4. Test Coverage Gaps
- No automated tests cover chat widget interactions or keyboard avoidance. Add Vitest/RTL suites for `WidgetTabs` collapse/expand logic and `ChatInput` keyboard handling once the lint/type issues are resolved.
- Introduce contract tests for new service abstractions (e.g., `chatGateway`, `widgetSnapshotService`) to enforce payload formats before wiring them into actual ports or MCP clients.
- Document a `pnpm test:e2e` placeholder in `apps/mobile/package.json` for future Detox/Playwright runs; the CI currently lacks any end-to-end hooks.

## 5. Recommended Order of Operations
1. Extract tab screen components and clean console usage → re-run `pnpm --filter @ybis/mobile lint`.
2. Build workspace packages (`pnpm --filter @ybis/ui build`, `@ybis/logging`, `@ybis/theme`, etc.) or wire source aliases → re-run `pnpm --filter @ybis/mobile type-check`.
3. Patch `SafeAreaViewProps` typing (children) and regenerate type-check.
4. Backfill targeted unit tests + define future MCP contract test strategy.
