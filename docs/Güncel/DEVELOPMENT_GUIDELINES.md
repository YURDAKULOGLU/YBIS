# YBIS Development Guidelines

**Purpose:** Prevent recurring issues and enforce proper solutions  
**Created:** 2025-10-06  
**Status:** 🔴 MANDATORY - Must follow during all development

---

## ⚠️ CRITICAL: Read Before ANY Development

This document contains **hard-learned lessons** from actual issues. **DO NOT skip or workaround** these guidelines. Every item here caused real problems.

---

## 🚫 FORBIDDEN PRACTICES (Zero Tolerance)

### 1. NO Workarounds or Quick Fixes
```typescript
// ❌ FORBIDDEN
skipLibCheck: true  // Hides real errors
strict: false       // Disables type safety
// @ts-ignore        // Ignores TypeScript errors
any                 // Bypasses type system
--force             // Breaks dependency tree
--legacy-peer-deps  // Masks peer dependency issues
```

**Why:** These hide problems that will surface later. Fix the root cause!

### 2. NO Shorthand Props in Tamagui with TypeScript
```typescript
// ❌ WRONG - TypeScript errors guaranteed
<YStack f={1} ai="center" jc="center" col="$gray11" fos="$4" />

// ✅ CORRECT - Always use full prop names
<YStack flex={1} alignItems="center" justifyContent="center" color="$gray11" fontSize="$4" />
```

**Root Cause:** TypeScript strict mode doesn't recognize Tamagui shorthands  
**Reference:** DEVELOPMENT_LOG.md - Issue #1

**Complete Mapping:**
```typescript
// Layout
f → flex
ai → alignItems
jc → justifyContent
fd → flexDirection
fw → flexWrap

// Spacing
p → padding
m → margin
mt → marginTop
mb → marginBottom
ml → marginLeft
mr → marginRight
pt → paddingTop
pb → paddingBottom
pl → paddingLeft
pr → paddingRight
gap → gap (OK, but use "$X" format)

// Typography
col → color
fos → fontSize
fow → fontWeight
ta → textAlign
ls → letterSpacing
lh → lineHeight

// Dimensions
w → width
h → height
mw → maxWidth
mh → maxHeight
minw → minWidth
minh → minHeight

// Background
bg → backgroundColor
bc → borderColor
br → borderRadius
```

**Prevention:** IDE autocomplete will show full names - use them!

---

## 📦 Monorepo TypeScript Configuration (MANDATORY)

### Problem: Cross-Package Imports in Monorepo
**Symptom:** `File 'packages/X/src/index.ts' is not under 'rootDir'`

### ✅ PROPER SOLUTION: TypeScript Project References

**Step 1: Configure Each Package**
```json
// packages/[package-name]/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,                    // ← REQUIRED for project references
    "outDir": "./dist",
    "rootDir": "./src",
    "tsBuildInfoFile": "./dist/.tsbuildinfo"  // ← Unique per package!
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 2: Configure Consuming App**
```json
// apps/mobile/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ybis/ui": ["../../packages/ui/src"],
      "@ybis/core": ["../../packages/core/src"],
      "@ybis/theme": ["../../packages/theme/src"]
    }
  },
  "references": [                        // ← REQUIRED!
    { "path": "../../packages/ui" },
    { "path": "../../packages/core" },
    { "path": "../../packages/theme" }
  ]
}
```

**Step 3: Build Packages Before Apps**
```bash
# ALWAYS run this before type-checking apps
npx tsc --build ./packages/ui ./packages/core ./packages/theme

# Then check app
npm run type-check --workspace=@ybis/mobile
```

**Why This Matters:**
- ✅ Proper type checking across packages
- ✅ Incremental builds (faster)
- ✅ IDE autocomplete works
- ✅ No hidden errors

**Prevention:**
1. Set up project references when creating new packages
2. Add to root package.json: `"build:packages": "tsc --build ./packages/*"`
3. Run before every app build

**Reference:** DEVELOPMENT_LOG.md - Issue #4, AD-006

---

## 📚 Package Creation Checklist

### Every New Package MUST Have:

```
packages/[name]/
├── src/
│   └── index.ts          ← MUST exist (even if empty export)
├── tsconfig.json         ← With composite: true
├── package.json          ← With name, main, types
└── README.md             ← Purpose and exports
```

**Minimum index.ts:**
```typescript
// packages/[name]/src/index.ts
export {};  // Valid empty export if no content yet
```

**Why:** TypeScript fails silently if no source files exist  
**Reference:** DEVELOPMENT_LOG.md - Issue #5

---

## 🎨 UI Library (Tamagui) Rules

### 1. Import Pattern (MANDATORY)
```typescript
// ❌ WRONG - Direct Tamagui import in app code
import { Button } from 'tamagui';

// ✅ CORRECT - Always use @ybis/ui wrapper
import { Button } from '@ybis/ui';
```

**Why:** Port architecture - easy to swap UI library later  
**Reference:** YBIS_PROJE_ANAYASASI.md - Principle #2

### 2. Component Props (MANDATORY)
```typescript
// ❌ WRONG - Shorthand props
<Button mt="$4" w={200} />

// ✅ CORRECT - Full props
<Button marginTop="$4" width={200} />
```

### 3. Theme Tokens (MANDATORY)
```typescript
// ✅ CORRECT - Always use tokens
color="$gray11"      // Not "#666"
fontSize="$4"        // Not "16px"
padding="$4"         // Not 16
gap="$3"            // Not 12
```

**Why:** Theme consistency, dark mode support

---

## 🔐 Authentication Pattern

### Import Pattern (MANDATORY)
```typescript
// ❌ WRONG - Direct OAuth library import
import * as AuthSession from 'expo-auth-session';

// ✅ CORRECT - Use @ybis/auth port
import { useAuth } from '@ybis/auth';
```

**Why:** Port architecture - can swap auth provider without app changes  
**Reference:** YBIS_PROJE_ANAYASASI.md - AuthPort

### Expo Auth Session (Current Implementation)
```typescript
// packages/auth/src/ExpoAuthAdapter.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// App code just uses:
const { signIn, signOut, user } = useAuth();
```

**Migration Path:**
- Phase 0: Expo Auth Session (now)
- Phase 1: Supabase Auth (when ready)
- App code: ZERO changes needed

---

## 🗄️ Database Pattern

### Import Pattern (MANDATORY)
```typescript
// ❌ WRONG - Direct Supabase import
import { createClient } from '@supabase/supabase-js';

// ✅ CORRECT - Use @ybis/database port
import { useDatabase } from '@ybis/database';
```

**Why:** Port architecture - can migrate to different DB  
**Reference:** YBIS_PROJE_ANAYASASI.md - DatabasePort

---

## 🤖 AI/LLM Pattern

### Import Pattern (MANDATORY)
```typescript
// ❌ WRONG - Direct OpenAI import
import OpenAI from 'openai';

// ✅ CORRECT - Use @ybis/llm port
import { useLLM } from '@ybis/llm';
```

**Why:** Multi-provider support, easy fallback  
**Reference:** YBIS_PROJE_ANAYASASI.md - LLMPort

**Provider Strategy:**
- Primary: OpenAI GPT-4o-mini
- Fallback: Anthropic Claude 3.5 Haiku
- App code: Agnostic

---

## 📝 Package Installation Rules

### 1. Check Compatibility FIRST
```bash
# ❌ WRONG - Install without checking
npm install some-package

# ✅ CORRECT - Check compatibility first
npm view some-package peerDependencies
npm view some-package versions

# Check if compatible with:
# - React 19.1.0.0
# - React Native 0.81.4
# - Expo SDK 54
```

### 2. Install in Correct Location
```bash
# App-specific (UI, navigation)
npm install --workspace=@ybis/mobile package-name

# Shared logic (types, utils)
npm install --workspace=@ybis/core package-name

# Root (dev tools, linting)
npm install --save-dev package-name
```

### 3. Update DEVELOPMENT_LOG
```markdown
### Day X - [DATE]
**Package Installed:** package-name@version
**Reason:** Why we need it
**Location:** Which workspace
**Compatibility:** Verified with React 19.1.0, RN 0.81.4
```

**Reference:** DEVELOPMENT_LOG.md - Package Version Log

---

## 🏗️ File Creation Order (MANDATORY)

When creating new features, follow this order to avoid errors:

### 1. Types First
```typescript
// packages/core/src/types/task.ts
export interface Task {
  id: string;
  title: string;
  // ...
}
```

### 2. Port Interface
```typescript
// packages/core/src/ports/TaskPort.ts
export interface TaskPort {
  createTask(task: CreateTaskDTO): Promise<Task>;
  // ...
}
```

### 3. Adapter Implementation
```typescript
// packages/database/src/adapters/SupabaseTaskAdapter.ts
export class SupabaseTaskAdapter implements TaskPort {
  // Implementation
}
```

### 4. Hook/Service
```typescript
// packages/core/src/hooks/useTask.ts
export function useTask() {
  // Uses TaskPort
}
```

### 5. UI Component
```typescript
// apps/mobile/app/(tabs)/tasks.tsx
import { useTask } from '@ybis/core';
// Now it works!
```

**Why:** Prevents import errors and circular dependencies

---

## 🧪 Testing Before Commit (MANDATORY)

```bash
# 1. TypeScript (MUST PASS)
npm run type-check

# 2. Linting (MUST PASS)
npm run lint

# 3. Build packages (if changed)
npx tsc --build ./packages/*

# 4. Test app
cd apps/mobile && npx expo start

# 5. Update DEVELOPMENT_LOG.md
# Document what was done, any issues found, solutions applied
```

**Zero tolerance:** If type-check fails, FIX IT. Don't commit.

---

## 📊 Error Patterns & Solutions

### Pattern 1: "Cannot find module '@ybis/X'"
**Root Cause:** Package doesn't exist or not built  
**Solution:**
1. Check package exists: `ls packages/X/src/index.ts`
2. Build package: `npx tsc --build ./packages/X`
3. Verify tsconfig.json paths are correct

### Pattern 2: "Property 'X' does not exist on type..."
**Root Cause:** Tamagui shorthand prop  
**Solution:** Use full prop name (see mapping above)

### Pattern 3: "File is not under rootDir"
**Root Cause:** Missing TypeScript Project References  
**Solution:** Add composite + references (see Monorepo section)

### Pattern 4: "No inputs were found in config file"
**Root Cause:** Empty package source folder  
**Solution:** Create index.ts with at least `export {};`

### Pattern 5: "Peer dependency conflict"
**Root Cause:** Package incompatible with React 19.1.0 or RN 0.81.4  
**Solution:** Find compatible version or different package

### Pattern 6: "Cannot find module [babel-plugin]" in Monorepo
**Root Cause:** Babel plugins installed in workspace root, but Metro/Babel can't resolve them  
**Solution:** Use `require.resolve()` with workspace root path

**Example:**
```javascript
// apps/mobile/babel.config.js
const path = require('path');

module.exports = function (api) {
  const workspaceRoot = path.resolve(__dirname, '../..');
  
  return {
    plugins: [
      // ❌ WRONG - won't find in monorepo
      '@tamagui/babel-plugin',
      
      // ✅ CORRECT - resolve from workspace root
      require.resolve('@tamagui/babel-plugin', { paths: [workspaceRoot] }),
    ],
  };
};
```

**Why:** Metro bundler and Babel use different module resolution strategies in monorepos  
**Prevention:** Always use `require.resolve()` for Babel plugins in monorepo apps

---

## 🎯 Architecture Decision Template

When making ANY architectural decision, document it:

```markdown
### AD-XXX: [Decision Title]
- **Date:** YYYY-MM-DD
- **Context:** Why we needed to decide
- **Decision:** What we decided
- **Alternatives Considered:** Other options and why rejected
- **Rationale:** Technical reasoning
- **Consequences:**
  - ✅ Benefits
  - ⚠️ Trade-offs
  - ❌ Risks

**Prevention:** How to avoid this decision becoming a problem
**Reference:** Related docs/code
```

**Add to:** `docs/Güncel/DEVELOPMENT_LOG.md` under Architecture Decisions

---

## 📝 DEVELOPMENT_LOG.md Update Rules

### MUST Document:
1. ✅ Every task completed (with date)
2. 🐛 Every issue encountered (problem + solution)
3. 🎯 Every architecture decision (AD-XXX format)
4. 📦 Every package installed (version + reason)
5. ⚠️ Every deviation from plan

### Update Frequency:
- **Daily:** At end of development session
- **Per Issue:** Immediately after solving
- **Per Decision:** Before implementing

### Format:
```markdown
### Day X - YYYY-MM-DD

**✅ Tasks Completed:**
- Task description with specific outcomes

**🐛 Issues Encountered & Solutions:**
**Issue #X: [Problem Title]**
- **Problem:** What went wrong
- **Root Cause:** Why it happened
- **Solution:** How we fixed it (detailed steps)
- **Prevention:** How to avoid in future

**🎯 Architecture Decisions:**
**AD-XXX:** [Decision] (see template above)
```

---

## 🚀 Deployment Checklist

Before ANY deployment:

```bash
# 1. All packages built
npx tsc --build ./packages/*

# 2. Type-check passes
npm run type-check

# 3. Linting passes
npm run lint

# 4. No console errors
# (Manual: Run app and check console)

# 5. DEVELOPMENT_LOG.md updated
# (Manual: Document all changes)

# 6. Constitution compliance check
# - No direct vendor imports?
# - Using port interfaces?
# - No workarounds?
# - No @ts-ignore?
```

---

## 🪟 Windows-Specific Development Issues

### ⚠️ CRITICAL: Windows Has Major Limitations for React Native

**TL;DR:** Use EAS Build or WSL2 - NOT local Android builds on Windows!

---

### Issue: Windows 260 Character Path Limit

**Problem:** `ninja: error: Stat(...): Filename longer than 260 characters`

**Root Cause:** Windows MAX_PATH limitation (legacy DOS compatibility)

**Affected Scenario:**
- React Native C++ native module builds (CMake/Ninja)
- Deep node_modules nesting
- Long package names (e.g., `react-native-keyboard-controller`)

**Example Path (280+ characters):**
```
C:\Projeler\YBIS\apps\mobile\android\app\.cxx\Debug\20s5o144\arm64-v8a\
reactnativekeyboardcontroller_autolinked_build\CMakeFiles\
react_codegen_reactnativekeyboardcontroller.dir\C_\Projeler\YBIS\
node_modules\react-native-keyboard-controller\common\cpp\react\renderer\
components\reactnativekeyboardcontroller\RNKCKeyboardBackgroundViewShadowNode.cpp.o
```

**❌ Workarounds (NOT RECOMMENDED):**
```powershell
# 1. Enable LongPathsEnabled (requires admin + reboot)
# Still has other Windows issues

# 2. Move to shorter path
C:\Projeler\YBIS → C:\Y
# Only reduces by ~10 chars, not enough for deep nesting
```

**✅ PROPER SOLUTIONS:**

**Option 1: EAS Build (RECOMMENDED) ⭐**
```bash
# Cloud build - no Windows limitations
eas build --profile development --platform android
```

**Benefits:**
- ✅ No path length limit
- ✅ No file locking issues
- ✅ Clean build environment
- ✅ Consistent across team
- ✅ No local SDK/NDK needed
- ⚠️ Free tier: 30 builds/month

**Option 2: WSL2 (Ubuntu on Windows)**
```bash
# Install WSL2
wsl --install

# Use Linux environment for builds
cd /mnt/c/Projeler/YBIS
# Linux has no 260 char limit
```

**Benefits:**
- ✅ Full Linux environment
- ✅ No path limit
- ✅ Better performance
- ⚠️ Requires WSL2 setup

**Prevention:**
- ❌ DON'T use local Android builds on Windows
- ✅ DO use EAS Build for native builds
- ✅ DO use WSL2 if must build locally
- ✅ DO use Metro bundler for JS-only changes (instant hot reload)

**Reference:** DEVELOPMENT_LOG.md - Issue #9

---

### Issue: Windows File Locking (Permission Denied)

**Problem:** `ninja: error: remove(...): Permission denied`

**Root Cause:** 
- Windows file locking during NDK/CMake C++ compilation
- Antivirus or Windows Defender scanning build files
- Gradle Daemon holding file locks

**Error Pattern:**
```
deleting depfile: Permission denied
ninja: error: remove(CMakeFiles\worklets.dir\...\UIRuntimeDecorator.cpp.o.d): Permission denied
```

**Affected Modules:**
- `react-native-worklets`
- `expo-modules-core`
- Any native module with C++ code

**❌ Attempted Workarounds (FAILED):**
```bash
# 1. Clean build
./gradlew.bat clean
# → Still fails on rebuild

# 2. Kill Gradle Daemon
./gradlew --stop
# → Files still locked

# 3. Disable Antivirus
# → Security risk, still has issues
```

**✅ PROPER SOLUTION: Use EAS Build**
- No file locking on cloud servers
- Clean environment every build
- No Antivirus interference

**Reference:** DEVELOPMENT_LOG.md - Issue #8

---

### Architecture Decision: EAS Build on Windows

**AD-008: EAS Build over Local Android Build on Windows**

**Context:** Local Android build failed due to:
1. Windows 260 character path limit
2. Windows file locking (permission denied)
3. Antivirus interference with NDK builds

**Decision:** Use EAS Build for all Android development builds on Windows

**Rationale:**
- Windows MAX_PATH is systemic (can't be fully solved)
- React Native C++ builds create very deep paths
- Native module package names are long (35+ chars)
- File locking issues are persistent
- EAS Build eliminates all Windows-specific issues

**Impact:**
- **Native Changes:** Require EAS Build (~5-10 min)
  - Initial setup
  - Adding/removing native modules
  - Native code changes
  - Release builds
- **JS Changes:** Use Metro bundler (instant hot reload, no rebuild)
  - UI changes
  - Business logic
  - Styling
  - Most development work

**Free Tier Limits:**
- 30 builds/month
- Sufficient for closed beta phase
- Typical usage: 5-10 builds/month

**When to Rebuild:**
```bash
# ✅ REBUILD NEEDED (use EAS Build)
- Installing new native module (npm install react-native-X)
- Changing app.json native config
- Modifying android/ or ios/ folders
- Updating Expo SDK

# ❌ NO REBUILD NEEDED (use Metro bundler)
- Changing JS/TS code
- Styling changes
- UI component updates
- Business logic changes
- API integrations
```

**Commands:**
```bash
# Development Build (first time or native changes)
eas build --profile development --platform android

# Daily Development (JS-only changes)
npx expo start --dev-client

# Hot reload happens automatically!
```

**Reference:** DEVELOPMENT_LOG.md - AD-008

---

## 🔄 Continuous Improvement

### This Document is Living
- Add new patterns as discovered
- Update solutions when better approach found
- Remove outdated practices
- Keep examples current

### Who Updates:
- **Developers:** Add issues encountered
- **Reviewers:** Add patterns from code review
- **AI Agents:** Add solutions that worked

### Review Frequency:
- **Weekly:** Check if guidelines followed
- **Monthly:** Update based on learnings
- **Per Major Issue:** Add new guideline immediately

---

## ✅ Checklist Summary

**Before Starting ANY Task:**
- [ ] Read relevant guidelines above
- [ ] Check DEVELOPMENT_LOG for similar past issues
- [ ] Verify all dependencies installed and compatible
- [ ] Confirm package structure correct (if creating new)

**During Development:**
- [ ] Use full Tamagui prop names
- [ ] Import through @ybis/* ports (never direct)
- [ ] Follow file creation order
- [ ] Build packages before type-checking

**Before Committing:**
- [ ] Type-check passes (zero errors)
- [ ] Linting passes (zero warnings)
- [ ] No console errors in app
- [ ] DEVELOPMENT_LOG.md updated
- [ ] No workarounds or @ts-ignore used

**If Issue Occurs:**
- [ ] Document in DEVELOPMENT_LOG immediately
- [ ] Find root cause (don't mask with workaround)
- [ ] Add prevention guideline to this document
- [ ] Test solution thoroughly

---

## 🆘 When In Doubt

1. **Check YBIS_PROJE_ANAYASASI.md** - Core principles
2. **Check DEVELOPMENT_LOG.md** - Past issues
3. **Check this document** - Specific guidelines
4. **Ask before workaround** - Never shortcut

**Remember:** Time spent on proper solution < Time wasted on workaround problems

---

**Last Updated:** 2025-10-06  
**Next Review:** 2025-10-13  
**Status:** 🔴 MANDATORY COMPLIANCE

**Violations:** Document in DEVELOPMENT_LOG as "Deviation from Guidelines"

