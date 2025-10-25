# /ybis: Komut İndeksi

**Amaç:** AI asistanlarının kullanabileceği ana `/ybis:` komutlarını, amaçlarını ve ne zaman kullanılmaları gerektiğini tanımlayan merkezi bir rehber.

**Kullanım:** Bu dosya, her AI oturumunun başında (Tier-1 kapsamında) okunarak, AI'ın mevcut proje yetenekleri ve iş akışları konusunda tam farkındalığa sahip olmasını sağlar.

---

## 🏛️ Yönetim ve Dokümantasyon Komutları

### **/ybis:log-decision**
- **Amaç:** Önemli bir mimari, teknoloji veya ürün kararını resmi olarak kaydetmek.
- **İş Akışı:**
    1. Kullanıcıdan kararın gerekçesini, alternatiflerini ve etkilerini alır.
    2. `DEVELOPMENT_LOG.md`'ye yeni bir `AD-XXX` (Architecture Decision) olarak ekler.
    3. Kararın etkilediği "Canlı Dokümanları" (`tech-stack.md`, `Architecture_better.md` vb.) otomatik olarak güncellemeyi önerir.
- **Ne Zaman Kullanılır:** Projenin gidişatını etkileyen bir karar alındığında.

### **/ybis:end_session**
- **Amaç:** Geliştirme oturumunu standart bir protokolle sonlandırmak.
- **İş Akışı:**
    1. Oturumda yapılanları özetler.
    2. `DEVELOPMENT_LOG.md`'ye kalıcı bir kayıt ekler.
    3. Bir sonraki oturum için `session-context.md`'yi hazırlar.
    4. Dokümantasyonun güncel olup olmadığını kontrol eder ve gerekirse `/ybis:log-decision` komutunu önerir.
- **Ne Zaman Kullanılır:** Günlük veya haftalık çalışma seansının sonunda.

---

## 💻 Geliştirme ve Uygulama Komutları

### **/ybis:implement**
- **Amaç:** `tasks.md` dosyasında tanımlanmış bir görevi (task) uygulamak.
- **İş Akışı:**
    1. İlgili görev tanımını `tasks.md`'den okur.
    2. Gerekirse ilgili `story` dosyasını okur.
    3. Kodlama standartlarına (`DEVELOPMENT_GUIDELINES.md`) uyarak görevi yerine getirir.
- **Ne Zaman Kullanılır:** Yeni bir özellik ekleneceği veya mevcut bir özellik üzerinde çalışılacağı zaman.

### **/ybis:sc-refactor**
- **Amaç:** Belirli bir kod parçasını veya dosyayı, kalite standartlarına ve en iyi pratiklere uygun olarak yeniden yapılandırmak (refactor etmek).
- **İş Akışı:**
    1. Hedef dosyayı veya kod bloğunu analiz eder.
    2. İyileştirme için bir plan önerir (örn: okunabilirlik, performans, soyutlama).
    3. Onay sonrası değişiklikleri uygular.
- **Ne Zaman Kullanılır:** "Kod kokusu" (code smell) tespit edildiğinde veya teknik borç (technical debt) azaltılmak istendiğinde.

---

## 🔍 Gözden Geçirme ve Kalite Komutları

### **/ybis:review-story**
- **Amaç:** Tamamlanmış bir kullanıcı hikayesini (`story`) gözden geçirmek.
- **İş Akışı:**
    1. İlgili `story` dosyasını okur.
    2. `story-dod-checklist.md` (Definition of Done) kontrol listesine göre story'nin tamamlanma durumunu doğrular.
    3. Eksik veya hatalı kısımlar için geri bildirimde bulunur.
- **Ne Zaman Kullanılır:** Bir geliştirme döngüsü tamamlandığında, QA (Kalite Güvence) sürecinin bir parçası olarak.

### **/ybis:quality-check**
- **Amaç:** Projenin genel kod kalitesini kontrol etmek.
- **İş Akışı:**
    1. `quality-standards.md` dosyasını okur.
    2. `lint` ve `type-check` gibi statik kod analizi komutlarını çalıştırır.
    3. Tespit edilen hataları ve uyarıları raporlar.
- **Ne Zaman Kullanılır:** Birleştirme (merge) öncesi veya periyodik sağlık kontrolleri için.

### **/ybis:deep-review**
- **Amaç:** Belirli bir konuda derinlemesine mimari ve gereksinim analizi yapmak.
- **İş Akışı:**
    1. `Architecture_better.md` ve `PRODUCT_REQUIREMENTS.md` gibi temel dokümanları okur.
    2. İstenen konunun bu dokümanlarla uyumluluğunu ve potansiyel etkilerini analiz eder.
- **Ne Zaman Kullanılır:** Yeni bir büyük özellik veya mimari değişiklik öncesinde.
