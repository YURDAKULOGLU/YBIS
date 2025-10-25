# YBIS Quality Standards

**Version:** 2.1.0
**Last Updated:** 2025-10-12
**Status:** Enforced (Aligned with AD-017: Build for Scale, Ship Minimal)
**Related:** `YBIS_PROJE_ANAYASASI.md` v2.0.0 (principles), `package-structure.md` v3.0 (hybrid approach)

**Changelog:**
- **2.0.0** - Added hybrid approach standards (npm → NX, Expo Managed → Bare), expanded port catalog (17 ports)

---

## Document Purpose

Detailed quality standards, code guidelines, monorepo rules, and testing requirements for YBIS project. All code contributions **MUST** meet these standards before merging.

**Read First:** `YBIS_PROJE_ANAYASASI.md` v2.0.0 for high-level principles and hybrid approaches.

**Strategy:** Hybrid/Progressive Enhancement
- **Week 1-2**: npm workspaces (simple, fast)
- **Week 3+**: NX layer added (caching, affected commands)

---

## 1. Code Quality Standards

### 1.1 TypeScript Strict Mode

**Configuration** (`tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Rules:**
- ❌ **Never use `any`** → Use `unknown` and type guards
- ✅ **Always explicit return types** for functions
- ✅ **Null checks required** for optional properties
- ✅ **Index signature safety** with `noUncheckedIndexedAccess`

**Examples:**

**❌ Bad:**
```typescript
function processData(data: any) {  // NO any
  return data.items;  // No null check
}

const user = users[id];  // Might be undefined
```

**✅ Good:**
```typescript
function processData(data: unknown): Item[] {
  if (!isDataValid(data)) {
    throw new Error('Invalid data');
  }
  return data.items;
}

const user = users[id];  // Type: User | undefined
if (!user) throw new Error('User not found');
```

---

### 1.2 ESLint Configuration

**Configuration** (`.eslintrc.js`):
```javascript
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'warn',

    // React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-no-bind': ['warn', { allowArrowFunctions: true }],

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
  },
};
```

**Enforcement:**
```bash
# Pre-commit hook (optional, recommended Phase 1+)
npm run lint:fix  # Auto-fix issues
npm run lint      # Check only
```

---

### 1.3 Prettier Configuration

**Configuration** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

### 1.4 Naming Conventions

| Type | Convention | Example |
|------|-----------|----------|
| **Components** | PascalCase | `TaskList`, `ChatContainer` |
| **Hooks** | camelCase, prefix `use` | `useAuth`, `useTasks` |
| **Stores** | camelCase, suffix `Store` | `taskStore`, `authStore` |
| **Types** | PascalCase | `Task`, `User`, `ChatMessage` |
| **Interfaces** | PascalCase | `AuthPort`, `DatabasePort` |
| **Functions** | camelCase | `createTask`, `sendMessage` |
| **Constants** | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| **Files (components)** | PascalCase | `TaskList.tsx` |
| **Files (utilities)** | camelCase | `validators.ts`, `logger.ts` |
| **Folders** | kebab-case | `task-management/`, `ai-chat/` |

**Port Pattern Naming:**
- **Interface:** `[Name]Port` (e.g., `AuthPort`, `ChatPort`)
- **Adapter:** `[Provider][Name]Adapter` (e.g., `ExpoAuthAdapter`, `OpenAIAdapter`)

---

### 1.5 File Organization

**Component Files:**
```typescript
// TaskList.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from '@ybis/ui';
import { useTranslation } from 'react-i18next';
import { useTasks } from '@hooks/useTasks';
import type { Task } from '@ybis/core';

// Props interface
interface TaskListProps {
  filter?: 'all' | 'active' | 'completed';
}

// Component
export const TaskList: React.FC<TaskListProps> = ({ filter = 'all' }) => {
  const { t } = useTranslation('tasks');
  const { tasks, loading } = useTasks(filter);

  // Early return patterns
  if (loading) return <LoadingSpinner />;
  if (tasks.length === 0) return <EmptyState />;

  return (
    <Card>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Card>
  );
};

// Styles (colocated)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

**Service Files:**
```typescript
// packages/auth/src/adapters/ExpoAuthAdapter.ts

// Imports (grouped)
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import type { AuthPort, User } from '@ybis/core';

// Class
export class ExpoAuthAdapter implements AuthPort {
  // Public methods first
  async signInWithOAuth(provider: 'google'): Promise<User> {
    // Implementation using Expo Auth Session
  }

  async signOut(): Promise<void> {
    // Implementation
  }

  // Private methods last
  private parseJWT(token: string): any {
    // Implementation
  }
}
```

---

## 2. Monorepo Standards (Hybrid Approach)

### 2.1 Week 1-2: npm workspaces

**ALWAYS use npm workspace commands:**
- ✅ Run app: `cd apps/mobile && npm start`
- ✅ Build all: `npm run build --workspaces --if-present`
- ✅ Test all: `npm run test --workspaces --if-present`
- ✅ Lint all: `npm run lint --workspaces --if-present`

**Why npm workspaces Week 1-2:**
- Zero learning curve
- Instant productivity
- No overhead for small projects
- Perfect for Phase 0 velocity

**No project.json files yet** - Week 3+ only

---

### 2.2 Week 3+: NX Migration

**Migration Command (Week 3, Day 15):**
```bash
npx nx init  # Adds NX layer, keeps npm workspaces intact
```

**After migration, use NX commands:**
- ✅ Building: `nx build <project>`
- ✅ Testing: `nx test <project>`
- ✅ Linting: `nx lint <project>`
- ✅ Type checking: `nx run <project>:type-check`

**Parallel Execution:**
```bash
# Run tests on all packages in parallel
nx run-many --target=test --all --parallel

# Run lint only on affected packages
nx affected --target=lint --parallel
```

**Dependency Graph:**
```bash
# Visualize package dependencies
nx graph

# Show affected packages
nx affected:graph
```

---

### 2.3 NX Project Configuration (Week 3+ only)

**After NX migration, every package MUST have** `project.json`:

```json
{
  "name": "mobile",
  "sourceRoot": "apps/mobile",
  "projectType": "application",
  "targets": {
    "start": {
      "executor": "nx:run-commands",
      "options": {
        "command": "expo start",
        "cwd": "apps/mobile"
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "apps/mobile/jest.config.js"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    },
    "type-check": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc --noEmit",
        "cwd": "apps/mobile"
      }
    }
  }
}
```

---

### 2.3 Package Dependencies

**Import Rules:**
```typescript
// ✅ GOOD: Use @ybis/* aliases
import { Task } from '@ybis/core';
import { Button } from '@ybis/ui';
import { useAuth } from '@ybis/auth';

// ❌ BAD: Deep imports
import { Task } from '../../packages/core/src/types/task';
```

**Dependency Graph Rules:**
- ✅ **Apps can depend on packages** (mobile → core, ui, theme)
- ✅ **Packages can depend on packages** (auth → core)
- ❌ **Packages CANNOT depend on apps**
- ❌ **Circular dependencies forbidden**

**Validation:**
```bash
nx graph  # Check for circular dependencies
```

---

### 2.4 NX Cache Configuration (Week 3+ only)

**Created by `nx init` command.**

**Cache All Targets:**
```json
// nx.json (created Week 3)
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^default"]
    },
    "lint": {
      "cache": true
    },
    "type-check": {
      "cache": true
    }
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "type-check"]
      }
    }
  }
}
```

**Cache Benefits:**
- ⚡ Second build: ~10x faster
- ⚡ Affected tests only
- ⚡ CI/CD optimization

---

## 3. Port Architecture Standards

### 3.1 Port Interface Design

**Every port MUST:**
1. Be defined in `packages/core/src/ports/`
2. Have clear method signatures
3. Document expected behavior
4. Include error cases

**Template:**
```typescript
// packages/core/src/ports/StoragePort.ts

/**
 * StoragePort - Abstract interface for data persistence
 *
 * Implementations:
 * - SupabaseStorageAdapter (Phase 0)
 * - GCSAdapter (Phase 2+ cost optimization)
 */
export interface StoragePort {
  /**
   * Upload file to storage
   * @throws StorageError if upload fails
   */
  upload(file: File, path: string): Promise<{ url: string }>;

  /**
   * Download file from storage
   * @throws StorageError if file not found
   */
  download(path: string): Promise<Blob>;

  /**
   * Delete file from storage
   * @throws StorageError if deletion fails
   */
  delete(path: string): Promise<void>;
}

export class StorageError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'StorageError';
  }
}
```

---

### 3.2 Adapter Implementation

**Every adapter MUST:**
1. Implement the port interface completely
2. Live in `packages/[port-name]/src/adapters/`
3. Handle errors gracefully
4. Log important events

**Template:**
```typescript
// packages/storage/src/adapters/SupabaseStorageAdapter.ts

import { createClient } from '@supabase/supabase-js';
import type { StoragePort, StorageError } from '@ybis/core';

export class SupabaseStorageAdapter implements StoragePort {
  private client;

  constructor(url: string, key: string) {
    this.client = createClient(url, key);
  }

  async upload(file: File, path: string): Promise<{ url: string }> {
    try {
      const { data, error } = await this.client.storage
        .from('uploads')
        .upload(path, file);

      if (error) throw new StorageError(error.message, 'UPLOAD_FAILED');

      const { data: { publicUrl } } = this.client.storage
        .from('uploads')
        .getPublicUrl(path);

      return { url: publicUrl };
    } catch (error) {
      console.error('[SupabaseStorage] Upload failed:', error);
      throw error;
    }
  }

  async download(path: string): Promise<Blob> {
    // Implementation
  }

  async delete(path: string): Promise<void> {
    // Implementation
  }
}
```

---

### 3.3 Port Usage in App Code

**Dependency Injection Pattern:**
```typescript
// apps/mobile/src/services/storage/storageService.ts

import { SupabaseStorageAdapter } from '@ybis/storage';
import type { StoragePort } from '@ybis/core';

// Service uses port interface, not concrete adapter
class StorageService {
  private adapter: StoragePort;

  constructor(adapter: StoragePort) {
    this.adapter = adapter;
  }

  async uploadAvatar(file: File, userId: string): Promise<string> {
    const path = `avatars/${userId}.jpg`;
    const { url } = await this.adapter.upload(file, path);
    return url;
  }
}

// Instantiate with concrete adapter
const supabaseAdapter = new SupabaseStorageAdapter(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const storageService = new StorageService(supabaseAdapter);

// Future migration: swap adapter, zero app code changes
// const gcsAdapter = new GCSAdapter(...);
// export const storageService = new StorageService(gcsAdapter);
```

---

### 3.4 Port Migration Checklist

**When migrating a port:**
- [ ] Create new adapter implementing port interface
- [ ] Write integration tests for new adapter
- [ ] Update environment variables
- [ ] Deploy new adapter alongside old
- [ ] Test new adapter in staging
- [ ] Swap adapter in production (feature flag)
- [ ] Monitor error rates
- [ ] Remove old adapter after migration confirmed

---

### 3.5 Expanded Port Catalog (17 Total Ports)

**See `YBIS_PROJE_ANAYASASI.md` v2.0.0 for full port definitions and examples.**

#### Tier 1: Core Ports (Phase 0)
1. **AuthPort** - Expo Auth → Supabase/Custom
2. **ChatPort** - Gifted Chat → Custom UI
3. **DatabasePort** - Supabase → Cloud SQL
4. **LLMPort** - OpenAI → Multi-provider
5. **ThemePort** - Tamagui → Custom
6. **LanguagePort** - i18next wrapper
7. **StoragePort** - Supabase Storage → GCS

#### Tier 2: Operational Ports (Phase 1+)

**8. AnalyticsPort** - Event tracking
```typescript
interface AnalyticsPort {
  trackEvent(name: string, properties?: Record<string, any>): void;
  trackScreen(screenName: string): void;
  setUser(userId: string, properties?: Record<string, any>): void;
}
// Console (dev) → PostHog → Self-hosted
```

**9. NotificationPort** - Push notifications
```typescript
interface NotificationPort {
  sendPush(userId: string, notification: PushNotification): Promise<void>;
  scheduleNotification(notification: ScheduledNotification): Promise<string>;
  cancelNotification(id: string): Promise<void>;
}
// Expo Notifications → FCM → OneSignal
```

**10. MediaPort** - Image/video uploads
```typescript
interface MediaPort {
  uploadImage(file: File, path: string): Promise<{ url: string; thumbnail: string }>;
  optimizeImage(file: File, options: OptimizeOptions): Promise<File>;
  deleteMedia(path: string): Promise<void>;
}
// Supabase Storage → Cloudinary → GCS
```

**11. LoggerPort** - Application logging
```typescript
interface LoggerPort {
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
}
// Console (dev) → Sentry → DataDog
```

#### Tier 3: Future Ports (Phase 2+)

**12. EmailPort** - Transactional emails
```typescript
interface EmailPort {
  sendEmail(to: string, template: string, data: Record<string, any>): Promise<void>;
  sendBulk(recipients: string[], template: string): Promise<void>;
}
// NoOp (Phase 0) → Resend → AWS SES
```

**13. SearchPort** - Full-text search
```typescript
interface SearchPort {
  index(docId: string, content: string, metadata: Record<string, any>): Promise<void>;
  search(query: string, filters?: SearchFilters): Promise<SearchResult[]>;
}
// Simple filter (Phase 0) → Algolia → Postgres FTS
```

**14. CachePort** - Caching layer
```typescript
interface CachePort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
// In-memory (dev) → Redis → Cloudflare KV
```

**15. PaymentPort** - Payment processing
```typescript
interface PaymentPort {
  createCheckout(priceId: string, userId: string): Promise<{ url: string }>;
  getSubscription(userId: string): Promise<Subscription | null>;
}
// NoOp (Closed Beta free) → Stripe → Custom
```

**16. VectorPort** - Vector embeddings
```typescript
interface VectorPort {
  embed(text: string): Promise<number[]>;
  search(vector: number[], limit: number): Promise<VectorMatch[]>;
}
// NoOp (Phase 0) → Pinecone → Local pgvector
```

**17. FeatureFlagPort** - Feature flags
```typescript
interface FeatureFlagPort {
  isEnabled(flag: string, userId?: string): Promise<boolean>;
  getVariant(flag: string, userId?: string): Promise<string>;
}
// Env vars (Phase 0) → LaunchDarkly → Custom
```

---

### 3.6 Port Implementation Priority

**Phase 0 (Closed Beta):**
- Tier 1: All 7 core ports (MUST implement)
- Tier 2: AnalyticsPort (console stub OK)
- Tier 3: All NoOp stubs

**Phase 1 (Open Beta):**
- Tier 2: Implement all 4 operational ports
- Tier 3: EmailPort, SearchPort (if needed)

**Phase 2+ (Scale):**
- Tier 3: Implement remaining ports as needed

---

## 4. Testing Standards

### 4.1 Test Coverage Requirements

**Targets:**
- **Overall:** 70% coverage
- **Domain logic:** 90% coverage (TaskService, WorkflowEngine)
- **Port adapters:** 80% coverage
- **UI components:** 50% coverage (critical paths only)

**Measurement:**
```bash
nx run-many --target=test --all --coverage
```

---

### 4.2 Test File Organization

```
apps/mobile/
├── src/
│   ├── components/
│   │   └── TaskList.tsx
│   └── __tests__/
│       └── TaskList.test.tsx

packages/core/
├── src/
│   ├── domain/
│   │   └── task/
│   │       └── TaskService.ts
│   └── __tests__/
│       └── domain/
│           └── task/
│               └── TaskService.test.ts
```

---

### 4.3 Unit Test Standards

**Template:**
```typescript
// packages/core/src/__tests__/domain/task/TaskService.test.ts

import { describe, it, expect } from '@jest/globals';
import { TaskService } from '../../../domain/task/TaskService';
import type { Task } from '../../../types/task';

describe('TaskService', () => {
  describe('filterByPriority', () => {
    it('should return only high priority tasks', () => {
      const tasks: Task[] = [
        { id: '1', priority: 'high', title: 'Urgent' },
        { id: '2', priority: 'low', title: 'Later' },
      ];

      const service = new TaskService();
      const result = service.filterByPriority(tasks, 'high');

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('1');
    });

    it('should return empty array if no matches', () => {
      const tasks: Task[] = [
        { id: '1', priority: 'low', title: 'Later' },
      ];

      const service = new TaskService();
      const result = service.filterByPriority(tasks, 'high');

      expect(result).toHaveLength(0);
    });
  });
});
```

**Rules:**
- ✅ **Descriptive test names** (what, when, expected)
- ✅ **Arrange-Act-Assert** pattern
- ✅ **Test edge cases** (empty arrays, null values)
- ❌ **No test interdependencies** (each test isolated)
- ❌ **No external API calls** (use mocks)

---

### 4.4 Integration Test Standards

**Template:**
```typescript
// packages/database/src/__tests__/SupabaseAdapter.integration.test.ts

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import { SupabaseAdapter } from '../adapters/SupabaseAdapter';

describe('SupabaseAdapter Integration', () => {
  let adapter: SupabaseAdapter;
  let testUserId: string;

  beforeAll(async () => {
    adapter = new SupabaseAdapter(
      process.env.SUPABASE_TEST_URL!,
      process.env.SUPABASE_TEST_KEY!
    );

    // Create test user
    testUserId = 'test-user-123';
  });

  afterAll(async () => {
    // Cleanup test data
    await adapter.delete('users', testUserId);
  });

  it('should insert and retrieve task', async () => {
    const task = {
      userId: testUserId,
      title: 'Test task',
      status: 'todo',
      priority: 'high',
    };

    const created = await adapter.insert('tasks', task);
    expect(created.id).toBeDefined();

    const retrieved = await adapter.findById('tasks', created.id);
    expect(retrieved?.title).toBe('Test task');
  });
});
```

**Rules:**
- ✅ **Use test database** (not production!)
- ✅ **Clean up after tests** (no pollution)
- ✅ **Test real scenarios** (create → read → update → delete)
- ⚠️ **Mark as slow** (`@slow` tag for CI optimization)

---

### 4.5 Component Test Standards

**Template:**
```typescript
// apps/mobile/src/__tests__/TaskList.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';

jest.mock('../hooks/useTasks');

describe('TaskList', () => {
  it('should render task items', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [
        { id: '1', title: 'Buy milk', status: 'todo' },
        { id: '2', title: 'Call mom', status: 'done' },
      ],
      loading: false,
    });

    render(<TaskList />);

    expect(screen.getByText('Buy milk')).toBeDefined();
    expect(screen.getByText('Call mom')).toBeDefined();
  });

  it('should show loading spinner when loading', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      loading: true,
    });

    render(<TaskList />);

    expect(screen.getByTestId('loading-spinner')).toBeDefined();
  });
});
```

---

### 4.6 E2E Test Standards (Phase 2+)

**Detox Configuration:**
```json
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YBIS.app',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 13' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_6_API_33' },
    },
  },
};
```

**E2E Test Example:**
```typescript
// e2e/auth.e2e.ts

import { device, element, by, expect as detoxExpect } from 'detox';

describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should sign in with Google', async () => {
    await element(by.id('google-sign-in-button')).tap();

    // Wait for auth to complete
    await detoxExpect(element(by.id('dashboard'))).toBeVisible();

    // Verify user is logged in
    await detoxExpect(element(by.text('Welcome'))).toBeVisible();
  });
});
```

---

## 5. Performance Standards

### 5.1 Target Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **App Launch (Cold Start)** | <2s | Firebase Performance |
| **App Launch (Warm Start)** | <1s | Firebase Performance |
| **AI Chat Response** | <5s | Custom timing |
| **Task CRUD** | <500ms | Custom timing |
| **Supabase Query** | <300ms | Supabase metrics |
| **Bundle Size (iOS)** | <50MB | Xcode |
| **Bundle Size (Android)** | <30MB | Android Studio |

### 5.2 Performance Monitoring

**Firebase Performance:**
```typescript
import perf from '@react-native-firebase/perf';

// Trace custom metrics
const trace = await perf().startTrace('ai_chat_response');
// ... AI call
await trace.stop();
```

**Custom Timing:**
```typescript
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    console.log(`[Perf] ${name}: ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`[Perf] ${name} failed after ${Date.now() - start}ms`);
    throw error;
  }
};

// Usage
await measurePerformance('create_task', () =>
  supabaseAdapter.insert('tasks', taskData)
);
```

---

### 5.3 React Performance

**Optimization Checklist:**
- [ ] Use `React.memo` for expensive components
- [ ] Use `useMemo` for expensive computations
- [ ] Use `useCallback` for stable function references
- [ ] Avoid inline functions in render (causes re-renders)
- [ ] Use `FlatList` for long lists (virtualization)
- [ ] Lazy load images with `FastImage`

**Example:**
```typescript
import React, { memo, useMemo, useCallback } from 'react';

interface TaskListProps {
  tasks: Task[];
  onTaskPress: (id: string) => void;
}

export const TaskList = memo<TaskListProps>(({ tasks, onTaskPress }) => {
  // Memoize filtered data
  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status !== 'done'),
    [tasks]
  );

  // Stable callback reference
  const handlePress = useCallback(
    (id: string) => {
      measurePerformance('task_press', () => onTaskPress(id));
    },
    [onTaskPress]
  );

  return (
    <FlatList
      data={activeTasks}
      renderItem={({ item }) => (
        <TaskItem task={item} onPress={handlePress} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
});
```

---

## 6. Security Standards

### 6.1 Environment Variables

**NEVER commit secrets:**
```bash
# .env.example (commit this)
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=

# .env (DO NOT commit)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
FIREBASE_PROJECT_ID=ybis-prod
```

**.gitignore:**
```
.env
.env.local
.env.production
google-services.json
GoogleService-Info.plist
```

---

### 6.2 Supabase Row Level Security

**All tables MUST have RLS:**
```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can CRUD their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Test RLS:**
```typescript
// Should fail (unauthorized)
await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', 'other-user-id');

// Should succeed (own data)
await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', currentUser.id);
```

---

### 6.3 Input Validation

**Always validate user input:**
```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
});

// Usage
export const createTask = async (input: unknown): Promise<Task> => {
  const validated = CreateTaskSchema.parse(input);
  // Safe to use validated data
  return await db.insert('tasks', validated);
};
```

---

## 7. Git & CI/CD Standards

### 7.1 Pre-commit Checks

**Husky + lint-staged (Phase 1+):**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

### 7.2 CI/CD Pipeline (GitHub Actions)

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run affected tests
        run: npx nx affected --target=test --parallel

      - name: Run affected lint
        run: npx nx affected --target=lint --parallel

      - name: Run affected type-check
        run: npx nx affected --target=type-check --parallel

      - name: Check test coverage
        run: npx nx affected --target=test --coverage --parallel
```

---

## 8. Documentation Standards

### 8.1 Code Comments

**When to comment:**
- ✅ **Complex algorithms** - Explain the "why"
- ✅ **Business logic** - Explain domain rules
- ✅ **Workarounds** - Explain why workaround needed
- ❌ **Obvious code** - Don't state the obvious

**Example:**
```typescript
// ❌ BAD: Obvious
// Set the user name
user.name = 'John';

// ✅ GOOD: Explains why
// AI-suggested change, needs user confirmation
// so we update Supabase directly and sync back on next login
await supabase.from('users').update({ display_name: newName });
```

---

### 8.2 JSDoc for Public APIs

**All port interfaces MUST have JSDoc:**
```typescript
/**
 * AuthPort - Authentication abstraction layer
 *
 * Implementations:
 * - FirebaseAuthAdapter (Phase 0)
 * - SupabaseAuthAdapter (Open Beta)
 *
 * @example
 * ```typescript
 * const auth = new ExpoAuthAdapter();
 * const user = await auth.signInWithGoogle();
 * ```
 */
export interface AuthPort {
  /**
   * Sign in with Google OAuth
   *
   * @throws {AuthError} If sign-in fails
   * @returns Authenticated user object
   */
  signInWithGoogle(): Promise<User>;

  /**
   * Sign out current user
   *
   * @throws {AuthError} If sign-out fails
   */
  signOut(): Promise<void>;
}
```

---

## 9. Quality Gates Summary

### Pre-Commit Checklist
- [ ] Code formatted (Prettier)
- [ ] No ESLint errors
- [ ] TypeScript compiles
- [ ] Affected tests pass

### Pre-PR Checklist
- [ ] All quality gates passed
- [ ] New tests added for new features
- [ ] i18n keys added for new strings
- [ ] Port interfaces documented
- [ ] Performance regression check

### Pre-Deploy Checklist
- [ ] All tests pass
- [ ] Performance targets met
- [ ] Sentry error rate <1%
- [ ] Manual testing complete
- [ ] Migration plan documented (if applicable)

---

## Appendix: Hybrid Approach Summary

### Monorepo: npm workspaces → NX
- **Week 1-2**: npm workspaces (commands: `npm run <script> --workspaces`)
- **Week 3+**: NX layer added (commands: `nx <target> <project>`)
- **Migration**: `npx nx init` (2-3 hours, low risk, reversible)
- **Trigger**: Week 3 OR build time >2min OR >5 packages

### Mobile: Expo Managed → Expo Bare
- **Closed Beta**: Expo Managed (NO ios/ android/ folders)
- **IF NEEDED**: `npx expo prebuild` (creates native folders)
- **Trigger**: Custom native module required (RARE for Phase 0)
- **Risk**: MEDIUM (requires Xcode/Android Studio setup)

### Web: Expo Web → Next.js
- **Closed Beta**: Expo Web (instant, same code: `npm start -- --web`)
- **Open Beta**: Stay on Expo Web OR migrate to Next.js
- **Trigger**: SEO/SSR critical OR Lighthouse <70
- **Effort**: 5 days (routing port + custom Chat UI)

### Port Architecture: 7 → 17 Ports
- **Tier 1 (Phase 0)**: 7 core ports (AuthPort, ChatPort, DatabasePort, LLMPort, ThemePort, LanguagePort, StoragePort)
- **Tier 2 (Phase 1+)**: 4 operational ports (AnalyticsPort, NotificationPort, MediaPort, LoggerPort)
- **Tier 3 (Phase 2+)**: 6 future ports (EmailPort, SearchPort, CachePort, PaymentPort, VectorPort, FeatureFlagPort)

**Philosophy**: Start simple, add complexity when needed, keep migration paths open.

---

**Status:** ✅ ENFORCED
**Next Review:** After Closed Beta (Week 6)
**Version:** 2.0.0 (Hybrid Approaches + 17 Ports)
