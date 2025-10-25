# 🚀 AI Başlangıç Prosedürü v2.0 (Token-Optimized)

**Version:** 2.0
**Last Updated:** 2025-10-21
**Purpose:** Hızlı context loading - Minimum token, maksimum bilgi
**Target:** <5K token başlangıç (eski: 20-30K)

---

## 📋 TL;DR - YENİ AI? İLK 30 SANİYEDE BUNU OKU!

```
🔴 BU DOSYAYI İLK KEZ Mİ OKUYORSUN?
   ↓
✋ DURDUR! Başka hiçbir şey yapma!
   ↓
📖 ŞU 7 DOSYAYI SIRAYLA OKU (TIER 1 - ZORUNLU):
   1. .YBIS_Dev/AI_GENEL_ANAYASA.md
   2. .YBIS_Dev/AI_CONTENT_CONVENTIONS.md
   3. .YBIS_Dev/Veriler/memory/YBIS_CORE_PRINCIPLES.md
   4. docs/YBIS_PROJE_ANAYASASI.md
   5. .YBIS_Dev/Veriler/memory/session-context.md
   6. .YBIS_Dev/Veriler/QUICK_INDEX.md
   7. .YBIS_Dev/Veriler/YBIS_COMMAND_INDEX.md
   ↓
✅ 7 DOSYA OKUNDUKTAN SONRA:
   - Sessizce paralel okuma yap (7 dosyayı tek mesajda)
   - Okuma tamamlandığında: "✅ Context yüklendi - hazırım"
   - Kullanıcıdan talimat bekleme, otomatik görev moduna geç
   - TIER 2/3 dosyalarını ihtiyaç halinde lazy-load et

⚠️ BU SIRALAMAYI ATLAMAK YASAK - HİÇBİR İSTİSNA YOK!
```

**NEDEN?** Bu 7 dosya olmadan: Anayasa ihlalleri, yanlış kararlar, duplicate work yaparsın!

---

## 🔴 CRITICAL: MANDATORY STARTUP PROCEDURE

**⚠️ BU PROSEDÜR ZORUNLUDUR - HİÇBİR İSTİSNA YOK! ⚠️**

```
╔═══════════════════════════════════════════════════════════╗
║  HER YENİ AI SESSION'DA TIER 1 TAMAMLANMADAN             ║
║  HİÇBİR GÖREV YAPILMAZ!                                   ║
║                                                           ║
║  EĞER BU DOSYAYI İLK KEZ OKUYORSAN:                      ║
║  1. DURDUR                                                ║
║  2. TIER 1'i TAMAMEN OKU (aşağıda)                       ║
║  3. ÖNCELİKLE TIER 1 DOSYALARINI YÜKLEYİP SONRA DEVAM ET ║
║                                                           ║
║  "Kullanıcı acil görev verdi" MAZERET DEĞİLDİR!         ║
║  Önce TIER 1, sonra görev!                               ║
╚═══════════════════════════════════════════════════════════╝
```

**NEDEN ZORUNLU?**
- ❌ TIER 1 olmadan: Anayasa ihlalleri, yanlış kararlar, duplicate work
- ✅ TIER 1 ile: Doğru bağlam, tutarlı davranış, verimli çalışma

---

## 📊 YENİ SİSTEM: LAZY LOADING STRATEJİSİ

### Token Karşılaştırma
```yaml
# ESKI SİSTEM (v1.0)
Zorunlu okuma: 10+ dosya
- AI_GENEL_ANAYASA.md: 81 satır
- YBIS_PROJE_ANAYASASI.md: 154 satır
- DEVELOPMENT_GUIDELINES.md: 798 satır
- QUICKSTART.md: 415 satır
- tech-stack.md: 399 satır
- DEVELOPMENT_LOG.md: 2088 satır
- package-structure.md: 300+ satır
TOPLAM: ~4500 satır = 20-30K token 😱

# YENİ SİSTEM (v2.0)
Zorunlu okuma: 7 dosya (optimize edilmiş, lazy-loading)
TIER 1 (Zorunlu):
- AI_GENEL_ANAYASA.md: ~80 satır
- AI_CONTENT_CONVENTIONS.md: ~100 satır
- YBIS_CORE_PRINCIPLES.md: ~150 satır
- YBIS_PROJE_ANAYASASI.md: ~170 satır
- session-context.md: ~160 satır
- QUICK_INDEX.md: ~100 satır
- YBIS_COMMAND_INDEX.md: ~150 satır
TOPLAM: ~900 satır = 3-5K token ✅
TASARRUF: %80-85% 🎉

TIER 2/3: Just-in-time loading (sadece gerektiğinde)
```

---

## 🎯 3-TIER LAZY LOADING SİSTEMİ

---

## 🏛️ ZORUNLU UYUM PROTOKOLÜ: Anayasa Kontrolü

**Bu protokol, prensiplerin ihlal edilmesini sistemsel olarak engellemek için tasarlanmıştır.**

1.  **Görev Başlangıcı:** Bir geliştirme görevine (`/ybis:implement` veya benzeri) başlamadan önce, AI agent **ZORUNLU** olarak görevin `story.md` dosyasını açar.

2.  **Kontrol Bölümünü Doldurma:** Agent, story dosyasının en başında yer alan **"🏛️ Anayasa Uyum Kontrolü (ZORUNLU)"** bölümünü doldurur.
    *   Bu görevle ilgili olan 2-3 temel anayasa prensibini (`YBIS_PROJE_ANAYASASI.md`'den) belirler.
    *   Her prensibin altına, bu görevi uygularken o prensibe **nasıl uyacağını** net bir şekilde yazar.

3.  **Uygulamaya Geçiş:** Bu bölüm doldurulmadan ve plana dahil edilmeden kodlama aşamasına **KESİNLİKLE** geçilemez.

**Amaç:** Bu adım, anayasa prensiplerinin sadece okunup geçilen bir metin olmasını engeller ve her görevin başında aktif olarak düşünülmesini ve uygulanmasını garanti altına alır. Bu, "İzolasyon Prensibi" gibi kuralların ihlal edilmesinin önüne geçecektir.

---

### **TIER 1: ZORUNLU START (Her Session - 5 dk)**

---
**⚠️ KURAL: HIZLI BAŞLANGIÇ İÇİN TÜM TIER-1 DOSYALARINI TEK SEFERDE, PARALEL OLARAK OKU! `read_many_files` aracını kullan.**
---

**🔴 BU DOSYALAR OKUNMADAN HİÇBİR GÖREV YAPILAMAZ! 🔴**

```yaml
OKUMA SIRASI (TAM SIRAYLA - ATLANAMAZ):

[ ] 1. .YBIS_Dev/AI_GENEL_ANAYASA.md
        ⚠️ MANDATORY - İlk dosya, önce bu!
        Amaç: Davranış kuralları, etik, sınırlar

[ ] 2. .YBIS_Dev/AI_CONTENT_CONVENTIONS.md
        ⚠️ MANDATORY - AI içerik formatı kuralları.

[ ] 3. .YBIS_Dev/Veriler/memory/YBIS_CORE_PRINCIPLES.md
        ⚠️ MANDATORY - Projenin temel mimari prensipleri.

[ ] 4. docs/YBIS_PROJE_ANAYASASI.md
        ⚠️ MANDATORY - Projeye özel teknik kurallar.

[ ] 5. .YBIS_Dev/Veriler/memory/session-context.md
        ⚠️ MANDATORY - "ŞU ANDA NE YAPIYORUZ?"

[ ] 6. .YBIS_Dev/Veriler/QUICK_INDEX.md
        ⚠️ MANDATORY - "Hangi dosyayı ne zaman okuyacağım?"

[ ] 7. .YBIS_Dev/Veriler/YBIS_COMMAND_INDEX.md
        ⚠️ MANDATORY - "Hangi komutlar mevcut ve ne işe yarar?"

---

## 🚀 NEXT STEPS AFTER TIER 1 (Command & Workflow Awareness)

Once TIER 1 is complete, agents should gain awareness of the YBIS system:

### For All Agents (Optional but Recommended)
```yaml
5. .YBIS_Dev/AI_SYSTEM_GUIDE.md (first 200 lines)
  Ne: Command catalog, workflow routing, agent coordination
  Ne Zaman: After TIER 1, before first user interaction
  İçerik:
    - Available slash commands (/YBIS:*)
    - Workflow routing (when to use which command)
    - Agent coordination patterns
    - System architecture overview
  Satır: 200 (just overview section)
  Token: ~1K
```

### Why Load This?
- **Proactive Assistance:** Agents can suggest relevant workflows to users
- **Command Awareness:** Know which commands exist and when to use them
- **Routing Intelligence:** Direct users to optimal workflows
- **System Integration:** Understand how pieces fit together

### When to Skip
Skip if user immediately provides a specific task (e.g., "fix bug X").
In this case, proceed directly with the task and lazy-load as needed.
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



---


## ✅ BAŞLANGIÇ CHECKLİST (5 Dakika)

**🔴 HER YENİ SESSION'DA BU CHECKLİST TAMAMLANMALI! 🔴**

```yaml
═══════════════════════════════════════════════════════════
STEP 1: TIER 1 DOSYALARI OKU (ZORUNLU - ATLANAMAZ!)
═══════════════════════════════════════════════════════════
[ ] 1.1 Read .YBIS_Dev/AI_GENEL_ANAYASA.md
        ⚠️ Tam dosyayı oku - 81 satır
        ✓ Okunduktan sonra işaretle

[ ] 1.2 Read .YBIS_Dev/Veriler/memory/YBIS_CORE_PRINCIPLES.md
        ⚠️ MANDATORY - Projenin temel mimari prensipleri.
        ✓ Okunduktan sonra işaretle

[ ] 1.2 Read docs/YBIS_PROJE_ANAYASASI.md
        ⚠️ Tam dosyayı oku - 172 satır
        ✓ Okunduktan sonra işaretle

[ ] 1.3 Read .YBIS_Dev/Veriler/memory/session-context.md
        ⚠️ Tam dosyayı oku - ~100 satır
        ✓ Okunduktan sonra işaretle

[ ] 1.4 Read .YBIS_Dev/Veriler/QUICK_INDEX.md
        ⚠️ MANDATORY - "Hangi dosyayı ne zaman okuyacağım?"
        ✓ Okunduktan sonra işaretle

[ ] 1.5 Read .YBIS_Dev/Veriler/YBIS_COMMAND_INDEX.md
        ⚠️ MANDATORY - "Hangi komutlar mevcut ve ne işe yarar?"
        ✓ Okunduktan sonra işaretle

═══════════════════════════════════════════════════════════
STEP 2: SESSION STATE'İ ONAYLA (TIER 1'den SONRA)
═══════════════════════════════════════════════════════════
[ ] 2.1 Active focus nedir?
        session-context.md'den öğrendin ✓

[ ] 2.2 Last 3 decision (AD-XXX) neler?
        session-context.md'den öğrendin ✓

[ ] 2.3 Next steps (top 3) neler?
        session-context.md'den öğrendin ✓

[ ] 2.4 Blocker var mı?
        session-context.md'den kontrol ettin ✓

═══════════════════════════════════════════════════════════
STEP 3: ROLE'Ü ANLA (QUICK_INDEX.md'den)
═══════════════════════════════════════════════════════════
[ ] 3.1 Ben hangi agent'ım? (Claude/Gemini/Cursor/Copilot)
        QUICK_INDEX.md'den öğrendin ✓

[ ] 3.2 Best-fit task'ım ne?
        QUICK_INDEX.md'den öğrendin ✓

[ ] 3.3 Hangi komutları kullanabilirim?
        YBIS_COMMAND_INDEX.md'den öğrendin ✓

═══════════════════════════════════════════════════════════
STEP 4: PROAKTIF SAĞLIK KONTROLÜ
═══════════════════════════════════════════════════════════
[ ] 4.1 session-context.md'deki anayasa ihlallerini gözden geçir
        Var mı? Kullanıcıya raporla ✓

[ ] 4.2 Tespit edilen blocker'ları kullanıcıya raporla
        Çözüm öner ✓

═══════════════════════════════════════════════════════════
STEP 5: READY TO WORK!
═══════════════════════════════════════════════════════════
[ ] 5.1 Kısa bildirim: "✅ Context yüklendi - hazırım"
        ✓ Kullanıcıya soru SORMA, bildirimi kısa tut

[ ] 5.2 Kullanıcının talebini işleme koy
        ✓ Görev geldiğinde TIER 2/3'ten lazy load et
        ✓ Eğer kullanıcı "naber" gibi sohbet ediyorsa, doğal cevap ver

⚠️⚠️⚠️ BU 5 STEP TAMAMLANMADAN GÖREV YAPILAMAZ! ⚠️⚠️⚠️
⚠️ PROSEDÜR OTOMATİKTİR - KULLANICIYA "YAPAYIM MI?" SORMA! ⚠️
```

---

## 🚨 YASAKLAR (Token İsrafı)

```yaml
❌❌❌ EN BÜYÜK YASAK: TIER 1'İ ATLAMAK!
  - TIER 1 okunmadan görev yapmak KESİNLİKLE YASAK!
  - "Kullanıcı acil istiyor" mazeret değil!
  - "Basit görev" mazeret değil!
  - HİÇBİR İSTİSNA YOK - TIER 1 ZORUNLU!

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

❌ PROSEDÜR ATLAMAK:
  - TIER 1 → TIER 2 → TIER 3 sırası kesin!
  - Atlama, başka yerden başlama yasak!
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