# 🚀 Final Setup Guide - Expo Managed Workflow

**Date:** 2025-10-29  
**Status:** Ready to execute  
**Time Required:** ~5 minutes

---

## ✅ YAPILAN DEĞİŞİKLİKLER ÖZET

### 1. Expo Managed Workflow Migration
- ❌ Removed native build scripts (`android`, `ios`)
- ❌ Removed `developmentClient: true` from eas.json
- ✅ Updated root scripts for Expo Go
- ✅ Added Android config to app.config.ts
- ✅ Backed up app.json, added to .gitignore

### 2. TypeScript Configuration Fix
- ❌ Removed `@types/react-native` (Expo provides types)
- ✅ Fixed paths: `dist/` → `src/` (development mode)
- ✅ Added `skipLibCheck: true` to all packages
- ✅ Standardized package tsconfig.json files

### 3. Constitution Update
- ✅ Updated `skipLibCheck` rule (Expo exception added)
- ✅ Documented TypeScript best practices

---

## 🎯 ŞİMDİ NE YAPACAKSIN? (ADIM ADIM)

### **ADIM 1: Git Commit (Değişiklikleri Kaydet)**
```powershell
# Working directory'deysen
cd C:\Projeler\YBIS

# Değişiklikleri gör
git status

# Tüm değişiklikleri ekle
git add .

# Commit yap
git commit -m "feat: Migrate to Expo managed workflow + Fix TypeScript config

Changes:
- Migrate to Expo Go (remove native build scripts)
- Remove developmentClient from eas.json
- Fix TypeScript paths (dist → src for development)
- Remove unnecessary @types/react-native
- Update constitution (skipLibCheck exception)
- Standardize package tsconfig files

Migration ready for clean install and testing.
"
```

**Beklenen Output:**
```
[your-branch] xxxxx feat: Migrate to Expo managed workflow + Fix TypeScript config
 X files changed, Y insertions(+), Z deletions(-)
```

---

### **ADIM 2: Temiz Kurulum (Clean Install)**
```powershell
# Node modules'leri sil
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\mobile\node_modules -ErrorAction SilentlyContinue

# Cache temizle (opsiyonel ama önerilen)
pnpm store prune

# Yeniden kur
pnpm install
```

**Beklenen Output:**
```
Scope: all 15 workspace projects
 WARN  3 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +199
Progress: resolved 1365, reused XXX, downloaded X, added 199
Done in 30-60s
```

**Warnings normal!** (glob, inflight, rimraf → Expo SDK'nın kendi subdependency'leri)

---

### **ADIM 3: Type Check (Hataları Kontrol Et)**
```powershell
# Tüm workspace'leri kontrol et
pnpm type-check
```

**Beklenen Output:**
```
> @ybis/mobile@0.1.0 type-check
> tsc --noEmit
✅ No errors

> @ybis/ui@0.1.0 type-check
> tsc --noEmit
✅ No errors

... (diğer paketler)
```

**Eğer hata varsa:** Hatayı buraya yapıştır, bakalım.

---

### **ADIM 4: Mobile App Başlat (Expo Go)**
```powershell
# Root'tan başlat
pnpm mobile
```

**Beklenen Output:**
```
› Metro waiting on exp://192.168.X.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
```

**Kontrol Noktaları:**
- ✅ QR code görünüyor mu?
- ✅ "Expo Go app" önerisi var mı?
- ❌ "dev-client required" mesajı VAR MI? (OLMAMALI!)

---

### **ADIM 5: Expo Go ile Test (Telefonda)**
```
1. Expo Go app'i indir:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. QR code'u tara

3. App açılmalı ✅

4. Ekranları test et:
   - Dashboard (Home) → Chat widget çalışıyor mu?
   - Tasks → Liste görünüyor mu?
   - Notes → Not eklenebiliyor mu?
   - Settings → Dil değiştirme çalışıyor mu?
```

---

## 🐛 OLASI SORUNLAR VE ÇÖZÜMLER

### Sorun 1: pnpm install Hatası (Tamagui temp error)
```
ERR_PNPM_ENOENT: Cannot find 'node_modules/@tamagui/tabs_tmp_...'
```

**Çözüm:**
```powershell
# Tekrar dene (genelde 2. seferde çözülür)
pnpm install

# Hala hata alırsan: Cache temizle
pnpm store prune
Remove-Item -Recurse -Force node_modules
pnpm install
```

---

### Sorun 2: TypeScript Hatası (IDE'de kırmızı çizgiler)
```
Cannot find module '@ybis/ui' or its corresponding type declarations
```

**Çözüm:**
```powershell
# VS Code'da:
# 1. Cmd+Shift+P → "TypeScript: Restart TS Server"
# 2. Cmd+Shift+P → "Reload Window"

# Hala çözülmezse:
# Paketleri build et (dist/ klasörleri oluştur)
pnpm --filter '@ybis/ui' run build
pnpm --filter '@ybis/core' run build
```

---

### Sorun 3: "dev-client required" Hatası
```
ERROR: This app requires a development client
```

**Çözüm:**
```powershell
# eas.json kontrol et
Get-Content apps\mobile\eas.json | Select-String "developmentClient"

# Eğer "developmentClient: true" görünüyorsa:
# apps/mobile/eas.json dosyasını düzenle
# "developmentClient: true" satırını kaldır
```

---

### Sorun 4: Metro Bundler Hatası
```
Error: Unable to resolve module ...
```

**Çözüm:**
```powershell
# Cache temizle
cd apps\mobile
Remove-Item -Recurse -Force .expo
npx expo start --clear

# Hala çözülmezse:
cd ..\..
Remove-Item -Recurse -Force node_modules
pnpm install
pnpm mobile
```

---

### Sorun 5: App Expo Go'da Çöküyor
```
App açılıyor ama hemen kapanıyor
```

**Çözüm:**
```powershell
# 1. Expo Go versiyonu güncel mi? (App Store/Play Store'da güncelle)

# 2. Metro bundler'da hata var mı? (Terminal'e bak)

# 3. expo-doctor çalıştır
cd apps\mobile
npx expo-doctor

# 4. Eğer "unsupported SDK version" uyarısı:
# Expo Go app'i 2-3 gün bekleyip tekrar dene (SDK 54 henüz yeni)
```

---

## ✅ BAŞARI KRİTERLERİ

Tüm bunlar EVET ise başarılı:

- [ ] `git commit` başarılı
- [ ] `pnpm install` hatasız tamamlandı
- [ ] `pnpm type-check` → 0 errors
- [ ] `pnpm mobile` → QR code gösteriyor
- [ ] "dev-client required" mesajı YOK
- [ ] Expo Go'da QR code tarandı
- [ ] App açıldı ve çalışıyor
- [ ] Tab navigation erişilebilir
- [ ] Chat input görünür

---

## 📋 İSTEĞE BAĞLI ADIMLAR

### app.json Sil (Artık Gereksiz)
```powershell
# app.json zaten .gitignore'da
# Silmek istersen:
Remove-Item apps\mobile\app.json
```

### Git Push (Remote'a Gönder)
```powershell
# Eğer remote repository varsa:
git push
```

### Dokümantasyon Güncelle
```powershell
# İleride yapılacak:
# - DEVELOPMENT_LOG.md → AD-040 ekle
# - session-context.md → Migration completed
# - QUICKSTART.md → Managed workflow info
```

---

## 🎯 SONRAKİ ADIMLAR (Migration Sonrası)

### 1. Development Workflow
```powershell
# Günlük geliştirme:
pnpm mobile  # Metro bundler başlat
# Telefonda Expo Go ile test et

# UI paketi değiştirdiysen:
pnpm --filter '@ybis/ui' run build
# Metro otomatik reload yapar

# Type check (geliştirme sırasında):
pnpm type-check
```

### 2. Production Build (İleride)
```powershell
# Android APK (internal testing)
cd apps\mobile
eas build --profile preview --platform android

# iOS build (Apple Developer hesabı gerekli)
eas build --profile preview --platform ios
```

### 3. OTA Update (Code push)
```powershell
# JS değişikliklerini anında gönder
eas update --branch production --message "Fix chat input bug"
```

---

## 📚 REFERANS DOSYALAR

- `TYPESCRIPT_FIX_SUMMARY.md` → TypeScript config detayları
- `CLEAN_INSTALL_TEST.md` → Troubleshooting guide
- `docs/plans/expo-managed-workflow-migration-plan.md` → Migration plan
- `docs/YBIS_PROJE_ANAYASASI.md` → Updated constitution

---

## 🚀 ÖZET: 3 KOMUT İLE BAŞLA

```powershell
# 1. Commit
git add . && git commit -m "feat: Migrate to Expo managed workflow"

# 2. Install
Remove-Item -Recurse -Force node_modules; pnpm install

# 3. Start
pnpm mobile
```

**Hazırsın! Komutları çalıştır ve sonuçları paylaş! 🎯**
