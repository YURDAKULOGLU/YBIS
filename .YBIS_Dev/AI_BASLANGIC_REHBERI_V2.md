# 🚀 AI Başlangıç Prosedürü v2.0 (Token-Optimized)

**Version:** 2.0  
**Last Updated:** 2025-10-12  
**Purpose:** Hızlı context loading - Minimum token, maksimum bilgi  
**Target:** <5K token başlangıç (eski: 20-30K)

---

## 📊 YENİ SİSTEM: LAZY LOADING STRATEJİSİ

### Token Karşılaştırma
```yaml
# ESKI SİSTEM (v1.0)
Zorunlu okuma: 7 dosya
- AI_GENEL_ANAYASA.md: 81 satır
- YBIS_PROJE_ANAYASASI.md: 154 satır
- DEVELOPMENT_GUIDELINES.md: 798 satır
- QUICKSTART.md: 415 satır
- tech-stack.md: 399 satır
- DEVELOPMENT_LOG.md: 2088 satır
- package-structure.md: 300+ satır
TOPLAM: ~4500 satır = 20-30K token 😱

# YENİ SİSTEM (v2.0)
Zorunlu okuma: 4 dosya (optimize edilmiş)
- AI_GENEL_ANAYASA.md: 81 satır
- YBIS_PROJE_ANAYASASI.md: 150 satır (sadece özet)
- session-context.md: 100 satır
- QUICK_INDEX.md: 50 satır
TOPLAM: ~400 satır = 3-5K token ✅
TASARRUF: %80-85% 🎉
```

---

## 🎯 3-TIER LAZY LOADING SİSTEMİ

### **TIER 1: ZORUNLU START (Her Session - 5 dk)**

```yaml
Okuma Sırası (sırayla):
  1. .YBIS_Dev/AI_GENEL_ANAYASA.md
     Amaç: Davranış kuralları, etik, sınırlar
     Satır: 81
     Token: ~400

  2. docs/YBIS_PROJE_ANAYASASI.md
     Amaç: Port katalogu, zero-tolerance, forbidden patterns
     Satır: 154 (sadece ilk 80 satır okunacak - port listesi)
     Token: ~400

  3. .YBIS_Dev/Veriler/memory/session-context.md
     Amaç: "ŞU ANDA NE YAPIYORUZ?"
     Satır: 100
     Token: ~500
     İçerik:
       - Active focus (Week X, Task Y)
       - Last 3 decisions (AD-XXX)
       - Next steps (top 3)
       - Blockers

  4. .YBIS_Dev/Veriler/QUICK_INDEX.md
     Amaç: "Hangi dosyayı ne zaman okuyacağım?"
     Satır: 50
     Token: ~250

TOPLAM TIER 1: ~1550 token (hedef: <2K)
SÜRESİ: 3-5 dakika
SONUÇ: Agent görevine başlayabilir!
```

---

### **TIER 2: İHTİYAÇ HALİNDE (Just-in-Time Load)**

**⚠️ Sadece gerektiğinde oku! Token tasarrufu!**

```yaml
# CODING BAŞLARKEN
IF task.type == "implementation":
  READ: docs/Güncel/DEVELOPMENT_GUIDELINES.md
  Amaç: Zero-tolerance rules, forbidden patterns
  Satır: 798
  Token: ~4K

IF task.type == "dependency_install":
  READ: docs/Güncel/tech-stack.md
  Amaç: Locked versions, constraints
  Satır: 399
  Token: ~2K

IF task.type == "package_creation":
  READ: docs/Güncel/package-structure.md
  Amaç: Monorepo rules, exports
  Satır: 300+
  Token: ~1.5K

# ARAŞTIRMA YAPARKEN
IF need.history == "architecture_decision":
  SEARCH: docs/Güncel/DEVELOPMENT_LOG.md for "AD-XXX"
  Method: grep veya codebase_search
  Sadece ilgili AD-XXX'i oku (20-30 satır)

IF need.context == "project_setup":
  READ: docs/QUICKSTART.md
  Amaç: Environment, commands
  Satır: 415
  Token: ~2K

# PLANLAMA İÇİN
IF task.type == "planning" OR "strategy":
  READ: docs/vision/PROJECT_VISION.md
  READ: docs/roadmap/PRODUCT_ROADMAP.md
  Token: ~3K toplam
```

---

### **TIER 3: KOMUT TEKLİ (Command-Triggered Load)**

**⚠️ Slash komut geldiğinde o dosyayı oku!**

```yaml
# Slash Komut → Dosya Mapping
/YBIS:implement:
  READ: docs/Güncel/tasks.md (only relevant task)
  READ: docs/stories/1.X.story-name.md (if story ref)

/YBIS:review-story:
  READ: docs/stories/*.md (specified story only)
  READ: .YBIS_Dev/Veriler/checklists/story-dod-checklist.md

/YBIS:deep-review:
  READ: docs/Güncel/Architecture_better.md
  READ: docs/prd/PRODUCT_REQUIREMENTS.md

/YBIS:session-start:
  Already loaded in TIER 1! ✅
  Just confirm environment

/YBIS:ad-create:
  READ: docs/Güncel/DEVELOPMENT_LOG.md (last AD number)
  UPDATE: DEVELOPMENT_LOG.md + session-context.md

/YBIS:quality-check:
  READ: docs/Güncel/quality-standards.md
  RUN: linting, type-check
```

---

## 🔄 DUAL-WRITE RULE (MANDATORY)

### Session Context ↔ Development Log Sync

**⚠️ HER session-context.md UPDATE'İNDE:**

```yaml
Step 1: Update session-context.md
  - Active focus
  - Recent decisions (AD-XXX)
  - Next steps
  - Max 100 lines!

Step 2: Simultaneously update DEVELOPMENT_LOG.md
  - Add Day X entry
  - Tasks completed
  - Architecture Decision (if AD-XXX created)
  - Issues/blockers

Step 3: Verify sync
  - AD-XXX numbers match
  - Dates match
  - No duplicate info (context = summary, log = detail)
```

**Format Örnek:**

```markdown
# session-context.md (100 lines)
## Recent Decisions (Last 3)
### AD-021: Navigation Widget Design Finalized
- Date: 2025-10-13
- Decision: Minimalist cards with tap-to-detail
- Details: See DEVELOPMENT_LOG.md#AD-021

---

# DEVELOPMENT_LOG.md (simultaneously)
### Day 6 - 2025-10-13

**Tasks Completed:**
- [x] T025: Widget component implementation
- [x] T026: Navigation logic

**Architecture Decisions:**
### AD-021: Navigation Widget Design Finalized
- **Date:** 2025-10-13
- **Context:** Main screen needs minimal yet functional widgets
- **Decision:** 
  - Card-based design with priority/time/progress indicators
  - Tap on widget → Task detail screen
  - Swipe actions for quick updates
- **Rationale:** Balances minimalism with functionality
- **Impact:** Mobile UX, Widget component API
- **Related:** AD-019 (widget-based navigation strategy)
```

---

## 📚 QUICK REFERENCE: DOCUMENTATION TIERS

### Tier -1: Strategic (Sadece planlama için)
```
docs/vision/PROJECT_VISION.md
docs/roadmap/PRODUCT_ROADMAP.md
docs/strategy/MARKET_RESEARCH.md
docs/strategy/COMPETITIVE_STRATEGY.md
```

### Tier 0: Canonical (Sadece AD-XXX araştırması için)
```
docs/Güncel/DEVELOPMENT_LOG.md (search AD-XXX)
docs/YBIS_PROJE_ANAYASASI.md (port katalogu - ilk 80 satır yeter)
```

### Tier 1: Reference (Sadece implementation için)
```
docs/Güncel/DEVELOPMENT_GUIDELINES.md (coding başlarken)
docs/Güncel/tech-stack.md (dependency eklerken)
docs/Güncel/package-structure.md (paket oluştururken)
docs/Güncel/quality-standards.md (quality check için)
```

### Tier 2: Execution (Sadece komut gelince)
```
docs/Güncel/tasks.md (/YBIS:implement gelince)
docs/stories/*.md (/YBIS:review-story gelince)
```

---

## ✅ BAŞLANGIÇ CHECKLİST (5 Dakika)

```yaml
[ ] 1. TIER 1 oku (4 dosya, <2K token)
    [ ] AI_GENEL_ANAYASA.md
    [ ] YBIS_PROJE_ANAYASASI.md (ilk 80 satır)
    [ ] session-context.md
    [ ] QUICK_INDEX.md

[ ] 2. SESSION STATE'i onayla
    [ ] Active focus nedir?
    [ ] Last 3 decision (AD-XXX)
    [ ] Next steps (top 3)
    [ ] Blocker var mı?

[ ] 3. ROLE'ü anla (QUICK_INDEX.md'den)
    [ ] Ben hangi agent'ım? (Claude/Gemini/Cursor/Copilot)
    [ ] Best-fit task'ım ne?
    [ ] Hangi komutları kullanabilirim?

[ ] 4. READY!
    [ ] User'dan talimat bekle
    [ ] Gerekli dosyaları TIER 2/3'ten lazy load et
    [ ] DUAL-WRITE kuralını uygula
```

---

## 🚨 YASAKLAR (Token İsrafı)

```yaml
❌ ASLA HEPSİNİ OKUMA:
  - DEVELOPMENT_LOG.md'nin tamamını okuma (2088 satır!)
  - Sadece ilgili AD-XXX'i grep/search et

❌ GEREKMEDİKÇE OKUMA:
  - Strategic docs (vision, roadmap) sadece planlama için
  - Legacy docs (Archive/) hiç okuma!

❌ DUPLICATE OKUMA:
  - session-context.md zaten özet veriyor
  - Detail'e ihtiyaç yoksa DEVELOPMENT_LOG'a gitme

❌ EARLY OKUMA:
  - Implementation başlamadıysa DEVELOPMENT_GUIDELINES okuma
  - Komut gelmeden task.md okuma
```

---

## 🎯 BAŞARI KRİTERLERİ

### Token Efficiency
- ✅ Başlangıç: <5K token (hedef: 3-5K)
- ✅ Tier 2 lazy load: Sadece gerekli dosyalar
- ✅ Tier 3 command load: Komut tetikli

### Session Continuity
- ✅ session-context.md her zaman güncel
- ✅ DUAL-WRITE uygulanıyor
- ✅ Next agent sorunsuz devralıyor

### Quality
- ✅ Zero-tolerance rules biliniyor (TIER 1'de)
- ✅ Port katalogu biliniyor (ilk 80 satır)
- ✅ Current focus belli (session-context)

---

**Version History:**
- v1.0: 7 dosya zorunlu, 20-30K token (deprecated)
- v2.0: 4 dosya + lazy loading, 3-5K token ✅

**Maintained By:** YBIS AI System  
**Update Trigger:** Documentation taxonomy değişirse

