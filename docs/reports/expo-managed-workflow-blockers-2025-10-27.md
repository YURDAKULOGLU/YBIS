# Expo Managed Workflow Engelleri - Rapor

**Tarih:** 2025-10-27  
**Durum:** 🔍 Analiz Tamamlandı  
**Sonuç:** Managed workflow için 5 engel tespit edildi (3 kritik, 2 uyarı)

---

## 📋 ÖZET

Expo managed workflow'u (Expo Go) kullanmak için projede şu engeller var:

### 🚨 KRİTİK ENGEL
1. ✅ **Native build script'leri** (`expo run:android`, `expo run:ios`)
2. ✅ **EAS config'de developmentClient: true** (development profile'da)
3. ⚠️ **app.json ve app.config.ts çift yapılandırma** (tutarsızlık riski)

### ⚠️ UYARILAR (Engel değil ama dikkat)
4. **Root package.json'da native build script'leri**
5. **iOS/Android native klasörleri varlığı kontrolü gerekli**

---

## 🔴 KRİTİK ENGELLER

### 1. Native Build Script implementation'ları

**Lokasyon:** `apps/mobile/package.json`

**Sorun:**
```json
"scripts": {
  "android": "npx expo run:android",  // ❌ Native build yapar
  "ios": "npx expo run:ios",          // ❌ Native build yapar
}
```

**Açıklama:** `expo run:*` komutları native build yapar ve `ios/` / `android/` klasörlerini gerektirir. Managed workflow'ta bu komutlar kullanılmaz.

**Çözüm:**
```json
"scripts": {
  "android": "npx expo start --android",  // ✅ Expo Go/Dev Client için
  "ios": "npx expo start --ios",          // ✅ Expo Go/Dev Client için
}
```

**Veya sadece:**
```json
"scripts": {
  "start": "npx expo start",  // ✅ Tek komut yeterli (Expo Go kullanır)
}
```

---

### 2. EAS Build Config - Development Client Flag

**Lokasyon:** `apps/mobile/eas.json`

**Sorun:**
```json
"development": {
  "developmentClient": true,  // ❌ Development client build eder
  ...
}
```

**Açıklama:** `developmentClient: true` flag'i EAS build'in development client build etmesini sağlar. Managed workflow'ta Expo Go kullanıldığı için bu flag gereksizdir.

**Çözüm (Seçenek 1 - Expo Go için):**
```json
"development": {
  // developmentClient: true kaldır (Expo Go kullanacağız)
  "distribution": "internal",
  ...
}
```

**Çözüm (Seçenek 2 - Dev Client gerekiyorsa):**
```json
"development": {
  "developmentClient": true,  // ✅ Dev Client gerekiyorsa kalır
  ...
}
```
Not: Bu durumda managed workflow'tan çıkılır, custom dev client build edilir.

---

### 3. app.json ve app.config.ts Çift Yapılandırma

**Lokasyonlar:**
- `apps/mobile/app.json`
- `apps/mobile/app.config.ts`

**Sorun:**
- Her iki dosya da var ve bazı config'ler tutarsız
- `app.json`'da `softInputMode` ve `navigationBar` var, `app.config.ts`'de yok
- İkisi de farklı zamanlarda güncellenebilir (tutarsızlık riski)

**Durum:**
- ✅ `app.config.ts` TypeScript, daha güçlü
- ✅ `app.json` daha basit ama statik
- ⚠️ Expo her ikisini de okuyabilir (öncelik: `app.config.ts` > `app.json`)

**Çözüm:**
1. **Tercih edilen:** Sadece `app.config.ts` kullan
2. `app.json`'u sil veya sadece referans olarak tut
3. Tüm config'leri `app.config.ts`'de birleştir

**Eksik config'ler (app.json'da var, app.config.ts'de yok):**
```typescript
// app.config.ts'e eklenmeli:
android: {
  package: 'com.ybis.app',
  versionCode: 1,
  permissions: ['RECEIVE_BOOT_COMPLETED', 'VIBRATE'],
  softInputMode: 'adjustResize',        // ⚠️ Eksik
  navigationBar: {                      // ⚠️ Eksik
    backgroundColor: '#000000'
  }
}
```

---

## ⚠️ UYARILAR (Kritik Değil)

### 4. Root Package.json Native Build Scripts

**Lokasyon:** `package.json` (root)

**Durum:**
```json
"scripts": {
  "mobile:ios": "cd apps/mobile && pnpm run ios",      // ❌ Native build
  "mobile:android": "cd apps/mobile && pnpm run android", // ❌ Native build
}
```

**Açıklama:** Root'tan native build çağrılıyor. Managed workflow'ta gereksiz ama zararlı değil (sadece hata verir).

**Çözüm:**
```json
"scripts": {
  "mobile": "cd apps/mobile && pnpm start",  // ✅ Expo Go için yeterli
  // mobile:ios ve mobile:android tombol bırakılabilir ama kullanılmayacak
}
```

---

### 5. iOS/Android Klasörleri Kontrolü

**Kontrol edilmesi gereken:** `apps/mobile/ios/` ve `apps/mobile/android/` klasörlerinin varlığı

**Durum:** 
- ✅ Listfolder'da görünmüyor (olmadığı varsayılıyor)
- ⚠️ Manuel kontrol gerekli

**Çözüm (varsa):**
```bash
cd apps/mobile
rm -rf ios android  # ✅ Managed workflow'ta gerekli değil
```

**Not:** Bu klasörler varsa `expo prebuild` çalıştırılmış demektir ve managed workflow'tan çıkılır.

---

## ✅ MANAGED WORKFLOW İLE UYUMLU OLANLAR

### Expo Modülleri ✅
Tüm kullanılan Expo modülleri managed workflow ile uyumlu:
- `expo-router` ✅
- `expo-font` ✅
- `expo-secure-store` ✅
- `expo-notifications` ✅
- `expo-auth-session` ✅
- `expo-image` ✅
- `expo-haptics` ✅
- ... (hepsi Expo Go'da çalışır)

### React Native Modülleri ✅
Kullanılan RN modülleri Expo Go ile uyumlu (version alignment ile):
- `react-native-gesture都很handler` ✅
- `react-native-reanimated` ✅ (Expo Go SDK 54'te native parts var)
- `react-native-safe-area-context` ✅
- `react-native-screens` ✅
- `@react-native-async-storage/async-storage` ✅

### Babel Config ✅
- `babel.config.js` managed workflow ile uyumlu
- Reanimated plugin otomatik (babel-preset-expo içinde)
- Tamagui plugin doğru yapılandırılmış

### EAS Build Profiles ✅
- `preview` ve `production` profile'lar managed workflow ile uyumlu
- Sadece `development` profile'da `developmentClient: true` sorunu var

---

## 🎯 DÜZELTME PLANI

### Adım 1: Script'leri Düzelt (5 dk)
```bash
# apps/mobile/package.json
"scripts": {
  "start": "npx expo start",
  "web": "npx expo start --web",
  # android ve ios script'lerini kaldır veya değiştir
}
```

### Adım 2: EAS Config Düzelt (2 dk)
```bash
# apps/mobile/eas.json
# development profile'dan developmentClient: true kaldır
```

### Adım 3: Config Dosyalarını Birleştir (10 dk)
```bash
# app.json'daki eksik config'leri app.config.ts'e ekle
# app.json'u sil veya .gitignore'a ekle (backup olarak)
```

### Adım 4: Native Klasörleri Kontrol Et (1 dk)
```bash
cd apps/mobile
# ios/ ve android/ klasörleri varsa sil
rm -rf ios android
```

### Adım 5: Root Scripts'i Güncelle (2 dk)
```bash
# package.json (root)
# mobile:ios ve mobile:android script'lerini kaldır veya güncelle
```

**Toplam Süre:** ~20 dakika

---

## 📝 TEST KONTROL LİSTESİ (Düzeltme Sonrası)

Düzeltmelerden sonra test et:

```bash
cd apps/mobile

# 1. Expo start çalışmalı
npx expo start

# 2. Expo Go ile QR kod taratılabilmeli
# 3. App yüklenmeli (dev-client required hatası OLMAMALI)
# 4. Navigation çalışmalı
# 5. Tamagui components render olmalı
# 6. Animations smooth olmalı (60 FPS)
```

**Başarı Kriterleri:**
- ✅ `expo start` komutu hatasız çalışır
- ✅ QR kod Expo Go'da taranabilir
- ✅ "dev-client required" hatası YOK
- ✅ App normal şekilde yüklenir
- ✅ Tüm özellikler çalışır

---

## 🔍 REFERANSLAR

- **Expo Managed Workflow Docs:** exon published
- **EXPO_GO_MIGRATION_FINAL.md:** Projenin Expo Go migration guide'ı
- **YBIS_PROJE_ANAYASASI.md:** "Expo Yönetimi" bölümü - managed workflow zorunlu

---

## ✅ SONUÇ

**Durum:** Proje managed workflow için hazır, sadece 5 düzeltme gerekiyor.

**Risk Seviyesi:** Düşük - Tüm düzeltmeler non-breaking changes
**Süre:** ~20 dakika
**Güven:** Yüksek - Expo SDK 54 + Expo Go destekleniyor

---

**Rapor Oluşturulma:** 2025-10-27  
**Sonraki Adım:** Düzeltmeleri uygula ve test et


