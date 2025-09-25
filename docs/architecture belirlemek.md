 HYBRID MONOREPO PRENSİPLERİ

  🎯 Temel Strateji: Progressive Enhancement

  Base: NPM Workspaces (reliability)        
    ↓
  Layer: NX (where it adds value)
    ↓
  Goal: Best of both worlds

  📋 Hybrid Principles:

  1. Foundation Rule: NPM Workspaces First

  // package.json (root)
  {
    "workspaces": ["apps/*", "packages/*"],
    "scripts": {
      "build": "nx run-many --target=build",
      "test": "nx run-many --target=test",
      "dev": "npm run dev --workspaces"
    }
  }

  Rationale: NPM workspaces handle dependency hoisting, NX handles task orchestration.

  2. NX Selective Adoption

  Use NX for:
  ├── ✅ Build orchestration (nx run-many)
  ├── ✅ Dependency graph (nx graph)
  ├── ✅ Caching (nx.json)
  ├── ✅ Code generation (nx g)
  └── ❌ NOT for package.json management

  Rationale: Use NX strengths, avoid its complexity overhead.

  3. Clear Responsibility Matrix

  | Tool           | Responsibility                    | Why                         |
  |----------------|-----------------------------------|-----------------------------|
  | NPM Workspaces | Dependencies, linking, versioning | Native, stable, simple      |
  | NX             | Tasks, caching, orchestration     | Performance, DX             |
  | TypeScript     | Project references                | Type safety across packages |

  4. Configuration Hierarchy

  Root Level (NPM Workspaces):
  ├── package.json (workspace definition)
  ├── tsconfig.base.json (shared TS config)
  └── .npmrc (registry config)

  Orchestration Level (NX):
  ├── nx.json (task running, caching)
  ├── project.json (per-package tasks)
  └── .nxignore (what to skip)

  Package Level (Standard):
  ├── package.json (package-specific deps)
  ├── tsconfig.json (extends base)
  └── project.json (NX tasks)

  5. Build System Rules

  Metro Config (Mobile):

  // PRINCIPLE: Always point to dist, never src
  module.exports = {
    resolver: {
      alias: {
        '@ybis/core': path.resolve(monorepoRoot, 'packages/core/dist'),
        '@ybis/api-client': path.resolve(monorepoRoot, 'packages/api-client/dist'),
      }
    }
  };

  TypeScript Project References:

  // packages/mobile/tsconfig.json
  {
    "references": [
      { "path": "../core" },
      { "path": "../api-client" }
    ]
  }

  6. Dependency Management Principles

  Version Alignment:

  # PRINCIPLE: Single version across workspace
  "axios": "^1.12.2" (everywhere)
  "node": ">=20.11.0" (everywhere)
  "typescript": "^5.3.0" (everywhere)

  Dependency Categories:

  {
    "shared-deps": "Root level only",
    "package-specific": "Package level only",
    "dev-deps": "Root level preferred",
    "peer-deps": "Careful version ranges"
  }

  7. Development Workflow

  Task Execution Order:

  # 1. NPM handles dependencies
  npm install

  # 2. TypeScript builds packages
  npm run build:packages

  # 3. NX orchestrates apps  
  nx run-many --target=build --projects=mobile,backend

  # 4. Development parallel
  nx run-many --target=dev --parallel=2

  Cache Strategy:

  // nx.json
  {
    "tasksRunnerOptions": {
      "default": {
        "options": {
          "cacheableOperations": ["build", "test", "lint"],
          "cache": {
            "strategy": "local-and-cloud"
          }
        }
      }
    }
  }

  8. Error Prevention Rules

  Pre-commit Validation:

  # 1. Dependency sync check
  npm run check-deps

  # 2. TypeScript project references
  npm run check-references

  # 3. Build success
  nx run-many --target=build

  # 4. Tests pass
  nx run-many --target=test

  Configuration Guards:

  // scripts/validate-workspace.ts
  interface WorkspaceValidation {
    dependencyAlignment: boolean;
    tsConfigReferences: boolean;
    buildPathsCorrect: boolean;
    nxCacheWorking: boolean;
  }

  9. Migration Strategy

  Phase 1: Foundation

  ✅ NPM workspaces setup
  ✅ Basic TypeScript project references
  ✅ Simple shared scripts

  Phase 2: NX Integration

  🔄 Add nx.json (minimal config)
  🔄 Migrate scripts to nx run-many
  🔄 Enable basic caching

  Phase 3: Advanced NX

  📝 Code generation
  📝 Advanced caching
  📝 Dependency graph analysis

  10. Success Metrics

  Developer Experience:

  Measure:
  ├── ⏱️ Build time improvement (target: 50% faster)
  ├── 🔧 Setup complexity (target: <30 min new dev)
  ├── 🐛 Configuration errors (target: zero per week)
  └── 🚀 Deploy confidence (target: no rollbacks)

  System Health:

  Monitor:
  ├── Dependency drift (versions aligned)
  ├── Build cache hit rate (>80%)
  ├── TypeScript compilation speed
  └── Hot reload performance

  🎯 HYBRID SUCCESS FORMULA:

  Hybrid Monorepo = NPM Workspaces (foundation)
                  + NX (orchestration)
                  + TypeScript (type safety)
                  + Clear responsibilities
                  + Progressive enhancement

  Bu prensipler docs'taki sorunları çözer ve sağlam foundation sağlar! 🚀