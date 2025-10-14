# Epic: Tier 1 Port Architecture Implementation

**ID:** 1
**Status:** To Do
**Owner:** @architect

## 1. Epic Goal

Bu epic'in amacı, YBIS projesinin Kapalı Beta feyzi için gerekli olan temel servis entegrasyonlarının temelini atmaktır. "Port ve Adaptör" mimari desenini kullanarak, kimlik doğrulama, veritabanı, yapay zeka ve dosya depolama işlemleri için dış servislerden bağımsız, soyut arayüzler (Port'lar) ve bu arayüzlerin ilk somut uygulamalarını (Adaptör'ler) oluşturmaktır. Bu, "zero vendor lock-in" (sıfır tedarikçi bağımlılığı) prensibini hayata geçirecektir.

## 2. Scope (Kapsam)

Bu epic, SADECE `service-integration-strategy.md` dokümanında tanımlanan Tier 1 portlarını kapsar:

- **AuthPort** & `ExpoAuthAdapter` (Google OAuth ile)
- **DatabasePort** & `SupabaseAdapter` (PostgreSQL için)
- **LLMPort** & `OpenAIAdapter` (GPT-4o-mini modeli ile)
- **StoragePort** & `SupabaseStorageAdapter` (Dosya depolama için)

## 3. Risk Analysis

- **Risk 1 (Yüksek):** Port arayüzlerinin yanlış veya eksik tasarlanması, gelecekte büyük refactoring maliyetleri doğurabilir.
  - **Azaltma:** Arayüzler, sadece Kapalı Beta'nın mevcut ihtiyaçlarına odaklanarak, gelecekteki spekülatif özellikler eklenmeden minimalist bir şekilde tasarlanacaktır.
- **Risk 2 (Orta):** Adaptörlerin, kullandıkları SDK'ya özel detayları dışarı sızdırması, "zero vendor lock-in" prensibini ihlal edebilir.
  - **Azaltma:** Kod gözden geçirmelerinde (code review), adaptörlerin port arayüzüne tam olarak uyduğu ve dışarıya hiçbir SDK-spesifik tip veya hata sızdırmadığı katı bir şekilde kontrol edilecektir.
- **Risk 3 (Orta):** Asenkron servislerin hata yönetimi karmaşıklık yaratabilir.
  - **Azaltma:** Tüm port metotları `Promise` dönecek ve standartlaştırılmış bir `IntegrationError` formatı kullanacaktır.

---

## 4. User Stories

### Story 1.1: AuthPort ve ExpoAuthAdapter Oluşturulması

- **User Story:** Bir geliştirici olarak, mobil uygulamanın Expo kütüphanelerine sıkı sıkıya bağlanmadan Google OAuth ile kimlik doğrulaması yapabilmesi için temiz bir `AuthPort` arayüzü ve bir `ExpoAuthAdapter` implementasyonu istiyorum.
- **Acceptance Criteria:**
  - [ ] `AuthPort` arayüzü, `@ybis/core` paketi içinde `signIn`, `signOut`, `getUser` gibi metotlarla tanımlanmalıdır.
  - [ ] `ExpoAuthAdapter`, `AuthPort` arayüzünü uygulayan bir sınıf olarak yeni bir `@ybis/adapter-expo-auth` paketi içinde oluşturulmalıdır.
  - [ ] Adaptör, `expo-auth-session` kullanarak tam Google OAuth akışını (PKCE ile) yönetmelidir.
  - [ ] Başarılı kimlik doğrulama, standart bir kullanıcı profili ve token nesnesi döndürmelidir.
  - [ ] Alınan token'ların Hono backend üzerinde doğrulanması için bir entegrasyon yolu düşünülmelidir.
- **Technical Notes:**
  - Token'lar `expo-secure-store` kullanılarak güvenli bir şekilde saklanmalıdır.
  - Arayüz, Expo'ya özel tüm detayları (örn: `AuthRequest`, `DiscoveryDocument`) soyutlamalıdır.

### Story 1.2: DatabasePort ve SupabaseAdapter Oluşturulması

- **User Story:** Bir geliştirici olarak, uygulamanın temel CRUD (Oluştur, Oku, Güncelle, Sil) işlemleri için genel bir `DatabasePort` ve bir `SupabaseAdapter` istiyorum, böylece uygulama doğrudan Supabase client'ına bağımlı kalmaz.
- **Acceptance Criteria:**
  - [ ] `DatabasePort` arayüzü, `@ybis/core` içinde `getById<T>(id: string)`, `create<T>(data: T)`, `update<T>(id: string, data: Partial<T>)`, `delete(id: string)` gibi jenerik metotlarla tanımlanmalıdır.
  - [ ] `SupabaseAdapter`, `DatabasePort` arayüzünü uygulayan bir sınıf olarak yeni bir `@ybis/adapter-supabase` paketi içinde oluşturulmalıdır.
  - [ ] Adaptör, PostgreSQL işlemleri için Supabase client'ını kullanmalıdır.
  - [ ] Tüm metotlar, Supabase'in RLS (Row Level Security) politikalarını doğru şekilde ele almalıdır.
- **Technical Notes:**
  - Arayüz, gelecekte farklı bir veritabanı sağlayıcısına (örn: Firebase Firestore) geçişi kolaylaştıracak kadar genel olmalıdır.
  - Hata yönetimi, Supabase'e özel hataları genel bir `DatabaseError` türüne dönüştürmelidir.

### Story 1.3: LLMPort ve OpenAIAdapter Oluşturulması

- **User Story:** Bir geliştirici olarak, üretken yapay zeka isteklerini yönetmek için bir `LLMPort` ve uygulamanın OpenAI SDK'sına bağımlı kalmadan GPT-4o-mini modelini kullanabilmesi için bir `OpenAIAdapter` istiyorum.
- **Acceptance Criteria:**
  - [ ] `LLMPort` arayüzü, `@ybis/core` içinde `generate(prompt: string)` gibi basit bir metotla tanımlanmalıdır.
  - [ ] `OpenAIAdapter`, `LLMPort` arayüzünü uygulayan bir sınıf olarak yeni bir `@ybis/adapter-openai` paketi içinde oluşturulmalıdır.
  - [ ] Adaptör, `gpt-4o-mini` modelini kullanarak OpenAI API'sine çağrılar yapmalıdır.
- **Technical Notes:**
  - Arayüz, modele özgü parametreleri (temperature, max_tokens vb.) soyutlamalı, ancak opsiyonel bir `options` nesnesi ile geçirilmesine izin vermelidir.
  - Adaptör, API anahtarını güvenli bir şekilde yönetmelidir (asla istemci tarafında olmamalıdır).

### Story 1.4: StoragePort ve SupabaseStorageAdapter Oluşturulması

- **User Story:** Bir geliştirici olarak, dosya yükleme/indirme işlemleri için bir `StoragePort` ve uygulamanın Supabase Storage'a bağımlı kalmadan kullanıcı dosyalarını yönetebilmesi için bir `SupabaseStorageAdapter` istiyorum.
- **Acceptance Criteria:**
  - [ ] `StoragePort` arayüzü, `@ybis/core` içinde `upload(file: File, path: string)` ve `getPublicUrl(path: string)` gibi metotlarla tanımlanmalıdır.
  - [ ] `SupabaseStorageAdapter`, `StoragePort` arayayüzünü uygulayan bir sınıf olarak `@ybis/adapter-supabase` paketi içinde oluşturulmalıdır.
  - [ ] Adaptör, dosyaları belirli bir "bucket"a yüklemeli ve herkese açık URL'lerini alabilmelidir.
- **Technical Notes:**
  - Arayüz, dosya verisini genel bir `Buffer` veya `Blob` olarak ele almalıdır.
  - Erişim kontrolleri (public/private) port seviyesinde tanımlanmalıdır.

### Story 1.5: Test Stratejisi ve Backend Entegrasyonu

- **User Story:** Bir geliştirici olarak, tüm Tier 1 portlarının güvenilirliğini ve Hono backend ile entegrasyonunu garanti altına almak için net bir test stratejisi ve entegrasyon planı istiyorum.
- **Acceptance Criteria:**
  - [ ] Projenin ana dokümantasyonuna bir `TESTING_STRATEGY.md` belgesi eklenmelidir.
  - [ ] Her adaptör için, temel alınan SDK'yı taklit eden (mocking) birim testleri (unit tests) yazılması zorunludur.
  - [ ] Her adaptörün canlı servisle (Supabase, OpenAI) çalıştığını doğrulayan entegrasyon testleri yazılmalıdır.
  - [ ] Hono backend, adaptörleri güvenli bir şekilde kullanmak için API katmanları içermelidir (örn: `/api/llm/generate` endpoint'i `LLMPort`'u kullanır).
- **Technical Notes:**
  - Testler için `vitest` kullanılacaktır.
  - Entegrasyon testleri, API anahtarları için ortam değişkenleri (`.env`) gerektirecektir ve CI/CD pipeline'ında dikkatli yönetilmelidir.
