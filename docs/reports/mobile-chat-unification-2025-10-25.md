---
title: "Mobile Chat Unification Review — 2025-10-25"
status: "draft"
owner: "gpt-5-codex"
created_date: "2025-10-25"
summary: "Aligns the mobile chat experience and orchestration layer with the closed beta promise by detailing immediate UX and abstraction fixes."
key_takeaways:
  - "Widget alanı chat merkezliliğini gölgeliyor; bağlamsal aksiyonlara ve daraltılabilir yapıya ihtiyaç var."
  - "Sohbet akışı hâlâ yerel mock mantığına bağlı; backend LLM portuna köprü kurulmalı."
  - "Yeni Calendar/Task/Note/Workflow portları tanımlanarak entegrasyon yolu netleştirilmeli."
  - "Klavye kaçınma ve Drawer gibi yüzeylerde platform çözümleri ve gerçek context uygulanmalı."
---

# Mobile Chat Unification Review — 2025-10-25

## Scope
- Home chat kabuğu (`apps/mobile/app/(tabs)/index.tsx`)
- Chat bileşenleri (`apps/mobile/src/features/chat/components/**/*`)
- Chat hook'ları ve servisleri (`apps/mobile/src/features/chat/hooks/**/*`, `apps/mobile/src/services/**/*`)
- Çekirdek port tanımları (`packages/core/src/ports/**/*`)

## Durum Özeti

### Ekran Deneyimi
- Widget yüzeyi sabit %20 yükseklikte; klavye açılınca sohbet arka plana itiliyor ve "tek ekran" vaadi zayıflıyor.
- Onboarding kartı neredeyse tam ekran; ilk beş dakikada hızlı etkileşim hedefini geciktiriyor.
- Drawer ve mikrofon ikonları kullanıcıya kontrol hissi veriyor ancak `noop` implementasyonlar nedeniyle hiçbir şey olmuyor.
- Klavye açılma senaryosu elle `Animated` API'siyle yönetiliyor; platform farklılıklarında kırılma riski yüksek.

### Mimari Soyutlama
- `useChat` yalnızca `setTimeout` ile sabit cevap döndürüyor; LLMPort ve backend `/api/llm/chat` rotası kullanılmıyor.
- Widget bileşeni sekmelere göre sabit diziler render ediyor; port mimarisiyle veri çekme yolu kurulmamış.
- Calendar/Task/Note/Workflow portları core pakette tanımlı değil; roadmap'teki entegrasyon hedefleri için temel eksik.
- Analytics/Logger çağrıları tekil; veri toplama stratejisi için eyleme geçirilebilir hook yok.

## Önerilen İyileştirmeler

### 1. Ekran Eleştirilerinin Giderilmesi
- Widget alanını daraltılabilir yapıya çevirerek sohbeti tekrar merkez konuma al, klavye açıldığında `KeyboardAvoidingView` kullan.
- Onboarding kartını kompaktlaştır; çoklu öneriyi yatay çipler ve hızlı başlat butonlarıyla sun.
- Drawer ve sesli komut yüzeylerini gerçek handler'lara bağla; en azından Logger ile kullanıcı aksiyonlarını izlenebilir kıl.
- Widget seçimlerinin sohbet girişine prompt olarak düşmesini sağla, "widget seç → chat'te aksiyon" akışını görünür kıl.

### 2. Soyutlama Yapısının Güçlendirilmesi
- `useChat`'i backend `/api/llm/chat` rotasına bağlayacak bir gateway katmanı ekle; gönderilen mesajları port formatına çevir.
- Widget verisi için Calendar/Task/Note/Workflow portlarını tanımla ve UI'da bu portların sunduğu özetleri işle.
- PortRegistry veya gelecekteki DI senaryoları için yeni portların tiplerini `@ybis/core` üzerinden paylaşılır hâle getir.
- Widget snapshot servisinde API erişimi yapılandırılmadığında anlaşılır hata üret ve Logger ile uyarı gönder.

## Takip Görevleri

### Görev 1 — Ekran Eleştirilerini Uygulama
- Widget kabuğunu daraltılabilir + yenilenebilir hâle getir.
- Onboarding önerilerini chip tabanlı aksiyonlara dönüştür.
- Mikrofon ve Drawer ikonlarını gerçek handler'lara bağla; chat akışına prompt düşür.
- Klavye kaçınmayı `KeyboardAvoidingView` veya eşdeğer platform çözümüne taşı.

### Görev 2 — Soyutlama Yapısını Düzeltme
- LLMPort üzerinden sohbet eden bir `chatGateway` oluştur ve `useChat` bunu kullansın.
- Calendar/Task/Note/Workflow portlarını `@ybis/core` içine ekleyip UI katmanında kullan.
- Widget snapshot servisi ve hook'u ile port tabanlı veri akışı için altyapı kur; hata/boş durumları ele al.
- Logger ve analitik giriş noktalarını genişletip her otomatik prompt aksiyonunu kaydet.

