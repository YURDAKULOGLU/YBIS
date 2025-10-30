# 🚀 Expo Managed Workflow Geçiş Planı

**Created:** 2025-10-27  
**Last Reviewed:** 2025-10-29  
**Status:** ✅ Ready to Execute  
**Hedef:** Tam managed workflow (Expo Go + EAS Build)

---

## 🎯 HEDEF

Projeyi **tam managed workflow**'a geçirmek:
- ✅ Expo Go ile development
- ✅ EAS Build ile production builds
- ✅ Native klasör yok (managed)
- ✅ Native kod yok (tüm özellikler Expo modülleri ile)

---

## 📋 MEVCUT DURUM ANALİZİ

### ✅ Zaten Managed ile Uyumlu Olanlar
- ✅ Native klasörler yok (`ios/`, `android/` yok)
- ✅ Tüm modüller Expo modülleri (native kod yok)
- ✅ Expo SDK 54
- ✅ Babel config doğru
- ✅ Metro config doğru

### ❌ Düzeltilmesi Gerekenler
1. ❌ `apps/mobile/package.json`: Native build script'leri var (`android`, `ios`)
2. ❌ `apps/mobile/eas.json`: `developmentClient: true` var
3. ❌ `app.json` ve `app.config.ts` çift config (birleştirilmeli)
4. ❌ Root `package.json`: Native build script'leri var + deprecated `prepare` script

### ✅ Dependency Uyumluluk Onayı (2025-10-29)
- ✅ **Tüm Expo paketler SDK 54 uyumlu** (~54.0.0 versiyonlar)
- ✅ **Sıfır custom native kod** (Camera, Bluetooth, Background tasks YOK)
- ✅ **Third-party paketler pure JS** (zustand, date-fns)
- ✅ **Tamagui build-time only** (devDependencies - native kod gerektirmez)
- ✅ **%100 Expo Go Ready**

---

## 🛠️ ADIM ADIM MİGRASYON PLANI

### **ADIM 0: Ön Kontrol ve Hazırlık (TAMAMLANDI ✅)**

#### 0.1 Proje Durumu Kontrolü
- ✅ `pnpm install` çalışıyor (warnings tolere edilebilir)
- ✅ TypeScript hataları YOK (0 errors)
- ✅ Mobile app başlatılabiliyor

#### 0.2 Native Klasör Kontrolü
- ✅ `apps/mobile/ios/` klasörü YOK
- ✅ `apps/mobile/android/` klasörü YOK
- ✅ Zaten managed workflow

#### 0.3 Dependency Uyumluluk
- ✅ Tüm paketler Expo Go uyumlu
- ✅ Custom native kod YOK
- ✅ Expo SDK 54 version match

#### 0.4 Git Backup
- ⏳ Kullanıcı tarafından yapılacak
- ⏳ Pre-migration commit önerilir

**Sonuç:** Migration için hazır ✅

---

### **ADIM 1: Script'leri Düzelt (5 dakika)**

#### 1.1 Mobile Package.json Scripts

**Dosya:** `apps/mobile/package.json`

**Değişiklik:**
```json
{
  "scripts": {
    "start": "npx expo start",
    // ❌ KALDIR: "android": "npx expo run:android",
    // ❌ KALDIR: "ios": "npx expo run:ios",
    "web": "npx expo start --web",
    "build:preview:android": "eas build --profile preview --platform android",
    "build:preview:ios": "eas build --profile preview --platform ios",
    "build:production:android": "eas build --profile production --platform android",
    "build:production:ios": "eas build --profile production --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios",
    "update": "eas update",
    "lint": "eslint . --ext .ts,.tsx --config ../../eslint.config.js",
    "type-check": "tsc --noEmit"
  }
}
```

**Açıklama:**
- ❌ `expo run:android` ve `expo run:ios` → Native build gerektirir (managed workflow'ta KULLANILMAZ)
- ✅ `expo start` → Expo Go QR code gösterir
- ℹ️ Platform-specific start script'leri gerekmiyor (QR code ile her platform erişebilir)

#### 1.2 Root Package.json Scripts

**Dosya:** `package.json` (root)

**Değişiklik:**
```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "prebuild": "pnpm --filter '@ybis/ui' --filter '@ybis/core' run build",
    "mobile": "cd apps/mobile && pnpm start",
    "mobile:android": "cd apps/mobile && pnpm start -- --android",
    "mobile:ios": "cd apps/mobile && pnpm start -- --ios",
    "mobile:web": "cd apps/mobile && pnpm start -- --web",
    "web": "cd apps/web && pnpm run dev",
    "backend": "cd apps/backend && pnpm run dev",
    // ❌ KALDIR: "prepare": "husky install"  (deprecated in husky v9+)
    // ... diğer script'ler
  }
}
```

**Açıklama:**
- ✅ `pnpm start -- --android` → Expo Go başlatır + Android önerir
- ✅ `pnpm start -- --ios` → Expo Go başlatır + iOS önerir
- ❌ `prepare: "husky install"` → Husky v9+ otomatik install kullanır (deprecated)

---

### **ADIM 2: EAS Config Düzelt (3 dakika)**

#### 2.1 Development Profile - Expo Go için

**Dosya:** `apps/mobile/eas.json`

**Değişiklik: Expo Go kullan (Phase 0 - Closed Beta)**
```json
{
  "build": {
    "development": {
      // ❌ KALDIR: "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

**Açıklama:**
- ❌ `developmentClient: true` → Dev Client gerektirir (custom native modül için)
- ✅ Kaldırınca → Expo Go kullanılır (managed workflow)

**Neden Expo Go?**
- ✅ Setup yok, Expo Go app indir + QR code tara
- ✅ Instant reload, fast development
- ✅ Tüm Expo SDK 54 modülleri built-in
- ❌ Custom native modül eklenemez (Camera, Bluetooth vb.)

**İleride Dev Client gerekir mi?**
- Şu anda: ❌ HAYIR (dependency analizi: %100 Expo Go uyumlu)
- Gelecekte: Sadece custom native modül eklenirse (örn: react-native-vision-camera)

---

### **ADIM 3: Config Dosyalarını Birleştir (10 dakika)**

#### 3.1 app.json'u app.config.ts'e Birleştir

**Dosya:** `apps/mobile/app.config.ts`

**Eksik config'leri ekle:**
```typescript
import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'YBIS',
  slug: 'ybis',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'ybis',
  userInterfaceStyle: 'automatic',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0a7ea4',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ybis.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'YBIS needs camera access for document scanning (future feature)',
      NSPhotoLibraryUsageDescription: 'YBIS needs photo library access for attachments',
    },
  },
  android: {
   iotics: 'com.ybis.app',
    versionCode: 1,
    permissions: ['RECEIVE_BOOT_COMPLETED', 'VIBRATE'],
    // ✅ EKLENMELİ (app.json'dan):
    softInputMode: 'adjustResize',
    navigationBar: {
      backgroundColor: '#000000',
    },
  },
  web: {
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-font', 'expo-secure-store', 'expo-notifications'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'a839b8e5-7de2-439c-9f6e-169bf138fd22',
    },
    supabaseUrl: process.env['SUPABASE_URL'],
    supabaseAnonKey: process.env['SUPABASE_PUBLISHABLE_KEY'],
  },
});
```

#### 3.2 app.json'u Kaldır veya Backup Al

**Seçenek A: Sil (Önerilen)**
```bash
cd apps/mobile
rm app.json  # veya git rm app.json
```

**Seçenek B: Backup olarak tut**
```bash
cd apps/mobile
mv app.json app.json.backup
```

**Seçenek C: .gitignore'a ekle (referans için)**
```bash
# .gitignore
apps/mobile/app.json
```

**Öneri:** **Seçenek A** - app.config.ts yeterli, app.json gereksiz.

---

### **ADIM 4: Native Klasörleri Kontrol Et (2 dakika)**

#### 4.1 Native Klasör Kontrolü

**Kontrol:**
```bash
cd apps/mobile
ls ios/ android/ 2>/dev/null || echo "Native klasörler yok ✅"
```

**Eğer varsa:**
```bash
cd apps/mobile
rm -rf ios android
git rm -r ios android  # Git'ten de sil
```

**⚠️ UYARI:** Native klasörler varsa managed workflow'tan çıkılmış demektir. Silmeden önce backup al!

---

### **ADIM 5: .gitignore Kontrolü (1 dakika)**

**Dosya:** `.gitignore` (root)

**Eklenmeli (yoksa):**
```
# Expo managed workflow - native klasörler yok
apps/mobile/ios/
apps/mobile/android/

# Expo build artifacts
apps/mobile/.expo/
apps/mobile/dist/
```

---

### **ADIM 6: Dokümantasyon Güncelle (5 dakika)**

#### 6.1 QUICKSTART.md Güncelle

**Eklenecek:**
```markdown
## Development (Managed Workflow)

### Expo Go ile Başlatma
```bash
pnpm mobile              # Expo Go başlatır
# veya
cd apps/mobile && pnpm start
```

### EAS Build ile Build
```bash
# Preview build
pnpm mobile:build:preview:android
pnpm mobile:build:preview:ios

# Production build
pnpm mobile:build:production:android
pnpm mobile:build:production:ios
```
```

#### 6.2 README.md Güncelle

Managed workflow bilgisi eklenecek.

---

## ✅ TEST PLANI

### Test 1: Expo Go Development
```bash
cd apps/mobile
pnpm start
# ✅ QR kod görünmeli
# ✅ "Expo Go app" önerilmeli (dev-client değil)
# ✅ App Expo Go'da açılmalı
```

### Test 2: EAS Build Preview
```bash
cd apps/mobile
eas build --profile preview --platform android
# ✅ Build başlamalı
# ✅ "Managed workflow" görünmeli
```

### Test 3: Managed Workflow Kontrolü
```bash
# Test: Native klasör YOK
cd apps/mobile
ls ios android 2>$null
# ✅ Hata vermeli (klasörler yok)

# Test: expo-doctor
npx expo-doctor
# ✅ 0 errors, minimal warnings beklenir
# ℹ️ "Managed workflow" kelimesi göstermez, sadece hata/uyarı verir
```

### Test 4: Script'ler
```bash
# Root'tan
pnpm mobile              # ✅ Expo Go QR code gösterir
pnpm mobile:android      # ✅ QR code + "Open on Android" gösterir
pnpm mobile:ios          # ✅ QR code + "Open on iOS" gösterir

# Mobile'den
cd apps/mobile
pnpm start               # ✅ Expo Go QR code gösterir
pnpm web                 # ✅ Web browser'da açar

# Kontrol: Dev Client mesajı OLMAMALI
# ❌ "dev-client required" → HATA (developmentClient: true kalmış demektir)
# ✅ "Expo Go app" önerilmeli
```

---

## 🎯 BAŞARI KRİTERLERİ

- ✅ `pnpm mobile` → Expo Go başlatır
- ✅ QR kod Expo Go'da taranabilir
- ✅ "dev-client required" hatası YOK
- ✅ Native klasörler YOK (`ios/`, `android/` yok)
- ✅ `expo-doctor` based workflow gösterir
- ✅ EAS Build managed workflow ile çalışır
- ✅ Script'ler managed workflow için doğru

---

## ⏱️ TAHMINI SÜRE

| Adım | Süre |
|------|------|
| 0. Ön Kontrol (✅ TAMAMLANDI) | 0 dk |
| 1. Script'leri Düzelt | 3 dk |
| 2. EAS Config Düzelt | 2 dk |
| 3. Config Birleştir | 10 dk |
| 4. Native Klasör Kontrol (✅ YOK) | 0 dk |
| 5. .gitignore Kontrol | 1 dk |
| 6. Test ve Doğrulama | 5 dk |
| 7. Dokümantasyon | 3 dk |
| **TOPLAM** | **~24 dakika** |

---

## 🚨 RİSK ANALİZİ

### Düşük Risk
- ✅ Script değişiklikleri (geri dönüşüm kolay - Git revert)
- ✅ Config birleştirme (app.json backup alınabilir)
- ✅ Native klasör YOK (risk yok)

### Orta Risk
- ⚠️ EAS config değişikliği (build sürecini etkileyebilir - test gerekli)

### Yüksek Risk
- ❌ Yok (tüm değişiklikler geri alınabilir)

### Rollback Senaryoları

**Senaryo 1: "pnpm mobile" çalışmıyor**
```bash
# Çözüm: Git revert
git revert HEAD
```

**Senaryo 2: Expo Go QR code göstermiyor**
```bash
# Çözüm: eas.json'a developmentClient geri ekle
# "development": { "developmentClient": true, ... }
```

**Senaryo 3: EAS Build başarısız**
```bash
# Çözüm: app.config.ts'de native config eksik mi kontrol et
# Örn: android.softInputMode, ios.bundleIdentifier
```

**Senaryo 4: App Expo Go'da çökuyor**
```bash
# Çözüm: Expo Go uyumsuz paket var mı?
npx expo-doctor
# Custom native modül tespit edilirse → Dev Client'a geçilmeli
```

---

## 📝 CHECKLIST

### Hazırlık
- [ ] Git durumu kontrol et: `git status`
- [ ] Uncommitted changes varsa commit yap
- [ ] Pre-migration snapshot: `git commit -m "Pre-migration snapshot - before Expo managed workflow"`
- [ ] app.json'u backup al: `cp apps/mobile/app.json apps/mobile/app.json.backup`

### Uygulama
- [ ] `apps/mobile/package.json`: `android` ve `ios` script'lerini kaldır
- [ ] Root `package.json`: `mobile:*` script'lerini düzelt + `prepare` kaldır
- [ ] `apps/mobile/eas.json`: `developmentClient: true` kaldır
- [ ] `apps/mobile/app.config.ts`: Android config ekle (`softInputMode`, `navigationBar`)
- [ ] `apps/mobile/app.json`: Sil veya `.gitignore`'a ekle
- [ ] `.gitignore`: Native klasörler için entry kontrol et

### Test
- [ ] `pnpm mobile` → QR code gösterir
- [ ] QR code Expo Go app'te taranabilir
- [ ] App Expo Go'da açılır ve çalışır
- [ ] `npx expo-doctor` → 0 errors
- [ ] Native klasörler YOK: `ls apps/mobile/ios 2>$null` (hata vermeli)

### Dokümantasyon
- [ ] DEVELOPMENT_LOG.md: AD-040 oluştur ("Expo Managed Workflow Migration")
- [ ] session-context.md: Migration completed notu ekle
- [ ] QUICKSTART.md: Managed workflow bilgisi güncelle
- [ ] Git commit: `git commit -m "feat: Migrate to Expo managed workflow (AD-040)"`

---

## 🔄 GERİ DÖNÜŞ PLANI

Eğer bir sorun çıkarsa:

1. **Git revert:**
   ```bash
   git revert HEAD
   ```

2. **app.json restore:**
   ```bash
   cd apps/mobile
   mv app.json.backup app.json
   ```

3. **Native klasör restore:**
   ```bash
   # Backup'tan geri yükle
   ```

---

## 📚 REFERANSLAR

- [Expo Managed Workflow Docs](https://docs.expo.dev/introduction/managed-vs-bare/)
- [EAS Build Managed Workflow](https://docs.expo.dev/build/introduction/)
- [EXPO_GO_MIGRATION_FINAL.md](./EXPO_GO_MIGRATION_FINAL.md)
- [expo-managed-workflow-blockers-2025-10-27.md](../reports/expo-managed-workflow-blockers-2025-10-27.md)

---

**Plan Created:** 2025-10-27  
**Last Updated:** 2025-10-29  
**Status:** ✅ Ready to Execute - Dependency analysis completed  
**Estimated Time:** ~24 minutes  

---

## 📊 DEPENDENCY ANALYSIS SUMMARY (2025-10-29)

### ✅ Expo Go Compatibility: %100
- **Expo Modules:** 14 packages (auth, font, image, notifications, etc.) - All SDK 54
- **React Native:** 0.81.4 (Expo SDK 54 compatible)
- **Third-Party:** Pure JS only (zustand, date-fns)
- **Tamagui:** Build-time devDependency (no native code)
- **Custom Native:** ZERO (no camera, bluetooth, background tasks)

### 🎯 Migration Confidence: HIGH
- Native folders already removed ✅
- All dependencies Expo Go compatible ✅
- No breaking changes expected ✅
- Rollback plan available ✅

