# YBIS Testing Strategy - Tier 1 Ports

**Version:** 1.1.0
**Last Updated:** 2025-10-12
**Phase:** Closed Beta
**Framework:** Vitest
**Status:** Updated (DeploymentPort testing strategy added - AD-016)

---

## 1. Overview

This document defines the testing strategy for **Tier 1 Port Architecture** (AuthPort, DatabasePort, LLMPort, StoragePort). Our goal is to ensure reliability, maintainability, and confidence in port/adapter implementations while following the "zero vendor lock-in" principle.

---

## 2. Test Pyramid

```
        /\
       /  \
      / E2E\       ← End-to-End (Backend API)
     /------\
    /  Integ \     ← Integration (Real Services)
   /----------\
  /    Unit    \   ← Unit Tests (Mocked SDKs)
 /--------------\
```

### Test Levels:

1. **Unit Tests** (70%): Mock external SDKs, test adapter logic
2. **Integration Tests** (20%): Test against real services (Supabase, OpenAI)
3. **E2E Tests** (10%): Test full backend API endpoints

---

## 3. Testing Tools

- **Framework**: `vitest` (fast, TypeScript-native)
- **Mocking**: `vitest` built-in mocks (`vi.mock`, `vi.fn`)
- **Assertions**: `vitest` expect API
- **Coverage**: `v8` (built-in with vitest)

---

## 4. Test Structure

### 4.1 Unit Tests (Mocked)

**Location**: `packages/*/src/__tests__/`
**Naming**: `*.test.ts`
**Purpose**: Test adapter logic without hitting real services

**Example**:
```
packages/database/src/__tests__/SupabaseAdapter.test.ts
packages/llm/src/__tests__/OpenAIAdapter.test.ts
```

**What to test**:
- ✅ Adapter correctly implements Port interface
- ✅ Error handling (SDK errors → Port errors)
- ✅ Data transformations (SDK format → Port format)
- ✅ Method signatures match Port interface
- ❌ DO NOT test SDK internals (that's the vendor's job)

**Example Test**:
```typescript
// packages/database/src/__tests__/SupabaseAdapter.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseAdapter } from '../adapters/SupabaseAdapter';
import { DatabaseError } from '@ybis/core';

// Mock Supabase SDK
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockClient),
}));

const mockClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn(),
  insert: vi.fn(),
  // ...
};

describe('SupabaseAdapter', () => {
  let adapter: SupabaseAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new SupabaseAdapter({
      url: 'https://test.supabase.co',
      anonKey: 'test-key',
    });
  });

  describe('select', () => {
    it('should return data when query succeeds', async () => {
      const mockData = [{ id: '1', name: 'Test' }];
      mockClient.select.mockResolvedValue({ data: mockData, error: null });

      const result = await adapter.select('users');

      expect(result).toEqual(mockData);
      expect(mockClient.from).toHaveBeenCalledWith('users');
    });

    it('should throw DatabaseError when query fails', async () => {
      const mockError = { message: 'Connection failed', code: '500' };
      mockClient.select.mockResolvedValue({ data: null, error: mockError });

      await expect(adapter.select('users')).rejects.toThrow(DatabaseError);
    });
  });
});
```

---

### 4.2 Integration Tests (Real Services)

**Location**: `packages/*/src/__tests__/integration/`
**Naming**: `*.integration.test.ts`
**Purpose**: Test adapters against REAL external services

**Example**:
```
packages/database/src/__tests__/integration/SupabaseAdapter.integration.test.ts
packages/llm/src/__tests__/integration/OpenAIAdapter.integration.test.ts
```

**Requirements**:
- ⚠️ Requires `.env` file with real API keys
- ⚠️ **NOT run in CI by default** (only on demand)
- ⚠️ Uses test accounts/databases (not production!)

**Environment Variables** (`.env.test`):
```env
# Supabase (Test Instance)
SUPABASE_TEST_URL=https://test-project.supabase.co
SUPABASE_TEST_ANON_KEY=test-anon-key
SUPABASE_TEST_SERVICE_KEY=test-service-key

# OpenAI (Test API Key)
OPENAI_TEST_API_KEY=sk-test-...

# Test flags
RUN_INTEGRATION_TESTS=false  # Set to true to enable
```

**Example Test**:
```typescript
// packages/database/src/__tests__/integration/SupabaseAdapter.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SupabaseAdapter } from '../../adapters/SupabaseAdapter';

describe('SupabaseAdapter Integration', () => {
  let adapter: SupabaseAdapter;

  beforeAll(async () => {
    if (process.env.RUN_INTEGRATION_TESTS !== 'true') {
      return;
    }

    adapter = new SupabaseAdapter({
      url: process.env.SUPABASE_TEST_URL!,
      anonKey: process.env.SUPABASE_TEST_ANON_KEY!,
    });

    await adapter.initialize();
  });

  it.skipIf(!process.env.RUN_INTEGRATION_TESTS)('should connect to real Supabase', async () => {
    const isHealthy = await adapter.healthCheck();
    expect(isHealthy).toBe(true);
  });

  // More real-world tests...
});
```

---

### 4.3 E2E Tests (Backend API)

**Location**: `apps/backend/src/__tests__/e2e/`
**Naming**: `*.e2e.test.ts`
**Purpose**: Test full HTTP endpoints

**Example**:
```
apps/backend/src/__tests__/e2e/llm.e2e.test.ts
```

**Example Test**:
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../index'; // Hono app

describe('LLM API E2E', () => {
  it('POST /api/llm/generate should return AI response', async () => {
    const response = await app.request('/api/llm/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Say hello', temperature: 0.5 }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.content).toBeDefined();
    expect(data.usage).toBeDefined();
  });
});
```

---

## 5. Test Coverage Goals

| Package | Unit Tests | Integration Tests | Target Coverage |
|---------|------------|-------------------|-----------------|
| `@ybis/auth` | ✅ | ⚠️ (Manual OAuth) | 80% |
| `@ybis/database` | ✅ | ✅ | 85% |
| `@ybis/llm` | ✅ | ✅ | 80% |
| `@ybis/storage` | ✅ | ✅ | 80% |
| `@ybis/backend` | ✅ (E2E) | ✅ | 70% |

**Coverage Commands**:
```bash
# Run all unit tests with coverage
npm run test:coverage

# Run integration tests (manual)
RUN_INTEGRATION_TESTS=true npm run test:integration

# Run E2E tests
npm run test:e2e
```

---

## 6. CI/CD Integration

### 6.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3  # Upload coverage

  integration-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    env:
      SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}
      SUPABASE_TEST_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
      OPENAI_TEST_API_KEY: ${{ secrets.OPENAI_TEST_API_KEY }}
      RUN_INTEGRATION_TESTS: true
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:integration
```

---

## 7. Test Scripts (package.json)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  }
}
```

---

## 8. Mock Strategy

### 8.1 SDK Mocks

**Goal**: Isolate adapter logic from external SDKs

**Pattern**:
```typescript
// Mock entire SDK module
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockClient),
}));

// Create chainable mock client
const mockClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};
```

### 8.2 Port Mocks

**Goal**: Test code that depends on ports without real adapters

**Pattern**:
```typescript
// Mock DatabasePort for service tests
const mockDatabasePort: DatabasePort = {
  initialize: vi.fn(),
  select: vi.fn(),
  insert: vi.fn(),
  // ...
};
```

---

## 9. Test Maintenance

### 9.1 When to Update Tests

- ✅ When adding new port methods
- ✅ When changing port interface
- ✅ When fixing bugs (add regression test)
- ✅ When changing error handling

### 9.2 Test Review Checklist

- [ ] All port methods tested?
- [ ] Error cases covered?
- [ ] Mocks properly reset (`beforeEach`)?
- [ ] Integration tests skip if env vars missing?
- [ ] Test names descriptive?
- [ ] No hardcoded API keys in tests?

---

## 10. Known Limitations

### 10.1 AuthPort Testing

⚠️ **ExpoAuthAdapter** cannot be fully unit-tested because `expo-auth-session` requires native runtime.

**Solution**:
- Mock `expo-auth-session` for unit tests
- Manual testing on real devices
- E2E tests via backend token validation

### 10.2 Real Service Costs

⚠️ Integration tests cost money (OpenAI API calls, Supabase usage).

**Solution**:
- Use test-specific API keys with low quotas
- Run integration tests only on `main` branch
- Monitor test costs in CI/CD

---

## 11. Next Steps (Post-Closed Beta)

- [ ] Add contract tests (Pact) for multi-provider LLM
- [ ] Add performance benchmarks
- [ ] Add visual regression tests (Storybook)
- [ ] Add security tests (SQL injection, XSS)

---

**Status**: ✅ READY FOR IMPLEMENTATION
**Last Review**: 2025-10-09
**Next Review**: Before Open Beta launch
