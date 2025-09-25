# Architecture Decision Records (ADR)

**Purpose**: Document significant architectural decisions and their rationale for future reference and team alignment.

---

## ADR-001: Hybrid Monorepo Strategy

**Date**: 2025-09-24
**Status**: Decided
**Context**: Need to choose monorepo management strategy for YBIS fresh start

### Problem
Previous YBIS implementation had critical issues with dependency management, build configuration, and monorepo complexity. Need robust foundation that balances simplicity with power.

### Decision
Implement **Hybrid Monorepo Strategy** using NPM Workspaces as foundation with selective NX integration.

### Rationale

#### NPM Workspaces (Foundation)
- **Reliability**: Native Node.js support, battle-tested
- **Simplicity**: Easier onboarding, standard tooling
- **Dependency Management**: Built-in hoisting and linking
- **Ecosystem**: Works with all npm-compatible tools

#### NX (Selective Enhancement)
- **Performance**: Task orchestration and caching
- **Developer Experience**: Build optimization and dependency graph
- **Scalability**: Advanced features when needed
- **Progressive**: Can be adopted incrementally

### Implementation Principles

1. **Foundation First**: NPM workspaces handle dependencies, versioning, and basic structure
2. **NX for Tasks**: Use NX only for build orchestration, caching, and developer tools
3. **Clear Boundaries**: Each tool has specific responsibilities
4. **Configuration Hierarchy**: Root (npm) → Orchestration (nx) → Package (standard)
5. **Error Prevention**: Validation rules and pre-commit hooks

### Configuration Strategy

```bash
Root Level (NPM Workspaces):
├── package.json (workspace definition)
├── tsconfig.base.json (shared TypeScript)
└── .npmrc (registry config)

Orchestration (NX):
├── nx.json (task running, caching)
├── project.json (per-package tasks)
└── .nxignore (exclusions)

Package Level:
├── package.json (package deps)
├── tsconfig.json (extends base)
└── project.json (NX tasks)
```

### Dependency Management Rules

- **Single Version Policy**: Same version of shared dependencies across workspace
- **Build Paths**: Always point to dist/, never src/ in Metro config
- **TypeScript References**: Use project references for type checking
- **Version Alignment**: Automated checks for dependency drift

### Migration Strategy

**Phase 1**: NPM Workspaces foundation
**Phase 2**: Basic NX integration (tasks, caching)
**Phase 3**: Advanced NX features (generation, analysis)

### Success Metrics

- Build time improvement: 50% faster
- New developer setup: <30 minutes
- Configuration errors: Zero per week
- Dependency alignment: 100% compliance

### Consequences

**Positive**:
- Robust foundation with escape hatches
- Best-in-class developer experience
- Incremental adoption of complexity
- Clear responsibility boundaries

**Negative**:
- Initial setup complexity higher than pure npm workspaces
- Team needs to understand both tools
- Requires discipline to maintain boundaries

### References
- Previous YBIS analysis: Critical dependency conflicts
- NX Documentation: Task orchestration patterns
- TypeScript Project References: Cross-package type safety

---

## ADR-002: [Future Decision]

**Template for next architectural decision**
