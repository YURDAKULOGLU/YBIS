# YBIS Closed Beta - FINAL EPIC PRIORITY & SCOPE

**Date:** 2025-10-29  
**Version:** FINAL - Ready to Ship  
**Strategy:** Ship Minimal, Patch Later

---

## 🎯 CLOSED BETA SCOPE - FINAL DECISION

### **Core Philosophy:**
> "Ship working app first, Google integrations later"
> "Built-in features > External sync (for beta)"

---

## 📋 FINAL EPIC LIST (PRIORITY SIRALAMASI)

### **P0 - CRITICAL (Shipment Blockers - 16-18 hafta)**

#### **Epic 3: Backend Foundation (REVISED)**
**Points:** 56  
**Duration:** ~8-9 hafta  
**Status:** MUST HAVE

**Scope:**
- ✅ Supabase setup (auth, database, RLS)
- ✅ AuthPort + SupabaseAuthAdapter (Google OAuth + Email/Password)
- ✅ DatabasePort + SupabaseDatabaseAdapter
- ✅ Notes/Tasks/Flows API (CRUD + Realtime)
- ✅ Security (JWT, input validation, workspace isolation)
- ✅ Deployment (Vercel Edge)

**Why Critical:** Nothing works without backend!

---

#### **Epic 4: Flows & Workflow Automation**
**Points:** 44  
**Duration:** ~6-7 hafta  
**Status:** MUST HAVE

**Scope:**
- ✅ Flow Engine (execution, triggers, step registry)
- ✅ 5 Pre-built Templates:
  1. Morning Routine (task list + daily note)
  2. Daily Planning (time blocks + focus tasks)
  3. Weekly Review (reflection + next week goals)
  4. Project Kickoff (project setup)
  5. Focus Mode (90 min deep work)
- ✅ Manual + Scheduled triggers
- ✅ Flow UI (list, detail, template gallery)

**Why Critical:** Core differentiation! Without flows, just another todo app.

---

#### **Epic 8: AI Tool Calling System**
**Points:** 27  
**Duration:** ~4 hafta  
**Status:** MUST HAVE

**Scope:**
- ✅ LLMPort function calling (OpenAI)
- ✅ 5 Core Tools:
  - createTask
  - createNote
  - searchNotes
  - addCalendarEvent (built-in calendar)
  - queryRAG
- ✅ Tool execution UI feedback
- ✅ Natural language workflows

**Why Critical:** AI-powered automation = core value!

---

### **P1 - HIGH (Polish Features - 8-10 hafta)**

#### **Epic 5: Push Notifications & Monitoring**
**Points:** 23  
**Duration:** ~3-4 hafta  
**Status:** HIGH

**Scope:**
- ✅ Firebase FCM + EAS Build APK
- ✅ Push token registration
- ✅ Basic triggers (task due, flow failure)
- ✅ Sentry error tracking
- ✅ EAS Update (OTA)

**Why High:** User engagement, error monitoring critical for beta!

---

#### **Epic 7: RAG System**
**Points:** 30  
**Duration:** ~4-5 hafta  
**Status:** HIGH

**Scope:**
- ✅ pgvector + OpenAI embeddings
- ✅ Document upload (PDF, TXT, MD)
- ✅ Semantic search
- ✅ AI context injection
- ✅ Source citations

**Why High:** AI quality boost, but not blocker!

---

### **P2 - DEFERRED (Post-Beta - Patch Updates)**

#### **Epic 6: Google Calendar Integration**
**Points:** 26  
**Duration:** ~4 hafta  
**Status:** DEFERRED → Post-Beta Patch

**Reason:**
> "Built-in calendar yeterli Closed Beta için"
> "Google sync nice-to-have, not blocker"

**When:** Beta feedback sonrası, eğer demand var

---

#### **Epic 9: Gmail Integration**
**Points:** 23  
**Duration:** ~3-4 hafta  
**Status:** DEFERRED → Post-Beta Patch

**Reason:**
> "Email summary nice-to-have"
> "Built-in notes + tasks yeterli MVP için"

**When:** Beta feedback sonrası, eğer users ister

---

#### **Epic 10: Plugin System**
**Points:** 0 (Skipped!)  
**Status:** NOT NEEDED

**Decision:**
> "Port Architecture = Plugin system already"
> "Feature Flags yeterli"
> "YAGNI - kullanılmayacak"

**Alternative:** Feature Registry (2 gün) yeterli

---

## 📊 FINAL TIMELINE & EFFORT

### **Closed Beta MVP - Minimum Shipment:**

```yaml
P0 EPICS (Critical Path):
  Epic 3: Backend Foundation - 56 points
  Epic 4: Flows - 44 points
  Epic 8: AI Tool Calling - 27 points
  
  SUBTOTAL: 127 points
  DURATION: ~18-20 hafta solo (10-12 hafta parallel)

P1 EPICS (Polish):
  Epic 5: Push + Monitoring - 23 points
  Epic 7: RAG System - 30 points
  
  SUBTOTAL: 53 points
  DURATION: +7-9 hafta

TOTAL CLOSED BETA: 180 points (~25-29 hafta = 6-7 ay)
PARALLEL WORK: ~17-21 hafta (4-5 ay)
```

---

## 🚀 SHIPMENT CRITERIA (DoD)

### **Minimum Viable Beta (Week 20):**

```yaml
✅ MUST HAVE (P0):
  - Auth working (Google OAuth + Email/Password)
  - Notes CRUD + Realtime
  - Tasks CRUD + Realtime
  - Flows CRUD + Execution
  - 5 Flow templates working
  - AI chat with tool calling
  - Chat history + context

✅ SHOULD HAVE (P1):
  - Push notifications (basic)
  - Error tracking (Sentry)
  - RAG (basic document search)

❌ DEFERRED (P2):
  - Google Calendar sync
  - Gmail sync
  - Advanced analytics
  - Voice commands
```

---

## 🎯 POST-BETA ROADMAP

### **Patch 1.1 (Beta + 1 month):**
```yaml
IF user feedback = "Need calendar sync":
  - Ship Epic 6: Google Calendar (4 hafta)

IF user feedback = "Need email summary":
  - Ship Epic 9: Gmail (3-4 hafta)

ELSE:
  - Focus on bug fixes, UX polish
```

### **Patch 1.2 (Beta + 2-3 months):**
```yaml
Analytics:
  - Weekly productivity reports
  - Usage insights
  - AI suggestions

Advanced Features:
  - LLM routing (cost optimization)
  - Cloudflare deployment (cost reduction)
  - Multi-provider support (if needed)
```

---

## ✅ FINAL SCOPE CONFIRMATION

### **What's IN Closed Beta:**
- ✅ Built-in Notes (create, edit, search, AI access)
- ✅ Built-in Tasks (create, complete, priority, due dates)
- ✅ Built-in Calendar (simple event CRUD - no Google sync)
- ✅ AI Chat (tool calling, context awareness)
- ✅ Flows (5 templates, manual + scheduled)
- ✅ RAG (document upload, semantic search)
- ✅ Push Notifications (basic triggers)

### **What's OUT (Deferred):**
- ❌ Google Calendar sync (built-in calendar instead)
- ❌ Gmail sync (built-in notes instead)
- ❌ Google Tasks sync (built-in tasks instead)
- ❌ Voice commands (text-only)
- ❌ Plugin system (feature flags instead)
- ❌ Advanced analytics (basic metrics only)

---

## 🎬 NEXT STEPS

### **1. Update Vision Document:**
```yaml
Action: Add "Closed Beta Scope" section
Content:
  - Built-in features > Google sync (for beta)
  - Google integrations = Post-beta patch
  - Rationale: Ship faster, validate core value first
```

### **2. Update Product Roadmap:**
```yaml
Action: Revise timeline
Content:
  Phase 0 (Closed Beta): Built-in features only
  Phase 1 (Beta Patch 1.1): Google Calendar sync
  Phase 2 (Beta Patch 1.2): Gmail sync
```

### **3. Sprint Planning:**
```yaml
Sprint 1-2 (Week 1-4): Epic 3 Backend Foundation
Sprint 3-4 (Week 5-8): Epic 4 Flows + Epic 8 AI Tools (parallel)
Sprint 5-6 (Week 9-12): Epic 5 Push + Epic 7 RAG (parallel)
Sprint 7 (Week 13-14): Testing, bug fixes, polish
Sprint 8 (Week 15-16): Beta release prep, documentation

TARGET: Week 16 Beta Launch!
```

---

## 📝 DECISION LOG

**AD-043: Defer Google Integrations to Post-Beta**

**Date:** 2025-10-29  
**Context:** Closed Beta timeline concerns, built-in features sufficient for MVP

**Decision:**
- Ship with built-in Notes, Tasks, Calendar
- Defer Google Calendar, Gmail, Tasks sync to post-beta patches
- Focus on core AI + Flows value proposition

**Rationale:**
1. ✅ Faster time to market (6-7 months → 4-5 months)
2. ✅ Built-in features work without API limits
3. ✅ Validate core value (AI + automation) first
4. ✅ Google sync = nice-to-have, not blocker
5. ✅ Can add post-beta based on user demand

**Consequences:**
- ✅ Simpler initial implementation
- ✅ No Google API quota limits
- ✅ No OAuth complexity during beta
- ⚠️ Less "wow" factor (no external sync)
- ⚠️ Users must manually input calendar events
- ✅ Can market as "privacy-first" (no Google data access)

**Impact:** -46 points (~6-7 hafta saved!)

---

**Last Updated:** 2025-10-29  
**Status:** APPROVED - Ready for Implementation  
**Next Action:** Start Epic 3 Story 3.1 (Supabase Setup)

---

**TOTAL CLOSED BETA SCOPE:**
- 5 Epics (3, 4, 5, 7, 8)
- 33 Stories
- 180 Story Points
- 17-21 hafta (4-5 ay with parallel work)
- Target: Beta Launch Week 16-20

🚀 **LET'S SHIP IT!**
