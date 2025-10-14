# TASK-20251009-tier1-ports
**From:** Claude Code
**To:** Gemini
**Type:** Epic + Story Creation
**Priority:** HIGH (Blocking)
**Created:** 2025-10-09 14:45
**Status:** PENDING

---

## Context

YBIS projesinde Closed Beta için **Tier 1 Port Architecture** implementasyonu yapıyoruz.

Claude Code şu an portları kod olarak yazmaya başladı ama **önce senin derin analizin ve epic/story oluşturman gerekiyor** (AI Görev Dağılımı prensibine göre).

---

## Request

**Ana Görev:** Tier 1 Port Architecture için Epic + Story breakdown oluştur

### Adımlar:

1. **`/YBIS:full-context`** komutunu çalıştır - Tüm proje mimarisini yükle

2. **Analiz edilecek dökümanlar:**
   - `docs/Güncel/Architecture_better.md` (Port mimarisi detayları)
   - `docs/Güncel/service-integration-strategy.md` (Tier 1 portlar: satır 507-514)
   - `docs/product-roadmap/closed-beta-scope.md` (Closed Beta kapsamı)
   - `docs/Güncel/tech-stack.md` (Teknoloji stack)

3. **`/YBIS:brownfield-create-epic`** komutunu çalıştır
   - Epic adı: "Tier 1 Port Architecture Implementation (Closed Beta)"

---

## Epic Kapsamı (Tier 1 Portlar)

### 1. AuthPort
- Interface: `packages/auth/src/ports/AuthPort.ts`
- Adapter: `ExpoAuthAdapter.ts` (Expo Auth Session + Google OAuth)
- Özellik: OAuth 2.0, token refresh, session management

### 2. DatabasePort
- Interface: `packages/database/src/ports/DatabasePort.ts`
- Adapter: `SupabaseAdapter.ts` (Supabase PostgreSQL)
- Özellik: CRUD, real-time subscriptions, transactions

### 3. LLMPort
- Interface: `packages/llm/src/ports/LLMPort.ts`
- Adapter: `OpenAIAdapter.ts` (GPT-4o-mini)
- Özellik: Chat completion, function calling, streaming

### 4. StoragePort
- Interface: `packages/storage/src/ports/StoragePort.ts`
- Adapter: `SupabaseStorageAdapter.ts` (Supabase Storage)
- Özellik: File upload/download, public/private buckets

---

## Story Breakdown İhtiyacı

Her port için ayrı story + backend entegrasyon story:

**Story 1:** AuthPort + ExpoAuthAdapter
**Story 2:** DatabasePort + SupabaseAdapter
**Story 3:** LLMPort + OpenAIAdapter
**Story 4:** StoragePort + SupabaseStorageAdapter
**Story 5:** Backend (Hono) Port Entegrasyonu

---

## Expected Output

### 1. Epic Belgesi
- Dosya: `docs/AI/shared/epics/tier1-ports-epic.md`
- Format: BMad Epic Template
- İçerik:
  - Epic overview
  - Business value
  - Technical scope
  - Dependencies
  - Success criteria
  - Risk analizi

### 2. User Stories (5 adet)
- Dosya: `docs/AI/shared/stories/1.3.auth-port.md`
- Dosya: `docs/AI/shared/stories/1.4.database-port.md`
- Dosya: `docs/AI/shared/stories/1.5.llm-port.md`
- Dosya: `docs/AI/shared/stories/1.6.storage-port.md`
- Dosya: `docs/AI/shared/stories/1.7.backend-port-integration.md`
- Format: BMad Story Template
- Her story için:
  - Acceptance criteria
  - Technical notes
  - File list (hangi dosyalar oluşturulacak)
  - Test strategy

### 3. Response Belgesi
- Dosya: `docs/AI/gemini/outgoing/RESPONSE-TASK-20251009-tier1-ports.md`
- İçerik:
  - Analiz özeti
  - Önemli kararlar
  - Riskler
  - Claude Code için next steps

---

## Important Notes

### Mimari Prensipler:
- ✅ Port pattern: Interface (packages/) + Adapter (implementations)
- ✅ Zero vendor lock-in (kolay değiştirilebilir)
- ✅ Backend (Hono) ile entegrasyon
- ✅ TypeScript strict mode
- ❌ Direct vendor imports yasak (her şey port üzerinden)

### Closed Beta Odak:
- SADECE Tier 1 portlar (Tier 2 Open Beta'da)
- Google OAuth ONLY (GitHub/Apple deferred)
- Supabase ONLY (Cloud SQL MVP'de)
- OpenAI ONLY (Anthropic multi-provider MVP'de)

---

## References

- **AI Görev Dağılımı:** `docs/AI_Asistan_Gorev_Dagilimi.md`
- **Port Strategy:** `docs/Güncel/service-integration-strategy.md`
- **Architecture:** `docs/Güncel/Architecture_better.md`
- **Tech Stack:** `docs/Güncel/tech-stack.md`
- **Story Templates:** `.YBIS_Dev/Veriler/templates/story-tmpl.yaml`

---

## Blocking Status

⚠️ **Claude Code şu anda beklemede!**

DatabasePort interface'i yarıda kaldı. Senin epic + story'lerin olmadan devam etmemeli.

**Tahmini süre:** 1-2 saat (senin için)

---

## Next Actions (Senden sonra)

1. ✅ Gemini: Epic + Stories oluştur
2. ⏳ Claude Code: Stories'e göre portları implement et
3. ⏳ Claude Code: Backend entegrasyonu
4. ⏳ Claude Code: Tests yaz
5. ⏳ Gemini: Full review (implementation sonrası)

---

**Status:** PENDING
**Beklenen Tamamlanma:** 2025-10-09 EOD
**Priority Nedeni:** Backend development blocked
