# YBIS Tech Stack Decision Report v2.0
**Tarih:** 2025-10-12  
**Durum:** Closed Beta (Week 1) → Open Beta → MVP  
**Hedef:** 100-200 user (Closed) → 4K-5K user (Open) → 20K+ (MVP)
**Status:** ✅ Updated - Aligned with AD-001 to AD-020

---

## 📋 Executive Summary

YBIS projesi için **port-by-port architecture** prensibiyle tasarlanmış, **web-ready** ve **future-proof** bir tech stack belirlendi. Ana strateji:

- ✅ **Closed Beta:** Hızlı development, sağlam temeller
- ✅ **Open Beta:** Web app ekleme, minimal refactor
- ✅ **MVP:** Production-ready, scalable architecture

**核心 Prensip:** Her component bir "port" - kolay değiştirilebilir, vendor lock-in yok, migration maliyeti düşük.

---

## 🎯 Phase 0: Closed Beta (4-6 hafta, 300 user)

### **Mobile Stack**

| Kategori | Teknoloji | Versiyon | Neden Seçildi |
|----------|-----------|----------|---------------|
| **Framework** | React Native + Expo | RN 0.81.4 + React 19.1.0 | Android 16 desteği, New Architecture ready, React 19 performance |
| **Navigation** | Expo Router | Latest | File-based routing, web-ready, unified mobile+web |
| **UI Library** | Tamagui | Latest | Universal components (mobile+web), performant, modern |
| **State Management** | Zustand | Latest | Lightweight, universal, simple API |
| **Form Management** | react-hook-form | Latest | Performant, TypeScript-first, universal |
| **Data Fetching** | TanStack Query | v5 | Caching, offline support, optimistic updates |
| **Animations** | Reanimated | 4.1+ | New Architecture optimized, web support |
| **Gestures** | Gesture Handler | 2.28+ | Fabric compatible, Reanimated integration |
| **Icons** | react-native-vector-icons | Latest | 15+ icon sets, performant, widely used |
| **Date Picker** | react-native-date-picker | Latest | Modal support, multi-language, native performance |

### **Backend Stack**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **Runtime** | Node.js 20.11+ | RN 0.81.4 minimum requirement |
| **Framework** | Hono | Edge-optimized, lightweight (11KB), Vercel-native |
| **Deployment** | DeploymentPort → VercelEdgeAdapter | Port architecture (AD-016), swap to Cloudflare/Node.js easy |
| **Database** | Supabase (PostgreSQL) | Real-time built-in, managed, migration-friendly |
| **Auth** | Expo Auth Session | OAuth 2.0 + PKCE, zero vendor lock-in, multi-provider (AD-015) |
| **Storage** | Supabase Storage | S3-compatible, integrated, cost-effective |
| **AI/LLM** | LLMPort → OpenAIAdapter | Port architecture, multi-provider future (Anthropic, Gemini) |

### **Internationalization & Theme**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **i18n** | i18next + react-i18next | Universal, TR+EN Day 1, formatting support |
| **Theme** | Tamagui theming | Built-in dark mode, design tokens, universal |

### **Developer Experience**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **Language** | TypeScript (Strict) | Type safety, IntelliSense, error prevention |
| **Linting** | ESLint + Prettier | Code quality, auto-formatting |
| **Testing** | Jest | Unit tests, 70% coverage target |
| **Monorepo** | npm workspaces | Simple, zero config, NX eklenebilir (sonra) |

### **Monitoring & Quality**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **Error Tracking** | Sentry | Industry standard, free tier (5K events/mo) |
| **Analytics** | PostHog / GA4 | Event tracking, funnel analysis |
| **Performance** | Firebase Performance | Mobile-focused, free tier generous |
| **Security** | expo-secure-store | Token storage, biometric support |

### **UX Polish & Features**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **Chat UI** | Gifted Chat | WhatsApp-like, 2-3 hafta → 2-3 gün |
| **Deep Linking** | Expo Router | Notification + email integration |
| **Push Notifications** | expo-notifications + FCM | User engagement critical |
| **Network Status** | @react-native-community/netinfo | Offline UX |
| **Error Boundaries** | react-error-boundary | Crash prevention |
| **App State** | AppState API (built-in) | Background sync |
| **Keyboard Handling** | KeyboardAvoidingView | Form UX |
| **Loading States** | Tamagui Skeleton | UX consistency |
| **Splash Screen** | expo-splash-screen | Branding |

---

## 🌐 Open Beta: Web Launch (8-12 hafta, 5K users)

### **Web Stack (NEW)**

| Kategori | Teknoloji | Neden Seçildi |
|----------|-----------|---------------|
| **Framework** | Next.js 14+ | Web-optimized, SEO built-in, App Router |
| **UI** | Tamagui (shared) | Aynı componentler mobile ile ortak! |
| **Routing** | Next.js App Router | SSR, file-based, performant |
| **SSR** | Yes | SEO critical |

### **Shared Packages (Universal)**

```
packages/
├── ui/              # Tamagui components (mobile + web)
├── core/            # Business logic, stores
├── chat/            # ChatPort + implementations
├── theme/           # ThemePort + providers
└── i18n/            # LanguagePort + translations
```

### **Platform-Specific**

| Platform | Chat UI | Navigation | Specific Needs |
|----------|---------|------------|----------------|
| **Mobile** | Gifted Chat | Expo Router | Native gestures, biometric |
| **Web** | Custom chat UI | Next.js Router | SEO, web vitals, meta tags |

---

## 🏗️ Port/Adapter Architecture

### **Tier 1: MANDATORY Ports (Phase 0 implement)**

**Criteria:** External vendor swap potential, multiple alternatives exist, network/native dependencies

| Port | Reason | Migration Path |
|------|--------|----------------|
| **AuthPort** | OAuth provider swap | Expo Auth → Google → Firebase → Supabase Auth |
| **DatabasePort** | Database vendor swap | Supabase → Cloud SQL → PostgreSQL |
| **LLMPort** | AI provider swap | OpenAI → Anthropic → Gemini → Local LLM |
| **StoragePort** | Storage vendor swap | Supabase Storage → GCS → S3 → R2 |
| **DeploymentPort** | Deployment platform swap | Vercel Edge → Cloudflare Workers → Node.js |

### **Tier 2: RECOMMENDED Ports (Phase 0 interface only)**

| Port | Reason | Migration Trigger |
|------|--------|-------------------|
| **AnalyticsPort** | PostHog → Self-hosted | Privacy/GDPR (MVP) |
| **ErrorMonitoringPort** | Sentry flexibility | Cost scaling |
| **OfflinePort** | TanStack Query abstraction | Full offline support (MVP) |

### **NOT Ported (Stable/Internal)**

**Criteria:** Framework part, single implementation, internal logic, or already portable

- ❌ **React / React Native** - Framework (core)
- ❌ **TypeScript** - Type system (core)
- ❌ **Zustand** - State management (already portable, stable)
- ❌ **Expo Router** - Navigation (framework part, swap = full rewrite)
- ❌ **react-hook-form** - Form management (stable, standard)
- ❌ **TanStack Query** - Data fetching (stable, standard)
- ❌ **Tamagui** - UI library (swap = full rewrite, use @ybis/ui wrapper instead)
- ❌ **i18next** - i18n (standard, no real alternatives)
- ❌ **Gifted Chat** - Chat UI (UI component, swap = full rewrite anyway)
- ❌ **Theme** - Internal (Tamagui config + zustand store, feature expansion not vendor swap)

### **Port Pattern Example**

```typescript
// Define interface (port)
interface ChatPort {
  getMessages(): Promise<ChatMessage[]>;
  sendMessage(content: string): Promise<void>;
  subscribeToMessages(callback: (msg: ChatMessage) => void): Unsubscribe;
}

// Phase 0: Gifted Chat adapter
class GiftedChatAdapter implements ChatPort {
  // Implementation for mobile
}

// Open Beta: Custom adapter (web + mobile)
class CustomChatAdapter implements ChatPort {
  // New implementation, same interface
}

// App code unchanged - just swap adapter!
```

---

## 📂 Monorepo Structure

```
ybis/
├── apps/
│   ├── mobile/          # Expo + React Native (Phase 0)
│   ├── web/             # Next.js (Open Beta)
│   └── backend/         # Hono + Vercel
│
├── packages/
│   ├── ui/              # Tamagui components (universal)
│   ├── core/            # Business logic, stores
│   ├── chat/            # ChatPort + implementations
│   ├── theme/           # ThemePort + providers
│   └── i18n/            # LanguagePort + translations
│
├── package.json         # Workspace root
└── tsconfig.json        # Shared TypeScript config
```

---

## ⏱️ Development Timeline & Investment

### **Phase 0 Setup Overhead**

| Task | Time | Justification |
|------|------|---------------|
| Tamagui + Expo Router | 2 gün | Web-ready foundation |
| Reanimated 4 setup | 0.5 gün | New Arch + web support |
| i18next setup | 1 gün | TR+EN Day 1 |
| Port implementations (9 ports) | 4 gün | Migration insurance |
| UX polish (deep link, push, etc.) | 6.5 gün | Production-ready UX |
| **TOTAL** | **14 gün** | Initial investment |

### **Open Beta Savings**

| Avoided Work | Time Saved | Reason |
|--------------|------------|--------|
| UI refactor (RN Paper → Tamagui) | -10 gün | Universal components Day 1 |
| Routing migration | -5 gün | Expo Router web-ready |
| i18n implementation | -2 gün | Already implemented |
| Animation web porting | -1 gün | Reanimated web support |
| **TOTAL SAVINGS** | **-18 gün** | Web launch acceleration |

### **ROI Calculation**

```
Net Savings: 18 gün - 14 gün = +4 gün
Benefit: Better UX + Future-proof + Web-ready
```

---

## 🚨 Critical Dependencies & Risks

### **High Priority Dependencies**

| Dependency | Risk | Mitigation |
|------------|------|------------|
| **Firebase Auth** | Vendor lock-in | AuthPort Day 1 |
| **Supabase** | Cost scaling | DatabasePort + migration plan |
| **OpenAI** | Rate limits, cost | LLMPort + fallback (Claude) |
| **Gifted Chat** | Mobile-only | ChatPort Day 1 |
| **Vercel** | Pricing model changes | Containerization ready |

### **New Architecture Migration**

```yaml
Status: Enabled Day 1
Risk: Third-party library compatibility
Mitigation:
  - All chosen libraries tested with New Arch
  - Reanimated 4, Gesture Handler 2.28+ confirmed
  - Fallback: Disable New Arch if critical issues
```

### **React 18.3.1 vs React 19**

```yaml
Decision: React 18.3.1
Reason: Ecosystem maturity, library compatibility
Future: React 19 migration Phase 2+ (when ecosystem ready)
```

---

## 📊 Success Metrics & KPIs

### **Phase 0 (Closed Beta)**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Development Speed** | 4-6 hafta to launch | Timeline tracking |
| **Crash-free Rate** | >99% | Sentry |
| **App Startup Time** | <2s | Firebase Performance |
| **User Engagement** | >60% daily active | PostHog |
| **Feature Adoption** | >50% use core workflow | Analytics |

### **Open Beta (Web Launch)**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Web Launch Time** | 2 hafta (thanks to shared packages) | Timeline |
| **Web Performance** | LCP <2.5s | Lighthouse |
| **Cross-platform Consistency** | >95% feature parity | Manual QA |
| **Bundle Size** | <5MB (mobile), <1MB (web initial) | Build analysis |

---

## 🔒 Security & Compliance

### **Authentication Security**

```yaml
Token Storage:
  - Mobile: expo-secure-store (encrypted)
  - Web: crypto-js + localStorage
  
JWT Refresh:
  - Auto-refresh before expiry
  - Concurrent request handling
  - Secure token rotation
```

### **Data Privacy**

```yaml
GDPR Compliance:
  - User data export (Phase 1)
  - Right to deletion
  - Analytics opt-out (AnalyticsPort)
  
Data Encryption:
  - In transit: HTTPS/TLS
  - At rest: Supabase encryption
  - Sensitive fields: Client-side encryption
```

---

## 🎨 Design System & Branding

### **Theme System**

```yaml
Modes: Light, Dark, System
Provider: Tamagui theming + ThemePort
Tokens:
  - Colors: Primary, Secondary, Success, Danger, etc.
  - Spacing: xs(4), sm(8), md(16), lg(24), xl(32)
  - Typography: h1, h2, body, caption
  - Border Radius: sm(4), md(8), lg(16)
```

### **Component Library**

```yaml
Phase 0: Tamagui components
Customization: Design tokens override
Brand Evolution: ThemePort allows full custom theme (Phase 2+)
```

---

## 📱 Platform-Specific Considerations

### **iOS**

```yaml
Minimum Version: iOS 13+
Considerations:
  - App Tracking Transparency (ATT) - analytics opt-in
  - Biometric auth (Face ID)
  - Push notification permissions
  - Universal links (deep linking)
```

### **Android**

```yaml
Minimum Version: Android 6 (API 23)
Target: Android 16 (API 36) - RN 0.81.4
Considerations:
  - Edge-to-edge rendering (Android 16 mandatory)
  - App links (deep linking)
  - Notification channels
  - Biometric auth (Fingerprint)
```

### **Web**

```yaml
Browsers: Chrome, Safari, Firefox (last 2 versions)
SEO:
  - Server-side rendering (Next.js)
  - Meta tags per page
  - Structured data (JSON-LD)
  - Sitemap generation
```

---

## 🔄 Migration Paths

### **Database Migration (Phase 1)**

```yaml
From: Supabase
To: Google Cloud SQL (PostgreSQL)
Reason: Cost optimization at scale
Process:
  1. Export Supabase data (pg_dump)
  2. Import to Cloud SQL
  3. Swap DatabasePort adapter
  4. Zero downtime (dual-write period)
```

### **Auth Migration (Open Beta)**

```yaml
From: Firebase Auth
To: Custom OAuth + JWT
Reason: Full control, cost
Process:
  1. Implement custom OAuth
  2. Dual-write (Firebase + Custom)
  3. Migrate users (background job)
  4. Deprecate Firebase
```

### **Chat UI Migration (Open Beta)**

```yaml
From: Gifted Chat (mobile)
To: Custom UI (mobile + web)
Reason: Brand consistency, web support
Process:
  1. ChatPort already abstracted
  2. Build custom UI
  3. Swap adapter
  4. A/B test (keep Gifted Chat fallback)
```

---

## 💰 Cost Estimation (Monthly)

### **Phase 0 (Closed Beta - 300 users)**

| Service | Cost | Notes |
|---------|------|-------|
| Supabase | $25 | Free tier → Pro |
| Firebase (Auth + FCM) | $0 | Free tier sufficient |
| Vercel | $20 | Hobby plan |
| OpenAI | ~$50 | Est. 300K tokens/day |
| Sentry | $0 | Free tier (5K events) |
| PostHog | $0 | Free tier (1M events) |
| **TOTAL** | **~$95/mo** | |

### **Open Beta (5K users)**

| Service | Cost | Notes |
|---------|------|-------|
| Supabase | $25-50 | May need Pro+ |
| Firebase | $0-20 | FCM may exceed free |
| Vercel | $20-80 | May need Pro |
| OpenAI | ~$500 | Est. 3M tokens/day |
| Sentry | $26-80 | Likely exceed free |
| PostHog | $0-50 | May exceed free |
| **TOTAL** | **~$600-800/mo** | |

### **MVP (20K+ users)**

| Service | Cost | Notes |
|---------|------|-------|
| Google Cloud SQL | $100-200 | Managed PostgreSQL |
| Google Cloud Storage | $50-100 | File storage |
| Vercel | $80-200 | Pro plan |
| OpenAI | ~$2000 | Est. 12M tokens/day |
| Sentry | $80-200 | Business plan |
| Analytics (self-hosted) | $50 | Server cost |
| **TOTAL** | **~$2400-2900/mo** | |

---

## ✅ Final Checklist

### **Before Closed Beta Launch**

- [ ] All Tier 1 Ports implemented
- [ ] Error boundaries configured
- [ ] Sentry integrated + tested
- [ ] Push notifications working (iOS + Android)
- [ ] Deep linking configured
- [ ] i18n TR+EN working
- [ ] Dark mode working
- [ ] Biometric auth (optional)
- [ ] Splash screen + app icons
- [ ] Network status indicator
- [ ] Loading states (skeletons)
- [ ] Form validation
- [ ] Keyboard handling
- [ ] 70% test coverage
- [ ] Performance monitoring

### **Before Open Beta (Web) Launch**

- [ ] Next.js app scaffolded
- [ ] Shared packages working (ui, core, chat)
- [ ] Web routing configured
- [ ] SEO meta tags
- [ ] Web vitals tracking
- [ ] Custom chat UI (web + mobile)
- [ ] Auth migration (Firebase → Custom)
- [ ] Analytics unified (web + mobile)
- [ ] Cross-platform testing

---

## 🎓 Learning Resources

### **Key Technologies Documentation**

- **Expo:** https://docs.expo.dev
- **Tamagui:** https://tamagui.dev
- **Reanimated:** https://docs.swmansion.com/react-native-reanimated
- **TanStack Query:** https://tanstack.com/query
- **i18next:** https://www.i18next.com
- **Hono:** https://hono.dev
- **Supabase:** https://supabase.com/docs
- **Next.js:** https://nextjs.org/docs

### **Best Practices**

- **React Native New Architecture:** https://reactnative.dev/docs/new-architecture-intro
- **Port/Adapter Pattern:** https://alistair.cockburn.us/hexagonal-architecture
- **Monorepo Best Practices:** https://monorepo.tools

---

## 📞 Support & Questions

**Sorular için:**
- Tech lead ile review meeting
- Implementation sırasında pair programming
- Weekly sync: Port implementation progress

---

**Son Güncelleme:** 2025-01-05  
**Durum:** ✅ APPROVED - Ready for Implementation  
**Next Steps:** Monorepo setup → Tier 1 Ports → Closed Beta features

---

**🚀 LET'S BUILD!**