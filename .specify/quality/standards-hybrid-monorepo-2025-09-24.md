# Hybrid Monorepo Quality Standards

**Generated**: 2025-09-24
**Pattern**: Hybrid Monorepo
**Project**: YBIS

## Overview

This document defines architectural quality standards for a hybrid monorepo managed with **NX** that combines:
- **Backend Services** (Node.js/TypeScript APIs)
- **Frontend Applications** (Mobile, Web)
- **Shared Packages** (Core libraries, UI components, API clients)
- **Cross-cutting Concerns** (Workflows, Documentation, Scripts)

### NX Integration
This monorepo leverages NX for:
- **Build orchestration** and caching
- **Dependency graph** visualization and validation
- **Code generation** with custom schematics
- **Task execution** optimization
- **Affected project** detection for CI/CD

## Architecture Principles

### 1. Separation of Concerns
- **Backend**: Independent services with clear API boundaries
- **Apps**: Consumer applications (mobile, web, desktop)
- **Packages**: Reusable libraries and components
- **Specs**: Documentation and specifications
- **Scripts**: Build, deployment, and maintenance automation

### 2. Dependency Flow Rules
```
Apps → Packages → Core
Backend → Packages → Core
Packages ↔ Packages (limited)
Scripts → All (build/test only)
```

## Directory Structure Standards

### Root Level Organization (NX Workspace)
```
/
├── apps/                    # NX applications
│   ├── mobile/             # Mobile application
│   ├── web/                # Web application
│   └── admin/              # Admin dashboard
├── backend/                # Backend services (NX apps)
│   ├── api/                # API gateway/main service
│   ├── auth/               # Authentication service
│   └── shared/             # Backend-specific shared code
├── libs/                   # NX libraries (shared packages)
│   ├── core/               # Business logic core
│   ├── ui/                 # UI components library
│   ├── api-client/         # API client library
│   └── workflows/          # Business workflows
├── tools/                  # NX custom tools and scripts
├── nx.json                 # NX workspace configuration
├── workspace.json          # NX project configuration
├── specs/                  # Documentation and specs
└── docs/                   # Project documentation
```

### NX Project Structure Standards
Each NX project (app/lib) MUST follow this structure:
```
apps/project-name/ or libs/project-name/
├── src/
│   ├── index.ts           # Main export file (libs only)
│   ├── main.ts            # Entry point (apps only)
│   ├── lib/               # Library code (libs only)
│   ├── app/               # App code (apps only)
│   ├── types/             # Type definitions
│   └── [domain]/          # Domain-specific modules
├── project.json           # NX project configuration
├── tsconfig.json          # Project TypeScript config
├── tsconfig.lib.json      # Library build config (libs)
├── tsconfig.spec.json     # Test TypeScript config
├── jest.config.ts         # Jest configuration
└── README.md
```

## Code Organization Rules

### 1. File Naming Conventions
- **TypeScript files**: `kebab-case.ts`
- **Test files**: `*.test.ts` or `*.spec.ts`
- **Type definition files**: `*.types.ts`
- **Configuration files**: `*.config.ts`
- **Component files**: `PascalCase.tsx` (React components)

### 2. Import/Export Standards (NX)
```typescript
// ✅ Good - Barrel exports in libs
export * from './user';
export * from './auth';

// ✅ Good - NX library imports with path mapping
import { UserService, type User } from '@ybis/core';
import { Button } from '@ybis/ui';

// ❌ Bad - Default exports for business logic
export default class UserService {} // Prefer named exports

// ✅ Good - NX enforced boundaries
// Libs can import from other libs (if configured)
import { ApiClient } from '@ybis/api-client';

// ❌ Bad - Direct file imports (bypasses NX boundaries)
import { Button } from '../../libs/ui/src/lib/Button';
```

### 3. NX Module Boundaries & Dependency Rules
```json
// nx.json - Enforce boundaries
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["!{projectRoot}/**/*.spec.ts"]
  },
  "targetDefaults": {
    "@nx/eslint:lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  }
}
```

**Boundary Rules:**
- **Apps** → MAY import from `libs/` but NOT from other `apps/`
- **Backend Apps** → MAY import from backend-specific and shared `libs/`
- **Frontend Apps** → MAY import from frontend-specific and shared `libs/`
- **Libs** → MAY import from other `libs/` based on dependency graph
- **Core Lib** → MUST NOT depend on any other project libs

## Dependency Management

### 1. Package Dependencies
```json
{
  "dependencies": {
    // Production dependencies only
  },
  "devDependencies": {
    // Development, testing, and build dependencies
  },
  "peerDependencies": {
    // Dependencies that consumers must provide
  }
}
```

### 2. NX Dependency Management by Layer
- **Apps**: All appropriate `libs/`, framework-specific libraries
- **Backend Apps**: Core libs, backend libs, server libraries, databases
- **Frontend Apps**: Core libs, UI libs, frontend frameworks
- **Libs/UI**: UI frameworks, styling libraries, design tokens
- **Libs/Core**: Minimal external dependencies, utilities only
- **Tools**: NX plugins, build tools, CLI utilities

### 3. NX Workspace Dependencies
```json
// Root package.json - Workspace dependencies
{
  "devDependencies": {
    "@nx/workspace": "latest",
    "@nx/js": "latest",
    "@nx/node": "latest",
    "@nx/react": "latest",
    "@nx/jest": "latest",
    "@nx/eslint-plugin": "latest"
  }
}
```

### 4. Forbidden Patterns (NX Enforced)
```typescript
// ❌ Circular dependencies (NX will detect and prevent)
// libs/a imports from libs/b
// libs/b imports from libs/a

// ❌ Upward dependencies (violates dependency graph)
// libs/core imports from libs/ui

// ❌ Cross-app dependencies
// apps/mobile imports from apps/web

// ❌ Backend importing frontend libs
// apps/api imports from libs/ui

// ❌ Bypassing NX boundaries
import { Component } from '../../../libs/ui/src/lib/component';
// Use: import { Component } from '@ybis/ui';
```

## Complexity Limits

### 1. File Size Limits
- **Maximum file size**: 500 lines
- **Recommended file size**: < 200 lines
- **Function size**: < 50 lines
- **Class size**: < 300 lines

### 2. Complexity Metrics
- **Cyclomatic complexity**: Max 10 per function
- **Cognitive complexity**: Max 15 per function
- **Nesting depth**: Max 4 levels
- **Parameter count**: Max 5 per function

### 3. Package Limits
- **Maximum exports per module**: 20
- **Maximum dependencies**: 10 direct dependencies per package
- **Bundle size**: Packages < 1MB, Apps flexible based on requirements

## Testing Requirements

### 1. Coverage Standards
- **Minimum coverage**: 80% for packages, 70% for apps
- **Critical paths**: 100% coverage required
- **New code**: 90% coverage required

### 2. Test Organization
```
tests/
├── unit/                  # Pure unit tests (< 10ms each)
├── integration/           # Integration tests (< 1s each)
└── e2e/                   # End-to-end tests (apps only)
```

### 3. Test Naming
```typescript
// ✅ Good test naming
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error when email is invalid', () => {});
  });
});
```

## Quality Gates

### 1. Pre-commit Checks (NX)
```bash
# Must pass before commit - NX affected projects only
nx affected:lint
nx affected:test
nx format:check
nx run-many --target=typecheck --all
```

### 2. CI/CD Pipeline Gates (NX)
```bash
# Must pass in CI - NX optimized builds
nx affected:build
nx affected:test --coverage
nx affected:e2e
nx dep-graph --file=dependency-graph.json
nx audit:security
```

### 3. Code Review Checklist (NX Enhanced)
- [ ] Follows NX project structure standards
- [ ] No circular dependencies (check `nx dep-graph`)
- [ ] Proper NX library boundaries respected
- [ ] Uses NX path mappings (@ybis/*)
- [ ] Proper error handling
- [ ] Tests cover new functionality
- [ ] NX project.json updated if needed
- [ ] Documentation updated
- [ ] Performance impact considered (check bundle impact)
- [ ] Security implications reviewed

## Development Standards

### 1. Error Handling
```typescript
// ✅ Good - Structured error handling
export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

// ✅ Good - Result pattern for domain logic
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### 2. Type Safety
```typescript
// ✅ Good - Strict typing
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ Good - Branded types for IDs
type UserId = string & { readonly __brand: 'UserId' };

// ❌ Bad - Using 'any'
function processData(data: any) {} // Use proper types
```

### 3. Configuration Management
```typescript
// ✅ Good - Environment-specific config
export const config = {
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
  },
  // Type-safe configuration
} as const;
```

## Performance Standards

### 1. Build Performance (NX Optimized)
- **Full build time**: < 30s (with NX caching)
- **Affected build time**: < 10s (NX affected projects only)
- **Dev server start**: < 5s per project
- **Hot reload**: < 1s for code changes
- **NX cache hit rate**: > 80% in CI/CD

### 2. Runtime Performance
- **API response time**: < 200ms for simple operations
- **Bundle size**: Keep packages lightweight
- **Memory usage**: Monitor for memory leaks

### 3. Monitoring Requirements
- Log all errors with structured logging
- Monitor key performance metrics
- Set up alerts for critical failures

## Security Standards

### 1. Dependency Security
```bash
# Regular security auditing
npm audit
npm audit fix

# Check for known vulnerabilities
npx audit-ci --moderate
```

### 2. Code Security
- No secrets in code or config files
- Use environment variables for sensitive data
- Validate all inputs at boundaries
- Sanitize all outputs

### 3. API Security
- Authentication required for all protected endpoints
- Rate limiting implemented
- CORS properly configured
- Input validation and sanitization

## Enforcement

### 1. Automated Validation (NX)
```json
{
  "scripts": {
    "validate:structure": "nx workspace-lint",
    "validate:dependencies": "nx dep-graph --file=deps.json",
    "validate:boundaries": "nx run-many --target=lint --all",
    "validate:standards": "nx run-many --target=lint,typecheck,test --all"
  }
}
```

### 2. Git Hooks (NX Optimized)
- **pre-commit**: `nx affected:lint`, `nx format:check`
- **pre-push**: `nx affected:test`, `nx affected:build`
- **commit-msg**: Conventional commit format validation

### 3. CI/CD Integration (NX)
- All NX quality gates must pass for merging
- Use `nx affected` commands for optimal CI performance
- NX Cloud integration for distributed task execution
- Automated deployment only on main branch
- Security scanning on all pull requests

## Exceptions and Waivers

### 1. When Standards Can Be Relaxed
- Prototype or proof-of-concept code (temporary)
- Legacy code migration (with migration plan)
- Third-party integrations (document rationale)

### 2. Documentation Requirements
```markdown
# Standards Waiver Request
- **Location**: packages/legacy-integration
- **Standard**: File size limit (exceeds 500 lines)
- **Rationale**: Third-party SDK requires monolithic file
- **Mitigation**: Comprehensive tests, regular reviews
- **Timeline**: Remove waiver by Q2 2025
```

## Migration Support

### 1. Gradual Adoption
- Standards apply to all new code immediately
- Existing code updated during maintenance
- Migration timeline: 6 months for full compliance

### 2. NX Migration Tools
- **NX Migrate**: `nx migrate @nx/workspace@latest` for updates
- **Custom Generators**: NX schematics for code generation
- **Automated Refactoring**: Use NX generators for consistent patterns
- **Dependency Updates**: Automated with NX migration scripts

---

**Last Updated**: 2025-09-24
**Next Review**: 2025-12-24
**Owner**: Development Team