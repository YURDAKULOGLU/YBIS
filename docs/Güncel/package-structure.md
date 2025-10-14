# YBIS Monorepo Package Structure

**Version:** 3.0 (Hybrid Approaches: npm → NX, Expo Managed → Bare)
**Last Updated:** 2025-10-12
**Status:** Pre-Development Blueprint
**Tech Stack Reference:** `Architecture_better.md`, `YBIS_PROJE_ANAYASASI.md` (v2.0.0)
**Strategy:** **Hybrid/Progressive Enhancement + Port Architecture**

---

## 📋 Executive Summary

**Core Principle:** Start simple, add complexity when needed + Port architecture for easy migration

### Key Decisions: Hybrid Approaches
- ✅ **npm workspaces (Week 1-2)** → **NX (Week 3+)** - Progressive monorepo tooling
- ✅ **Expo Managed** → **Expo Bare** (if custom native needed) - Start simple, eject if required
- ✅ **Expo Web** → **Next.js** (Open Beta, if SEO/performance needed) - Web-ready from Day 1
- ✅ **Expo + Expo Router** (file-based routing, web-ready)
- ✅ **Tamagui** (universal UI, mobile+web)
- ✅ **Supabase** (database Phase 0 baştan)
- ✅ **Expo Auth Session** (OAuth 2.0) → **AuthPort** (swap later)
- ✅ **Gifted Chat** (speed) → **ChatPort** (swap later)
- ✅ **i18next** (TR+EN Day 1 full)

---

## 📂 Monorepo Structure

**Week 1-2 (npm workspaces):**
```
ybis/
├── apps/
│   ├── mobile/              # Expo Managed app (no ios/ android/ folders)
│   ├── web/                 # Next.js (stubbed Phase 0, activated Open Beta)
│   └── backend/             # Hono API server
│
├── packages/
│   ├── ui/                  # Tamagui components (universal)
│   ├── core/                # Business logic, types, domain
│   ├── chat/                # ChatPort + adapters (Gifted → Custom)
│   ├── auth/                # AuthPort + adapters (Expo Auth → Supabase Auth)
│   ├── database/            # DatabasePort + adapters (Supabase)
│   ├── llm/                 # LLMPort + adapters (OpenAI → multi-provider)
│   ├── theme/               # ThemePort + Tamagui theme
│   └── i18n/                # LanguagePort + i18next (TR+EN)
│
├── package.json             # Root workspace config (workspaces: ["apps/*", "packages/*"])
├── tsconfig.base.json       # Shared TypeScript config
├── .eslintrc.js             # Shared ESLint config
├── .prettierrc              # Shared Prettier config
└── README.md
```

**Week 3+ (npm workspaces + NX layer):**
```
ybis/
├── apps/                    # Same structure
├── packages/                # Same structure
├── nx.json                  # NX configuration (added Week 3)
├── package.json             # Workspace config (workspaces + NX scripts)
└── ...                      # Rest unchanged
```

**Migration Command (Week 3):**
```bash
npx nx init  # Adds NX layer, keeps workspaces intact
```

---

## Root Configuration

### `package.json` (Root - Week 1-2: npm workspaces only)

```json
{
  "name": "ybis-monorepo",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "mobile": "cd apps/mobile && npm start",
    "mobile:ios": "cd apps/mobile && npm run ios",
    "mobile:android": "cd apps/mobile && npm run android",
    "mobile:web": "cd apps/mobile && npm run web",
    "web": "cd apps/web && npm run dev",
    "backend": "cd apps/backend && npm run dev",
    "backend:deploy": "cd apps/backend && npm run deploy",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "npm run type-check --workspaces --if-present"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.4",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### `package.json` (Root - Week 3+: npm workspaces + NX)

```json
{
  "name": "ybis-monorepo",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "mobile": "nx run mobile:start",
    "mobile:ios": "nx run mobile:ios",
    "mobile:android": "nx run mobile:android",
    "mobile:web": "nx run mobile:web",
    "web": "nx run web:dev",
    "backend": "nx run backend:dev",
    "backend:deploy": "nx run backend:deploy",
    "build": "nx run-many --target=build --all",
    "test": "nx run-many --target=test --all",
    "lint": "nx run-many --target=lint --all",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "type-check": "nx run-many --target=type-check --all",
    "affected:build": "nx affected --target=build",
    "affected:test": "nx affected --target=test",
    "graph": "nx graph"
  },
  "devDependencies": {
    "@nx/workspace": "^19.8.14",
    "@nx/js": "^19.8.14",
    "nx": "^19.8.14",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.4",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

### `nx.json` (NX Configuration - Added Week 3+)

**Created by:** `npx nx init` command in Week 3

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
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
  "defaultBase": "main",
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "production": ["!{projectRoot}/**/*.spec.ts"]
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

**Note:** Week 1-2 has NO nx.json file. Monorepo runs on pure npm workspaces.

---

### `tsconfig.base.json` (Root Shared TypeScript Config)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "jsx": "react-native",
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
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@ybis/ui": ["packages/ui/src/index.ts"],
      "@ybis/core": ["packages/core/src/index.ts"],
      "@ybis/chat": ["packages/chat/src/index.ts"],
      "@ybis/auth": ["packages/auth/src/index.ts"],
      "@ybis/database": ["packages/database/src/index.ts"],
      "@ybis/llm": ["packages/llm/src/index.ts"],
      "@ybis/theme": ["packages/theme/src/index.ts"],
      "@ybis/i18n": ["packages/i18n/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "dist", "build", "coverage"]
}
```

---

### `.eslintrc.js` (Root ESLint Config)

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
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist', 'build', 'node_modules', 'coverage', '.expo'],
};
```

---

### `.prettierrc` (Root Prettier Config)

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

---

## App 1: `apps/mobile` (Expo + React Native)

### Directory Structure

**Expo Managed Workflow (Closed Beta):**
```
apps/mobile/
├── app/                       # Expo Router file-based routing
│   ├── (auth)/                # Auth layout group
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/                # Main tabs layout group
│   │   ├── _layout.tsx        # Tab navigator
│   │   ├── plan.tsx           # Plan tab screen
│   │   ├── tasks.tsx          # Tasks tab screen
│   │   └── notes.tsx          # Notes tab screen
│   ├── _layout.tsx            # Root layout
│   └── index.tsx              # Entry redirect
│
├── src/
│   ├── components/            # Screen-specific components
│   │   ├── chat/
│   │   │   └── ChatContainer.tsx
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskItem.tsx
│   │   └── notes/
│   │       ├── NoteList.tsx
│   │       └── NoteEditor.tsx
│   │
│   ├── services/              # Port adapter implementations
│   │   ├── auth/
│   │   │   └── authService.ts         # Uses @ybis/auth
│   │   ├── database/
│   │   │   └── databaseService.ts     # Uses @ybis/database
│   │   ├── chat/
│   │   │   └── chatService.ts         # Uses @ybis/chat
│   │   └── llm/
│   │       └── llmService.ts          # Uses @ybis/llm
│   │
│   ├── stores/                # Zustand stores
│   │   ├── authStore.ts
│   │   ├── taskStore.ts
│   │   ├── noteStore.ts
│   │   ├── chatStore.ts
│   │   └── workflowStore.ts
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useNotes.ts
│   │   ├── useChat.ts
│   │   └── useTheme.ts
│   │
│   └── utils/                 # Mobile-specific utilities
│       ├── permissions.ts
│       ├── notifications.ts
│       └── deepLinks.ts
│
├── assets/                    # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── package.json
├── project.json               # NX project config (Week 3+)
├── tsconfig.json
├── app.json                   # Expo config
├── eas.json                   # EAS Build config
└── babel.config.js
```

**Note:** NO `ios/` and `android/` folders in Managed workflow. Generated by EAS Build in cloud.

**If Expo Bare needed (custom native modules):**
```bash
npx expo prebuild  # Creates ios/ and android/ folders (5 mins)
```

**After `expo prebuild`:**
```
apps/mobile/
├── app/                       # Same as above
├── src/                       # Same as above
├── assets/                    # Same as above
├── android/                   # ⚠️ NEW: Android native code (after prebuild)
├── ios/                       # ⚠️ NEW: iOS native code (after prebuild)
├── package.json
├── ...
```

---

### `apps/mobile/package.json`

```json
{
  "name": "@ybis/mobile",
  "version": "0.1.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.3.0",
    "expo-splash-screen": "~0.29.0",
    "expo-status-bar": "~2.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-notifications": "~0.29.0",
    "expo-auth-session": "~7.0.0",
    "expo-web-browser": "~15.0.0",
    "expo-crypto": "~15.0.0",
    "tamagui": "^1.117.10",
    "@tamagui/config": "^1.117.10",
    "react-native-reanimated": "~4.1.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-gifted-chat": "^2.4.0",
    "react-native-vector-icons": "^10.2.0",
    "react-native-date-picker": "^5.0.7",
    "@tanstack/react-query": "^5.62.8",
    "zustand": "^5.0.2",
    "react-hook-form": "^7.54.2",
    "date-fns": "^4.1.0",
    "@ybis/ui": "*",
    "@ybis/core": "*",
    "@ybis/chat": "*",
    "@ybis/auth": "*",
    "@ybis/database": "*",
    "@ybis/llm": "*",
    "@ybis/theme": "*",
    "@ybis/i18n": "*"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@types/react": "~18.3.1",
    "@types/react-native": "~0.76.0",
    "jest": "^29.7.0",
    "typescript": "^5.3.3"
  }
}
```

---

### `apps/mobile/project.json` (NX Config - Week 3+ only)

**Note:** This file does NOT exist Week 1-2. Created by `nx init` or manually in Week 3.

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
    "ios": {
      "executor": "nx:run-commands",
      "options": {
        "command": "expo start --ios",
        "cwd": "apps/mobile"
      }
    },
    "android": {
      "executor": "nx:run-commands",
      "options": {
        "command": "expo start --android",
        "cwd": "apps/mobile"
      }
    },
    "web": {
      "executor": "nx:run-commands",
      "options": {
        "command": "expo start --web",
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

### `apps/mobile/app.json` (Expo Config)

```json
{
  "expo": {
    "name": "YBIS",
    "slug": "ybis",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.ybis.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.ybis.app",
      "versionCode": 1
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      "expo-notifications"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "scheme": "ybis"
  }
}
```

---

## App 2: `apps/web` (Next.js - Stubbed Phase 0)

### Directory Structure

```
apps/web/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── dashboard/
│       └── page.tsx           # Dashboard (Open Beta)
│
├── src/
│   ├── components/            # Web-specific components
│   └── lib/                   # Web utilities
│
├── public/                    # Static assets
├── package.json
├── project.json               # NX config
├── tsconfig.json
└── next.config.js
```

---

### `apps/web/package.json` (Stubbed Phase 0)

```json
{
  "name": "@ybis/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.21",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tamagui": "^1.117.10",
    "@tamagui/next-plugin": "^1.117.10",
    "@ybis/ui": "*",
    "@ybis/core": "*",
    "@ybis/theme": "*",
    "@ybis/i18n": "*"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.3.3"
  }
}
```

---

## App 3: `apps/backend` (Hono API Server)

### Directory Structure

```
apps/backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts            # Auth routes
│   │   ├── tasks.ts           # Task CRUD
│   │   ├── notes.ts           # Note CRUD
│   │   ├── chat.ts            # Chat/LLM routes
│   │   ├── workflows.ts       # Workflow routes
│   │   └── index.ts           # Route aggregator
│   │
│   ├── services/
│   │   ├── llm/
│   │   │   └── llmService.ts  # Uses @ybis/llm
│   │   ├── auth/
│   │   │   └── authService.ts # Google OAuth verification
│   │   └── database/
│   │       └── supabaseClient.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── errorHandler.ts   # Error handling
│   │   ├── logger.ts          # Request logging
│   │   └── cors.ts            # CORS config
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   └── validators.ts
│   │
│   └── index.ts               # Entry point
│
├── package.json
├── project.json               # NX config
├── tsconfig.json
├── vercel.json                # Vercel deployment config
└── .env.example
```

---

### `apps/backend/package.json`

```json
{
  "name": "@ybis/backend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "deploy": "vercel --prod",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "hono": "^4.6.14",
    "@hono/node-server": "^1.13.7",
    "openai": "^4.73.1",
    "@anthropic-ai/sdk": "^0.34.1",
    "firebase-admin": "^13.0.1",
    "@supabase/supabase-js": "^2.47.10",
    "zod": "^3.24.1",
    "@ybis/core": "*",
    "@ybis/llm": "*",
    "@ybis/database": "*"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "tsx": "^4.19.2",
    "typescript": "^5.3.3",
    "vercel": "^39.2.3"
  }
}
```

---

### `apps/backend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "dist"
}
```

---

## Package 1: `packages/ui` (Tamagui Universal Components)

### Directory Structure

```
packages/ui/
├── src/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Text.tsx
│   ├── Avatar.tsx
│   ├── Spinner.tsx
│   ├── Skeleton.tsx
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/ui/package.json`

```json
{
  "name": "@ybis/ui",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "tamagui": "^1.117.10",
    "@tamagui/config": "^1.117.10"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-native": "*"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/ui/src/Button.tsx` (Example Component)

```typescript
import { Button as TamaguiButton, ButtonProps } from 'tamagui';
import React from 'react';

export interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  ...props
}) => {
  return (
    <TamaguiButton
      theme={variant}
      {...props}
    />
  );
};
```

---

## Package 2: `packages/core` (Business Logic & Types)

### Directory Structure

```
packages/core/
├── src/
│   ├── types/                 # Domain types
│   │   ├── task.ts
│   │   ├── note.ts
│   │   ├── calendar.ts
│   │   ├── workflow.ts
│   │   ├── user.ts
│   │   ├── chat.ts
│   │   └── index.ts
│   │
│   ├── ports/                 # Port interfaces
│   │   ├── AuthPort.ts
│   │   ├── DatabasePort.ts
│   │   ├── LLMPort.ts
│   │   ├── ChatPort.ts
│   │   ├── StoragePort.ts
│   │   ├── ThemePort.ts
│   │   ├── LanguagePort.ts
│   │   └── index.ts
│   │
│   ├── domain/                # Business logic
│   │   ├── task/
│   │   │   ├── TaskService.ts
│   │   │   └── taskValidators.ts
│   │   ├── note/
│   │   │   └── NoteService.ts
│   │   ├── workflow/
│   │   │   └── WorkflowEngine.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── date.ts
│   │   ├── string.ts
│   │   ├── logger.ts
│   │   └── index.ts
│   │
│   └── index.ts               # Public API
│
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/core/package.json`

```json
{
  "name": "@ybis/core",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "date-fns": "^4.1.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "jest": "^29.7.0",
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/core/src/ports/AuthPort.ts` (Port Interface)

```typescript
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface AuthPort {
  // Sign in methods
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;

  // User state
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;

  // Token management
  getIdToken(): Promise<string | null>;
  refreshToken(): Promise<string | null>;
}
```

---

### `packages/core/src/ports/ChatPort.ts` (Port Interface)

```typescript
export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  isAI: boolean;
  metadata?: Record<string, any>;
}

export interface ChatPort {
  // Message management
  getMessages(): Promise<ChatMessage[]>;
  sendMessage(text: string, metadata?: Record<string, any>): Promise<ChatMessage>;

  // Real-time
  subscribeToMessages(callback: (message: ChatMessage) => void): () => void;

  // UI state
  setTypingIndicator(isTyping: boolean): void;
}
```

---

## Package 3: `packages/chat` (ChatPort + Adapters)

### Directory Structure

```
packages/chat/
├── src/
│   ├── ChatPort.ts            # Re-export from @ybis/core
│   ├── adapters/
│   │   ├── GiftedChatAdapter.tsx     # Phase 0 (mobile)
│   │   └── CustomChatAdapter.tsx     # Open Beta (stub)
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/chat/package.json`

```json
{
  "name": "@ybis/chat",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ybis/core": "*",
    "react-native-gifted-chat": "^2.4.0"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-native": "*"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/chat/src/adapters/GiftedChatAdapter.tsx` (Phase 0)

```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { ChatPort, ChatMessage } from '@ybis/core';

interface GiftedChatAdapterProps {
  chatPort: ChatPort;
  currentUserId: string;
}

export const GiftedChatAdapter: React.FC<GiftedChatAdapterProps> = ({
  chatPort,
  currentUserId,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Load initial messages
    chatPort.getMessages().then((msgs) => {
      const giftedMessages = msgs.map(mapToGiftedMessage);
      setMessages(giftedMessages);
    });

    // Subscribe to new messages
    const unsubscribe = chatPort.subscribeToMessages((msg) => {
      setMessages((prev) => [mapToGiftedMessage(msg), ...prev]);
    });

    return unsubscribe;
  }, [chatPort]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      newMessages.forEach((msg) => {
        chatPort.sendMessage(msg.text);
      });
    },
    [chatPort]
  );

  const mapToGiftedMessage = (msg: ChatMessage): IMessage => ({
    _id: msg.id,
    text: msg.text,
    createdAt: msg.createdAt,
    user: {
      _id: msg.userId,
      name: msg.isAI ? 'YBIS AI' : 'You',
    },
  });

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ _id: currentUserId }}
      placeholder="YBIS'e bir şey sor..."
    />
  );
};
```

---

## Package 4: `packages/auth` (AuthPort + Adapters)

### Directory Structure

```
packages/auth/
├── src/
│   ├── AuthPort.ts            # Re-export from @ybis/core
│   ├── adapters/
│   │   ├── ExpoAuthAdapter.ts        # Phase 0 (Closed Beta)
│   │   └── SupabaseAuthAdapter.ts    # Open Beta (planned)
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/auth/package.json`

```json
{
  "name": "@ybis/auth",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ybis/core": "*",
    "expo-auth-session": "~7.0.0",
    "expo-web-browser": "~15.0.0",
    "expo-crypto": "~15.0.0",
    "expo-secure-store": "~15.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "vitest": "^1.6.1"
  }
}
```

---

### `packages/auth/src/adapters/ExpoAuthAdapter.ts` (Phase 0)

```typescript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import type { AuthPort, User, SignInResult } from '@ybis/core';

WebBrowser.maybeCompleteAuthSession();

export interface ExpoAuthConfig {
  google: {
    clientId: string;
    iosClientId?: string;
    androidClientId?: string;
  };
}

export class ExpoAuthAdapter implements AuthPort {
  private config: ExpoAuthConfig;
  private currentUser: User | null = null;

  constructor(config: ExpoAuthConfig) {
    this.config = config;
  }

  async signInWithOAuth(provider: 'google'): Promise<SignInResult> {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'ybis',
      path: 'auth/callback',
    });

    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };

    const [request, , promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: this.config.google.clientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
      },
      discovery
    );

    const result = await promptAsync();
    
    if (result.type === 'success') {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: this.config.google.clientId,
          code: result.params.code,
          redirectUri,
          extraParams: { code_verifier: request?.codeVerifier || '' },
        },
        discovery
      );

      const idTokenPayload = this.parseJWT(tokenResponse.idToken || '');
      
      const user: User = {
        id: idTokenPayload.sub,
        email: idTokenPayload.email,
        displayName: idTokenPayload.name || null,
        photoURL: idTokenPayload.picture || null,
        emailVerified: idTokenPayload.email_verified || false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      await SecureStore.setItemAsync('auth_token', tokenResponse.accessToken);
      this.currentUser = user;

      return { user, credentials: tokenResponse, isNewUser: false };
    }

    throw new Error('Authentication cancelled');
  }

  async signOut(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  private parseJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
}
```

---

## Package 5: `packages/database` (DatabasePort + Supabase)

### Directory Structure

```
packages/database/
├── src/
│   ├── DatabasePort.ts        # Re-export from @ybis/core
│   ├── adapters/
│   │   └── SupabaseAdapter.ts
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/database/package.json`

```json
{
  "name": "@ybis/database",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ybis/core": "*",
    "@supabase/supabase-js": "^2.47.10"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/database/src/adapters/SupabaseAdapter.ts`

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabasePort } from '@ybis/core';

export class SupabaseAdapter implements DatabasePort {
  private client: SupabaseClient;

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey);
  }

  async query<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
    let query = this.client.from(table).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await this.client
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async insert<T>(table: string, data: Omit<T, 'id'>): Promise<T> {
    const { data: inserted, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return inserted as T;
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated as T;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.client.from(table).delete().eq('id', id);
    if (error) throw error;
  }

  subscribe<T>(table: string, callback: (data: T[]) => void): () => void {
    const channel = this.client
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          // Refetch all data on change (simple approach Phase 0)
          this.query<T>(table).then(callback);
        }
      )
      .subscribe();

    return () => {
      this.client.removeChannel(channel);
    };
  }
}
```

---

## Package 6: `packages/llm` (LLMPort + OpenAI)

### Directory Structure

```
packages/llm/
├── src/
│   ├── LLMPort.ts             # Re-export from @ybis/core
│   ├── adapters/
│   │   ├── OpenAIAdapter.ts   # Phase 0
│   │   └── ClaudeAdapter.ts   # Fallback (stub)
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/llm/package.json`

```json
{
  "name": "@ybis/llm",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@ybis/core": "*",
    "openai": "^4.73.1",
    "@anthropic-ai/sdk": "^0.34.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/llm/src/adapters/OpenAIAdapter.ts`

```typescript
import OpenAI from 'openai';
import { LLMPort, LLMMessage, LLMResponse, LLMTool } from '@ybis/core';

export class OpenAIAdapter implements LLMPort {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async chat(
    messages: LLMMessage[],
    tools?: LLMTool[]
  ): Promise<LLMResponse> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools: tools?.map((t) => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      })),
    });

    const message = completion.choices[0]?.message;

    return {
      content: message?.content ?? '',
      toolCalls: message?.tool_calls?.map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      })),
      usage: {
        inputTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
      },
    };
  }

  estimateCost(messages: LLMMessage[]): number {
    // Rough estimation: 1 message ≈ 100 tokens
    const estimatedTokens = messages.reduce(
      (sum, m) => sum + m.content.length / 4,
      0
    );
    // GPT-4o-mini: $0.15 per 1M input tokens
    return (estimatedTokens / 1_000_000) * 0.15;
  }
}
```

---

## Package 7: `packages/theme` (ThemePort + Tamagui)

### Directory Structure

```
packages/theme/
├── src/
│   ├── theme.ts               # Tamagui theme config
│   ├── ThemeProvider.tsx
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/theme/package.json`

```json
{
  "name": "@ybis/theme",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "tamagui": "^1.117.10",
    "@tamagui/config": "^1.117.10"
  },
  "peerDependencies": {
    "react": "18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/theme/src/theme.ts`

```typescript
import { createTamagui, createTokens } from 'tamagui';
import { config } from '@tamagui/config/v3';

const tokens = createTokens({
  color: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  size: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
});

export const tamaguiConfig = createTamagui({
  ...config,
  tokens,
  themes: {
    light: {
      background: tokens.color.backgroundPrimary,
      color: tokens.color.textPrimary,
    },
    dark: {
      background: '#000000',
      color: '#FFFFFF',
    },
  },
});

export type TamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends TamaguiConfig {}
}
```

---

## Package 8: `packages/i18n` (LanguagePort + i18next)

### Directory Structure

```
packages/i18n/
├── src/
│   ├── locales/
│   │   ├── tr/
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── tasks.json
│   │   │   └── chat.json
│   │   └── en/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── tasks.json
│   │       └── chat.json
│   ├── i18n.ts
│   └── index.ts
├── package.json
├── project.json
└── tsconfig.json
```

---

### `packages/i18n/package.json`

```json
{
  "name": "@ybis/i18n",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "i18next": "^24.2.0",
    "react-i18next": "^15.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

---

### `packages/i18n/src/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import trCommon from './locales/tr/common.json';
import trAuth from './locales/tr/auth.json';
import trTasks from './locales/tr/tasks.json';
import trChat from './locales/tr/chat.json';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enTasks from './locales/en/tasks.json';
import enChat from './locales/en/chat.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'tr',
  fallbackLng: 'en',
  resources: {
    tr: {
      common: trCommon,
      auth: trAuth,
      tasks: trTasks,
      chat: trChat,
    },
    en: {
      common: enCommon,
      auth: enAuth,
      tasks: enTasks,
      chat: enChat,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

---

### `packages/i18n/src/locales/tr/common.json` (Example)

```json
{
  "appName": "YBIS",
  "welcome": "Hoş geldiniz",
  "loading": "Yükleniyor...",
  "error": "Bir hata oluştu",
  "save": "Kaydet",
  "cancel": "İptal",
  "delete": "Sil",
  "edit": "Düzenle"
}
```

---

### `packages/i18n/src/locales/en/common.json` (Example)

```json
{
  "appName": "YBIS",
  "welcome": "Welcome",
  "loading": "Loading...",
  "error": "An error occurred",
  "save": "Save",
  "cancel": "Cancel",
  "delete": "Delete",
  "edit": "Edit"
}
```

---

## 🔄 Port Architecture Implementation Summary

### Tier 1 Ports (Implemented Phase 0)

| Port | Package | Phase 0 Adapter | Open Beta Migration |
|------|---------|----------------|-------------------|
| **AuthPort** | `@ybis/auth` | ExpoAuthAdapter | SupabaseAuthAdapter |
| **ChatPort** | `@ybis/chat` | GiftedChatAdapter | CustomChatAdapter |
| **DatabasePort** | `@ybis/database` | SupabaseAdapter | CloudSQLAdapter (if needed) |
| **LLMPort** | `@ybis/llm` | OpenAIAdapter | MultiProviderAdapter |
| **ThemePort** | `@ybis/theme` | Tamagui theme | Custom theme engine |
| **LanguagePort** | `@ybis/i18n` | i18next | Same (stable) |

---

## ⏱️ Development Timeline

### Phase 0: Closed Beta Setup (Hybrid Approach)

**Week 1-2: npm workspaces + Expo Managed**

| Task | Duration | Dependencies |
|------|----------|--------------|
| npm workspaces init | 0.5 day | - |
| Expo Managed app scaffold | 0.5 day | workspace setup |
| Tamagui + theme setup | 1 day | Expo scaffold |
| i18next setup (TR+EN) | 1 day | - |
| Tier 1 Ports implementation | 4 days | All packages |
| Firebase Auth integration | 1 day | @ybis/auth |
| Supabase setup | 1 day | @ybis/database |
| Gifted Chat integration | 0.5 day | @ybis/chat |
| **TOTAL** | **10 days** | Infrastructure ready |

**Week 3+: NX Migration**

| Task | Duration | Trigger |
|------|----------|---------|
| Run `npx nx init` | 0.5 day | Build time >2min OR >5 packages |
| Add project.json files | 0.5 day | NX init done |
| Test NX caching | 0.5 day | project.json added |
| **TOTAL** | **1.5 days** | NX layer added |

**If Expo Bare needed:**

| Task | Duration | Trigger |
|------|----------|---------|
| Run `npx expo prebuild` | 0.5 day | Custom native module needed |
| Test native builds | 1 day | Prebuild done |
| **TOTAL** | **1.5 days** | Bare workflow activated |

### Open Beta: Web Launch

| Task | Duration | Decision |
|------|----------|----------|
| **Option A: Expo Web** (easiest) | 1 day | `expo start --web` just works |
| **Option B: Next.js** (if SEO/perf needed) | 5 days | Custom Chat UI + routing port |
| Supabase Auth migration | 2 days | AuthPort swap |
| Web-specific features | 3 days | SEO, SSR, etc. |
| **TOTAL (Option A)** | **6 days** | Web launch ready (Expo Web) |
| **TOTAL (Option B)** | **10 days** | Web launch ready (Next.js) |

---

## 📊 Migration Checklist

### When to Migrate Each Port

| Port | Current | Target | Trigger | Estimated Effort |
|------|---------|--------|---------|------------------|
| AuthPort | Firebase | Supabase/Custom | Open Beta launch | 2-3 days |
| ChatPort | Gifted Chat | Custom UI | Web launch | 5-7 days |
| DatabasePort | Supabase | Cloud SQL | >20K users (cost) | 3-5 days |
| LLMPort | OpenAI only | Multi-provider | Rate limits OR cost | 2-3 days |
| ThemePort | Tamagui | Custom theme | Brand evolution | 5-10 days |

---

## ✅ Final Checklist

### Before Starting Development

- [ ] NX installed and configured
- [ ] All package.json files created
- [ ] tsconfig.base.json paths configured
- [ ] ESLint + Prettier configured
- [ ] Firebase project created (Auth + FCM)
- [ ] Supabase project created (Database + Storage)
- [ ] OpenAI API key obtained
- [ ] Vercel account created
- [ ] EAS account created (Expo Application Services)

### Before Closed Beta Launch

- [ ] All Tier 1 Ports implemented
- [ ] i18n TR+EN fully translated
- [ ] Error boundaries configured
- [ ] Sentry integrated
- [ ] Push notifications working (iOS + Android)
- [ ] Deep linking configured
- [ ] Dark mode working
- [ ] Performance monitoring
- [ ] 70% test coverage

---

## 🚀 Next Steps (Hybrid Approach)

**Week 1, Day 1: npm workspaces setup**

1. **Create root workspace**
   ```bash
   mkdir ybis && cd ybis
   npm init -y
   ```

2. **Add workspaces to package.json**
   ```json
   {
     "workspaces": ["apps/*", "packages/*"]
   }
   ```

3. **Create folder structure**
   ```bash
   mkdir -p apps/mobile apps/web apps/backend
   mkdir -p packages/ui packages/core packages/chat packages/auth packages/database packages/llm packages/theme packages/i18n
   ```

4. **Initialize Expo Managed app**
   ```bash
   cd apps/mobile
   npx create-expo-app@latest . --template blank-typescript
   # NO ios/ android/ folders will be created (Managed workflow)
   ```

5. **Install dependencies**
   ```bash
   cd ../.. # Back to root
   npm install
   ```

6. **Start development** (Week 1, Day 1 from tasks.md)

---

**Week 3: NX Migration (when ready)**

```bash
npx nx init  # Adds NX layer, keeps workspaces
```

---

**If Expo Bare needed (custom native):**

```bash
cd apps/mobile
npx expo prebuild  # Creates ios/ android/ in 5 mins
```

---

**Status:** ✅ READY FOR IMPLEMENTATION
**Strategy:** Hybrid/Progressive Enhancement + Port Architecture
**Week 1-2:** npm workspaces + Expo Managed (zero learning curve)
**Week 3+:** NX layer (caching, affected commands)
**Onaylandı mı?** 🚀
