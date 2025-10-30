---
title: "YBIS Proje Anayasası"
description: "YBIS projesi için uyulması zorunlu teknik kuralları, mimari prensipleri, kalite standartlarını ve otomasyon gereksinimlerini tanımlar."
version: "4.0.0"
status: "active"
owner: "@ybis-master"
last_updated: "2025-10-21"
tags: ["anayasa", "kural", "mimari", "kalite", "standartlar"]
related_docs:
  - "./vision/PROJECT_VISION.md"
  - "./Güncel/DEVELOPMENT_LOG.md"
  - "./strategy/COMPETITIVE_STRATEGY.md"
  - "./roadmap/PRODUCT_ROADMAP.md"
  - "./strategy/BUILD_AUTOMATION_STRATEGY.md"
  - "./strategy/PROPOSED_CONSTITUTION_AMENDMENTS.md"
---
# YBIS Proje Anayasası

---

## 🚨 ENFORCEMENT NOTICE

```
╔═══════════════════════════════════════════════════════════════╗
║                    ZERO-TOLERANCE CONSTITUTION                ║
║                                                               ║
║  Bu anayasadaki EVERY SINGLE RULE is MANDATORY.              ║
║  İhlal = PR BLOCKED = Code CANNOT merge to main             ║
║                                                               ║
║  Enforcement Layers:                                          ║
║  1. ESLint (IDE) - Instant feedback                          ║
║  2. Pre-commit hooks - Local gate                            ║
║  3. CI/CD pipeline - Automated gate                          ║
║  4. PR review - Manual gate (final)                          ║
║                                                               ║
║  NO EXCEPTIONS. NO "bu sefer geçirelim".                     ║
║  NO "sonra düzeltiriz". FIX NOW or DON'T MERGE.             ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 1. Amaç ve Kapsam

Bu anayasa, YBIS projesi için **uyulması zorunlu** teknik kuralları, mimari prensipleri, kalite standartlarını ve **otomasyon gereksinimlerini** tanımlar.

**Scope:**
- ✅ Code quality (TypeScript, ESLint, testing)
- ✅ Architecture (ports, abstractions, patterns)
- ✅ Performance (bundle size, re-render, build times)
- ✅ Security (data validation, error handling)
- ✅ Developer Experience (build automation, tooling)

Bu kurallar, `AI_GENEL_ANAYASA.md` dosyasındaki evrensel kuralları bu proje özelinde genişletir ve **önceliklidir**.

## 2. Kalite ve Güvenlik Emirleri (Zero-Tolerance)

Bu bölümdeki kurallar tartışılamaz ve asla esnetilemez.

### 2.1 TypeScript Rules (MANDATORY)

**❌ FORBIDDEN:**
- `strict: false` - TypeScript strict mode MUST NEVER be disabled
- `any` type - FORBIDDEN in all code (use `unknown` + type guards)
- `@ts-ignore` or `@ts-expect-error` - FORBIDDEN (fix the root cause)

**⚠️ EXPO/REACT NATIVE EXCEPTION:**
- `skipLibCheck: true` - **REQUIRED** for Expo projects
  - React Native type ecosystem has expected conflicts
  - Third-party packages (Tamagui, Reanimated) provide own RN types
  - This is NOT a workaround, it's the correct approach
  - Microsoft + Expo documentation confirms this pattern

**✅ REQUIRED:**
- All functions MUST have explicit return types
- All parameters MUST be typed (no implicit any)
- Use `type` imports: `import type { Foo } from 'bar'`

**Enforcement:** ESLint + CI/CD (fails on violation)

### 2.2 ESLint Rules (MANDATORY)

**ALL** rules in `.eslintrc.js` MUST be followed. NO exceptions.

**Zero Warnings Policy:**
- Warnings = Errors (CI/CD treats warnings as failures)
- PR cannot merge with ANY ESLint warnings

**Enforcement:** Pre-commit hooks + CI/CD

### 2.3 Forbidden Patterns (ABSOLUTE BAN)

**❌ NEVER USE:**
```bash
npm install --force              # Breaks dependency tree
npm install --legacy-peer-deps   # Masks compatibility issues
```

**❌ NEVER USE (Code):**
```typescript
// @ts-ignore                    # Ignores TypeScript errors
bg="$blue5"                      # Tamagui shorthands (use backgroundColor)
console.log()                    # Use Logger instead
```

**Violation = PR BLOCKED**

### 2.4 Automated Rule Enforcement (CI/CD Gates)

**MUST implement automated checks for:**
1. **UI Isolation Check** - ESLint rule: No direct `tamagui` imports in `apps/`
2. **Port Usage Check** - Custom lint rule: Detect direct vendor imports
3. **Test Coverage Gate** - Block merge if coverage <80%
4. **Bundle Size Gate** - Block merge if bundle exceeds limit
5. **Type Safety Gate** - Block merge on ANY TypeScript error

**Implementation Timeline:**
- Phase 0: ESLint + TypeScript checks ✅
- Phase 1: Custom ESLint rules (UI isolation, Port usage)
- Phase 2: Bundle size + Coverage gates
- Phase 3: Performance budgets (re-render, build time)

## 3. Mimari Prensipleri

- **Port-by-Port Mimarisi (Criteria-Based):** **Sadece değiştirilebilir external bağımlılıklar** için port kullanılmalıdır. Port kullanım kriterleri:
  - ✅ **Port Kullan:** External vendor/service (Supabase, OpenAI), swap potential var, birden fazla alternatif mevcut, network call veya native kod
  - ❌ **Port Kullanma:** Internal app logic, framework part (React, Expo Router), single implementation, stable library (Zustand, i18next)
  - **Örnek (Port):** `DatabasePort` (Supabase → Cloud SQL), `LLMPort` (OpenAI → Anthropic), `AuthPort` (OAuth providers)
  - **Örnek (No Port):** Theme (Tamagui + zustand store), i18n (i18next), Navigation (Expo Router), State (Zustand)
  - Uygulama katmanları (`apps/*`), portlanmış bağımlılıkları port üzerinden (`DatabasePort`), portlanmamış bağımlılıkları doğrudan import eder.
- **UI İzolasyonu:** Tüm UI bileşenleri, `@ybis/ui` paketi üzerinden kullanılmalıdır. Doğrudan `tamagui` veya başka bir UI kütüphanesinden bileşen import etmek yasaktır.
- **Seçilmiş UI İhracatı Prensibi (Curated UI Export Principle):** `@ybis/ui` paketi, `export * from 'tamagui'` gibi genel bir joker (wildcard) ihracat ifadesi **kullanamaz**. Paket, projenin tasarım sistemi için onaylanmış olan `Button`, `YStack`, `Text` gibi bileşenleri **tek tek ve açıkça** (`explicitly`) export etmelidir. Eğer `tamagui`'den yeni bir bileşene ihtiyaç duyulursa, bu bileşen önce `@ybis/ui` paketinin `index.ts` dosyasındaki export listesine bilinçli bir şekilde eklenmelidir.
- **"Build for Scale, Ship Minimal" Prensibi:** Phase 0'da infrastructure, gelecekteki genişlemeleri destekleyecek şekilde (multi-theme, multi-provider, multi-language) tasarlanmalı, ancak sadece minimal özellikler (dark/light theme, tek LLM, TR+EN) ship edilmelidir. Yeni özellik (vertical, theme, LLM provider) eklemek, core kodunda değişiklik gerektirmemelidir.

- **"Fix the Abstraction" Prensibi (No Patch, No Shortcut):** Bir alt seviye teknoloji (örn: React Hook kullanan bir kütüphane) ile üst seviye bir soyutlama (örn: Port arayüzü) arasında mimari bir uyumsuzluk tespit edildiğinde, sorun ara katmanlar, yardımcı dosyalar veya geçici çözümler ile "yamalanmamalıdır". Bunun yerine, soyutlamanın kendisi, altta yatan teknolojinin gerçekliğini doğru bir şekilde modelleyecek şekilde yeniden tasarlanmalıdır.
  - **Örnek (`AuthPort` Refactoring):**
    - **Problem:** `ExpoAuthAdapter`, bir class içinde çağrılamayacak olan `useAuthRequest` React Hook'unu kullanmak zorundaydı. Orijinal tek metodlu `signInWithOAuth()` arayüzü, bu iki fazlı (Hook + Action) yapı için mimari olarak yanlıştı.
    - **Hatalı Çözüm ("Patch"):** Test edilebilirliği sağlamak için ara `helpers.ts` dosyaları oluşturmak veya UI katmanını implementasyon detaylarını bilmeye zorlamak. Bu, asıl problemi gizler.
    - **Doğru Çözüm ("Fix the Abstraction"):** `AuthPort` arayüzünü, sürecin iki fazını (UI hazırlığı ve mantık işlemi) yansıtacak şekilde `getOAuthRequestConfig()` ve `processOAuthResponse()` olarak iki metoda ayırmak. Bu, soyutlamayı temiz, test edilebilir ve teknolojiyle uyumlu hale getirir.
  - **Kural:** Belirtiyi implementasyonda değil, kök nedeni soyutlama katmanında çöz.

---

## 3.2 Ürün ve Kullanıcı Deneyimi Prensipleri

### 3.2.1 Veri Odaklı İterasyon Prensibi ("Feedback Porn")
- **Kural:** Özellikle Closed Beta fazı boyunca, kullanıcıların yaptığı her anlamlı etkileşim (buton tıklaması, ekran görüntülemesi vb.) standart bir formatta bir analiz olayı olarak kaydedilmelidir.
- **Altyapı:** Bu işlem, `AnalyticsPort` arayüzü üzerinden, geliştirme ortamında konsola, beta'da ise PostHog gibi merkezi bir platforma gönderilerek yapılır.
- **Gizlilik Şerhi:** Bu loglama, **asla** kullanıcının kişisel içeriğini (not metinleri, görev başlıkları vb.) içermez. Amaç, kullanıcı davranışını analiz ederek ürün kararlarını veriye dayandırmaktır.

### 3.2.2 "Önce Çevrimdışı" Prensibi (Offline-First Principle)
- **Kural:** Uygulama, internet bağlantısı olmadığında veya zayıf olduğunda bile temel işlevlerini (not alma, görev ekleme vb.) yerine getirebilmelidir.
- **Uygulama:** Kullanıcı eylemleri anında arayüze yansıtılır ve cihazın yerel hafızasına kaydedilir. Bağlantı kurulduğunda, sistem arka planda sunucu ile otomatik olarak senkronize olur.
- **Amaç:** Kesintisiz, hızlı ve güvenilir bir mobil deneyim sunmak.

### 3.2.3 "Kullanıcıyı Asla Bekletme" Prensibi (Optimistic UI)
- **Kural:** Zaman alabilecek hiçbir işlem (API isteği, AI işlemi vb.) kullanıcı arayüzünü kilitlememelidir.
- **Uygulama:** Kullanıcı bir eylem gerçekleştirdiğinde, arayüz işlemin başarılı olacağını varsayarak anında güncellenir ("Optimistic UI"). İşlem arka planda devam eder. Eğer bir hata oluşursa, kullanıcıya bir "Geri Al" seçeneği sunularak durum düzeltilir.
- **Amaç:** Uygulamanın her zaman akıcı ve anında tepki veriyor hissettirmesi.

### 3.2.4 "Geri Alınabilir Eylemler" Prensibi (Reversible Actions)
- **Kural:** Bir veriyi silmek gibi kritik ve geri döndürülemez eylemler, her zaman kullanıcıya kısa bir süre için geri alma imkanı sunmalıdır.
- **Uygulama:** Bir öğe silindiğinde, veritabanından hemen kaldırılmaz, "silindi" olarak işaretlenir (soft delete). Arayüzde birkaç saniyeliğine "Geri Al" seçeneği sunan bir bildirim gösterilir.
- **Amaç:** Yanlışlıkla yapılabilecek veri kayıplarını önlemek ve kullanıcıya güven vermek.

### 3.2.5 "Düşünceli Kullanıcı Deneyimi" Prensibi (Thoughtful UX Principle)
- **Kural:** Uygulama, kullanıcının içinde bulunabileceği her duruma (ilk kullanım, veri olmaması, yüklenme, hata) karşı hazırlıklı olmalı ve net bir geri bildirim sağlamalıdır.
- **Uygulama:**
    1.  **Boş Durumlar (Empty States):** Bir listenin (örn: görevler) boş olması durumunda, kullanıcıya yol gösterici bir mesaj ve eyleme çağrı ("İlk görevinizi ekleyin") sunulmalıdır.
    2.  **Yüklenme Durumları (Loading States):** Veri beklenirken, içeriğin yerini belli eden "iskelet" (skeleton) bileşenler veya belirgin bir yüklenme göstergesi kullanılmalıdır.
    3.  **Geri Bildirim (Feedback):** Başarılı bir işlemden sonra (örn: not kaydedildi) veya bir hatayla karşılaşıldığında (örn: internet bağlantısı yok) kullanıcıya anlık, anlaşılır ve eyleme geçirilebilir mesajlar gösterilmelidir.
- **Amaç:** Kullanıcının uygulamanın her anında ne olduğunu anlamasını sağlamak, belirsizliği ortadan kaldırmak ve güven hissini pekiştirmek.

---

## 3.5 Performance Standards (MANDATORY LIMITS)

### 3.5.1 Bundle Size Ceiling

**❌ HARD LIMIT: Mobile bundle CANNOT exceed 10 MB (production)**

**Enforcement:**
```yaml
CI/CD Gate:
  - Build mobile app
  - Measure bundle size
  - IF size > 10MB → BLOCK PR
  - Require bundle analysis report
```

**Every New Dependency MUST:**
1. Be justified (cannot use existing solution?)
2. Bundle impact analyzed (use `source-map-explorer`)
3. Alternatives considered (lighter options?)
4. Approved in PR review

**Violation = PR BLOCKED until bundle reduced**

### 3.5.2 Re-render Budget (Performance Optimization)

**❌ FORBIDDEN: Unnecessary re-renders**

**REQUIRED:**
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Profile with React DevTools (no bariz issues)

**PR Review MUST check:**
- [ ] Performance profiler screenshots attached
- [ ] No obvious re-render issues
- [ ] Memoization used where appropriate

**Enforcement:** Manual (PR review) + Profiler evidence required for complex components

### 3.5.3 Build Time Budget

**❌ HARD LIMIT: Full monorepo build CANNOT exceed 2 minutes**

**Trigger for NX Migration:**
```yaml
IF any of:
  - Full build > 2 minutes
  - Package count > 5
  - Team size > 1 developer
  - Cache miss rate > 50%
THEN:
  - MUST implement NX
  - MUST setup build caching
  - MUST optimize dep graph
```

**Current Status:** Monitor (will implement when threshold reached)

---

## 3.6 Data Validation & API Security (MANDATORY)

### 3.6.1 API Schema Mandate (Zod Validation)

**❌ FORBIDDEN: Trust backend data "as is"**

**REQUIRED: ALL API responses MUST be validated with Zod**

```typescript
// ❌ WRONG - Direct usage
const userData = await api.getUser(id);
setUser(userData); // Unsafe!

// ✅ CORRECT - Validated
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

const response = await api.getUser(id);
const userData = UserSchema.parse(response); // Validates + throws on mismatch
setUser(userData); // Safe!
```

**Implementation:**
1. **All schemas in `@ybis/core/schemas`**
2. **Validate at network boundary** (API layer, NOT components)
3. **Log validation failures** (Sentry + Logger)
4. **Graceful degradation** (show error UI, don't crash)

**Enforcement:**
- Custom ESLint rule: Detect direct API usage without validation
- Code review: Check for schema validation
- CI/CD: Require schema tests

**Violation = PR BLOCKED**

### 3.6.2 Input Sanitization

**ALL user inputs MUST be sanitized before:**
- Sending to backend
- Rendering in UI
- Storing locally

**Use:** DOMPurify (web), validator.js (common patterns)

---

## 3.7 Build Automation & Tooling (Developer Experience)

### 3.7.1 Pre-commit Hooks (MANDATORY)

**MUST run before every commit:**
```yaml
Pre-commit checklist:
  1. ESLint (auto-fix enabled)
  2. TypeScript type check
  3. Prettier (auto-format)
  4. Test affected files
```

**Setup:** Husky + lint-staged (already configured ✅)

### 3.7.2 Build Automation Strategy

**Current (Phase 0):** Manual `pnpm build`

**Future (NX Migration Criteria):**
```yaml
Implement NX when:
  ✅ Build time > 2 minutes (current: <1 min)
  ✅ Package count > 5 (current: 11 packages)
  ⏳ Team size > 1 (current: solo)

Decision: Implement NX in Phase 1 (multi-developer)
```

**Reference:** `docs/strategy/BUILD_AUTOMATION_STRATEGY.md`

---

## 4. Test Requirements (MANDATORY - NO EXCEPTIONS)

### 4.1 Test Coverage Gates (CI/CD Enforced)

**❌ HARD LIMITS:**
```yaml
Minimum Coverage (CANNOT merge if below):
  - Overall: 80%
  - Statements: 80%
  - Branches: 75%
  - Functions: 80%
  - Lines: 80%
```

**Enforcement:** CI/CD blocks PR if coverage drops below thresholds

### 4.2 Unit Test Requirements

**MUST have unit tests for:**
- ✅ All Port adapters (`@ybis/database`, `@ybis/llm`, etc.)
- ✅ All business logic functions
- ✅ All utility functions (`@ybis/core/utils`)
- ✅ All custom hooks
- ✅ All Zustand stores (actions + selectors)

**Test file convention:**
```
src/
  services/
    UserService.ts
    __tests__/
      UserService.test.ts   # ✅ Co-located with source
```

**Framework:** Vitest (already configured ✅)

### 4.3 Integration Test Requirements

**MUST have integration tests for:**
- ✅ API endpoints (backend routes)
- ✅ Database operations (CRUD flows)
- ✅ Port adapter integrations (mock external services)
- ✅ Multi-step workflows (auth flow, data sync)

**Example:**
```typescript
// Integration test: Auth flow
describe('Auth Integration', () => {
  it('should complete OAuth flow', async () => {
    const config = await authPort.getOAuthRequestConfig('google');
    const response = mockOAuthResponse();
    const result = await authPort.processOAuthResponse(response);
    expect(result.user).toBeDefined();
  });
});
```

### 4.4 E2E Test Requirements (Phase 1+)

**Future requirement (NOT Phase 0):**
- E2E tests with Detox (React Native)
- Critical user flows (login, create task, send message)
- Run on CI/CD for every PR

**Current:** Manual testing OK for Phase 0

### 4.5 What MUST Be Tested

**Priority 1 (MUST have tests):**
- Port adapters (database, LLM, auth, storage)
- Business logic (task creation, message handling)
- Data transformation (API → UI models)
- Validation schemas (Zod)
- Error handling paths

**Priority 2 (SHOULD have tests):**
- React components (complex logic only)
- Custom hooks
- Utility functions

**Priority 3 (OPTIONAL):**
- Simple presentational components
- Type definitions (TypeScript handles this)
- Configuration files

### 4.6 Test Quality Standards

**Tests MUST:**
- [ ] Have descriptive names (`should create user when valid data provided`)
- [ ] Test ONE thing per test case
- [ ] Use AAA pattern (Arrange, Act, Assert)
- [ ] Mock external dependencies (no real API calls)
- [ ] Clean up after themselves (no test pollution)

**Tests MUST NOT:**
- ❌ Depend on test execution order
- ❌ Share mutable state between tests
- ❌ Make real network calls
- ❌ Have hard-coded timeouts (use waitFor)

### 4.7 Missing Test Coverage (Current Gaps)

**As of 2025-10-21, we need tests for:**

**Unit Tests Needed:**
- [ ] `@ybis/ui` components (Button, Card, etc.) - Priority 3
- [ ] `@ybis/chat` components - Priority 2
- [ ] `@ybis/i18n` translation loading - Priority 2
- [ ] `@ybis/theme` provider - Priority 3
- [ ] `apps/mobile` screens - Priority 2 (complex logic only)
- [ ] `apps/backend` routes - Priority 1

**Integration Tests Needed:**
- [ ] Backend API endpoints (`/api/llm/*`) - Priority 1
- [ ] Auth flow (OAuth complete flow) - Priority 1
- [ ] Database CRUD operations - Priority 1
- [ ] Storage upload/download - Priority 1

**E2E Tests Needed:**
- [ ] Login flow (Phase 1)
- [ ] Task creation flow (Phase 1)
- [ ] Chat message flow (Phase 1)

**Action Item:** Add these tests incrementally, starting with Priority 1

### 4.8 CI/CD Test Gates

**PR cannot merge unless:**
```yaml
✅ All tests pass (0 failures)
✅ Coverage >= 80%
✅ No test timeouts
✅ No skipped tests (test.skip forbidden)
✅ Test execution < 5 minutes
```

**Enforcement:** GitHub Actions (setup in Phase 1)

---

## 5. Monorepo ve Paket Kuralları

- **npm workspaces Kaynak:** npm workspaces, monorepo yapısının kaynağıdır. NX, sadece belgelenmiş tetikleyiciler karşılandığında (build süreleri >2dk, >5 paket, >1 kişi ekip) eklenmelidir.
- **Paket Standardı:** Her paket, `tsconfig.json` (`composite: true`), `src/index.ts` ve uygun `package.json` exports ile birlikte gelmelidir.
- **Build Sırası:** Bağımlı uygulamaları kontrol etmeden önce paket referanslarını build edin (`npx tsc --build ./packages/*`).
- **Expo Yönetimi:** Expo, varsayılan olarak "managed workflow" olarak yönetilir. `expo prebuild` sadece native kod gereksinimleri doğrulandığında çalıştırılmalıdır.

## 6. İsimlendirme ve i18n Kuralları

- **i18next Zorunluluğu:** Tüm kullanıcıya görünen metinler, `i18next` üzerinden çekilmelidir. Hardcode string yasaktır.
- **Desteklenen Diller:** Türkçe (TR) ve İngilizce (EN) Phase 0'dan itibaren desteklenir.
- **Kullanım:** `const { t } = useTranslation('namespace'); return <Text>{t('key')}</Text>`

## 7. Hata İşleme ve İzleme

- **Error Boundaries:** Tüm uygulama root'larında React Error Boundary kullanılmalıdır.
- **Sentry Entegrasyonu:** Production'da Sentry ile hata takibi yapılmalıdır.
- **Tutarlı API Hata Formatı:** Tüm API hataları `{ code: string, message: string, details?: any }` formatında dönmelidir.

## 8. Port Kataloğu (Tier 1 - Çekirdek)

**Port Kullanım Kriteri:** "Will we swap vendors? Port it. Will we expand features? Don't port it."

Aşağıdaki portlar Phase 0'da implement edilmelidir:

1. **AuthPort** - OAuth provider swap (Expo Auth → Google → Supabase Auth)
2. **DatabasePort** - Supabase PostgreSQL → Cloud SQL (gelecek)
3. **LLMPort** - OpenAI → Anthropic → Gemini → Local LLM (multi-provider)
4. **StoragePort** - Supabase Storage → GCS → S3 (vendor swap)
5. **DeploymentPort** - Vercel Edge → Cloudflare Workers (Phase 1) 🆕
6. **RAGPort** - OpenAI Embeddings → Cohere → Voyage AI → Local embeddings (Week 5-6) 🆕

**Portlanmayan (Stable/Internal):**
- ❌ **Theme** - Tamagui config + zustand store (internal, feature expansion)
- ❌ **i18n** - i18next (standard, no real alternatives)
- ❌ **Chat UI** - Gifted Chat (UI library, swap = full rewrite anyway)
- ❌ **Navigation** - Expo Router (framework part)
- ❌ **State** - Zustand (already portable)

**Tüm port detayları:** `docs/Güncel/Architecture_better.md`

## 9. React Native & Expo Specific Rules (Zero-Tolerance)

### 9.1 Folder Structure (Expo Router Convention)

**Kural:** `app/` = routes only, `src/` = everything else

```
apps/mobile/
├── app/                    # Expo Router (routes only)
│   ├── (tabs)/
│   ├── _layout.tsx        # ✅ Route file
│   └── index.tsx           # ✅ Route file
└── src/                    # Everything else
    ├── components/         # ✅ UI components here
    ├── hooks/              # ✅ Custom hooks here
    ├── stores/             # ✅ Zustand stores here
    └── utils/              # ✅ Helper functions here
```

**❌ YASAK:**
- `app/components/` → Route conflict (Expo Router algılar)
- `app/utils/` → Route conflict
- `app/hooks/` → Route conflict

**Belirti:** `WARN Route "./components/Foo.tsx" is missing default export`

**Çözüm:** Hemen `src/` altına taşı.

### 9.2 Modal + Animation Lifecycle (Critical Pattern)

**Problem:** Animated modal 2. açılışta "spawn" olur (slide animasyonu olmaz).

**Kök Neden:** Animation state close sonrası reset edilmez.

**Zorunlu Pattern:**

```tsx
const [modalVisible, setModalVisible] = useState(false);
const slideAnim = useRef(new Animated.Value(INITIAL)).current;

useEffect(() => {
  if (open) {
    setModalVisible(true);  // 1. Show modal
    Animated.timing(...).start(); // 2. Animate in
  } else if (modalVisible) {
    Animated.timing(...).start(() => {
      setModalVisible(false);         // 3. Hide after animation
      slideAnim.setValue(INITIAL);    // 4. RESET (critical!)
    });
  }
}, [open, modalVisible]);
```

**Test Requirement:** Modal/Drawer **3+ kez aç/kapa** test et.

### 9.3 "Fancy Features" Approval Rule

**Kural:** "Cool" feature eklemeden önce kullanıcıya sor.

**Onay gerektirir:**
- ❌ Haptic feedback (titreşim)
- ❌ Sound effects
- ❌ Complex animations (spring physics)
- ❌ Gesture recognizers (swipe, long-press)

**Default:** Professional ama minimal → Fancy sadece onay ile

**Örnek:** "Drawer açılınca hafif titreşim ekleyeyim mi?" → User onayı → Ekle

### 9.4 Component Testing Checklist

**Her mobile component için zorunlu:**
- [ ] Multiple cycles (3+ kez interact)
- [ ] Safe area test (notched device)
- [ ] Keyboard test (open/close)
- [ ] Dark + Light theme test

**Detaylı pattern:** `docs/Güncel/REACT_NATIVE_PATTERNS.md`

## 10. Referans Dokümanlar

**Okuması zorunlu:**
- `docs/Güncel/DEVELOPMENT_GUIDELINES.md` - Yasaklı desenler ve zorunlu standartlar
- `.specify/memory/session-context.md` - Mevcut odak, aktif story, kararlar
- `docs/Güncel/DEVELOPMENT_LOG.md` - Günlük geliştirme ilerlemesi

**Mimari ve teknik:**
- `docs/Güncel/Architecture_better.md` - Mimari kararlar, port detayları
- `docs/Güncel/tech-stack.md` - Teknoloji yığını (Expo SDK 54, React 19.1)
- `docs/Güncel/package-structure.md` - Monorepo yapısı
- `docs/Güncel/REACT_NATIVE_PATTERNS.md` - Mobile-specific patterns, Expo conventions 🆕

## 11. Dokümantasyon Güncel Tutma Kuralları

### 11.1 Zorunlu Güncelleme Tetikleyicileri

Aşağıdaki durumlarda dokümantasyon güncellemesi **zorunludur**:

- **Paket Güncellemeleri:** `package.json` değişiklikleri → `tech-stack.md` güncellemesi
- **Mimari Kararlar:** Yeni port ekleme, mimari değişiklik → `DEVELOPMENT_LOG.md` + `Architecture_better.md`
- **Görev Tamamlama:** Her görev tamamlandığında → `tasks.md` + `DEVELOPMENT_LOG.md`
- **Prensip Değişikliği:** Yeni kalite kuralı, yasak desen → `YBIS_PROJE_ANAYASASI.md`
- **Pattern Discovery:** Mobile-specific pattern bulundu → `REACT_NATIVE_PATTERNS.md` 🆕

### 11.3 Dokümantasyon İçerik Standardı (Token-Verimli Özet Başlığı)

- **Özet Başlığı Zorunluluğu:** Tüm büyük metin tabanlı dokümanlar (strateji, analiz, ham sohbet kayıtları, fikir taslakları vb.) token-verimli tarama ve hızlı bağlam sağlama amacıyla yapısal bir YAML "Özet Başlığı" ile başlamalıdır.
- **Durum (Status) Alanı:** Her özet başlığı, dokümanın mevcut durumunu (`status: draft`, `idea`, `proposal`, `active`, `rejected`, `archived` vb.) açıkça belirtmelidir. Bu, dokümanın kesin karar olup olmadığını netleştirir.
- **İçerik:** Başlık, durum, sahip, oluşturulma/güncellenme tarihi, kısa özet ve ana çıkarımlar gibi temel bilgileri içermelidir.
- **Uygulama:** Bu standarda uygunluk, `/YBIS:add-summary-header` komutu kullanılarak sağlanmalıdır.

### 11.2 Dokümantasyon Güncelleme Workflow'u

**Kullanılacak Workflow:** `.YBIS_Dev/Veriler/workflows/documentation-maintenance.yaml`

**Adımlar:**
1. **Değişiklik Analizi:** Hangi dokümanların güncellenmesi gerektiğini belirle
2. **Güncelleme Planı:** `documentation-update-plan-tmpl.yaml` kullanarak plan oluştur
3. **Doküman Güncelleme:** Sırasıyla tech-stack.md, DEVELOPMENT_LOG.md, tasks.md güncelle
4. **Tutarlılık Kontrolü:** `documentation-consistency-checklist.md` ile doğrula
5. **İndeks Güncelleme:** DOCUMENTATION_INDEX.md'yi güncel duruma getir

### 10.3 Tutarlılık Standartları

**Paket Versiyonları:**
- Tüm dokümanlarda React 19.1.0 (19.2 değil)
- Expo SDK 54, React Native 0.81.4
- Versiyon bilgileri sadece `tech-stack.md`'de

**Tarih Tutarlılığı:**
- "Last Updated" tarihleri güncel
- DEVELOPMENT_LOG.md girişleri doğru tarihli
- Tüm dokümanlarda tutarlı tarih formatı

**Cross-Reference Tutarlılığı:**
- `constitution.md` → `YBIS_PROJE_ANAYASASI.md`
- `START_HERE.md` → `QUICKSTART.md`
- Tüm relative linkler çalışır durumda

### 10.4 AI Workflow Entegrasyonu

**Bootstrap Prosesi:**
- AI_BASLANGIC_REHBERI.md → 4 katmanlı yükleme
- AI_SYSTEM_GUIDE.md → Agent rolleri ve komutlar
- YBIS_PROJE_ANAYASASI.md → Proje kuralları

**Otomatik Güncelleme:**
- Her görev tamamlandığında dokümantasyon güncelleme workflow'u çalıştır
- Paket güncellemelerinde tech-stack.md otomatik güncelle
- Mimari kararlarda DEVELOPMENT_LOG.md'ye AD-XXX girişi ekle

### 10.5 Kalite Kontrolü

**Her Güncelleme Sonrası:**
- [ ] Paket versiyonları tutarlı
- [ ] Tarihler güncel
- [ ] Cross-referenceler çalışıyor
- [ ] Duplicate bilgi yok
- [ ] Formatting tutarlı

**Haftalık Kontrol:**
- Tüm dokümantasyon health check
- Eksik güncellemeleri tespit et
- Tutarlılık raporu oluştur

## 11. Versiyonlama

**Versiyon:** 4.0.0
**Son Güncelleme:** 2025-10-21
**Değişiklik:** MAJOR UPDATE - Ultra-enforcing constitution

**Yeni Eklenenler (v4.0.0):**
- 🚨 Enforcement Notice (Zero-tolerance framework)
- 📊 Performance Standards (Bundle size, Re-render, Build time)
- 🔒 Data Validation & API Security (Zod mandate)
- 🛠️ Build Automation & Tooling (NX criteria)
- ✅ Comprehensive Test Requirements (Unit, Integration, E2E)
- 📋 Test Coverage Gates (80% minimum)
- 🎯 Missing Test Coverage Tracking

**Breaking Changes:**
- Warnings now treated as errors (CI/CD)
- Bundle size hard limit enforced (10 MB)
- Test coverage gates active
- API validation mandatory (Zod)

**Migration Required:** None (incremental enforcement)