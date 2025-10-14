# YBIS Tech Stack Architecture & Migration Strategy

## 🎯 Overview
Bu doküman, YBIS'in teknik mimarisini ve phase'ler arası migration stratejisini tanımlar. **Migration-friendly** yaklaşım ile her phase'de güvenli geçişler planlanır.

## 📋 Core Principles

### 1. Migration-Friendly Architecture
- **Modular Monolith:** Monorepo yapısı, büyüdükçe mikroservislere ayrılabilir
- **Version Pinning:** Beta'da tam sürüm pinleme, MVP sonrası kontrollü güncelleme
- **Isolation Strategy:** Riskli paketleri çekirdekten ayırma
- **Controlled Updates:** Planlı güncelleme pencereleri

### 2. Development Strategy
- **Beta:** Hızlı + temel sağlam
- **MVP:** Scale-ready foundation
- **Scale:** Enterprise-grade architecture

## 🏗️ Tech Stack by Phase

### Phase 0: Closed Beta

#### Mobile Development
- **React Native:** 0.81.4 (New Architecture ON)
- **React:** 18.3.1 (Safe path)
- **TypeScript:** Strict mode
- **State Management:** Zustand
- **Navigation:** React Navigation 7 (stable önkoşul, değilse 6.x ile başla)
- **Animations:** React Native Reanimated 3.x

#### Backend Architecture
- **Runtime:** Node.js 20.11.0
- **Framework:** Hono (lightweight, edge-compatible)
- **Database:** **TBD** (Supabase PostgreSQL vs Serverless)
- **Authentication:** Firebase Auth (Google Sign-In only)
- **Storage:** **TBD** (Real-time sync vs batch sync)

#### Infrastructure
- **Deployment:** Vercel (backend)
- **Database Hosting:** **TBD** (Supabase vs Serverless)
- **Monitoring:** Basic logging
- **CI/CD:** GitHub Actions

#### Monorepo Structure
- **Package Manager:** pnpm
- **Workspace Management:** npm workspaces
- **Structure:**
  ```
  YBIS/
  ├── apps/
  │   ├── mobile/              # RN 0.81, React 18.3.1
  │   └── web/                 # Next 14 (Phase1'de 15.1+)
  ├── packages/
  │   ├── core/                # Domain types, zod schemas
  │   ├── api-client/          # Fetch/GraphQL client
  │   ├── ui/                  # RN + RN-web ortak bileşenler
  │   └── workflows/           # Orkestrasyon, action runners
  ├── backend/                 # Hono API
  ├── decisions/               # DR-XXX kayıtları
  ├── boosters/                # Booster dökümanları
  ├── specs/                   # Feature specs
  └── pipeline/                # CI/renovate config
  ```

#### Version Management
- **Dependencies:** Tam sürüm pinleme ("react": "18.3.1")
- **Lockfile:** Frozen-lockfile CI'da
- **Updates:** Sadece güvenlik yamaları
- **Automation:** Renovate (patch/minor gruplandırma)

### Phase 1: Open Beta

#### Mobile Development
- **React Native:** 0.81.4 → 0.82.x (minor update)
- **React:** 18.3.1 (stable)
- **New Architecture:** Full production usage
- **Hermes:** Default engine

#### Backend Architecture
- **Database:** Supabase PostgreSQL (finalized)
- **Sync Strategy:** Real-time sync (finalized)
- **API:** GraphQL layer addition
- **Caching:** Redis for session management

#### Infrastructure
- **Monitoring:** Advanced logging + error tracking
- **Analytics:** User behavior tracking
- **Performance:** Bundle size optimization

#### Monorepo Structure
- **NX Integration:** Selective NX features
- **Build Orchestration:** NX task pipeline
- **Code Generation:** NX generators
- **Build Caching:** NX cloud (optional)

### Phase 2: MVP v1.0

#### Mobile Development
- **React Native:** 0.82.x → 0.83.x
- **React:** 18.3.1 → 19.x (major update)
- **New Architecture:** Full optimization
- **Performance:** Advanced optimization

#### Backend Architecture
- **Microservices:** Service decomposition başlangıcı
- **API Gateway:** Centralized routing
- **Database:** Multi-region setup
- **Caching:** Advanced Redis strategies

#### Infrastructure
- **Multi-Region:** US/EU deployment
- **CDN:** Global content delivery
- **Monitoring:** Full observability stack
- **Security:** Advanced security measures

#### Monorepo Structure
- **NX Full:** Complete NX ecosystem
- **Build Optimization:** Advanced caching
- **Code Generation:** Full automation
- **Testing:** Comprehensive test suite

### Phase 3: Scale

#### Mobile Development
- **React Native:** Latest stable
- **React:** 19.x (optimized)
- **Performance:** Maximum optimization
- **Platforms:** Web, Windows, macOS support

#### Backend Architecture
- **Microservices:** Full service decomposition
- **Event-Driven:** Event sourcing patterns
- **Database:** Multi-database strategy
- **API:** GraphQL + REST hybrid

#### Infrastructure
- **Global:** Multi-region deployment
- **Kubernetes:** Container orchestration
- **Service Mesh:** Advanced networking
- **Observability:** Full-stack monitoring

#### Monorepo Structure
- **NX Enterprise:** Full enterprise features
- **Multi-Platform:** Web, mobile, desktop
- **Advanced Tooling:** Custom generators
- **Enterprise CI/CD:** Advanced pipelines

## 🔄 Migration Strategy

### Version Update Strategy

#### Beta Phase (Phase 0)
- **Freeze Policy:** Sadece güvenlik yamaları
- **Update Window:** Haftada 1 canary branch test
- **Automation:** Renovate patch/minor gruplandırma
- **Testing:** Smoke tests only

#### MVP Phase (Phase 1-2)
- **Controlled Updates:** Haftalık update window
- **Grouped Updates:** Paket grupları halinde
- **Testing:** Comprehensive test suite
- **Rollback:** Lockfile snapshot + tag

#### Scale Phase (Phase 3+)
- **Automated Updates:** Patch/minor otomatik
- **Major Updates:** Mini-sprint approach
- **Testing:** Full regression suite
- **Monitoring:** Performance regression detection

### Database Migration Strategy

#### Phase 0: Closed Beta
- **TBD:** Supabase vs Serverless decision
- **Local First:** AsyncStorage + sync
- **Simple Schema:** Basic user data

#### Phase 1: Open Beta
- **Supabase:** PostgreSQL finalized
- **Real-time:** Live sync implementation
- **Schema Evolution:** Versioned migrations

#### Phase 2: MVP
- **Multi-Region:** Global database setup
- **Performance:** Query optimization
- **Backup:** Automated backup strategy

#### Phase 3: Scale
- **Sharding:** Database sharding
- **Read Replicas:** Performance scaling
- **Event Sourcing:** Advanced patterns

### Authentication Migration Strategy

#### Phase 0: Closed Beta
- **Firebase Auth:** Google Sign-In only
- **Simple Tokens:** Basic JWT management
- **Local Storage:** Token persistence

#### Phase 1: Open Beta
- **Firebase Auth:** Multiple providers
- **Advanced Tokens:** Refresh token strategy
- **Security:** Enhanced security measures

#### Phase 2: MVP
- **Custom Auth:** Self-hosted solution
- **SSO:** Enterprise SSO support
- **Compliance:** GDPR, KVKK compliance

#### Phase 3: Scale
- **Identity Provider:** Full identity management
- **Multi-Factor:** Advanced MFA
- **Enterprise:** Full enterprise features

## 🛠️ Development Tools

### Package Management
- **Package Manager:** pnpm
- **Lockfile:** Frozen-lockfile CI
- **Updates:** Renovate automation
- **Overrides:** pnpm.overrides for peer deps

### Testing Strategy
- **Unit Tests:** Jest + RTL
- **Integration Tests:** React Native Testing Library
- **E2E Tests:** Detox (mobile), Playwright (web)
- **Performance Tests:** Bundle size, startup time

### CI/CD Pipeline
- **Type Checking:** TypeScript strict
- **Linting:** ESLint + Prettier
- **Testing:** Unit + Integration + E2E
- **Building:** Metro bundler optimization
- **Deployment:** Automated deployment

#### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm -F apps/mobile run e2e:smoke   # Detox smoke
      - run: pnpm -F apps/web run e2e:smoke      # Playwright smoke
```

#### Canary Pipeline
```yaml
# .github/workflows/canary.yml
name: Canary
on:
  pull_request:
    branches: [ main ]
jobs:
  canary:
    if: contains(github.head_ref, 'renovate/') || contains(github.head_ref, 'deps/')
    runs-on: ubuntu-latest
    steps:
      - run: pnpm run smoke:critical  # modals/portals + nav + reanimated
```

### Monitoring & Observability
- **Error Tracking:** Sentry
- **Performance:** React Native Performance
- **Analytics:** PostHog/Mixpanel (versioned event schema)
- **Logging:** Structured logging

## 📊 Performance Targets

### Mobile Performance
- **Startup Time:** <3 seconds
- **Bundle Size:** <50MB
- **Memory Usage:** <100MB
- **Frame Rate:** 60fps animations

### Backend Performance
- **API Response:** <500ms
- **Database Query:** <100ms
- **Uptime:** 99.9%
- **Throughput:** 1000+ req/sec

## 🔐 Security Strategy

### Phase 0: Closed Beta
- **Basic Security:** HTTPS, JWT tokens
- **Data Encryption:** At rest and in transit
- **Access Control:** Role-based access

### Phase 1: Open Beta
- **Advanced Security:** Rate limiting, CORS (zorunlu gate)
- **Data Protection:** GDPR compliance
- **Audit Logging:** User activity tracking (zorunlu gate)

### Phase 2: MVP
- **Enterprise Security:** SSO, MFA
- **Compliance:** SOC 2, ISO 27001
- **Advanced Encryption:** End-to-end encryption

### Phase 3: Scale
- **Zero Trust:** Zero-trust architecture
- **Security Monitoring:** Real-time threat detection
- **Compliance:** Full regulatory compliance

## 🧭 Decision Records

### DR-001: React Sürümü (Beta→MVP)
- **Tarih:** 2025-09-26
- **Durum:** Kabul edildi
- **Kapsam:** Mobile (RN), Web (Next)
- **Seçenekler:** React 18.3.1 vs React 19.1
- **Karar:** Beta'da **React 18.3.1**, MVP sonrası **tek sprint** ile **19.1**
- **Gerekçe:** Ekosistem 18'de olgun; Beta hız önceliği; 19'a geçiş tek seferlik plan
- **Bağlılıklar:** RN 0.81.x (New Arch ON), Next 14→15.1+
- **Riskler:** 19'a geçişte portal/modal, nav, test stack regresyonu
- **Mitigasyon:** Renovate + CI smoke, `pnpm.overrides`, canary, rollback
- **Artefaktlar:** boosters/dependency-update-system.md, boosters/react19-migration-checklist.md

### DR-002: Database Seçimi (TBD)
- **Tarih:** TBD
- **Durum:** Karar bekliyor
- **Seçenekler:** Supabase PostgreSQL vs Serverless
- **Kriterler:** Throughput, cost, RLS, edge-latency
- **Test Planı:** 2 gün spike → ölçümler → karar

### DR-003: Sync Strategy (TBD)
- **Tarih:** TBD
- **Durum:** Karar bekliyor
- **Seçenekler:** Real-time vs batch sync
- **Kriterler:** Offline-first testleri, conflict policy
- **Test Planı:** Conflict resolution testleri → karar

### DR-004: NX Integration Timing (TBD)
- **Tarih:** TBD
- **Durum:** Karar bekliyor
- **Kriterler:** Build times, affected-only, remote cache kazancı
- **Test Planı:** Build time ölçümleri → karar

### DR-005: Firebase Migration (TBD)
- **Tarih:** TBD
- **Durum:** Karar bekliyor
- **Seçenekler:** Firebase → Custom Auth/SSO
- **Kriterler:** KVKK/GDPR compliance, enterprise requirements
- **Timeline:** Phase 2 gate'e bağlı

## 🔧 Quality Boosters

### Booster: Dependency Update System
- **Paket Yöneticisi:** pnpm
- **Politika (Beta):** Tam sürüm pinleme, `--frozen-lockfile`, yalnız güvenlik yamaları
- **Politika (MVP+):** Patch/Minor otomatik (gruplu), Major "mini-sprint"
- **Otomasyon:** Renovate (gruplar: RN ekosistemi, Test Stack, Build Tooling, UI/State)
- **CI Gate:** type-check, lint, unit/integration, **e2e smoke** (Detox/Playwright)
- **Rollback:** Lockfile snapshot + git tag
- **Kırılgan Alan Smoke'ları:** modals/portals, navigation stack reset, reanimated + gestures, Suspense sınırları

#### Renovate Configuration
```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", "group:allNonMajor"],
  "rangeStrategy": "replace",
  "timezone": "Europe/Istanbul",
  "schedule": ["after 09:00 before 18:00 on Tuesday"],
  "prHourlyLimit": 4,
  "packageRules": [
    {
      "groupName": "RN ekosistemi",
      "matchPackageNames": [
        "react-native",
        "react-native-reanimated",
        "react-native-gesture-handler",
        "@react-navigation/*"
      ],
      "automerge": false
    },
    {
      "groupName": "Test stack",
      "matchPackageNames": ["jest", "@testing-library/*", "detox", "playwright"],
      "automerge": true,
      "matchUpdateTypes": ["patch", "minor"]
    },
    {
      "groupName": "React çekirdek",
      "matchPackageNames": ["react", "react-dom"],
      "automerge": false
    }
  ]
}
```

#### pnpm Overrides
```json
{
  "pnpm": {
    "overrides": {
      "react": "18.3.1",
      "react-dom": "18.3.1",
      "@types/react": "18.3.5"
    }
  }
}
```

### Booster: React 19 Migration Checklist
- [ ] FC `defaultProps` → parametre default
- [ ] `propTypes` → TypeScript
- [ ] legacy context / string refs / `findDOMNode` kaldırıldı
- [ ] Web tarafı: her yerde `createRoot`
- [ ] Next 15.1+ hedeflendi (web)
- [ ] RN kütüphaneleri son sürüme (Navigation, Reanimated, modal/portal libs)
- [ ] Canary branch'te smoke: modal/portal, stack reset, optimistic form/actions (web)

### Booster: RN New Architecture Readiness
- [ ] Hermes ON, Fabric ON, TurboModules ON
- [ ] Native Module'lar TurboModule şablonlarıyla
- [ ] UI bileşenleri Fabric uyumlu
- [ ] Reanimated 3.x + gesture-handler 2.x uyum testleri
- [ ] Navigation 7 ile stack/transition smoke

## 🚪 Phase Gates

### Phase 0 → Phase 1 Gate
- ✅ Mobile startup <3s (p50), bundle <50MB
- ✅ E2E smoke (Detox) %100
- ✅ Crash-free sessions > %99.5 (7g)
- ✅ Supabase/Realtime nihai karar (DR-002), şema v1 tamam
- ✅ Renovate aktif, canary pipeline yeşil

### Phase 1 → Phase 2 Gate
- ✅ Next 15.1+ geçildi (web)
- ✅ React 19 migration canary'de yeşil
- ✅ RN ekosistemi son sürümlerle stabil
- ✅ Observability (Sentry + perf) dashboard hedefleri tutuyor

### Phase 2 → Phase 3 Gate
- ✅ Multi-region deployment stable
- ✅ Enterprise features (SSO, compliance) ready
- ✅ Performance targets met
- ✅ Security audit passed

## 📋 TBD Items

### Critical TBDs
- **Database Choice:** Supabase PostgreSQL vs Serverless (DR-002)
- **Sync Strategy:** Real-time vs batch sync (DR-003)
- **NX Integration:** When to add NX features (DR-004)
- **Firebase Migration:** When to move away from Firebase (DR-005)

### Secondary TBDs
- **Microservices:** When to decompose services
- **Multi-Region:** When to go global
- **Platform Expansion:** Web, desktop support timeline
- **Enterprise Features:** SSO, compliance timeline

## 🎯 Success Criteria

### Technical Metrics
- **Build Time:** <5 minutes
- **Test Coverage:** >80%
- **Bundle Size:** <50MB
- **Performance:** 60fps animations

### Development Metrics
- **Deployment Frequency:** Daily
- **Lead Time:** <1 day
- **Mean Time to Recovery:** <1 hour
- **Change Failure Rate:** <5%

---

**Last Updated:** [Current Date]
**Next Review:** [Phase milestone dates]
**Architecture Review:** [Quarterly reviews]
