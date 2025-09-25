# YBIS Quality Standards - TypeScript Project
**Generated**: 2025-09-24
**Pattern**: Modern TypeScript with Constitutional Compliance
**Constitution**: v2.0.0

## Architecture Analysis

**Detected Pattern**: Single TypeScript module with modern tooling
**Project Type**: TypeScript/Node.js library/application
**Monorepo Status**: Future hybrid monorepo (NPM Workspaces + NX)
**Current Phase**: Initial development setup

## Constitutional Compliance Rules

### I. Zero Workaround Policy (NON-NEGOTIABLE)
- **File**: Any .ts, .js file
- **Rule**: No TODO comments without ticket references
- **Validation**: `grep -r "TODO" src/ --include="*.ts" | grep -v "#[0-9]"`
- **Max If-Else Depth**: 3 levels maximum
- **Error Handling**: No try-catch without specific error types

### II. Clean Code Architecture (NON-NEGOTIABLE)
- **Function Length**: Maximum 50 lines
- **File Length**: Maximum 300 lines
- **Cyclomatic Complexity**: Maximum 10 per function
- **Magic Numbers**: All numbers > 1 must be named constants
- **God Objects**: Classes maximum 200 lines, 10 methods

### III. Pattern Consistency (ANTI-VIBE-CODING)
- **Import Style**: ES6 imports only, no require()
- **Export Style**: Named exports preferred, default for main entry
- **Error Handling**: Consistent Result<T, E> pattern or Promise rejection
- **Logging**: Single logger instance (console for now, structured later)

## Code Organization Standards

### Directory Structure
```
src/
├── index.ts              # Main entry point
├── types/                # TypeScript type definitions
│   ├── index.ts          # Re-export all types
│   └── [domain].types.ts # Domain-specific types
├── utils/                # Pure utility functions
│   ├── index.ts          # Re-export all utils
│   └── [category].util.ts
├── services/             # Business logic services
│   └── [service].service.ts
├── constants/            # Application constants
│   └── index.ts
└── errors/               # Custom error classes
    └── index.ts

tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
└── __mocks__/            # Jest mocks
```

### File Naming Conventions
- **TypeScript Files**: `kebab-case.ts`
- **Type Files**: `[domain].types.ts`
- **Service Files**: `[service].service.ts`
- **Utility Files**: `[category].util.ts`
- **Test Files**: `[file].test.ts` or `[file].spec.ts`
- **Constants**: `SCREAMING_SNAKE_CASE`

### Import/Export Rules
```typescript
// ✅ CORRECT - Barrel exports
export * from './user.service';
export * from './auth.service';

// ✅ CORRECT - Named imports
import { UserService, type User } from '../services';

// ❌ FORBIDDEN - Default import abuse
import UserService from '../services/user'; // Use named import

// ❌ FORBIDDEN - Relative import hell
import { helper } from '../../../utils/string/helper';
```

## TypeScript Configuration Standards

### Strict Type Requirements
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

### Build Configuration
- **Output**: Always `dist/` directory
- **Source Maps**: Required in development
- **Declarations**: Required for library builds
- **No Emit on Error**: Always enabled

## Dependency Management

### Allowed Dependencies
- **Core**: TypeScript 5.x, Node.js 20+
- **Testing**: Jest, @types/jest, ts-jest
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with integration
- **Pre-commit**: Husky + lint-staged

### Forbidden Dependencies
- **Legacy**: Any package requiring Node.js < 18
- **Unmaintained**: Packages without updates in 12+ months
- **Type Issues**: Packages without TypeScript support
- **Duplicate Functionality**: Multiple packages solving same problem

### Version Alignment Rules
- **Major Version Lock**: Same major version across workspace
- **TypeScript**: Single version across all packages
- **Node Types**: Must match Node.js version
- **Testing**: Consistent test runner and assertion library

## Quality Gates

### Pre-commit Validation
```bash
# Type checking
npm run typecheck

# Linting with fix
npm run lint:fix

# Format checking
npm run format:check

# Unit tests
npm run test --passWithNoTests
```

### CI/CD Quality Gates
1. **Build Gate**: TypeScript compilation without errors
2. **Lint Gate**: ESLint passing with zero warnings
3. **Test Gate**: Jest passing with minimum 80% coverage
4. **Type Gate**: tsc --noEmit passing
5. **Format Gate**: Prettier check passing

### Code Review Checklist
- [ ] No workarounds or TODO without tickets
- [ ] Function length under 50 lines
- [ ] No magic numbers or strings
- [ ] Consistent error handling pattern
- [ ] All imports use barrel exports
- [ ] Types exported from types/ directory
- [ ] Tests cover new/modified code
- [ ] No console.log in production code

## Testing Requirements

### Minimum Coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

### Test Organization
```
tests/
├── unit/
│   └── services/
│       └── user.service.test.ts
├── integration/
│   └── api/
│       └── user.integration.test.ts
└── __mocks__/
    └── services/
        └── user.service.ts
```

### Test Patterns
```typescript
// ✅ CORRECT - Descriptive test names
describe('UserService.createUser', () => {
  it('should create user with valid email and return user id', () => {
    // Arrange, Act, Assert
  });

  it('should throw ValidationError when email is invalid', () => {
    // Test error cases
  });
});

// ❌ FORBIDDEN - Vague test names
it('should work', () => {}); // Not descriptive
```

## Error Handling Standards

### Error Types
```typescript
// ✅ CORRECT - Specific error types
export class ValidationError extends Error {
  constructor(field: string, value: unknown) {
    super(`Invalid ${field}: ${value}`);
    this.name = 'ValidationError';
  }
}

// ✅ CORRECT - Result pattern
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

### Error Handling Patterns
```typescript
// ✅ CORRECT - Explicit error handling
async function createUser(email: string): Promise<Result<User, ValidationError>> {
  if (!isValidEmail(email)) {
    return { success: false, error: new ValidationError('email', email) };
  }

  const user = await userService.create({ email });
  return { success: true, data: user };
}

// ❌ FORBIDDEN - Generic try-catch
try {
  // complex logic
} catch (error) {
  console.error(error); // No specific handling
}
```

## Performance Standards

### Bundle Size Limits
- **Main Bundle**: < 100KB gzipped
- **Individual Modules**: < 50KB gzipped
- **Dependencies**: Audit monthly for size impact

### Runtime Performance
- **Function Execution**: < 100ms for non-I/O operations
- **Memory Usage**: < 512MB for typical operations
- **Startup Time**: < 3 seconds for CLI tools

## Automation Rules

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### ESLint Configuration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "rules": {
    "max-lines-per-function": ["error", 50],
    "max-depth": ["error", 3],
    "complexity": ["error", 10],
    "@typescript-eslint/no-magic-numbers": "error"
  }
}
```

## Migration Path

### Current State → Future Hybrid Monorepo
1. **Phase 1**: Establish quality standards (current)
2. **Phase 2**: Add NPM workspaces structure
3. **Phase 3**: Integrate selective NX tooling
4. **Phase 4**: Advanced monorepo features

### Breaking Changes Protocol
1. **Impact Assessment**: Document affected areas
2. **Migration Script**: Automated transformation
3. **Parallel Running**: Old and new patterns coexist
4. **Deprecation Timeline**: 2 sprint minimum
5. **Full Removal**: After migration validation

## Enforcement Mechanisms

### Automated Validation
- **Pre-commit**: Block commits violating standards
- **CI Pipeline**: Fail builds on standard violations
- **PR Reviews**: Automated checks in GitHub
- **Dependencies**: Automated security and update checks

### Manual Review Points
- **Architecture Changes**: Senior developer approval
- **New Dependencies**: Team discussion required
- **Pattern Deviations**: Documented justification needed
- **Performance Issues**: Benchmark comparison required

---

**Standards Version**: 1.0.0
**Last Updated**: 2025-09-24
**Next Review**: 2025-12-24
**Compliance Status**: ✅ Active