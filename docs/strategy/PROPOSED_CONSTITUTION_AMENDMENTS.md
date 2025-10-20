# Önerilen Anayasa Değişiklikleri

**Tarih:** 21 Ekim 2025
**Durum:** Tartışmaya Açık

Bu doküman, YBIS Proje Anayasası'nı daha da güçlendirmek ve projenin uzun vadeli kalitesini, performansını ve güvenliğini artırmak için önerilen yeni "katı yasaları" içermektedir.

---

## 1. Bundle Boyutu Tavanı (Bundle Size Ceiling)

- **Önerilen Yasa:** Mobil uygulamanın production "bundle" boyutu, belirlenen bir tavanı (örneğin, `10 MB`) aşamaz. Projeye eklenecek her yeni harici bağımlılık (`dependency`), önce bundle üzerindeki potansiyel etkisi analiz edilerek onaylanmalıdır. Tavanı aşan bir değişiklik ana branch'e birleştirilemez.
- **Gerekçe:** Özellikle mobil uygulamalarda, büyük bundle boyutları uygulamanın yavaş açılmasına ve kötü bir kullanıcı deneyimine yol açar. Bu yasa, projenin her zaman performanslı ve hızlı kalmasını en başından garanti eder ve geliştiricileri daha bilinçli bağımlılık seçimi yapmaya teşvik eder.

---

## 2. API Şema Zorunluluğu (API Schema Mandate)

- **Önerilen Yasa:** Uygulama katmanları (mobil, web), backend'den gelen veriyi asla "olduğu gibi" kabul edemez. Gelen her veri, `@ybis/core` içinde tanımlanmış olan **Zod** gibi bir şema doğrulama kütüphanesi kullanılarak, daha component'e ulaşmadan önce, en dış katmanda doğrulanmalıdır. Şemaya uymayan veri, bir hata olarak kabul edilip loglanmalıdır.
- **Gerekçe:** Bu kural, backend'de yapılan bir değişikliğin (örneğin, bir alanın adının değişmesi veya türünün farklılaşması) uygulamanın beklenmedik bir anda, öngörülemeyen bir yerde çökmesini engeller. Uygulamayı, API kaynaklı hatalara karşı inanılmaz derecede dayanıklı ve güvenilir hale getirir.

---

## 3. Yeniden Çizim Bütçesi (Re-render Budget)

- **Önerilen Yasa:** Bir component, state (durum) değişikliği olmadığı sürece gereksiz yere yeniden çizilemez (re-render). `React.memo`, `useMemo` ve `useCallback` gibi optimizasyon araçlarının kullanımı standart bir pratik olarak kabul edilmelidir. PR (Pull Request) incelemelerinde, performans profiler araçlarıyla tespit edilen bariz yeniden çizim sorunları, "bug" olarak değerlendirilir ve düzeltilmesi zorunludur.
- **Gerekçe:** React uygulamalarındaki performans sorunlarının ve yavaşlık hissinin en büyük kaynağı gereksiz yeniden çizimlerdir. Bu yasa, uygulamanın her zaman akıcı ve pürüzsüz bir kullanıcı deneyimi sunmasını sağlar ve geliştiricileri performans odaklı düşünmeye teşvik eder.
