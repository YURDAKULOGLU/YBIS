# 📚 QUICK INDEX - Hangi Dosya Ne Zaman?

**Version:** 1.0  
**Last Updated:** 2025-10-12  
**Purpose:** Token-optimized documentation roadmap  
**Rule:** Gerekmedikçe OKUMA! Sadece referans ver!

---

## ⚙️ TIER 0: DOKÜMANTASYON YÖNETİMİ (Command-Triggered)

```yaml
1. .YBIS_Dev/Veriler/commands/add-summary-header.md
   Ne: Markdown dosyalarına token-verimli özet başlığı ekler.
   Ne Zaman: Yeni doküman oluştururken veya mevcut dokümanları optimize ederken.
   İçerik: Başlık, durum, sahip, tarih, özet, ana çıkarımlar.
   Oku: /YBIS:add-summary-header komutu ile tetiklenir.
```

---

---

## 🔧 TIER 2A: CODING BAŞLARKEN (Just-in-Time)

```yaml
5. docs/Güncel/DEVELOPMENT_GUIDELINES.md
   Ne: Zero-tolerance rules, forbidden patterns
   Ne Zaman: Implementation task geldiğinde
   İçerik:
     - ❌ any, @ts-ignore, skipLibCheck
     - ❌ Tamagui shorthands (bg, px, py...)
     - ✅ Explicit return types
     - ✅ AuthPort interface compliance
   Satır: 798
   Oku: Sadece coding yapacaksan

6. docs/Güncel/tech-stack.md
   Ne: Locked versions, constraints
   Ne Zaman: Dependency eklerken, version check
   İçerik:
     - React 19.1.0 (locked)
     - Expo SDK 54
     - Node 20.x
     - All package versions
   Satır: 399
   Oku: npm install yapmadan önce

7. docs/Güncel/package-structure.md
   Ne: Monorepo rules, package exports
   Ne Zaman: Yeni paket oluştururken
   İçerik:
     - tsconfig.json composite: true
     - src/index.ts exports
     - package.json structure
   Satır: 300+
   Oku: Paket oluşturmadan önce

8. docs/Güncel/quality-standards.md
   Ne: Code quality gates, testing rules
   Ne Zaman: Quality check, PR review
   İçerik:
     - ESLint strict rules
     - Type coverage requirements
     - Testing strategy
   Satır: 1292
   Oku: /YBIS:quality-check komutunda
```

---

## 🔧 TIER 2B: ARAŞTIRMA (Search-Based)

```yaml
9. docs/Güncel/DEVELOPMENT_LOG.md
   Ne: Architecture decisions (AD-XXX), history
   Ne Zaman: AD-XXX araştırması gerektiğinde
   Method: grep "AD-018" veya codebase_search
   İçerik:
     - AD-001 → AD-020 (current)
     - Week 1, Day 1 → Day 5 (progress)
   Satır: 2088
   Oku: ASLA TAMAMI! Sadece ilgili AD search et

10. docs/QUICKSTART.md
    Ne: Environment setup, commands
    Ne Zaman: Setup sorunu, yeni environment
    İçerik:
      - Prerequisites
      - Installation steps
      - Common issues
    Satır: 415
    Oku: Setup/environment sorununda

11. docs/Güncel/INTEGRATION_ROADMAP.md
    Ne: Service integration phases
    Ne Zaman: External service entegre ederken
    İçerik:
      - Phase 1: Expo Auth
      - Phase 2: Supabase
      - Phase 3-6: Timeline
    Satır: 359
    Oku: Integration task başlarken

12. docs/Güncel/service-integration-strategy.md
    Ne: Port-based integration patterns
    Ne Zaman: Yeni adapter yazarken
    İçerik:
      - Adapter patterns
      - Port implementations
      - Migration strategy
    Satır: 953
    Oku: Adapter oluşturmadan önce
```

---

## 📋 TIER 3: KOMUT TEKLİ (Command-Triggered)

```yaml
13. docs/Güncel/tasks.md
    Ne: 6-week development plan, task details
    Ne Zaman: /YBIS:implement komutu gelince
    İçerik:
      - T001-T180 task list
      - Dependencies, blockers
    Satır: ~500
    Oku: /YBIS:implement T032 → Sadece T032'yi oku

14. docs/stories/*.md
    Ne: User story details, acceptance criteria
    Ne Zaman: /YBIS:review-story komutu
    İçerik:
      - Story scope
      - Dev agent checklist
      - DoD criteria
    Oku: Komutta belirtilen story'yi

15. .YBIS_Dev/Veriler/checklists/story-dod-checklist.md
    Ne: Definition of Done checklist
    Ne Zaman: Story complete, /YBIS:review-story
    Oku: Story tamamlanmadan önce

16. docs/TESTING_STRATEGY.md
    Ne: Test requirements, port testing
    Ne Zaman: Test yazarken, coverage check
    İçerik:
      - Unit test patterns
      - Port test requirements
      - Coverage minimums
    Satır: 391
    Oku: Test task başlarken
```

---

## 🎯 TIER -1: STRATEJİK (Sadece Planlama)

```yaml
17. docs/vision/PROJECT_VISION.md
    Ne: Mission, vision, strategy
    Ne Zaman: Planlama, roadmap discussion
    İçerik:
      - Product vision
      - Port architecture purpose
      - Growth strategy
    Satır: ~400
    Oku: Strategic planning session

18. docs/roadmap/PRODUCT_ROADMAP.md
    Ne: Phases, timeline, milestones
    Ne Zaman: Phase planning, scope discussion
    İçerik:
      - Closed Beta → Open Beta → MVP
      - LLM provider evolution
      - Plugin system timeline
    Satır: ~500
    Oku: Roadmap alignment gerektiğinde

19. docs/strategy/MARKET_RESEARCH.md
    Ne: Market analysis, competitors
    Ne Zaman: Feature prioritization, positioning
    Oku: Product decision tartışması

20. docs/strategy/COMPETITIVE_STRATEGY.md
    Ne: Competitive positioning, moats
    Ne Zaman: Differentiation discussion
    Oku: Strategy session
```

---

## 🗺️ TIER META: DOCUMENTATION ARCHITECTURE

```yaml
21. .YBIS_Dev/Veriler/documentation-taxonomy.md
    Ne: 5-Tier doc system açıklaması
    Ne Zaman: Yeni doküman oluştururken
    İçerik:
      - Tier -1 → Tier 4 hierarchy
      - Update cascade rules
    Satır: 885
    Oku: Documentation structure sorusu

22. .YBIS_Dev/Veriler/documentation-map.yaml
    Ne: Machine-readable doc registry
    Ne Zaman: Cross-reference check, dependency
    İçerik:
      - File paths
      - Dependencies
      - Update rules
    Oku: Automated tooling için
```

---

## 🤖 AGENT-SPECIFIC GUIDES

```yaml
23. docs/AI_Asistan_Gorev_Dagilimi.md
    Ne: Agent strengths, optimal distribution
    Ne Zaman: İlk session (agent role understanding)
    İçerik:
      - Claude: Architecture, planning
      - Gemini: Research, analysis
      - Cursor/Copilot: Implementation
    Satır: 431
    Oku: Agent başlarken (ilk 100 satır yeter)

24. CLAUDE.md
    Ne: Claude Code specific guide
    Ne Zaman: Claude agent başlarken
    Oku: Sadece Claude isen

25. GEMINI.md
    Ne: Gemini specific context
    Ne Zaman: Gemini agent başlarken
    Oku: Sadece Gemini isen

26. CODEX.md
    Ne: Codex specific guide
    Ne Zaman: Codex agent başlarken
    Oku: Sadece Codex isen

27. AGENTS.md
    Ne: Tüm agentlar için repository rules
    Ne Zaman: Her agent ilk session
    Satır: ~100
    Oku: İlk kez projeye başlarken
```

---

## 📂 DİĞER ÖZEL DOSYALAR

```yaml
28. docs/prd/PRODUCT_REQUIREMENTS.md
    Ne: PRD, user personas, requirements
    Ne Zaman: Feature scope tartışması
    Oku: /YBIS:deep-review veya product query

29. docs/Güncel/Architecture_better.md
    Ne: Tech stack decisions, rationale
    Ne Zaman: Architecture review, tech choice
    Satır: ~400
    Oku: /YBIS:deep-review komutunda

30. docs/Güncel/expo-sdk54-migration-plan.md
    Ne: Expo SDK 54 migration details
    Ne Zaman: Expo-specific issue, migration
    Oku: Expo error/migration sorununda

31. docs/epics/tier-1-port-architecture.md
    Ne: Epic-level port architecture plan
    Ne Zaman: Port implementation planning
    Oku: Port epic başlarken
```

---

## 🚨 ASLA OKUMA (Deprecated/Archive)

```yaml
❌ docs/Archive/Legacy/*
   → Eski dokümanlar, ignore et

❌ docs/Archive/Product-Roadmap/*
   → Eski roadmap, şimdi docs/roadmap/ kullan

❌ docs/.GRAND_CONSISTENCY_REPORT.md
   → Geçici analiz dosyası, ignore et
```

---

## 🎯 HIZLI KARAR AĞACI

```
Soru: "Ne yapayım?"
│
├─ Session başlıyor mu?
│  ├─ YES → TIER 1 (4 dosya, <2K token)
│  └─ THEN → AI_SYSTEM_GUIDE.md (ilk 200 satır) ← NEW
│
├─ YBIS komutlarını bilmem gerekiyor mu?
│  └─ YES → AI_SYSTEM_GUIDE.md (command catalog)
│
├─ Kod yazacak mısın?
│  └─ YES → TIER 2A (DEVELOPMENT_GUIDELINES + tech-stack)
│
├─ AD-XXX araştırması mı?
│  └─ YES → grep DEVELOPMENT_LOG.md "AD-018"
│
├─ Slash komut geldi mi?
│  ├─ /YBIS:implement → tasks.md (sadece o task)
│  ├─ /YBIS:review-story → stories/*.md (o story)
│  ├─ /YBIS:deep-review → Architecture + PRD
│  └─ /YBIS:quality-check → quality-standards.md
│
├─ Planlama/strateji mi?
│  └─ YES → TIER -1 (vision, roadmap, strategy)
│
└─ Diğer?
   └─ session-context.md'de referans var mı kontrol et
```

---

## ✅ BAŞARI KRİTERLERİ

```yaml
Token Efficiency:
  ✅ Başlangıç < 5K token
  ✅ TIER 1'den başla, lazy load yap
  ✅ Duplicate okuma yok

Session Continuity:
  ✅ session-context.md güncel
  ✅ Next agent sorunsuz devraldı

Quality:
  ✅ Zero-tolerance biliniyor
  ✅ Current focus belli
  ✅ Gerekli doc zamanında yüklendi
```

---

**Maintained By:** YBIS AI System  
**Cross-Reference:** AI_BASLANGIC_REHBERI_V2.md  
**Update Rule:** Yeni tier eklendikçe güncelle

