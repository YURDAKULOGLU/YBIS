# YBIS Tech Stack & Library Decisions

**Version:** 1.0
**Last Updated:** 2025-01-05
**Status:** Decision Phase (Pre-Development)
**Principle:** **Port-by-port architecture - Replace easily, Future-proof foundation**

---

## Decision Framework

### Core Principles

**1. Port-by-Port Architecture**
> Each component is a "port" that can be swapped without breaking the system.

```
Example:
├─ State Management Port:
│  └─ Phase 0: Zustand (simple)
│  └─ Phase 2: Redux Toolkit (if complex state needed)
│  └─ Swap: Change 1 port, rest stays intact

├─ Database Port:
│  └─ Phase 0: AsyncStorage (local)
│  └─ Phase 1: Supabase (cloud)
│  └─ Swap: Interface stays same, implementation changes
```

**2. Future-Proof Foundation**
- TypeScript interfaces for all ports (enforced contracts)
- Dependency injection where possible
- Abstract layers (no direct third-party coupling)

**3. Replace Easily**
- No deep integration locks
- Clear adapter patterns
- Feature flags for gradual migration

---

## Tech Stack Decision Matrix

### Category 1: Build System & Monorepo

#### **Decision: Monorepo Strategy**

| Aspect | Phase 0 (Closed Beta) | Phase 2+ (Scale) | Migration Path |
|--------|----------------------|-----------------|----------------|
| **Tool** | npm workspaces | NX | Add NX incrementally |
| **Reason** | Simple, zero config | Build caching, task orchestration | NX generators wrap workspaces |
| **Port** | `package.json` workspaces field | `nx.json` + keep workspaces | Additive, not replacement |

**Phase 0 Setup:**
```json
// package.json (root)
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "backend"
  ]
}
```

**Phase 2 Migration (When?):**
- **Trigger:** >5 packages OR build time >2 minutes OR team >2 people
- **How:** `npx nx init` (keeps npm workspaces, adds NX on top)
- **Risk:** Low (NX is additive)

**✅ DECISION: Start with npm workspaces, add NX when complexity demands it**

---

### Category 2: Mobile Framework & Navigation

#### **Decision: React Native Version**

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **React Native** | **0.81.4** | Latest stable with Android 16 support |
| **React** | **18.3.1** | Ecosystem compatibility (NOT 19) |
| **Fallback Plan** | RN 0.76.x if 0.81.4 has issues | Stability over features |

**Port Architecture:**
- RN version is a "platform port" (easy downgrade if needed)
- No RN-specific APIs in business logic (abstracted via services)

**✅ DECISION: RN 0.81.4 + React 18.3.1, fallback to 0.76.x if critical issues**

---

#### **Decision: Navigation Library**

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| **React Navigation 7** | De facto standard, mature, well-documented | Slightly heavier | ✅ **SELECTED** |
| Native Navigation (RN Nav) | Native performance | Complex setup, less docs | ❌ Overkill for Phase 0 |
| Expo Router | Modern, file-based | Requires Expo, opinionated | ❌ Not using Expo |

**Port Architecture:**
```typescript
// Abstract navigation service (port)
interface NavigationPort {
  navigate(screen: string, params?: any): void;
  goBack(): void;
  reset(screen: string): void;
}

// Implementation (replaceable)
class ReactNavigationAdapter implements NavigationPort {
  // React Navigation specific code
}
```

**✅ DECISION: React Navigation 7 (port pattern for future swap if needed)**

---

### Category 3: State Management

#### **Decision: Global State Library**

| Option | Pros | Cons | Phase 0? | Phase 2+? |
|--------|------|------|---------|----------|
| **Zustand** | Lightweight (1KB), simple API, no boilerplate | Less tooling than Redux | ✅ **YES** | Maybe Redux if complex |
| Redux Toolkit | Industry standard, DevTools, time-travel | Boilerplate, overkill for simple state | ❌ Not yet | ✅ If state becomes complex |
| Jotai/Valtio | Modern, atomic state | Less mature, smaller community | ❌ Too experimental | TBD |
| Context API | Built-in, no deps | Performance issues at scale | ❌ Not for global state | N/A |

**Port Architecture:**
```typescript
// State port interface
interface StatePort<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  subscribe(listener: (state: T) => void): () => void;
}

// Zustand implementation (Phase 0)
const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
}));

// Future Redux migration:
// Replace Zustand stores with Redux slices, interface stays same
```

**Migration Trigger:**
- State >10 stores OR
- Complex async logic OR
- Time-travel debugging needed

**✅ DECISION: Zustand for Phase 0, Redux Toolkit port open for Phase 2+**

---

### Category 4: Data Persistence & Database

#### **Decision: Local Storage**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **AsyncStorage** | Built-in RN, simple API | Slow for large data, no encryption | ✅ **YES** |
| MMKV | Fast (C++ based), encrypted | Extra native dependency | ❌ Phase 1+ if performance critical |
| SQLite (expo-sqlite / react-native-sqlite-storage) | SQL, relational, fast queries | Overkill, more complex | ❌ Phase 2+ if needed |
| Watermelon DB | Reactive, fast for large datasets | Complex setup | ❌ Phase 3+ if scaling issues |

**Port Architecture:**
```typescript
// Storage port interface
interface StoragePort {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// AsyncStorage adapter (Phase 0)
class AsyncStorageAdapter implements StoragePort {
  async getItem(key) { return AsyncStorage.getItem(key); }
  async setItem(key, value) { await AsyncStorage.setItem(key, value); }
  // ...
}

// MMKV adapter (Phase 1+ if needed)
class MMKVAdapter implements StoragePort {
  async getItem(key) { return MMKV.getString(key); }
  // ...
}
```

**Migration Path:**
- Start with AsyncStorage
- Monitor performance (if >100ms read/write, consider MMKV)
- Swap adapter, no app code changes

**✅ DECISION: AsyncStorage Phase 0, MMKV port ready for Phase 1+**

---

#### **Decision: Cloud Database (Phase 1+)**

| Option | Pros | Cons | Phase 1? |
|--------|------|------|----------|
| **Supabase** | PostgreSQL, real-time, auth, generous free tier | Vendor lock-in (medium) | ✅ **LIKELY** |
| Firebase Firestore | Real-time, NoSQL, Google ecosystem | NoSQL limitations, pricing can spike | ❌ Already using Firebase Auth, don't want full lock-in |
| Vercel Postgres | Serverless, Vercel integration | Limited features vs Supabase | ⚠️ Backup option |
| PlanetScale | MySQL, edge, serverless | MySQL syntax, less real-time features | ❌ Not priority |

**Port Architecture:**
```typescript
// Database port interface
interface DatabasePort {
  query<T>(table: string, filters?: any): Promise<T[]>;
  insert<T>(table: string, data: T): Promise<T>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  delete(table: string, id: string): Promise<void>;
  subscribe<T>(table: string, callback: (data: T[]) => void): () => void;
}

// AsyncStorage implementation (Phase 0)
class AsyncStorageDB implements DatabasePort {
  async query(table, filters) {
    const data = await AsyncStorage.getItem(table);
    // Simple in-memory filtering
    return JSON.parse(data || '[]').filter(/* ... */);
  }
}

// Supabase implementation (Phase 1+)
class SupabaseDB implements DatabasePort {
  async query(table, filters) {
    const { data } = await supabase.from(table).select('*').match(filters);
    return data;
  }

  subscribe(table, callback) {
    const subscription = supabase
      .from(table)
      .on('*', (payload) => callback(payload.new))
      .subscribe();
    return () => subscription.unsubscribe();
  }
}
```

**Migration Trigger:**
- Open Beta launch (need cross-device sync)
- >200 users (cloud sync essential)

**✅ DECISION: AsyncStorage Phase 0, Supabase Phase 1 (port pattern ready)**

---

### Category 5: UI Component Library

#### **Decision: Component Library**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **Custom Components** | Full control, lightweight, learn by building | Time-consuming, reinvent wheel | ✅ **START HERE** |
| React Native Paper | Material Design, comprehensive, good docs | Opinionated styling, bundle size | ⚠️ **ADD IF NEEDED** (Week 3+) |
| Native Base | Cross-platform, accessible, themed | Large bundle, performance concerns | ❌ Too heavy |
| React Native Elements | Lightweight, customizable | Less comprehensive | ❌ Similar to custom, no clear advantage |
| Tamagui | Performance-focused, universal (web + mobile) | Complex setup, early stage | ❌ Phase 2+ if cross-platform web |

**Hybrid Approach:**
```
Phase 0 (Week 1-2):
├─ Custom components: Button, Input, Card, Text
└─ Reason: Learn patterns, lightweight, full control

Phase 0 (Week 3+ IF time pressure):
├─ Add React Native Paper for complex components (date picker, modals)
└─ Keep custom components for brand-specific UI

Phase 2+ (If web dashboard):
├─ Tamagui OR shared component library
└─ Evaluate based on cross-platform needs
```

**Port Architecture:**
```typescript
// Component port pattern (design system)
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  onPress: () => void;
  children: ReactNode;
}

// Custom implementation (Phase 0)
export const Button: FC<ButtonProps> = ({ variant, onPress, children }) => {
  // Custom styling
};

// React Native Paper wrapper (Phase 0 fallback)
export const Button: FC<ButtonProps> = ({ variant, onPress, children }) => {
  return <RNPButton mode={variant === 'primary' ? 'contained' : 'outlined'} onPress={onPress}>{children}</RNPButton>;
};
```

**✅ DECISION: Start with custom components, add React Native Paper as needed (port pattern)**

---

### Category 6: Styling System

#### **Decision: Styling Approach**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **StyleSheet (RN built-in)** | Zero deps, fast, type-safe with TypeScript | No theming out-of-box, verbose | ✅ **YES** |
| Styled Components | Familiar (CSS-in-JS), dynamic theming | Performance overhead, bundle size | ❌ Not needed |
| Tailwind (NativeWind) | Utility-first, fast development | RN compatibility issues, learning curve | ❌ Too experimental |
| Emotion | Flexible, performant | Extra dependency, overkill | ❌ Not needed |

**Design Tokens Approach:**
```typescript
// Design system port (theme.ts)
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    danger: '#FF3B30',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    body: { fontSize: 16, fontWeight: 'normal' },
    caption: { fontSize: 12, fontWeight: 'normal' },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

// Usage (StyleSheet + tokens)
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
});
```

**Dark Mode:**
```typescript
// Context-based theme switching (port for future theme engines)
const ThemeContext = createContext<typeof theme>(theme);

export const useTheme = () => useContext(ThemeContext);

// Switch theme
<ThemeProvider value={isDark ? darkTheme : lightTheme}>
  <App />
</ThemeProvider>
```

**✅ DECISION: StyleSheet + Design Tokens (theme.ts), React Context for theme switching**

---

### Category 7: Backend Framework & Deployment

#### **Decision: Backend Framework**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **Hono** | Edge-optimized, lightweight (11KB), Vercel-native | Less mature than Express | ✅ **YES** |
| Express | Industry standard, huge ecosystem | Not edge-optimized, heavier | ❌ Old school |
| Fastify | Fast, schema-based validation | Learning curve | ❌ Overkill |
| tRPC | Type-safe, great DX | Requires shared types (monorepo benefit) | ⚠️ **Phase 2+ option** |

**Port Architecture:**
```typescript
// HTTP framework port (if we ever need to swap)
interface RouteHandler {
  get(path: string, handler: (req, res) => any): void;
  post(path: string, handler: (req, res) => any): void;
  // ...
}

// Hono adapter (Phase 0)
class HonoAdapter implements RouteHandler {
  private app = new Hono();

  get(path, handler) {
    this.app.get(path, (c) => handler(c.req, c));
  }
}

// Future tRPC migration (Phase 2+ if type-safety priority)
// tRPC doesn't need adapter, uses shared @ybis/core types directly
```

**Migration Consideration:**
- **Hono → tRPC** possible in Phase 2+ if we want end-to-end type safety
- Monorepo makes tRPC viable (shared types across mobile + backend)
- Port pattern allows gradual route-by-route migration

**✅ DECISION: Hono Phase 0, tRPC port open for Phase 2+ (type-safety upgrade path)**

---

#### **Decision: Deployment Platform**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **Vercel** | Zero-config, edge functions, free tier generous | Vendor lock-in | ✅ **YES** |
| Railway | Generous free tier, PostgreSQL included | Less mature | ⚠️ Backup |
| Fly.io | Global edge, containers | More complex setup | ❌ Phase 2+ |
| AWS Lambda | Scalable, industry standard | Complex, expensive for small scale | ❌ Overkill |

**Port Architecture:**
- Backend code is platform-agnostic (standard Node.js)
- Deployment config is the "port" (vercel.json vs. Dockerfile)
- Easy migration: Containerize Hono app → deploy anywhere

**✅ DECISION: Vercel Phase 0 (simplest), containerization ready for future migration**

---

### Category 8: AI & LLM Integration

#### **Decision: LLM Provider**

| Option | Pros | Cons | Phase 0? | Phase 2+? |
|--------|------|------|---------|----------|
| **OpenAI (GPT-4o-mini)** | Cheap ($0.15/1M input), fast, function calling mature | Vendor lock-in | ✅ **PRIMARY** | Keep as option |
| Anthropic (Claude 3.5 Haiku) | Great reasoning, $0.25/1M input | Slightly pricier | ⚠️ **FALLBACK** | Multi-provider routing |
| Gemini 2.0 Flash | Free tier generous, fast | Less mature tooling | ❌ Phase 1+ experiment | Possible addition |
| Local LLM (Llama 3) | No API costs, privacy | Mobile performance concerns | ❌ Phase 3+ | Privacy tier feature |

**Port Architecture:**
```typescript
// LLM provider port
interface LLMPort {
  chat(messages: Message[], tools?: Tool[]): Promise<LLMResponse>;
  estimateCost(messages: Message[]): number;
}

// OpenAI adapter (Phase 0)
class OpenAIAdapter implements LLMPort {
  async chat(messages, tools) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools,
    });
    return this.parseResponse(response);
  }

  estimateCost(messages) {
    const tokens = this.countTokens(messages);
    return tokens * 0.00000015;  // $0.15 per 1M tokens
  }
}

// Claude adapter (Phase 0 fallback OR Phase 2 multi-provider)
class ClaudeAdapter implements LLMPort {
  async chat(messages, tools) {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      messages,
      tools,
    });
    return this.parseResponse(response);
  }
}

// Multi-provider router (Phase 2+)
class MultiProviderLLM implements LLMPort {
  async chat(messages, tools) {
    // Route to cheapest OR most reliable provider
    const provider = this.selectProvider(messages);
    return provider.chat(messages, tools);
  }
}
```

**Cost Management:**
```typescript
// Cost tracking port
interface CostTrackerPort {
  trackUsage(userId: string, provider: string, cost: number): void;
  getUserSpend(userId: string, period: 'day' | 'month'): number;
  alertIfOverBudget(userId: string, threshold: number): void;
}
```

**Migration Path:**
- Phase 0: OpenAI only
- Phase 1: Add Claude as fallback (if OpenAI rate limits)
- Phase 2: Multi-provider routing (cost optimization)
- Phase 3: Local LLM for privacy tier

**✅ DECISION: OpenAI GPT-4o-mini Phase 0, Claude fallback ready, multi-provider port for Phase 2+**

---

### Category 9: Authentication

#### **Decision: Auth Provider**

| Option | Pros | Cons | Phase 0? |
|--------|------|------|---------|
| **Firebase Auth** | Google Sign-In easy, free tier generous, RN SDKs | Google lock-in | ✅ **YES** (Google only) |
| Supabase Auth | Open-source, self-hostable, multiple providers | Need Supabase DB (Phase 1) | ⚠️ Phase 1+ |
| Clerk | Great DX, multi-provider, user management UI | Expensive ($25/mo) | ❌ Too expensive |
| Auth0 | Enterprise-grade, robust | Overkill, expensive | ❌ Overkill |

**Port Architecture:**
```typescript
// Auth port interface
interface AuthPort {
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

// Firebase Auth adapter (Phase 0)
class FirebaseAuthAdapter implements AuthPort {
  async signInWithGoogle() {
    const credential = await GoogleSignin.signIn();
    const userCredential = await auth().signInWithCredential(credential);
    return this.mapUser(userCredential.user);
  }
}

// Supabase Auth adapter (Phase 1+ migration option)
class SupabaseAuthAdapter implements AuthPort {
  async signInWithGoogle() {
    const { user } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    return this.mapUser(user);
  }
}
```

**Migration Trigger:**
- If moving to Supabase DB (Phase 1), consider Supabase Auth migration
- Otherwise, keep Firebase Auth (works fine standalone)

**✅ DECISION: Firebase Auth (Google Sign-In) Phase 0, Supabase Auth migration possible Phase 1+**

---

### Category 10: Testing & Quality

#### **Decision: Testing Framework**

| Category | Tool | Phase 0? | Phase 2+? |
|----------|------|---------|----------|
| **Unit Tests** | Jest (built-in RN) | ✅ Basic coverage | ✅ >70% coverage |
| **Component Tests** | React Native Testing Library | ⚠️ Critical components only | ✅ Comprehensive |
| **E2E Tests** | Detox OR Maestro | ❌ Manual testing Phase 0 | ✅ Automated E2E |
| **Type Checking** | TypeScript strict mode | ✅ **YES** | ✅ **YES** |
| **Linting** | ESLint + Prettier | ✅ **YES** | ✅ **YES** |

**Port Architecture:**
- Testing is a "quality port" (can add/swap test runners)
- Focus: Test business logic (stores, services), not implementation details

**Phase 0 Test Strategy:**
```
Priority 1: Type Safety (TypeScript strict)
Priority 2: Linting (ESLint + Prettier)
Priority 3: Unit tests for critical logic (AI tools, storage services)
Priority 4: Manual testing (beta testers ARE our E2E tests)

Phase 2: Add automated E2E (Detox or Maestro)
```

**✅ DECISION: TypeScript strict + ESLint Phase 0, Jest for critical logic, manual E2E → automated Phase 2+**

---

### Category 11: Developer Experience

#### **Decision: Code Quality Tools**

| Tool | Purpose | Phase 0? |
|------|---------|---------|
| **TypeScript** | Type safety | ✅ Strict mode |
| **ESLint** | Code quality | ✅ Airbnb OR Standard config |
| **Prettier** | Code formatting | ✅ Auto-format on save |
| **Husky** | Pre-commit hooks | ⚠️ If team >1, else optional |
| **Lint-staged** | Run linters on staged files | ⚠️ With Husky |
| **Commitlint** | Commit message format | ❌ Phase 2+ |

**Setup:**
```json
// .eslintrc.js
module.exports = {
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',  // No any allowed
    '@typescript-eslint/explicit-function-return-type': 'warn',
  },
};

// tsconfig.json (strict mode)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
  }
}
```

**✅ DECISION: TypeScript strict + ESLint + Prettier Phase 0, Husky if team grows**

---

## Summary: Tech Stack Final Decisions

### Phase 0 (Closed Beta) - **Confirmed Stack**

```yaml
Monorepo:
  Tool: npm workspaces
  Migration: NX when complexity demands

Mobile:
  Framework: React Native 0.81.4 + React 18.3.1
  Navigation: React Navigation 7
  State: Zustand
  Storage: AsyncStorage
  UI: Custom components (+ RN Paper if needed)
  Styling: StyleSheet + Design Tokens

Backend:
  Framework: Hono
  Deployment: Vercel
  Database: AsyncStorage (Phase 0), Supabase (Phase 1+)
  Auth: Firebase Auth (Google Sign-In)
  AI: OpenAI GPT-4o-mini (+ Claude fallback ready)

Quality:
  TypeScript: Strict mode
  Linting: ESLint + Prettier
  Testing: Jest (unit tests for critical logic)
  E2E: Manual (beta testers)
```

### Migration Ports Ready

```yaml
State Management:
  Current: Zustand
  Port Ready: Redux Toolkit (if complex state)

Database:
  Current: AsyncStorage
  Port Ready: Supabase, MMKV

Storage:
  Current: AsyncStorage
  Port Ready: MMKV (performance), SQLite (relational)

Backend:
  Current: Hono
  Port Ready: tRPC (type-safety), Express (fallback)

LLM:
  Current: OpenAI
  Port Ready: Claude, Gemini, Local LLM

Component Library:
  Current: Custom
  Port Ready: RN Paper, Tamagui (cross-platform)
```

---

## TBD Items (Moved to Separate Track)

### UI/UX Design (TBD - Separate Decision)
- [ ] Dashboard layout finalization
- [ ] Component library selection (custom vs RN Paper)
- [ ] Design system (colors, typography, spacing)
- [ ] Animation library (if needed: Reanimated, Lottie)
- [ ] Icon library (react-native-vector-icons OR custom SVGs)

**Approach:** Design-first OR development-first?
- **Option A:** Design mockups first (Figma), then implement
- **Option B:** Build functional UI first, polish later

**Recommendation:** Option B for Phase 0 (speed > aesthetics), Option A for Phase 1+

---

### Database Strategy (Partially Decided, Final Call Phase 1)
- ✅ Phase 0: AsyncStorage confirmed
- ⏳ Phase 1: Supabase vs Vercel Postgres (TBD when Open Beta starts)
- Decision Criteria: Cost, real-time needs, migration complexity

---

### MCP Implementation Depth (Deferred to Phase 1)
- ✅ Phase 0: MCP interfaces defined, stub adapters
- ⏳ Phase 1: Full MCP protocol implementation (when Google integration starts)
- Decision: How strictly to follow Anthropic MCP spec vs custom protocol

---

## Next Action

**Ready to finalize?** Confirm each decision or request changes:

**Quick Confirm Checklist:**
- [ ] ✅ npm workspaces → NX later (confirmed?)
- [ ] ✅ RN 0.81.4 + React 18.3.1 (confirmed?)
- [ ] ✅ Zustand → Redux port ready (confirmed?)
- [ ] ✅ AsyncStorage → Supabase port (confirmed?)
- [ ] ✅ Custom UI → RN Paper fallback (confirmed?)
- [ ] ✅ Hono → tRPC port ready (confirmed?)
- [ ] ✅ OpenAI → multi-provider port (confirmed?)
- [ ] ⏳ UI/UX design approach? (Design-first OR dev-first?)

**Once confirmed, next step:**
→ Create `package-structure.md` (exact monorepo folder structure + package.json for each package)
→ OR start coding (Week 1, Day 1 tasks)

Hangisini tercih edersin? 🚀
