# /ybis: Komut ─░ndeksi

**Ama├ğ:** AI asistanlar─▒n─▒n kullanabilece─şi ana `/ybis:` komutlar─▒n─▒, ama├ğlar─▒n─▒ ve ne zaman kullan─▒lmalar─▒ gerekti─şini tan─▒mlayan merkezi bir rehber.

**Kullan─▒m:** Bu dosya, her AI oturumunun ba┼ş─▒nda (Tier-1 kapsam─▒nda) okunarak, AI'─▒n mevcut proje yetenekleri ve i┼ş ak─▒┼şlar─▒ konusunda tam fark─▒ndal─▒─şa sahip olmas─▒n─▒ sa─şlar.

---

## ­şÅø´©Å Y├Ânetim ve Dok├╝mantasyon Komutlar─▒

### **/ybis:log-decision**
- **Ama├ğ:** ├ûnemli bir mimari, teknoloji veya ├╝r├╝n karar─▒n─▒ resmi olarak kaydetmek.
- **─░┼ş Ak─▒┼ş─▒:**
    1. Kullan─▒c─▒dan karar─▒n gerek├ğesini, alternatiflerini ve etkilerini al─▒r.
    2. `DEVELOPMENT_LOG.md`'ye yeni bir `AD-XXX` (Architecture Decision) olarak ekler.
    3. Karar─▒n etkiledi─şi "Canl─▒ Dok├╝manlar─▒" (`tech-stack.md`, `Architecture_better.md` vb.) otomatik olarak g├╝ncellemeyi ├Ânerir.
- **Ne Zaman Kullan─▒l─▒r:** Projenin gidi┼şat─▒n─▒ etkileyen bir karar al─▒nd─▒─ş─▒nda.

### **/ybis:end_session**
- **Ama├ğ:** Geli┼ştirme oturumunu standart bir protokolle sonland─▒rmak.
- **─░┼ş Ak─▒┼ş─▒:**
    1. Oturumda yap─▒lanlar─▒ ├Âzetler.
    2. `DEVELOPMENT_LOG.md`'ye kal─▒c─▒ bir kay─▒t ekler.
    3. Bir sonraki oturum i├ğin `session-context.md`'yi haz─▒rlar.
    4. Dok├╝mantasyonun g├╝ncel olup olmad─▒─ş─▒n─▒ kontrol eder ve gerekirse `/ybis:log-decision` komutunu ├Ânerir.
- **Ne Zaman Kullan─▒l─▒r:** G├╝nl├╝k veya haftal─▒k ├ğal─▒┼şma seans─▒n─▒n sonunda.
- **Not:** `session end` komutu ile ayn─▒ i┼şlevi g├Âr├╝r, `session end` daha genel kullan─▒md─▒r.

### **/ybis:maintain-docs**
- **Ama├ğ:** Dok├╝mantasyonun tutarl─▒l─▒─ş─▒n─▒ ve g├╝ncelli─şini sa─şlamak i├ğin otomatik bak─▒m i┼ş ak─▒┼ş─▒n─▒ tetikler.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `documentation-maintenance.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Kanonik kaynaklardaki de─şi┼şiklikleri tespit eder.
    3. T├╝retilmi┼ş dok├╝manlar─▒ g├╝nceller ve tutarl─▒l─▒k kontrolleri yapar.
- **Ne Zaman Kullan─▒l─▒r:** Dok├╝mantasyonun g├╝ncel ve tutarl─▒ oldu─şundan emin olmak istendi─şinde veya bir kanonik dok├╝man de─şi┼şti─şinde.

### **/ybis:maintain-docs**
- **Ama├ğ:** Dok├╝mantasyonun tutarl─▒l─▒─ş─▒n─▒ ve g├╝ncelli─şini sa─şlamak i├ğin otomatik bak─▒m i┼ş ak─▒┼ş─▒n─▒ tetikler.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `documentation-maintenance.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Kanonik kaynaklardaki de─şi┼şiklikleri tespit eder.
    3. T├╝retilmi┼ş dok├╝manlar─▒ g├╝nceller ve tutarl─▒l─▒k kontrolleri yapar.
- **Ne Zaman Kullan─▒l─▒r:** Dok├╝mantasyonun g├╝ncel ve tutarl─▒ oldu─şundan emin olmak istendi─şinde veya bir kanonik dok├╝man de─şi┼şti─şinde.

### **/ybis:create-story**
- **Ama├ğ:** Proje standartlar─▒na ve ┼şablonlara uygun yeni bir kullan─▒c─▒ hikayesi (story) dok├╝man─▒ olu┼şturur.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `create-story.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Kullan─▒c─▒dan ├╝st d├╝zey gereksinimleri toplar.
    3. ┼Şablonu doldurur ve taslak hikayeyi kullan─▒c─▒ya sunar.
    4. Onay sonras─▒ hikayeyi `docs/stories/` alt─▒na kaydeder.
- **Ne Zaman Kullan─▒l─▒r:** Yeni bir ├Âzellik veya geli┼ştirme i├ğin kullan─▒c─▒ hikayesi olu┼şturulaca─ş─▒ zaman.

### **/ybis:create-epic**
- **Ama├ğ:** Proje standartlar─▒na ve ┼şablonlara uygun yeni bir epic dok├╝man─▒ olu┼şturur.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `create-epic.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Kullan─▒c─▒dan ├╝st d├╝zey epic gereksinimlerini toplar.
    3. ┼Şablonu doldurur ve taslak epic'i kullan─▒c─▒ya sunar.
    4. Onay sonras─▒ epic'i `docs/epics/` alt─▒na kaydeder.
- **Ne Zaman Kullan─▒l─▒r:** Yeni bir b├╝y├╝k ├Âzellik grubu veya stratejik hedef tan─▒mlanaca─ş─▒ zaman.

---

## ÔÜÖ´©Å Oturum Y├Ânetimi Komutlar─▒

### **session start <session_id>**
- **Ama├ğ:** Yeni bir AI oturumu ba┼şlat─▒r ve benzersiz bir `<session_id>` atar.
- **─░┼ş Ak─▒┼ş─▒:**
    1. Yeni bir `session-context.md` dosyas─▒ olu┼şturur veya mevcut olan─▒ `<session_id>` ile g├╝nceller.
    2. TIER 1 dok├╝manlar─▒n─▒ y├╝kler (Orchestrator-First prosed├╝r├╝ne g├Âre).
    3. Oturumun ba┼şlang─▒├ğ durumunu `DEVELOPMENT_LOG.md`'ye kaydeder.
- **Ne Zaman Kullan─▒l─▒r:** Yeni bir ├ğal─▒┼şma oturumuna ba┼şlarken.

### **session end <session_id>**
- **Ama├ğ:** Belirtilen AI oturumunu standart bir protokolle sonland─▒r─▒r.
- **─░┼ş Ak─▒┼ş─▒:**
    1. Oturumda yap─▒lanlar─▒ ├Âzetler.
    2. `DEVELOPMENT_LOG.md`'ye kal─▒c─▒ bir kay─▒t ekler.
    3. Bir sonraki oturum i├ğin `session-context.md`'yi haz─▒rlar.
    4. Dok├╝mantasyonun g├╝ncel olup olmad─▒─ş─▒n─▒ kontrol eder ve gerekirse `/ybis:log-decision` komutunu ├Ânerir.
- **Ne Zaman Kullan─▒l─▒r:** G├╝nl├╝k veya haftal─▒k ├ğal─▒┼şma seans─▒n─▒n sonunda.
- **Not:** `/ybis:end_session` komutu ile ayn─▒ i┼şlevi g├Âr├╝r, `session end` daha genel kullan─▒md─▒r.

### **execute <command>**
- **Ama├ğ:** Belirtilen komutu mevcut oturum ba─şlam─▒nda ├ğal─▒┼şt─▒r─▒r.
- **─░┼ş Ak─▒┼ş─▒:**
    1. Komutu ayr─▒┼şt─▒r─▒r ve ge├ğerlili─şini kontrol eder.
    2. ─░lgili ajan─▒ veya script'i tetikler.
    3. Komutun ├ğ─▒kt─▒s─▒n─▒ kullan─▒c─▒ya sunar.
- **Ne Zaman Kullan─▒l─▒r:** Do─şrudan bir komut ├ğal─▒┼şt─▒rmak istendi─şinde.

### **list sessions**
- **Ama├ğ:** Aktif ve yak─▒n zamanda tamamlanm─▒┼ş AI oturumlar─▒n─▒ listeler.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `DEVELOPMENT_LOG.md` ve `session-context.md`'den oturum bilgilerini ├ğeker.
    2. Oturum ID'si, ba┼şlang─▒├ğ/biti┼ş zaman─▒, aktif odak gibi bilgileri g├Âsterir.
- **Ne Zaman Kullan─▒l─▒r:** Mevcut oturumlar─▒ g├Âzden ge├ğirmek veya bir oturuma geri d├Ânmek istendi─şinde.

### **get session_log <session_id>**
- **Ama├ğ:** Belirtilen oturumun detayl─▒ loglar─▒n─▒ ve ba─şlam─▒n─▒ getirir.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `DEVELOPMENT_LOG.md`'den `<session_id>`'ye ait t├╝m girdileri filtreler.
    2. `session-context.md`'nin o oturuma ait son durumunu g├Âsterir.
- **Ne Zaman Kullan─▒l─▒r:** Belirli bir oturumun ge├ğmi┼şini incelemek veya ba─şlam─▒n─▒ yeniden y├╝klemek istendi─şinde.

### **/ybis:handoff**
- **Ama├ğ:** G├Ârevleri ve ba─şlam─▒ AI ajanlar─▒ aras─▒nda sorunsuz bir ┼şekilde aktar─▒r.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `handoff.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Tamamlanan i┼şi ve ilgili oturum ba─şlam─▒n─▒ ├Âzetler.
    3. G├Ârevin devam─▒ i├ğin en uygun ajan─▒ belirler ve ba─şlam─▒ hedef ajan─▒n klas├Âr├╝ne kaydeder.
    4. Kullan─▒c─▒y─▒ ve hedef ajan─▒ bilgilendirir.
- **Ne Zaman Kullan─▒l─▒r:** Bir ajan─▒n g├Ârevini tamamlay─▒p ba┼şka bir ajan─▒n devam etmesi gerekti─şinde.

---

## ­şÆ╗ Geli┼ştirme ve Uygulama Komutlar─▒

### **/ybis:implement**
- **Ama├ğ:** `tasks.md` dosyas─▒nda tan─▒mlanm─▒┼ş bir g├Ârevi (task) uygulamak.
- **─░┼ş Ak─▒┼ş─▒:**
    1. ─░lgili g├Ârev tan─▒m─▒n─▒ `tasks.md`'den okur.
    2. Gerekirse ilgili `story` dosyas─▒n─▒ okur.
    3. Kodlama standartlar─▒na (`DEVELOPMENT_GUIDELINES.md`) uyarak g├Ârevi yerine getirir.
- **Ne Zaman Kullan─▒l─▒r:** Yeni bir ├Âzellik eklenece─şi veya mevcut bir ├Âzellik ├╝zerinde ├ğal─▒┼ş─▒laca─ş─▒ zaman.

### **/ybis:sc-refactor**
- **Ama├ğ:** Belirli bir kod par├ğas─▒n─▒ veya dosyay─▒, kalite standartlar─▒na ve en iyi pratiklere uygun olarak yeniden yap─▒land─▒rmak (refactor etmek).
- **─░┼ş Ak─▒┼ş─▒:**
    1. Hedef dosyay─▒ veya kod blo─şunu analiz eder.
    2. ─░yile┼ştirme i├ğin bir plan ├Ânerir (├Ârn: okunabilirlik, performans, soyutlama).
    3. Onay sonras─▒ de─şi┼şiklikleri uygular.
- **Ne Zaman Kullan─▒l─▒r:** "Kod kokusu" (code smell) tespit edildi─şinde veya teknik bor├ğ (technical debt) azalt─▒lmak istendi─şinde.

### **/ybis:query-kb**
- **Ama├ğ:** Projenin bilgi taban─▒n─▒ sorgular ve eksik veya belirsiz bilgileri iyile┼ştirmeyi ├Ânerir.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `query-kb.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Ajan─▒n bilgi ihtiyac─▒na g├Âre bir sorgu form├╝le eder.
    3. ─░lgili bilgi dosyalar─▒n─▒ ve dok├╝mantasyon haritas─▒n─▒ arar.
    4. Sonu├ğlar─▒ sunar ve bilgi bo┼şluklar─▒ tespit edilirse iyile┼ştirme ├Ânerir.
- **Ne Zaman Kullan─▒l─▒r:** Ajan─▒n mevcut ba─şlam─▒nda olmayan belirli bilgilere ihtiya├ğ duyuldu─şunda veya bilgi taban─▒nda bir bo┼şluk tespit edildi─şinde.

### **/ybis:proactive-solve**
- **Ama├ğ:** Yinelenen sorunlar─▒ veya engelleyicileri proaktif olarak tespit eder, k├Âk nedenleri analiz eder ve ├ğ├Âz├╝mler ├Ânerir veya uzman ajanlar─▒ ba┼şlat─▒r.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `proactive-solve.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. `DEVELOPMENT_LOG.md` ve `session-context.md`'deki sorun kal─▒plar─▒n─▒ izler.
    3. K├Âk neden analizi yapar ve ├ğ├Âz├╝m ├Ânerileri sunar.
    4. Kullan─▒c─▒ya veya ilgili ajana rapor sunar.
- **Ne Zaman Kullan─▒l─▒r:** Proaktif sorun ├ğ├Âzme veya yinelenen sorunlar─▒ ├Ânleme ihtiyac─▒ oldu─şunda.

---

## ­şöı G├Âzden Ge├ğirme ve Kalite Komutlar─▒

### **/ybis:review-story**
- **Ama├ğ:** Tamamlanm─▒┼ş bir kullan─▒c─▒ hikayesini (`story`) g├Âzden ge├ğirmek.
- **─░┼ş Ak─▒┼ş─▒:**
    1. ─░lgili `story` dosyas─▒n─▒ okur.
    2. `story-dod-checklist.md` (Definition of Done) kontrol listesine g├Âre story'nin tamamlanma durumunu do─şrular.
    3. Eksik veya hatal─▒ k─▒s─▒mlar i├ğin geri bildirimde bulunur.
- **Ne Zaman Kullan─▒l─▒r:** Bir geli┼ştirme d├Âng├╝s├╝ tamamland─▒─ş─▒nda, QA (Kalite G├╝vence) s├╝recinin bir par├ğas─▒ olarak.

### **/ybis:quality-check**
- **Ama├ğ:** Projenin genel kod kalitesini kontrol etmek.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `quality-standards.md` dosyas─▒n─▒ okur.
    2. `lint` ve `type-check` gibi statik kod analizi komutlar─▒n─▒ ├ğal─▒┼şt─▒r─▒r.
    3. Tespit edilen hatalar─▒ ve uyar─▒lar─▒ raporlar.
- **Ne Zaman Kullan─▒l─▒r:** Birle┼ştirme (merge) ├Âncesi veya periyodik sa─şl─▒k kontrolleri i├ğin.

### **/ybis:deep-review**
- **Ama├ğ:** Belirli bir konuda derinlemesine mimari ve gereksinim analizi yapmak.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `Architecture_better.md` ve `PRODUCT_REQUIREMENTS.md` gibi temel dok├╝manlar─▒ okur.
    2. ─░stenen konunun bu dok├╝manlarla uyumlulu─şunu ve potansiyel etkilerini analiz eder.
- **Ne Zaman Kullan─▒l─▒r:** Yeni bir b├╝y├╝k ├Âzellik veya mimari de─şi┼şiklik ├Âncesinde.

### **/ybis:health-check**
- **Ama├ğ:** Kod taban─▒ ve dok├╝mantasyonun proje standartlar─▒na uygunlu─şunu periyodik olarak kontrol eder ve sapmalar─▒ raporlar.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `health-check.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. 'Zero-Tolerance' kurallar─▒n─▒n ihlallerini, test kapsam─▒n─▒ ve dok├╝mantasyon tutarl─▒l─▒─ş─▒n─▒ kontrol eder.
    3. Bulgular─▒ yap─▒land─▒r─▒lm─▒┼ş bir rapor halinde sunar.
- **Ne Zaman Kullan─▒l─▒r:** Kod taban─▒ ve dok├╝mantasyonun sa─şl─▒k durumunu kontrol etmek veya bir PR birle┼ştirmeden ├Ânce.

### **/ybis:health-check**
- **Ama├ğ:** Kod taban─▒ ve dok├╝mantasyonun proje standartlar─▒na uygunlu─şunu periyodik olarak kontrol eder ve sapmalar─▒ raporlar.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `health-check.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. 'Zero-Tolerance' kurallar─▒n─▒n ihlallerini, test kapsam─▒n─▒ ve dok├╝mantasyon tutarl─▒l─▒─ş─▒n─▒ kontrol eder.
    3. Bulgular─▒ yap─▒land─▒r─▒lm─▒┼ş bir rapor halinde sunar.
- **Ne Zaman Kullan─▒l─▒r:** Kod taban─▒ ve dok├╝mantasyonun sa─şl─▒k durumunu kontrol etmek veya bir PR birle┼ştirmeden ├Ânce.

### **/ybis:code-review**
- **Ama├ğ:** Kod taban─▒n─▒ proje standartlar─▒na g├Âre otomatik olarak inceler, yap─▒land─▒r─▒lm─▒┼ş bir rapor olu┼şturur ve iyile┼ştirmeler ├Ânerir.
- **─░┼ş Ak─▒┼ş─▒:**
    1. `code-review.yaml` i┼ş ak─▒┼ş─▒n─▒ ba┼şlat─▒r.
    2. Kodlama standartlar─▒na, kalite ge├ğitlerine ve test kapsam─▒na uygunlu─şu kontrol eder.
    3. Statik analiz ara├ğlar─▒n─▒ ├ğal─▒┼şt─▒r─▒r ve bulgular─▒ derler.
    4. Kullan─▒c─▒ya veya ilgili ajana bir kod inceleme raporu sunar.
- **Ne Zaman Kullan─▒l─▒r:** Bir kodlama g├Ârevi tamamland─▒─ş─▒nda veya bir PR olu┼şturulmadan ├Ânce.
