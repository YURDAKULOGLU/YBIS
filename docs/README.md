# YBIS Documentation

**Last Updated:** 2025-10-12  
**Status:** 🟢 Optimized - 88 → 19 active docs (78% reduction)  
**Tech Stack:** React 19.1.0 + Expo SDK 54 + RN 0.81.4

> **📋 Full navigation:** See [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md)

---

## ⚡ Quick Start by Role

### 👨‍💻 Developer → [`QUICKSTART.md`](./QUICKSTART.md)
Get coding in 5 minutes

### 📋 PM → [`YBIS_PROJE_ANAYASASI.md`](./YBIS_PROJE_ANAYASASI.md) + [`Güncel/tasks.md`](./Güncel/tasks.md)
Principles + 170 tasks

### 🏗️ Architect → [`Güncel/Architecture_better.md`](./Güncel/Architecture_better.md)
Tech decisions & rationale

### 🤖 AI Agent → [`YBIS_PROJE_ANAYASASI.md`](./YBIS_PROJE_ANAYASASI.md) ⚠️ READ FIRST
Core constraints & patterns

**🔴 THEN READ:** [`Güncel/DEVELOPMENT_GUIDELINES.md`](./Güncel/DEVELOPMENT_GUIDELINES.md)  
**Prevents ALL common issues - MANDATORY!**

---

## 📁 Documentation Structure

### Tier 1: Active Development (Use Daily) ⭐
```
docs/
├── QUICKSTART.md                    ← Start here for development
├── Güncel/
│   ├── tech-stack.md               ← Complete tech reference
│   ├── DEVELOPMENT_LOG.md          ← Daily progress log
│   ├── YBIS_PROJE_ANAYASASI.md     ← Core principles (v2.0.0)
│   └── tasks.md                    ← Executable task list
```

### Tier 2: Reference (When Needed)
```
docs/Güncel/
├── expo-sdk54-migration-plan.md    ← Migration guide
├── package-structure.md            ← Monorepo layout
├── Architecture_better.md          ← Tech decisions
├── service-integration-strategy.md ← Integration patterns
├── quality-standards.md            ← Code quality
└── INTEGRATION_ROADMAP.md          ← Integration phases
```

### Tier 3: Planning Artifacts (Background)
```
docs/Güncel/
├── START_HERE.md                   ← Project overview
└── product-roadmap/                ← Future planning
```

---

## 🔧 BMad Integration

YBIS uses a **hybrid development system**:

- **BMad Method:** AI-driven planning and structured workflows
- **Custom YBIS Tools:** Project-specific agents and commands
- **Claude Code/Cursor:** IDE integration

### BMad Commands (Available in `.claude/commands/YBIS/`)
- `/plan` - Planning workflows
- `/implement` - Development execution
- `/review-story` - Code review
- `/qa-gate` - Quality gates
- `/document-project` - Architecture docs
- See [`.YBIS_Dev/AI_SYSTEM_GUIDE.md`](../.YBIS_Dev/AI_SYSTEM_GUIDE.md) for full guide

---

## 📊 Current State (2025-10-06)

### ✅ Completed
- Expo SDK 54 + React 19.2 migration
- All 1546 packages installed (0 vulnerabilities)
- 10+ major version updates
- Firebase Auth → Expo Auth Session migration
- Complete tech stack finalized

### 🚧 In Progress (Week 1)
- Mobile app structure (Expo Router screens)
- EAS Build configuration
- Backend API endpoints

### 📋 Next Up
- Google OAuth implementation
- Chat interface integration
- First test build (iOS + Android)

---

## 🎓 For AI Agents

**IMPORTANT:** Before making any changes:

1. **Read YBIS_PROJE_ANAYASASI.md first** - Core principles and constraints
2. **Check DEVELOPMENT_LOG.md** - What's already done
3. **Review tech-stack.md** - Current package versions
4. **Follow port architecture** - No vendor lock-in
5. **Zero tolerance for shortcuts** - No `--force`, no `@ts-ignore`

**Key Constraints:**
- 🔴 **Read DEVELOPMENT_GUIDELINES.md FIRST** - Prevents ALL common issues!
- ✅ Use Expo managed workflow (no bare RN)
- ✅ React 19.2 + RN 0.81.4 (locked versions)
- ✅ All changes must go through port interfaces
- ✅ TypeScript strict mode (no `any`)
- ✅ NO workarounds, NO @ts-ignore, NO --force
- ✅ Use full Tamagui prop names (not shorthands)
- ✅ Update DEVELOPMENT_LOG.md after changes

---

## 📞 Need Help?

**Architecture Questions:** Check YBIS_PROJE_ANAYASASI.md → Architecture_better.md  
**Package Issues:** See tech-stack.md → DEVELOPMENT_LOG.md  
**Task Execution:** Review tasks.md → QUICKSTART.md  
**BMad System:** Read `.YBIS_Dev/AI_SYSTEM_GUIDE.md`

---

**Status:** 🟢 Documentation up-to-date and actionable  
**Next Review:** After Week 1 completion

