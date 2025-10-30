# 🧹 Temiz Kurulum ve Test Komutları

**Tarih:** 2025-10-29  
**Amaç:** Expo Managed Workflow migration sonrası temiz kurulum ve test

---

## 📋 ADIM ADIM KOMUTLAR

### ADIM 1: Mevcut Durumu Kaydet (Backup)
```powershell
# Git durumu kontrol et
git status

# Uncommitted changes varsa commit yap
git add .
git commit -m "Pre-cleanup snapshot - before clean install"
```

---

### ADIM 2: Temizlik (Clean)
```powershell
# Node modules sil (tüm workspace'ler)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\mobile\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\backend\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\web\node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force packages\*\node_modules -ErrorAction SilentlyContinue

# pnpm lock dosyası sil (OPSIYONEL - sadece ciddi sorun varsa)
# Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue

# pnpm cache temizle
pnpm store prune

# Expo cache temizle
cd apps\mobile
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
cd ..\..

Write-Host "✅ Temizlik tamamlandı" -ForegroundColor Green
```

---

### ADIM 3: Yeniden Kurulum (Reinstall)
```powershell
# Root'tan install (tüm workspace'ler)
pnpm install

# Beklenen: Warnings (glob, inflight, rimraf) - Normal!
# Hata alırsan: Tamagui temp error tekrar ederse tekrar çalıştır
```

**Beklenen Output:**
```
Scope: all 15 workspace projects
 WARN  3 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6, rimraf@3.0.2
Packages: +199
Progress: resolved 1365, reused XXX, downloaded X, added 199
Done in 30-60s
```

**Eğer Tamagui Hatası Alırsan:**
```powershell
# Tekrar dene
pnpm install

# Hala hata alırsan: Cache temizle + tekrar
pnpm store prune
pnpm install
```

---

### ADIM 4: Build Packages (Önce paketler)
```powershell
# UI ve Core paketlerini build et
pnpm prebuild

# Alternatif: Manuel build
# pnpm --filter '@ybis/ui' run build
# pnpm --filter '@ybis/core' run build
```

**Beklenen Output:**
```
> @ybis/ui@0.1.0 build
> tsc --build
✅ Build completed

> @ybis/core@0.1.0 build
> tsc --build
✅ Build completed
```

---

### ADIM 5: Type Check (Hata kontrolü)
```powershell
# Tüm workspace'lerde type check
pnpm type-check

# Sadece mobile için
cd apps\mobile
pnpm type-check
cd ..\..
```

**Beklenen Output:**
```
> @ybis/mobile@0.1.0 type-check
> tsc --noEmit
✅ No errors
```

---

### ADIM 6: Expo Doctor (Sağlık kontrolü)
```powershell
cd apps\mobile
npx expo-doctor
```

**Beklenen Output:**
```
✔ Checking project
✔ Checking package.json
✔ Checking dependencies
✔ Checking Expo config

No issues found! ✅
```

**Uyarılar (Normal):**
- Peer dependency warnings → Tolere edilebilir
- Deprecated packages → Expo SDK'nın kendi sorunları

---

### ADIM 7: Native Klasör Kontrolü
```powershell
# ios klasörü kontrolü
if (Test-Path "apps\mobile\ios") {
    Write-Host "❌ HATA: ios klasörü VAR (managed workflow'a aykırı)" -ForegroundColor Red
} else {
    Write-Host "✅ ios klasörü YOK (doğru)" -ForegroundColor Green
}

# android klasörü kontrolü
if (Test-Path "apps\mobile\android") {
    Write-Host "❌ HATA: android klasörü VAR (managed workflow'a aykırı)" -ForegroundColor Red
} else {
    Write-Host "✅ android klasörü YOK (doğru)" -ForegroundColor Green
}
```

**Beklenen Output:**
```
✅ ios klasörü YOK (doğru)
✅ android klasörü YOK (doğru)
```

---

### ADIM 8: Mobile App Başlat (Expo Go)
```powershell
# Root'tan başlat
pnpm mobile

# VEYA mobile klasöründen
cd apps\mobile
pnpm start
```

**Beklenen Output:**
```
› Metro waiting on exp://192.168.X.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

**Kontrol Noktaları:**
- ✅ QR code görünüyor mu?
- ✅ "Expo Go app" önerisi var mı?
- ❌ "dev-client required" mesajı VAR MI? (Olmamalı!)

---

### ADIM 9: Platform-Specific Test
```powershell
# Android için (Expo Go açar)
pnpm mobile:android

# iOS için (Expo Go açar)
pnpm mobile:ios

# Web için (Browser açar)
pnpm mobile:web
```

---

### ADIM 10: Expo Go ile Test
```
1. Expo Go app indir:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. QR code'u tara

3. App açılmalı ✅

4. Ana ekranları test et:
   - Dashboard (Home)
   - Tasks
   - Notes
   - Plan
   - Chat
   - Settings
```

---

## 🐛 SORUN GİDERME

### Sorun 1: "dev-client required" Hatası
```powershell
# Çözüm: eas.json kontrol et
cd apps\mobile
Get-Content eas.json | Select-String "developmentClient"

# Eğer "developmentClient: true" görünüyorsa:
# eas.json'ı düzenle ve kaldır
```

### Sorun 2: pnpm Install Hatası (Tamagui)
```powershell
# Çözüm 1: Tekrar dene
pnpm install

# Çözüm 2: Cache temizle
pnpm store prune
Remove-Item -Recurse -Force node_modules
pnpm install

# Çözüm 3: Lock file sil (son çare)
Remove-Item pnpm-lock.yaml
pnpm install
```

### Sorun 3: Type Check Hataları
```powershell
# Paketler build edilmemiş olabilir
pnpm prebuild

# Tekrar type check
pnpm type-check
```

### Sorun 4: Metro Bundler Hatası
```powershell
# Cache temizle
cd apps\mobile
npx expo start --clear

# Alternatif: Expo cache sil
Remove-Item -Recurse -Force .expo
npx expo start
```

### Sorun 5: QR Code Görünmüyor
```powershell
# Network ayarları kontrol et
ipconfig

# Tunnel mode dene
npx expo start --tunnel

# Localhost dene
npx expo start --localhost
```

---

## ✅ BAŞARI KRİTERLERİ

Tüm bunlar EVET ise başarılı:

- [ ] `pnpm install` → Hatasız tamamlandı
- [ ] `pnpm type-check` → 0 errors
- [ ] `npx expo-doctor` → No issues found
- [ ] Native klasörler YOK (ios/, android/)
- [ ] `pnpm mobile` → QR code gösteriyor
- [ ] "dev-client required" mesajı YOK
- [ ] Expo Go app'te QR code taranabiliyor
- [ ] App Expo Go'da açılıyor ve çalışıyor

---

## 📊 PERFORMANS BEKLENTİLERİ

| İşlem | Süre (İlk Kez) | Süre (Cache'li) |
|-------|----------------|-----------------|
| pnpm install | 30-60s | 10-20s |
| pnpm prebuild | 5-10s | 2-5s |
| pnpm type-check | 10-15s | 5-10s |
| expo start | 15-30s | 10-15s |
| **TOPLAM** | **60-115s** | **27-50s** |

---

## 🎯 SONRAKİ ADIMLAR

Migration başarılı olduktan sonra:

```powershell
# Git commit
git add .
git commit -m "feat: Migrate to Expo managed workflow (Expo Go)

- Removed native build scripts
- Removed developmentClient from eas.json
- Updated root scripts for managed workflow
- Added Android config to app.config.ts
- Clean install and test completed successfully

Tested:
✅ pnpm install - No errors
✅ Type check - 0 errors
✅ Expo doctor - No issues
✅ App runs in Expo Go
"

# Optional: app.json sil
Remove-Item apps\mobile\app.json

# Push (eğer remote'a göndermek istiyorsan)
git push
```

---

**Hazır! Komutları sırayla çalıştır ve sonuçları paylaş! 🚀**
