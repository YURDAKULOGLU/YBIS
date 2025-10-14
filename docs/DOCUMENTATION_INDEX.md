# YBIS Documentation Index

**Purpose:** Single source of truth for all documentation  
**Last Updated:** 2025-10-12  
**Status:** ✅ Optimized - 88 → 19 active docs (78% reduction)

---

## 🎯 Start Here Based on Your Role

### 👨‍💻 Developer (Wants to CODE)
1. **[`QUICKSTART.md`](./QUICKSTART.md)** ⭐ START HERE
   - 5-minute setup
   - First task options
   - Development workflow
   
2. **[`Güncel/tech-stack.md`](./Güncel/tech-stack.md)** - Tech reference
   - All package versions
   - Architecture overview
   - API references

3. **[`Güncel/DEVELOPMENT_LOG.md`](./Güncel/DEVELOPMENT_LOG.md)** - Progress log
   - What's been done
   - Architecture decisions
   - Issues & fixes

---

### 📋 Product Manager (Wants to PLAN)
1. **[`YBIS_PROJE_ANAYASASI.md`](./YBIS_PROJE_ANAYASASI.md)** v2.0.0 - Core principles
   - Port architecture
   - Quality gates
   - Tech decisions

2. **[`Güncel/tasks.md`](./Güncel/tasks.md)** - 170 executable tasks
   - 6-week roadmap
   - Prioritized by week
   - Clear acceptance criteria

3. **[`Güncel/INTEGRATION_ROADMAP.md`](./Güncel/INTEGRATION_ROADMAP.md)** - Integration phases
   - 3 → 7 → 20 → 100+ integrations
   - MCP strategy
   - Phase timeline

---

### 🏗️ Architect (Wants TECHNICAL DECISIONS)
1. **[`Güncel/Architecture_better.md`](./Güncel/Architecture_better.md)** - Tech decisions
   - Why Expo, React 19.1.0, Hono, etc.
   - Alternatives considered
   - Migration paths

2. **[`Güncel/service-integration-strategy.md`](./Güncel/service-integration-strategy.md)** - Port architecture
   - 17 ports (Tier 1/2/3)
   - Adapter patterns
   - Migration triggers

3. **[`Güncel/package-structure.md`](./Güncel/package-structure.md)** - Monorepo layout
   - Package dependencies
   - Import patterns
   - Build system

---

### 🤖 AI Agent (Wants CONTEXT)
1. **[`Güncel/YBIS_PROJE_ANAYASASI.md`](./Güncel/YBIS_PROJE_ANAYASASI.md)** ⚠️ READ FIRST
   - Core constraints
   - Forbidden patterns
   - Quality standards

2. 🔴 **[`Güncel/DEVELOPMENT_GUIDELINES.md`](./Güncel/DEVELOPMENT_GUIDELINES.md)** ⚠️ MANDATORY!
   - **Prevents ALL common issues**
   - Proper solutions (no workarounds)
   - Error patterns & prevention
   - **READ BEFORE ANY DEVELOPMENT**

3. **[`Güncel/DEVELOPMENT_LOG.md`](./Güncel/DEVELOPMENT_LOG.md)** - What's done
   - Completed tasks
   - Architecture decisions
   - Issues already solved
   - Current state

4. **[`Güncel/tech-stack.md`](./Güncel/tech-stack.md)** - Tech reference
   - Locked package versions
   - APIs to use
   - Update policy

5. **[`../.YBIS_Dev/AI_SYSTEM_GUIDE.md`](../.YBIS_Dev/AI_SYSTEM_GUIDE.md)** - BMad system
   - Agent system
   - Workflow orchestration
   - Commands reference

---

## 📁 Complete File Structure

### Tier 1: Active Development (Use Daily) ⭐
```
docs/
├── README.md                        ← Overview & navigation
├── QUICKSTART.md                    ← Developer quick start
├── DOCUMENTATION_INDEX.md           ← This file (navigation)
└── Güncel/
    ├── DEVELOPMENT_GUIDELINES.md   🔴 MANDATORY - Prevents ALL issues!
    ├── tech-stack.md               ← Complete tech reference
    ├── DEVELOPMENT_LOG.md          ← Daily progress & decisions
    ├── YBIS_PROJE_ANAYASASI.md             ← Core principles (v2.2.0)
    └── tasks.md                    ← 170 executable tasks
```

### Tier 2: Reference (When Needed)
```
docs/Güncel/
├── expo-sdk54-migration-plan.md    ← Migration completed (reference)
├── package-structure.md            ← Monorepo layout
├── Architecture_better.md          ← Tech decisions & rationale
├── service-integration-strategy.md ← Port architecture patterns
├── quality-standards.md            ← Code quality & testing
└── INTEGRATION_ROADMAP.md          ← Integration phases
```

### Tier 3: Archive (Historical Reference)
```
docs/Archive/
├── Legacy/                        ← Old architecture docs (26 files)
├── Product-Roadmap/               ← Future planning (17 files)
└── AI-Tasks/                     ← Old AI task files (3 files)
```

### Tier 4: BMad System (AI Tooling)
```
.YBIS_Dev/
├── AI_SYSTEM_GUIDE.md              ← Complete BMad guide
├── AI_BASLANGIC_REHBERI.md         ← AI bootstrap procedure
└── Veriler/
    ├── agents/                     ← AI agent definitions
    ├── commands/                   ← Executable commands
    ├── workflows/                  ← Multi-step processes
    ├── templates/                  ← Document templates
    ├── checklists/                 ← Validation checklists
    └── data/                       ← Knowledge bases
```

---

## 🔄 Documentation Principles (NO Duplicates!)

### What Goes Where

**QUICKSTART.md** - Getting started only
- Setup instructions
- First task options
- Basic workflow
- Common issues

**tech-stack.md** - Technical reference only
- Package versions (single source of truth)
- Architecture diagram
- Deployment info
- API references

**DEVELOPMENT_LOG.md** - Facts and decisions only
- Daily accomplishments
- Architecture decisions (AD-XXX format)
- Issues encountered & resolved
- Deviations from plan

**YBIS_PROJE_ANAYASASI.md** - Principles and constraints only
- Core principles
- Port architecture mandate
- Quality gates
- Anti-patterns (what NOT to do)

**tasks.md** - Task list only
- 170 tasks organized by week
- Acceptance criteria
- Dependencies
- Status tracking

**Architecture_better.md** - Technical decisions only
- Why we chose X over Y
- Alternatives considered
- Trade-offs accepted
- Future migration paths

---

## 🚫 What We Cleaned Up (January 2025)

**Archived (69 files):**
- ❌ Legacy/ (26 files) → `Archive/Legacy/`
- ❌ product-roadmap/ (17 files) → `Archive/Product-Roadmap/`
- ❌ AI/ (3 files) → `Archive/AI-Tasks/`
- ❌ chat-architecture-duzenlenmiş (taslak)/ (24 files) → Deleted

**Active Docs (19 files):**
- ✅ Core development docs (11 files)
- ✅ Reference docs (8 files)
- ✅ Archive organized (3 categories)

**Result:** 88 → 19 active docs (78% reduction)

---

## 📊 Documentation Status

| Document | Purpose | Status | Last Updated |
|----------|---------|--------|--------------|
| `QUICKSTART.md` | Developer onboarding | ✅ Complete | 2025-10-06 |
| `tech-stack.md` | Tech reference | ✅ Complete | 2025-10-06 |
| `DEVELOPMENT_LOG.md` | Progress tracking | 🟢 Active | 2025-10-06 |
| `YBIS_PROJE_ANAYASASI.md` | Core principles | ✅ v2.2.0 | 2025-10-06 |
| `tasks.md` | Task list | 🟢 Active | 2025-01-06 |
| `Architecture_better.md` | Tech decisions | ✅ Complete | 2025-01-05 |
| `expo-sdk54-migration-plan.md` | Migration reference | ✅ Archived | 2025-10-06 |

---

## 🎯 Next Documentation Updates

### When to Update Each File

**Daily:**
- `DEVELOPMENT_LOG.md` - After completing tasks

**Per Task:**
- `tasks.md` - Mark tasks complete

**When Tech Changes:**
- `tech-stack.md` - Update package versions
- `YBIS_PROJE_ANAYASASI.md` - Update if new principles

**When Planning:**
- `tasks.md` - Add new tasks
- `INTEGRATION_ROADMAP.md` - Update phases

**Never Update (Historical):**
- `expo-sdk54-migration-plan.md` - Archived
- Old planning docs in `Legacy/` folder

---

## 🔍 How to Find Information

### "What package version should I use?"
→ `tech-stack.md` (Package Version Summary)

### "What task should I work on?"
→ `tasks.md` (Week 1 section)

### "How do I start development?"
→ `QUICKSTART.md` (5-Minute Setup)

### "Why did we choose Expo?"
→ `Architecture_better.md` or `YBIS_PROJE_ANAYASASI.md` (AD-001)

### "What was done yesterday?"
→ `DEVELOPMENT_LOG.md` (Daily log)

### "What are the core principles?"
→ `YBIS_PROJE_ANAYASASI.md` (Core Principles section)

### "How do I use BMad commands?"
→ `.YBIS_Dev/AI_SYSTEM_GUIDE.md`

### "What's the port architecture?"
→ `service-integration-strategy.md` or `YBIS_PROJE_ANAYASASI.md`

---

## ✅ Documentation Health Check

**Healthy documentation:**
- ✅ No duplicates across files
- ✅ Each file has single purpose
- ✅ Clear navigation (this index)
- ✅ Actionable content only
- ✅ Up-to-date dates
- ✅ Cross-references use relative links

**Unhealthy documentation:**
- ❌ Same info in multiple places
- ❌ Outdated information
- ❌ No clear starting point
- ❌ Verbose planning without action
- ❌ Broken links
- ❌ Unclear purpose

**Current status:** ✅ **HEALTHY** (Refactored 2025-10-06)

---

**Last Review:** 2025-10-10  
**Next Review:** After Week 1 completion  
**Maintained By:** Development team + AI agents + Documentation Maintenance System

