---
title: "Checkout Çalışmaları - Fark Analizi ve Değerlendirme"
date: "2025-10-30"
status: "draft"
owner: "@ybis-master"
related:
  - "apps/mobile/app/(auth)/login.tsx"
  - "apps/mobile/app/(tabs)/index.tsx"
  - "apps/mobile/src/features/chat/components/Widget.tsx"
  - "@stash/* (referans)"
summary: "Stash'teki değişiklikler ile mevcut kod arasındaki farkların kapsamlı analizi, etkileri ve önerilen yön."
---

## 1) Kapsam ve Yöntem

- Bu rapor, `@stash` altına kopyalanan referans dosyalar ile mevcut kod tabanındaki karşılıklarının farklarını özetler.
- İncelenen ana dosyalar:
  - `apps/mobile/app/(auth)/login.tsx` ↔ `@stash/stash_login.tsx`
  - `apps/mobile/app/(tabs)/index.tsx` ↔ `@stash/stash_index.tsx`
  - `apps/mobile/src/features/chat/components/Widget.tsx` ↔ `@stash/stash_widget.tsx`
- Ek olarak `stash-files.txt` listesi uyarınca diğer yol/kapsamlar `@stash/` altında arşiv amaçlı kopyalanmıştır.

## 2) Özet Sonuçlar

- Login:
  - Mevcut sürüm, Demo Mode ve gelişmiş hata/loader yönetimiyle daha olgun. Stash sürümünde Demo Mode yok.
  - Mevcut akış, giriş sonrası `router.replace('/(tabs)')` ile net yönlendirme yapıyor (Demo Mode'da). Stash yönlendirmeyi auth state'e bırakıyor.

- Ana Sekme (Chat) Ekranı `(tabs)/index.tsx`:
  - Mevcut sürümde klavye-animasyon etkileşimi ve içerik alt padding’i `ChatInput` yüksekliğine göre dinamik ayarlanıyor (daha iyi UX).
  - Stash sürümünde padding sabit/az; ayrıca bazı ikon/emojiler UTF bozulması içeriyor.
  - Mevcut sürüm `useTheme` ile UI rengini gerçek tema değerlerinden alıyor; stash sürümü string tabanlı `$background`/`$borderColor` kullanıyor.

- Widget bileşeni:
  - Mevcut sürüm sade, sabit içerik gösterimi ve düzgün i18n anahtarları kullanıyor.
  - Stash sürümünde ekstra `ScrollView` + test `Input` alanı var; ancak metinlerde encoding bozulmaları var (punkt/emoji karakterleri). Bu haliyle taşınması riskli.

## 3) Detaylı Farklar ve Etkiler

### 3.1 Login Ekranı (`apps/mobile/app/(auth)/login.tsx`)

- Mevcut:
  - `useMockAuth.loginDemo` ile Demo Mode.
  - `clearError()` input değişimlerinde tetikleniyor.
  - Başarılı auth veya demo sonrası `router.replace('/(tabs)')`.
  - Google OAuth butonu pasif (bilgilendirici etiketle).

- Stash (`@stash/stash_login.tsx`):
  - Demo Mode yok.
  - Navigasyon auth state’e bırakılmış (explicite yönlendirme yok).

- Etki:
  - Mevcut akış kullanıcı deneyimi açısından daha iyi ve hataya dayanıklı. Stash’tan alınması gereken bir ek değer bulunmuyor.

### 3.2 Ana Ekran (Chat) (`apps/mobile/app/(tabs)/index.tsx`)

- Mevcut:
  - `Keyboard` dinleyicileri ile `widgetHeightAnim` dinamik; klavye açılınca widget yüksekliği 0’a animasyonla iner.
  - `contentContainerStyle.paddingBottom = chatInputHeight + 16` ile içerik taşması engelleniyor.
  - `useTheme()` ile `theme.background.val`/`theme.gray5.val` kullanımı.
  - `SafeAreaView edges={['bottom']}` kullanımı standardize.

- Stash (`@stash/stash_index.tsx`):
  - Benzer animasyon iskeleti mevcut; ancak `paddingBottom` sabit 8 ve `SafeAreaView edges={[]}`.
  - Sabit string tabanlı `$background`/`$borderColor` kullanımı.
  - Bazı ikon/emoji stringlerinde encoding bozulması (görsel kalite ve i18n riskleri).

- Etki:
  - Mevcut sürüm, klavye/scroll etkileşimlerinde daha kararlı ve profesyonel his veriyor.
  - Stash’taki sabit padding, chat input üzerine içerik binmesi riskini artırır.

### 3.3 Widget (`apps/mobile/src/features/chat/components/Widget.tsx`)

- Mevcut:
  - Basit kart, iki satır item gösterimi, i18n anahtarları ile temiz içerik.

- Stash (`@stash/stash_widget.tsx`):
  - `ScrollView` + test amaçlı `Input` alanı.
  - Liste öğelerinde ve ikonlarda encoding bozulmaları (Örn: `ÔÇó`).

- Etki:
  - Test amaçlı `Input` üretim sürümünde gereksiz ve encode sorunları risk.
  - Mevcut sürüm UI tutarlılığı açısından daha güvenli.

## 4) Encoding / i18n Notları

- Stash dosyalarında (özellikle `stash_index.tsx`, `stash_widget.tsx`) emoji ve noktalama karakterlerinde UTF-8 bozulmaları var.
- Risk: UI’da bozuk karakterler, çeviri anahtarlarının yanlış render edilmesi.
- Öneri: Stash’tan yalnızca mantıksal kısımlar taşınacaksa, karakter seti normalization (UTF-8) uygulanmalı.

## 5) Önerilen Yön

1. Login: Mevcut sürümü koru. Stash’tan eklenecek bir parça yok.
2. `(tabs)/index.tsx`: Mevcut sürümü koru. Stash’tan yalnızca gerekirse küçük yorum/düzen fikirleri alın, sabit padding’e geri dönme.
3. `Widget`: Mevcut sürümü koru. Stash’taki test `Input` ve ScrollView gereksiz; encoding sorunları nedeniyle alınmamalı.
4. Encoding: Stash dosyaları ileride referans olarak saklanacaksa UTF-8 düzeltmesi yapılarak arşivlenmeli.

## 6) İzlenen Dosyalar (Referans)

`stash-files.txt` temel alınarak `@stash/` altına kopyalanan başlıca yollar (tam liste dosyada):

- `apps/mobile/app/(auth)/login.tsx`
- `apps/mobile/app/(tabs)/index.tsx`
- `apps/mobile/src/features/chat/components/Widget.tsx`
- `docs/Güncel/DEVELOPMENT_LOG.md`, `docs/YBIS_PROJE_ANAYASASI.md` (karar ve standart referansları)
- `packages/auth/*`, `packages/i18n/*`, `packages/theme/*` (port ve paket düzeyinde referans)

## 7) Kapanış

- Mevcut kod, stash’e kıyasla kullanıcı deneyimi ve kalite standartları açısından daha ileri noktada.
- Stash, fikir ve geçmiş çalışma arşivi olarak faydalı; doğrudan merge önerilmez.


