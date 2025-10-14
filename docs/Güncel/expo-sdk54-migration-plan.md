# Expo SDK 54 Migration - Reference

**Date:** 2025-10-06  
**Version:** 1.1  
**Status:** ✅ COMPLETED  
**Result:** React 19.1.0 + Expo SDK 54 + RN 0.81.4

> **Note:** This is a reference document. For current tech stack, see [`tech-stack.md`](./tech-stack.md)

---

## Quick Summary

**What was done:**
- Migrated to Expo SDK 54 managed workflow
- Updated React 19.1.0 → 19.2.0
- Updated 40+ packages to latest versions
- Migrated Firebase Auth → Expo Auth Session
- Installed 1546 packages with 0 vulnerabilities

**Key files created:**
- `apps/mobile/package.json` - Expo dependencies
- `apps/mobile/app.json` - Expo config
- `apps/mobile/babel.config.js` - Babel + Tamagui
- `apps/mobile/metro.config.js` - Metro bundler
- `apps/mobile/tsconfig.json` - TypeScript config

**Full details:**
- Package versions → [`tech-stack.md`](./tech-stack.md)
- Daily log → [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md)
- Decisions → [`YBIS_PROJE_ANAYASASI.md`](./YBIS_PROJE_ANAYASASI.md) v2.2.0

---

## 🎯 Migration Hedefleri

### **Teknik Hedefler**
1. React 19.1 özelliklerini kullanabilme
2. Expo'nun managed workflow avantajları
3. Daha hızlı development cycle
4. Simplified build process
5. Better developer experience

### **İş Hedefleri**
1. Geliştirme hızını artırma
2. Platform-specific kod azaltma
3. Deployment sürecini basitleştirme
4. Beta testini hızlandırma

---

## 📊 Mevcut Durum Analizi

### **Mevcut Paketler**

#### **Packages (Monorepo)**
```json
{
  "@ybis/core": {
    "version": "0.1.0",
    "dependencies": {
      "date-fns": "^4.1.0",
      "zod": "^3.24.1"
    }
  },
  "@ybis/chat": {
    "version": "0.1.0",
    "dependencies": {
      "react-native-gifted-chat": "^2.4.0"
    },
    "peerDependencies": {
      "react": "18.3.1"  // ⚠️ React 19.1'e güncellenecek
    }
  },
  "@ybis/ui": {
    "version": "0.1.0",
    "dependencies": {
      "tamagui": "^1.117.10"  // ⚠️ Expo uyumluluğu kontrol edilecek
    }
  },
  "@ybis/auth": {
    "version": "0.1.0",
    "dependencies": {
      "@react-native-firebase/auth": "^21.5.0",  // ❌ Expo alternative'e geçilecek
      "@react-native-google-signin/google-signin": "^14.1.0"  // ❌ expo-auth-session kullanılacak
    }
  },
  "@ybis/database": {},
  "@ybis/llm": {},
  "@ybis/i18n": {},
  "@ybis/theme": {},
  "@ybis/workflows": {}
}
```

#### **Apps**
```
apps/
├── backend/
│   └── package.json (Hono + Vercel) ✅ Değişiklik yok
├── mobile/
│   ├── android/ (Native Android) ⚠️ Expo managed'a geçecek
│   ├── ios/ (Native iOS) ⚠️ Expo managed'a geçecek
│   └── ❌ package.json YOK - oluşturulacak
└── web/
    └── package.json ✅ Değişiklik yok
```

---

## 🔄 Migration Stratejisi

### **Phase 1: Preparation (1 gün)**

#### 1.1. Expo CLI Kurulumu
```bash
npm install -g expo-cli eas-cli
```

#### 1.2. Mobile App Package.json Oluşturma
```json
{
  "name": "@ybis/mobile",
  "version": "0.1.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  }
}
```

#### 1.3. Expo Config (app.json)
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
      "bundleIdentifier": "com.ybis.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.ybis.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-secure-store"
    ]
  }
}
```

---

### **Phase 2: Dependency Migration (2-3 gün)**

#### 2.1. React & React Native
```bash
# Expo SDK 54 dependencies
npx expo install react@19.1.0 react-native@0.81.0
```

#### 2.2. Auth Package Migration

**Mevcut:**
```json
{
  "@react-native-firebase/auth": "^21.5.0",
  "@react-native-google-signin/google-signin": "^14.1.0"
}
```

**Expo Alternative:**
```bash
npx expo install expo-auth-session expo-web-browser expo-crypto
```

**Yeni Implementation:**
```typescript
// packages/auth/src/google-auth.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const useGoogleAuth = () => {
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'com.ybis.app'
      }),
    },
    discovery
  );

  return { promptAsync, response };
};
```

#### 2.3. UI Package (Tamagui) Kontrol

**Tamagui Expo Uyumluluğu:**
```bash
# Tamagui Expo SDK 54 uyumlu mu kontrol
npm info tamagui@1.117.10 peerDependencies

# Gerekirse güncelle
npx expo install tamagui @tamagui/config
```

**Tamagui Config (tamagui.config.ts):**
```typescript
import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const tamaguiConfig = createTamagui(config);

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
```

#### 2.4. Chat Package (Gifted Chat)

**Gifted Chat Expo Uyumluluğu:**
```bash
npx expo install react-native-gifted-chat
```

**Not:** `react-native-gifted-chat` Expo ile uyumludur, ancak dependencies kontrol edilmeli.

---

### **Phase 3: Monorepo Packages Update (1 gün)**

#### 3.1. Peer Dependencies Güncelleme

**Tüm @ybis/* paketlerinde:**
```json
{
  "peerDependencies": {
    "react": "19.1.0",  // 18.3.1 → 19.1.0
    "react-native": "0.81.0"
  }
}
```

#### 3.2. Core Package - No Changes
```json
{
  "name": "@ybis/core",
  "dependencies": {
    "date-fns": "^4.1.0",
    "zod": "^3.24.1"
  }
}
```
✅ Platform-agnostic, değişiklik yok.

#### 3.3. Database Package
```bash
# Expo ile uyumlu database çözümü
npx expo install expo-sqlite
```

**Veya Supabase (cross-platform):**
```bash
npm install @supabase/supabase-js
```

#### 3.4. LLM Package - No Changes
```json
{
  "name": "@ybis/llm",
  "dependencies": {
    "openai": "latest",
    "@anthropic-ai/sdk": "latest"
  }
}
```
✅ API-based, platform-agnostic.

---

### **Phase 4: Mobile App Structure (2 gün)**

#### 4.1. Expo Router Setup
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

#### 4.2. File Structure
```
apps/mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx       # Chat screen
│   │   ├── tasks.tsx
│   │   ├── calendar.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx
│   └── +not-found.tsx
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── components/             # Shared components
├── hooks/                  # Custom hooks
├── providers/              # Context providers
├── utils/                  # Utilities
├── app.json                # Expo config
├── package.json
├── tsconfig.json
└── babel.config.js
```

#### 4.3. Expo Entry Point
```javascript
// expo/AppEntry.js
import 'expo-router/entry';
```

#### 4.4. Babel Config
```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
        },
      ],
    ],
  };
};
```

---

### **Phase 5: Native Modules Migration (1-2 gün)**

#### 5.1. Required Expo Modules
```bash
# Core Expo modules
npx expo install expo-constants expo-device expo-status-bar

# Storage
npx expo install expo-secure-store expo-file-system

# Notifications
npx expo install expo-notifications

# Camera & Media (future)
# npx expo install expo-camera expo-image-picker

# Location (future)
# npx expo install expo-location

# Haptics
npx expo install expo-haptics
```

#### 5.2. Firebase Alternative (Optional)
Eğer Firebase Cloud Messaging kullanacaksak:
```bash
npx expo install expo-notifications
# + Backend'de FCM setup
```

---

### **Phase 6: Build Configuration (1 gün)**

#### 6.1. EAS Build Setup
```bash
# EAS CLI ile build yapılandırması
eas build:configure
```

#### 6.2. eas.json
```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 6.3. Environment Variables
```bash
# .env.local (gitignore'da)
EXPO_PUBLIC_API_URL=https://api.ybis.app
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxx
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=xxx
```

**app.config.js (dynamic config):**
```javascript
export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'YBIS',
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },
};
```

---

### **Phase 7: Testing & Validation (2-3 gün)**

#### 7.1. Development Build
```bash
# iOS simulator
eas build --profile development --platform ios

# Android emulator
eas build --profile development --platform android

# Local development
npx expo run:ios
npx expo run:android
```

#### 7.2. Validation Checklist
- [ ] App launches without errors
- [ ] Google Sign-In çalışıyor
- [ ] Chat interface render oluyor
- [ ] Tamagui components düzgün görünüyor
- [ ] Navigation çalışıyor (Expo Router)
- [ ] Hot reload çalışıyor
- [ ] TypeScript errors yok
- [ ] Build başarılı (iOS + Android)

#### 7.3. Performance Testing
- [ ] Cold start time: <3s
- [ ] Hot reload: <2s
- [ ] Memory usage: <150MB idle
- [ ] Bundle size: <50MB

---

## 🚨 Potential Issues & Solutions

### **Issue 1: Tamagui Expo Compatibility**
**Problem:** Tamagui Metro config çakışması olabilir  
**Solution:** 
```bash
npx expo customize metro.config.js
```
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
```

### **Issue 2: Monorepo Path Resolution**
**Problem:** Expo Metro @ybis/* paketleri bulamayabilir  
**Solution:**
```javascript
// metro.config.js
const path = require('path');

config.watchFolders = [
  path.resolve(__dirname, '../../packages'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];
```

### **Issue 3: React Native Reanimated**
**Problem:** Gifted Chat, Reanimated gerektirebilir  
**Solution:**
```bash
npx expo install react-native-reanimated
```
```javascript
// babel.config.js
plugins: ['react-native-reanimated/plugin'] // En son plugin olmalı
```

### **Issue 4: React 19.1 Breaking Changes**
**Problem:** React 19.1 bazı API'ları değiştirdi  
**Solution:**
- `ReactDOM.render` → `createRoot`
- `useEffect` cleanup timing değişti
- [React 19 migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)

---

## 📦 Final Package Structure

### **Mobile App (apps/mobile/package.json)**
```json
{
  "name": "@ybis/mobile",
  "version": "0.1.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build:preview": "eas build --profile preview",
    "build:production": "eas build --profile production",
    "submit": "eas submit"
  },
  "dependencies": {
    // Expo Core
    "expo": "~54.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-constants": "~17.0.0",
    
    // React
    "react": "19.1.0",
    "react-native": "0.81.0",
    
    // Navigation
    "react-native-safe-area-context": "4.14.0",
    "react-native-screens": "~4.4.0",
    
    // Auth
    "expo-auth-session": "~6.0.0",
    "expo-web-browser": "~14.0.0",
    "expo-crypto": "~14.0.0",
    
    // Storage
    "expo-secure-store": "~14.0.0",
    "expo-file-system": "~18.0.0",
    
    // Notifications
    "expo-notifications": "~0.29.0",
    
    // UI
    "tamagui": "^1.117.10",
    "@tamagui/config": "^1.117.10",
    "react-native-reanimated": "~4.1.0",
    
    // YBIS Packages
    "@ybis/core": "*",
    "@ybis/chat": "*",
    "@ybis/ui": "*",
    "@ybis/auth": "*",
    "@ybis/theme": "*",
    "@ybis/i18n": "*"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "~19.1.0",
    "typescript": "^5.3.3"
  }
}
```

---

## 📈 Migration Timeline

```
Week 1:
├─ Day 1: Expo CLI setup, research, planning ✅
├─ Day 2: Package migrations (@ybis/auth, @ybis/ui)
├─ Day 3: Mobile app structure + Expo Router
├─ Day 4: Native modules migration
└─ Day 5: Build configuration + first test build

Week 2:
├─ Day 1-2: Bug fixes, compatibility issues
├─ Day 3: Performance optimization
├─ Day 4: Testing (iOS + Android)
└─ Day 5: Documentation update
```

---

## ✅ Success Criteria

### **Technical**
- [ ] App builds successfully on iOS and Android
- [ ] All @ybis/* packages working with Expo
- [ ] Google Sign-In functional
- [ ] Hot reload working
- [ ] No TypeScript errors
- [ ] Bundle size <50MB

### **Performance**
- [ ] Cold start <3s
- [ ] Hot reload <2s
- [ ] Memory usage <150MB
- [ ] 60 FPS animations

### **Developer Experience**
- [ ] `expo start` works instantly
- [ ] Development builds in <5 minutes
- [ ] EAS build pipeline configured
- [ ] Clear documentation

---

## 📚 Dokümantasyon Güncellemeleri

Aşağıdaki dokümanlar güncellenecek:

### **1. PRD (Product Requirements Document)**
```markdown
# Technology Stack (Updated)

## Mobile
- **Framework:** Expo SDK 54
- **React:** 19.1.0
- **React Native:** 0.81.0
- **Router:** Expo Router (file-based)
- **UI Library:** Tamagui
- **Auth:** expo-auth-session (Google OAuth)
```

### **2. Project Brief**
```markdown
### Technology Preferences

**Frontend:**
- **Mobile:** Expo SDK 54 + React Native 0.81
- **React:** 19.1.0 (latest features)
- **State Management:** Zustand
- **Navigation:** Expo Router
- **UI Library:** Tamagui
- **TypeScript:** Strict mode
```

### **3. Beta Development Spec**
```markdown
## React Native & Expo Stratejisi
- **Mevcut:** Expo SDK 54 + React 19.1 + RN 0.81
- **Managed Workflow:** Expo managed workflow kullanıyoruz
- **Build:** EAS Build (cloud builds)
- **OTA Updates:** Expo Updates (CodePush alternative)
```

---

## 🔗 Resources

### **Official Docs**
- [Expo SDK 54 Release Notes](https://expo.dev/changelog/sdk-54)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Expo Router Docs](https://expo.github.io/router/docs/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

### **Migration Guides**
- [Expo Bare to Managed](https://docs.expo.dev/bare/overview/)
- [React 18 → 19 Migration](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Tamagui with Expo](https://tamagui.dev/docs/guides/expo)

---

**Status:** ✅ Migration plan ready  
**Next Steps:** Execute Phase 1 (Preparation)  
**Estimated Completion:** 2 weeks  
**Risk Level:** Medium (well-documented migration path)

