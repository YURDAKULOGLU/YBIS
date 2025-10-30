---
title: "Stash Takip Planı - 2025-10-30"
status: "draft"
author: "Codex Agent"
summary: "Stash içeriğindeki değişikliklerin YBIS standartlarına göre incelenmesi ve sonraki oturuma aktarılacak görev listesi."
created_at: "2025-10-30"
---

# Kapsam

- Kaynak: `stash-full.patch`, `stash_index.tsx`, `stash_login.tsx`, `stash_widget.tsx`, `stash_auth_index.ts`, `stash-login.patch`.
- Amaç: Geniş kapsamlı stash değişikliklerini kontrollü biçimde ana kod tabanına taşıyabilmek için takip oturumunda izlenecek adımları belirlemek.

# Önceliklendirilmiş İşler

## 1. Login Akışı
- **Story Referansı:** `docs/stories/4.1.login-screen-google-oauth.md` (AC-6 demo modu ile güncellendi).
- **Dosyalar:** `stash_login.tsx`, `stash-login.patch`.
- **Notlar:**
  - Yeni Supabase tabanlı login ekranı + demo modu butonu.
  - `useAuth` context entegrasyonu ve loading / error yönetimi.
  - Takip oturumunda: `apps/mobile/app/(auth)/login.tsx` ile karşılaştır, UI izolasyonu ve TypeScript katılığı onayla, demo butonunun mock auth akışını bozmadığından emin ol.

## 2. Chat Ana Ekran Refaktörü
- **Dosya:** `stash_index.tsx`.
- **İçerik:**
  - FlatList + keyboard-aware animasyonlar, widget yüksekliği yönetimi.
  - Kullanıcı scroll davranışı ve auto-scroll kontrolü.
  - Takip oturumunda: Mevcut `apps/mobile/app/(tabs)/index.tsx` ile diff al; SafeArea / widget davranışı regresyon testleri (özellikle tab bar & keyboard).

## 3. Widget Revizyonu
- **Dosya:** `stash_widget.tsx`.
- **İçerik:** Scroll edilebilir widget, inline test input (demo), emoji ikonlar.
- **Takip:** Tasarım kararlarını story 2.x dosyalarıyla kıyasla; gerçek veriye geçişte not tutulmalı.

## 4. Auth Package Exportları
- **Dosya:** `stash_auth_index.ts`.
- **İçerik:** `@ybis/auth` için merkezî index (Expo + Supabase adapter exportları).
- **Takip:** Paket yapısı (`packages/auth/`) ile karşılaştır, casing ve type exportları doğrula, backend/mobile import noktalarını güncelleme gereksinimi var mı kontrol et.

## 5. Dokümantasyon/Yönetim Değişiklikleri
- **Patch:** `stash-full.patch` (büyük yelpaze).
- **Öne çıkanlar:**
  - AI content conventions (IMPORTANT / ACTION blockları).
  - Anayasa ve quick index güncellemeleri.
  - Story referansları ve development log ekleri.
- **Takip:** Belge bazında seçici uygulama; mevcut revizyonlarla çakışmaları kontrol et (özellikle `YBIS_PROJE_ANAYASASI.md`, `DEVELOPMENT_LOG.md`).

# Takip Oturumu İçin Çalışma Adımları

1. **Stash Çıkartması İçin Sandbox:**
   - `git worktree add ../ybis-stash-review` (veya manuel klasör kopyası).
   - Stash’i sandbox içinde uygula, diff incele.

2. **Kod İnceleme ve Uygulama Sırası:**
   1. Auth package (`stash_auth_index.ts`) → export yapısı.
   2. Login ekranı (`stash_login.tsx`) + story AC doğrulaması.
   3. Chat ana ekran & widget (`stash_index.tsx`, `stash_widget.tsx`).
   4. Dokümantasyon yamaları (`stash-full.patch`) → belgeden belgeye.

3. **Test Planı:**
   - `pnpm --filter @ybis/mobile exec expo start -c` (kullanıcı adayı komut).
   - `pnpm lint`, `pnpm type-check`, `pnpm test`.
   - Gerekirse `pnpm run doctor` (Metro watchFolders uyarısı not alınmış durumda).

4. **Demo Mode Performans Kontrolü:**
   - Demo butonu ile login → Chat ana ekranı → Demo göstergesi.
   - Gerçek Supabase login akışıyla çakışmadığından emin olun.

# Bağımlılıklar / Ön Koşullar

- Node 20.18.x kullanımı (engines ayarlandı).
- Stash içeriğindeki doküman değişiklikleri, mevcut repository revizyonlarıyla çakışabilir; merge stratejisi belirlenmeli.
- `useAuth` context ve `useMockAuth` store yapıları doğrulanmalı (demo mode).

# Notlar

- Expo Metro `watchFolders` uyarısı bilerek tutuluyor (pnpm monorepo gerekçesi).
- Dokümantasyon değişiklikleri yüksek hacimli olduğu için incremental yaklaşım önerilir.

# Sonraki Aksiyon

- Takip oturumunda bu rapor referans alınarak sandbox > inceleme > seçici merge süreci yürütülecek.
