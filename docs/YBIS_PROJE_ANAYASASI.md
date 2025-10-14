# YBIS Proje Anayasası

**Version:** 3.1.0  
**Last Updated:** 2025-10-12  
**Status:** CANONICAL - Technical Constitution  

**Cross-References:**
- [Project Vision](vision/PROJECT_VISION.md) - Strategic foundation (product principles → architecture)
- [Development Log](Güncel/DEVELOPMENT_LOG.md) - Architecture Decisions (AD-XXX)
- [Competitive Strategy](strategy/COMPETITIVE_STRATEGY.md) - Moats → Tech advantages
- [Product Roadmap](roadmap/PRODUCT_ROADMAP.md) - Timeline alignment

---

## 1. Amaç

Bu anayasa, sadece YBIS projesi için geçerli olan, uyulması zorunlu teknik kuralları, mimari prensipleri ve kalite standartlarını tanımlar. Bu kurallar, `AI_GENEL_ANAYASA.md` dosyasındaki evrensel kuralları bu proje özelinde genişletir ve önceliklidir.

## 2. Kalite ve Güvenlik Emirleri (Zero-Tolerance)

Bu bölümdeki kurallar tartışılamaz ve asla esnetilemez.

- **TypeScript Katılığı:** TypeScript'in `strict` modu asla devre dışı bırakılamaz. `any` türü kesinlikle yasaktır. Belirsiz türler için `unknown` kullanılmalı ve tür koruması (type guard) ile daraltılmalıdır.
- **ESLint Kuralları:** Projenin `.eslintrc.js` dosyasında tanımlı olan tüm kurallara uyulması zorunludur.
- **Yasaklanmış Desenler:** `--force`, `--legacy-peer-deps` gibi komutlar; `@ts-ignore` gibi açıklamalar; ve Tamagui'nin `f`, `ai`, `jc` gibi kısayol prop'ları kesinlikle yasaktır.

## 3. Mimari Prensipleri

- **Port-by-Port Mimarisi (Criteria-Based):** **Sadece değiştirilebilir external bağımlılıklar** için port kullanılmalıdır. Port kullanım kriterleri:
  - ✅ **Port Kullan:** External vendor/service (Supabase, OpenAI, Firebase), swap potential var, birden fazla alternatif mevcut, network call veya native kod
  - ❌ **Port Kullanma:** Internal app logic, framework part (React, Expo Router), single implementation, stable library (Zustand, i18next)
  - **Örnek (Port):** `DatabasePort` (Supabase → Cloud SQL), `LLMPort` (OpenAI → Anthropic), `AuthPort` (OAuth providers)
  - **Örnek (No Port):** Theme (Tamagui + zustand store), i18n (i18next), Navigation (Expo Router), State (Zustand)
  - Uygulama katmanları (`apps/*`), portlanmış bağımlılıkları port üzerinden (`DatabasePort`), portlanmamış bağımlılıkları doğrudan import eder.
- **UI İzolasyonu:** Tüm UI bileşenleri, `@ybis/ui` paketi üzerinden kullanılmalıdır. Doğrudan `tamagui` veya başka bir UI kütüphanesinden bileşen import etmek yasaktır.
- **"Build for Scale, Ship Minimal" Prensibi:** Phase 0'da infrastructure, gelecekteki genişlemeleri destekleyecek şekilde (multi-theme, multi-provider, multi-language) tasarlanmalı, ancak sadece minimal özellikler (dark/light theme, tek LLM, TR+EN) ship edilmelidir. Yeni özellik (vertical, theme, LLM provider) eklemek, core kodunda değişiklik gerektirmemelidir.

## 4. Geliştirme Akışı Kuralları

- **Test Zorunluluğu:** Önemli değişiklikler içeren veya yeni bir özellik ekleyen her kod parçası, ilgili testlerle (birim, entegrasyon) birlikte sunulmalıdır. Kod, lint ve tür kontrolünden (`npm run lint`, `npm run type-check`) hatasız geçmeden tamamlanmış sayılmaz.
- **Loglama ve Dokümantasyon:** Alınan önemli kararlar, yapılan sapmalar ve tamamlanan görevler, `docs/Güncel/DEVELOPMENT_LOG.md` dosyasına ve ilgili `.YBIS_Dev/Veriler/memory/session-context.md` dosyasına işlenmelidir.
- **Hata Durumunda Durma:** Talimatlar çelişiyorsa, gerekli dosyalar eksikse veya bir doğrulama adımı (örn: testler) üst üste üç kez başarısız olursa, işlem durdurulmalı ve durum kullanıcıya bildirilmelidir.

## 5. Monorepo ve Paket Kuralları

- **npm workspaces Kaynak:** npm workspaces, monorepo yapısının kaynağıdır. NX, sadece belgelenmiş tetikleyiciler karşılandığında (build süreleri >2dk, >5 paket, >1 kişi ekip) eklenmelidir.
- **Paket Standardı:** Her paket, `tsconfig.json` (`composite: true`), `src/index.ts` ve uygun `package.json` exports ile birlikte gelmelidir.
- **Build Sırası:** Bağımlı uygulamaları kontrol etmeden önce paket referanslarını build edin (`npx tsc --build ./packages/*`).
- **Expo Yönetimi:** Expo, varsayılan olarak "managed workflow" olarak yönetilir. `expo prebuild` sadece native kod gereksinimleri doğrulandığında çalıştırılmalıdır.

## 6. İsimlendirme ve i18n Kuralları

- **i18next Zorunluluğu:** Tüm kullanıcıya görünen metinler, `i18next` üzerinden çekilmelidir. Hardcode string yasaktır.
- **Desteklenen Diller:** Türkçe (TR) ve İngilizce (EN) Phase 0'dan itibaren desteklenir.
- **Kullanım:** `const { t } = useTranslation('namespace'); return <Text>{t('key')}</Text>`

## 7. Hata İşleme ve İzleme

- **Error Boundaries:** Tüm uygulama root'larında React Error Boundary kullanılmalıdır.
- **Sentry Entegrasyonu:** Production'da Sentry ile hata takibi yapılmalıdır.
- **Tutarlı API Hata Formatı:** Tüm API hataları `{ code: string, message: string, details?: any }` formatında dönmelidir.

## 8. Port Kataloğu (Tier 1 - Çekirdek)

**Port Kullanım Kriteri:** "Will we swap vendors? Port it. Will we expand features? Don't port it."

Aşağıdaki portlar Phase 0'da implement edilmelidir:

1. **AuthPort** - OAuth provider swap (Expo Auth → Google → Firebase → Supabase Auth)
2. **DatabasePort** - Supabase PostgreSQL → Cloud SQL (gelecek)
3. **LLMPort** - OpenAI → Anthropic → Gemini → Local LLM (multi-provider)
4. **StoragePort** - Supabase Storage → GCS → S3 (vendor swap)
5. **DeploymentPort** - Vercel Edge → Cloudflare Workers (Phase 1) 🆕

**Portlanmayan (Stable/Internal):**
- ❌ **Theme** - Tamagui config + zustand store (internal, feature expansion)
- ❌ **i18n** - i18next (standard, no real alternatives)
- ❌ **Chat UI** - Gifted Chat (UI library, swap = full rewrite anyway)
- ❌ **Navigation** - Expo Router (framework part)
- ❌ **State** - Zustand (already portable)

**Tüm port detayları:** `docs/Güncel/Architecture_better.md`

## 9. Referans Dokümanlar

**Okuması zorunlu:**
- `docs/Güncel/DEVELOPMENT_GUIDELINES.md` - Yasaklı desenler ve zorunlu standartlar
- `.specify/memory/session-context.md` - Mevcut odak, aktif story, kararlar
- `docs/Güncel/DEVELOPMENT_LOG.md` - Günlük geliştirme ilerlemesi

**Mimari ve teknik:**
- `docs/Güncel/Architecture_better.md` - Mimari kararlar, port detayları
- `docs/Güncel/tech-stack.md` - Teknoloji yığını (Expo SDK 54, React 19.1)
- `docs/Güncel/package-structure.md` - Monorepo yapısı

## 10. Dokümantasyon Güncel Tutma Kuralları

### 10.1 Zorunlu Güncelleme Tetikleyicileri

Aşağıdaki durumlarda dokümantasyon güncellemesi **zorunludur**:

- **Paket Güncellemeleri:** `package.json` değişiklikleri → `tech-stack.md` güncellemesi
- **Mimari Kararlar:** Yeni port ekleme, mimari değişiklik → `DEVELOPMENT_LOG.md` + `Architecture_better.md`
- **Görev Tamamlama:** Her görev tamamlandığında → `tasks.md` + `DEVELOPMENT_LOG.md`
- **Prensip Değişikliği:** Yeni kalite kuralı, yasak desen → `YBIS_PROJE_ANAYASASI.md`

### 10.2 Dokümantasyon Güncelleme Workflow'u

**Kullanılacak Workflow:** `.YBIS_Dev/Veriler/workflows/documentation-maintenance.yaml`

**Adımlar:**
1. **Değişiklik Analizi:** Hangi dokümanların güncellenmesi gerektiğini belirle
2. **Güncelleme Planı:** `documentation-update-plan-tmpl.yaml` kullanarak plan oluştur
3. **Doküman Güncelleme:** Sırasıyla tech-stack.md, DEVELOPMENT_LOG.md, tasks.md güncelle
4. **Tutarlılık Kontrolü:** `documentation-consistency-checklist.md` ile doğrula
5. **İndeks Güncelleme:** DOCUMENTATION_INDEX.md'yi güncel duruma getir

### 10.3 Tutarlılık Standartları

**Paket Versiyonları:**
- Tüm dokümanlarda React 19.1.0 (19.2 değil)
- Expo SDK 54, React Native 0.81.4
- Versiyon bilgileri sadece `tech-stack.md`'de

**Tarih Tutarlılığı:**
- "Last Updated" tarihleri güncel
- DEVELOPMENT_LOG.md girişleri doğru tarihli
- Tüm dokümanlarda tutarlı tarih formatı

**Cross-Reference Tutarlılığı:**
- `constitution.md` → `YBIS_PROJE_ANAYASASI.md`
- `START_HERE.md` → `QUICKSTART.md`
- Tüm relative linkler çalışır durumda

### 10.4 AI Workflow Entegrasyonu

**Bootstrap Prosesi:**
- AI_BASLANGIC_REHBERI.md → 4 katmanlı yükleme
- AI_SYSTEM_GUIDE.md → Agent rolleri ve komutlar
- YBIS_PROJE_ANAYASASI.md → Proje kuralları

**Otomatik Güncelleme:**
- Her görev tamamlandığında dokümantasyon güncelleme workflow'u çalıştır
- Paket güncellemelerinde tech-stack.md otomatik güncelle
- Mimari kararlarda DEVELOPMENT_LOG.md'ye AD-XXX girişi ekle

### 10.5 Kalite Kontrolü

**Her Güncelleme Sonrası:**
- [ ] Paket versiyonları tutarlı
- [ ] Tarihler güncel
- [ ] Cross-referenceler çalışıyor
- [ ] Duplicate bilgi yok
- [ ] Formatting tutarlı

**Haftalık Kontrol:**
- Tüm dokümantasyon health check
- Eksik güncellemeleri tespit et
- Tutarlılık raporu oluştur

## 11. Versiyonlama

**Versiyon:** 3.2.0
**Son Güncelleme:** 2025-10-12
**Değişiklik:** Port kullanım kriterleri netleştirildi (criteria-based, no overengineering)