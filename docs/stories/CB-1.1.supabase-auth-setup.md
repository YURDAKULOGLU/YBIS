# Story CB-1.1: Supabase Project Setup & Authentication

**Status:** 📝 Draft  
**Epic:** E-CB-001 Closed Beta Foundation  
**Priority:** P0 - BLOCKER  
**Effort:** 8h  
**Owner:** Dev Agent  

---

## 📖 Story

**As a** YBIS user,  
**I want** Google ile giriş yapabilmek,  
**so that** verilerime güvenli erişebilir ve kendi workspace'ime sahip olabilirim.

---

## 🏛️ Anayasa Uyum Kontrolü (ZORUNLU)

- **Prensip 1: Port Architecture (AuthPort)**
  - **Uyum Planı:** Supabase Auth, `AuthPort` interface üzerinden soyutlanacak. Direct Supabase import yasak, sadece `SupabaseAuthAdapter` üzerinden erişim.

- **Prensip 2: Workspace-Based Data Schema**
  - **Uyum Planı:** Her kullanıcı signup'da otomatik workspace oluşturacak. Tüm tablolar `workspace_id` foreign key ile ilişkilendirilecek.

- **Prensip 3: Zero-Tolerance TypeScript Rules**
  - **Uyum Planı:** Strict mode, explicit return types, no `any` types. ESLint kurallarına tam uyum.

---

## ✅ Acceptance Criteria

1. **Supabase Project Setup**
   - [ ] Supabase organization "YBIS" altında yeni project (`ybis-closed-beta-prod`)
   - [ ] Database oluşturulmuş (PostgreSQL 15+)
   - [ ] Environment variables ayarlanmış (`.env.local` + Vercel)

2. **Google OAuth Provider**
   - [ ] Supabase Dashboard → Authentication → Providers → Google enabled
   - [ ] Google Cloud Console: OAuth 2.0 credentials created
   - [ ] Redirect URI: `ybis://auth-callback` configured
   - [ ] Scopes: `email`, `profile`, `calendar.events`, `calendar.settings.readonly`

3. **Database Schema**
   - [ ] Table: `workspaces(id uuid PK, owner_id uuid FK, name text, created_at timestamp)`
   - [ ] Table: `profiles(id uuid PK, user_id uuid FK, workspace_id uuid FK, display_name text, avatar_url text)`
   - [ ] RLS policies: `workspace_id = auth.uid()` için tüm tablolar

4. **AuthPort Implementation**
   - [ ] Interface: `packages/auth/src/ports/AuthPort.ts` (signIn, signOut, getSession, onAuthStateChange)
   - [ ] Adapter: `packages/auth/src/adapters/SupabaseAuthAdapter.ts`
   - [ ] Tests: Unit tests for adapter (mock Supabase client)

5. **Mobile Login Flow**
   - [ ] Screen: `apps/mobile/src/screens/LoginScreen.tsx` (Google button)
   - [ ] Service: `apps/mobile/src/services/auth.service.ts` (AuthPort kullanımı)
   - [ ] Token storage: `expo-secure-store` (session token)
   - [ ] Auto-redirect: Login success → Home screen
   - [ ] Logout: Token clear + redirect to login

---

## 📋 Tasks / Subtasks

### Backend (Supabase)
- [ ] **Task 1: Supabase Project Setup**
  - [ ] Create organization "YBIS"
  - [ ] Create project `ybis-closed-beta-prod`
  - [ ] Copy API keys to `.env.local`
  - [ ] Create project `ybis-closed-beta-dev` (development)

- [ ] **Task 2: Google OAuth Configuration**
  - [ ] Google Cloud Console → Create OAuth 2.0 Client ID
  - [ ] Add redirect URI: `ybis://auth-callback`
  - [ ] Copy Client ID + Secret to Supabase Dashboard
  - [ ] Test OAuth flow (Supabase dashboard test)

- [ ] **Task 3: Database Schema**
  - [ ] Run migration: `workspaces` table
  - [ ] Run migration: `profiles` table
  - [ ] RLS policies: Enable RLS on all tables
  - [ ] RLS policy: `workspaces` SELECT/UPDATE WHERE `owner_id = auth.uid()`
  - [ ] RLS policy: `profiles` ALL WHERE `workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())`

### Port Architecture
- [ ] **Task 4: AuthPort Interface**
  - [ ] Create `packages/auth/package.json`
  - [ ] Create `packages/auth/src/ports/AuthPort.ts`
    ```typescript
    export interface AuthPort {
      signInWithGoogle(): Promise<AuthSession>;
      signOut(): Promise<void>;
      getSession(): Promise<AuthSession | null>;
      onAuthStateChange(callback: (session: AuthSession | null) => void): void;
    }
    ```
  - [ ] Create types: `AuthSession`, `User`, `Workspace`

- [ ] **Task 5: SupabaseAuthAdapter**
  - [ ] Create `packages/auth/src/adapters/SupabaseAuthAdapter.ts`
  - [ ] Implement all AuthPort methods
  - [ ] Handle token refresh logic
  - [ ] Error handling (network errors, invalid tokens)
  - [ ] Unit tests (mock supabase client)

### Mobile App
- [ ] **Task 6: Login Screen**
  - [ ] Create `apps/mobile/src/screens/LoginScreen.tsx`
  - [ ] Google button UI (Tamagui Button + Google icon)
  - [ ] Loading state (spinner)
  - [ ] Error banner (NetworkErrorBanner)

- [ ] **Task 7: Auth Service**
  - [ ] Create `apps/mobile/src/services/auth.service.ts`
  - [ ] Inject AuthPort (Zustand store or context)
  - [ ] Login flow: `signInWithGoogle()` → store session → navigate to Home
  - [ ] Logout flow: `signOut()` → clear session → navigate to Login

- [ ] **Task 8: Session Management**
  - [ ] Zustand store: `authStore` (session, user, workspace)
  - [ ] Persist session: `expo-secure-store`
  - [ ] Auto-login: Check session on app start
  - [ ] Protected routes: Redirect to login if no session

---

## 🔧 Dev Notes

### Supabase Configuration
- **Dashboard:** https://app.supabase.com
- **Database:** PostgreSQL 15 (free tier: 500MB)
- **Auth:** Supabase Auth (built-in OAuth providers)
- **RLS:** Row Level Security (workspace isolation)

### Google OAuth
- **Redirect URI:** `ybis://auth-callback` (Expo deep link)
- **Scopes Required:**
  - `email` (user email)
  - `profile` (user name, avatar)
  - `https://www.googleapis.com/auth/calendar.events` (calendar read/write)
  - `https://www.googleapis.com/auth/calendar.settings.readonly` (timezone, work hours)

### Port Architecture
- **AuthPort:** Single source of truth for authentication
- **Adapter Pattern:** Supabase-specific implementation
- **Dependency Injection:** Mobile app receives AuthPort instance (not direct Supabase)

### Security
- **Token Storage:** `expo-secure-store` (encrypted keychain on iOS/Android)
- **RLS Policies:** Database-level security (workspace isolation)
- **No Direct Access:** Mobile app NEVER calls Supabase directly (only via ports)

---

## 🧪 Testing

### Unit Tests
```typescript
// packages/auth/src/adapters/__tests__/SupabaseAuthAdapter.test.ts
describe('SupabaseAuthAdapter', () => {
  it('should sign in with Google', async () => {
    // Mock Supabase client
    // Call signInWithGoogle()
    // Assert session returned
  });

  it('should handle sign in errors', async () => {
    // Mock network error
    // Call signInWithGoogle()
    // Assert error thrown
  });
});
```

### Integration Tests
1. **Login Flow**
   - Open app → Login screen appears
   - Tap Google button → OAuth browser opens
   - Complete Google auth → Redirect to app
   - Session stored → Home screen appears

2. **Logout Flow**
   - Tap logout button → Confirm dialog
   - Token cleared → Redirect to login

3. **Auto-Login**
   - Kill app → Reopen
   - Session exists → Auto-navigate to Home (skip login)

### Manual Testing
- [ ] iOS: Login with Google account
- [ ] Android: Login with Google account
- [ ] Logout → re-login
- [ ] App restart → auto-login
- [ ] Token expiry → refresh token flow

---

## 📁 Files Created/Modified

### New Files
```
packages/auth/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── ports/
│   │   └── AuthPort.ts
│   ├── adapters/
│   │   └── SupabaseAuthAdapter.ts
│   └── types/
│       ├── AuthSession.ts
│       ├── User.ts
│       └── Workspace.ts

apps/mobile/src/
├── screens/
│   └── LoginScreen.tsx
├── services/
│   └── auth.service.ts
└── stores/
    └── authStore.ts
```

### Modified Files
```
apps/mobile/app/_layout.tsx (add auth check)
apps/mobile/package.json (add @ybis/auth dependency)
```

---

## 🚧 Dependencies & Blockers

**Dependencies:**
- Google Cloud Console access (OAuth credentials)
- Supabase account (organization creation)
- `expo-secure-store` package installed

**Blockers:**
- None

**Related Stories:**
- CB-1.2: Core Data Tables (needs workspace_id from this story)

---

## 📝 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-29 | 1.0 | Initial story creation | Copilot |

---

## 🤖 Dev Agent Record

**Agent Model Used:** _[To be filled by Dev Agent]_

**Debug Log References:** _[To be filled by Dev Agent]_

**Completion Notes:**
- _[To be filled by Dev Agent]_

**File List:**
- _[To be filled by Dev Agent]_

---

## ✅ QA Results

_[To be filled by QA Agent]_
