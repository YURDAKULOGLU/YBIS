# YBIS Product Roadmap

**Version:** 2.0  
**Last Updated:** 2025-10-12  
**Status:** Active - Phase 0 (Week 1: 80% complete)  
**Strategy:** Build Infrastructure for All Paths, Ship Minimal

**Cross-References:**
- [Project Vision](../vision/PROJECT_VISION.md) - Strategic foundation (goals → timeline)
- [Market Research](../strategy/MARKET_RESEARCH.md) - Market priorities (inform roadmap)
- [Competitive Strategy](../strategy/COMPETITIVE_STRATEGY.md) - Positioning (inform strategy)
- [Tasks](../Güncel/tasks.md) - 165 executable tasks (24 completed, weekly breakdown)
- [Development Log](../Güncel/DEVELOPMENT_LOG.md) - Daily progress + architecture decisions
- [Integration Roadmap](../Güncel/INTEGRATION_ROADMAP.md) - Integration phases (aligned)
- [Product Requirements](../prd/PRODUCT_REQUIREMENTS.md) - Feature scope

---

## 🎯 **Core Philosophy**

**"Build for Scale, Ship Minimal"**

- **Ship:** Individual users, minimal features (Google Workspace)
- **Build:** Infrastructure for vertical plugins, team features, enterprise deployment
- **Decide:** Post-release based on market feedback

**Architecture Principles:**
- ✅ Port Architecture (easy tech migration pre-release)
- ✅ Plugin System (vertical feature expansion ready)
- ✅ LLM Auto-Routing (cost optimization infrastructure)
- ✅ Multi-Provider Support (workspace flexibility)

---

## 📅 **Phase 0: Closed Beta**

**Timeline:** October - November 2025 (6 weeks)  
**Status:** Week 1 - 80% complete (24/30 tasks done)  
**Users:** 100-200 beta testers  
**Focus:** Core value validation

### **Primary Goals**
- ✅ Validate AI assistant value proposition
- ✅ Test Google Workspace integration
- ✅ Establish technical foundation
- ✅ Gather user behavior patterns

### **Features (Minimal)**

#### **Google Workspace Integration**
- ✅ **Auth:** Expo Auth Session + Google OAuth (NOT Firebase)
- ✅ **Calendar:** Google Calendar (CalendarPort → GoogleCalendarAdapter)
- ✅ **Email:** Gmail (EmailPort → GmailAdapter)
- ✅ **Tasks:** Google Tasks (TaskPort → GoogleTasksAdapter)

#### **AI Chat System**
- ✅ **LLM:** OpenAI only (single provider, simple)
- ✅ **Chat UI:** Widget-based + slidable tabs (Notes, Tasks, Calendar, Flows)
- ✅ **Context:** Conversation memory (local storage)
- ✅ **Tool Calling:** Basic task creation, search, organize

#### **Core Features**
- ✅ **Note Management:** Built-in (create, edit, search, AI summary)
- ✅ **Task Management:** Built-in (create, complete, priority)
- ✅ **Calendar View:** Built-in (daily view, basic CRUD)
- ✅ **Workflow Templates:** 3-5 presets (morning routine, daily planning)

### **Tech Stack (Closed Beta)**
```yaml
Mobile:
  framework: "Expo SDK 54 + React 19.1.0 + React Native 0.81.4"
  navigation: "Expo Router (file-based)"
  ui: "Tamagui (universal components)"
  state: "Zustand (lightweight)"

Backend:
  framework: "Hono (edge-optimized)"
  deployment: "Vercel Edge Functions (DeploymentPort → VercelEdgeAdapter)"
  database: "Supabase (PostgreSQL)"
  auth: "Expo Auth Session (OAuth 2.0 + PKCE)"
  llm: "OpenAI GPT-4o-mini (LLMPort → OpenAIAdapter)"

Infrastructure (Built, Not Shipped):
  plugin_system: "Registry foundation (vertical expansion ready)"
  deployment_port: "Serverless → Server migration ready (enterprise)"
  multi_provider: "Architecture supports (not shipped yet)"
```

### **Week-by-Week Breakdown**

**Week 1: Foundation** ✅ 80% Complete (24/30 tasks)
- ✅ Monorepo setup (npm workspaces)
- ✅ Mobile app boilerplate (Expo Router screens)
- ✅ Backend API (Hono + Supabase)
- ✅ Expo Auth Session (ExpoAuthAdapter + AuthPort)
- ⏳ Vercel deployment (pending)
- ⏳ Google OAuth setup (pending)

**Week 2: Core Integrations**
- [ ] Google Calendar integration (CalendarPort)
- [ ] Gmail integration (EmailPort)
- [ ] Google Tasks integration (TaskPort)
- [ ] AI chat UI (widget-based design)

**Week 3: AI & Workflows**
- [ ] OpenAI integration (LLMPort)
- [ ] Tool calling (create tasks, search, organize)
- [ ] 3-5 workflow templates
- [ ] Plugin system infrastructure (foundation)

**Week 4: Polish & Testing**
- [ ] UI/UX refinement
- [ ] Offline support
- [ ] Error handling
- [ ] Beta tester recruitment

**Week 5-6: Beta Testing**
- [ ] User feedback collection
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Prepare for Open Beta

### **Success Metrics (Closed Beta)**
- ✅ App launches on iOS + Android
- ✅ Google Workspace integration works
- ✅ AI chat functional
- ✅ 100+ beta testers recruited
- ✅ NPS >40
- ✅ Day 7 retention >40%

---

## 🚀 **Phase 1: Open Beta**

**Timeline:** December 2025 - February 2026 (8-10 weeks)  
**Users:** 4,000-5,000  
**Focus:** Scale validation + Web launch

### **Primary Goals**
- Validate product scalability
- Test LLM auto-routing strategy (cost optimization)
- Launch web dashboard
- Establish plugin system (operational)

### **New Features**

#### **LLM Auto-Routing Strategy** 🆕
```yaml
Purpose: Cost optimization + quality balance
Implementation:
  - Simple query → GPT-3.5 (cheap, fast)
  - Complex task → GPT-4 (quality, accuracy)
  - Auto-routing based on query complexity

Testing:
  - A/B test routing logic
  - Measure cost per user
  - Validate quality metrics
  
Goal: Kesinleştir strategy for MVP
```

#### **Plugin System Operational** 🆕
```yaml
Purpose: Vertical feature expansion readiness
Infrastructure:
  - Plugin registry system
  - Feature module loading
  - Sandboxed execution
  
Potential Plugins (NOT shipped, just ready):
  - Finance Plugin (budget tracking)
  - Student Plugin (flashcards)
  - Health Plugin (medical records)
  
Decision: Market feedback determines which (if any)
```

#### **Web Dashboard** 🆕
```yaml
Platform: Next.js (Expo Web or standalone)
Features:
  - Read-only dashboard (initially)
  - Calendar view (desktop-optimized)
  - Task management
  - Notes browser
  
Goal: Desktop workflow support
```

#### **Enhanced Features**
- Multi-device sync (real-time)
- Advanced workflow builder (user-defined)
- Richer AI context (extended memory)
- Performance monitoring

### **Tech Stack Updates (Open Beta)**
```yaml
Added:
  web: "Next.js 14+ (web dashboard)"
  llm_routing: "Auto-routing system (GPT-3.5/4)"
  plugin_registry: "Feature module system"
  sync: "Real-time (WebSocket)"

Infrastructure Testing:
  - Multi-provider architecture (backend ready)
  - Plugin sandboxing
  - Cost tracking per user
```

### **Success Metrics (Open Beta)**
- 4,000-5,000 users
- LLM cost <$5/user/month
- Plugin system operational (0 plugins shipped, infrastructure proven)
- Web dashboard functional
- NPS >45
- Day 30 retention >25%

---

## 📈 **Phase 2: MVP Release**

**Timeline:** March - May 2026 (8-10 weeks)  
**Users:** 20,000+  
**Focus:** Production ready + Monetization

### **Primary Goals**
- Production-grade platform
- Monetization active
- Kesinleşmiş LLM routing strategy
- Plugin registry production-ready

### **New Features**

#### **Production LLM Routing** ✅
```yaml
Strategy: Finalized (based on Open Beta data)
Implementation:
  - Cost-optimized model selection
  - Quality thresholds enforced
  - Fallback mechanisms
  - User-level quota management

Providers:
  - OpenAI (primary)
  - Possible: Anthropic, Gemini (if routing demands)
```

#### **Plugin Registry Production** ✅
```yaml
Status: Production-ready (0 plugins shipped initially)
Capability:
  - Finance Plugin: Budget tracking, investments
  - Student Plugin: Flashcards, study tools
  - Health Plugin: Medical records, fitness
  - Custom Plugins: User/community created

Launch Decision: Post-MVP feedback
  - IF Finance vertical demand → Ship Finance Plugin
  - IF Student demand → Ship Student Plugin
  - Else: Infrastructure unutilized (OK, we hedged bets)
```

#### **Monetization System**
```yaml
Pricing Tiers (TBD - cost analysis needed):
  free:
    workflows: 3
    integrations: ["Google Workspace"]
    ai_messages: "100/month"
    
  lite:
    price: "$5-7/month"
    workflows: "unlimited"
    ai_messages: "500/month"
    
  pro:
    price: "$12-15/month"
    ai_messages: "unlimited"
    advanced_features: ["Plugin access", "Custom workflows"]

Payment: Stripe integration
Trial: 14-day pro trial
```

#### **Multi-Provider Support** 🆕
```yaml
User Choice:
  - Connect 2+ calendar apps (Google + Outlook + Apple)
  - Connect multiple email providers
  - Mix task managers (Google Tasks + Todoist)

Architecture: Ready (CalendarPort supports multiple adapters)
```

### **Tech Stack Updates (MVP)**
```yaml
Production Infrastructure:
  deployment: "Auto-scaling (Vercel Edge or Cloudflare - DeploymentPort)"
  monitoring: "Sentry (error tracking), PostHog (analytics)"
  security: "SOC2 groundwork, data encryption"
  backup: "Automated backups, point-in-time recovery"

Kesinleşmiş:
  llm_routing: "Production strategy (cost-optimized)"
  plugin_system: "Registry operational"
  multi_provider: "User connects multiple apps"
```

### **Success Metrics (MVP)**
- 20,000+ users
- $200K+ ARR (Year 2 target)
- Free → Paid conversion >5%
- LLM cost validated (<$5/user/month)
- Plugin infrastructure proven (ship based on demand)
- NPS >50
- Churn <7%

---

## 🔀 **Post-Release: Conditional Paths**

**Decision Point:** Month 6+ (Post-MVP launch)  
**Strategy:** Infrastructure ready for all paths, ship based on market feedback

### **Path A: Individual Enhancement** ✅ Always Active

```yaml
Focus: Power user features
Roadmap:
  - Advanced AI features
  - Deeper integrations (20+ apps)
  - Personal automation builder
  - AI learning (pattern recognition)

Status: Core product, always develops
```

### **Path B: Vertical Plugins** 🔄 Conditional

```yaml
Decision: IF market demand (user feedback, revenue potential)

Finance Plugin:
  features: ["Budget tracking", "Investment monitoring", "Tax prep"]
  users: "Finance professionals, investors"
  
Student Plugin:
  features: ["Flashcard system", "Study scheduler", "Grade tracker"]
  users: "Students, researchers"
  
Health Plugin:
  features: ["Medical records", "Fitness tracking", "Appointment management"]
  users: "Health-conscious users, medical professionals"

Infrastructure: ✅ Ready (plugin registry operational)
Commitment: ❌ ZERO (decide post-release)
```

### **Path C: Team/KOBİ Features** 🔄 Conditional

```yaml
Decision: IF enterprise demand (customer requests, ARR potential)

Phase 4A: User Connection (2 users)
  - Shared workflows
  - Basic collaboration
  
Phase 5A: Team Features (5-20 people)
  - Team workspaces
  - Shared calendars
  - Project management
  
Phase 6A: KOBİ Features (20-100 people)
  - Multi-user billing
  - Admin dashboard
  - KOSGEB integration (Turkey market)
  
Phase 7A: Enterprise (500+ people)
  - Local LLM deployment (DeploymentPort → NodeServerAdapter)
  - SSO, compliance, advanced security
  - Custom integrations

Infrastructure: ✅ Partially ready
  - DeploymentPort: Serverless → Server migration ready
  - Multi-user architecture: Needs development
```

---

## 🔮 **Far Future (TBD)**

**Timeline:** 12+ months post-release  
**Decision:** Based on ecosystem maturity

### **MCP Integration** 🔄 Optional
```yaml
Current: Port Architecture (manual adapters)
Future: Possible MCP integration (if ecosystem matures)

Trigger:
  - >15 integrations planned OR
  - Third-party developer interest HIGH OR
  - Integration maintenance cost too high

Timeline: Evaluate in Open Beta, decide post-MVP
```

### **Community Marketplace** 🔄 Optional
```yaml
Concept: User/developer created plugins
Prerequisites:
  - Plugin system proven (production)
  - Developer interest validated
  - Revenue model for creators

Timeline: Far future (product must mature first)
```

---

## 📊 **Success Metrics & KPIs**

### **Core Metrics (All Phases)**
```yaml
User Growth:
  - DAU, MAU, retention rates
  - Viral coefficient (referrals)

Engagement:
  - Session duration (target: >8 min)
  - Feature usage (workflows, AI chat)
  - Daily active workflows

Monetization:
  - MRR, ARR growth
  - Free → Paid conversion
  - LTV:CAC ratio (target: >3:1)

Quality:
  - NPS (target: >50)
  - Churn rate (target: <7%)
  - Support tickets (target: <5% users)
```

### **Phase-Specific KPIs**

| Phase | Users | Retention (D30) | NPS | ARR | Key Focus |
|-------|-------|-----------------|-----|-----|-----------|
| Closed Beta | 100-200 | >20% | >40 | N/A | Value validation |
| Open Beta | 4K-5K | >25% | >45 | N/A | LLM routing, Plugin system |
| MVP | 20K+ | >30% | >50 | $200K+ | Monetization, Production |
| Year 2 | 50K+ | >35% | >55 | $1M+ | Scale, Conditional paths |

---

## 🔄 **Migration & Tech Evolution**

### **Port Architecture Evolution**
```yaml
Pre-Release (Closed + Open Beta):
  purpose: "Easy tech migration during development"
  examples:
    - Expo Auth → Supabase Auth (if needed)
    - Vercel → Cloudflare (cost optimize)
    - OpenAI → Anthropic (performance test)

Post-Release:
  purpose: "Multi-provider user features"
  examples:
    - User connects Google Calendar + Outlook
    - User mixes Gmail + Outlook email
```

### **LLM Strategy Evolution**
```yaml
Closed Beta: "OpenAI only"
Open Beta: "Auto-routing testing (GPT-3.5/4)"
MVP: "Production routing (kesinleşmiş)"
Future: "Multi-model (OpenAI, Anthropic, Gemini)"
```

### **Deployment Evolution**
```yaml
Closed Beta: "Vercel Edge (serverless)"
Open Beta: "Vercel or Cloudflare (cost analysis)"
MVP: "Kesinleşmiş provider (DeploymentPort)"
Enterprise (if): "Local server (NodeServerAdapter)"
```

---

## 🎯 **Strategic Decision Points**

### **Fork Decision Matrix**

**Vertical Plugin Launch:**
```yaml
IF:
  - User demand >30% for specific vertical AND
  - Revenue potential >$50K ARR from vertical AND
  - Plugin infrastructure proven in production

THEN: Ship vertical plugin

ELSE: Infrastructure unutilized (OK, we hedged bets)
```

**Team/KOBİ Path:**
```yaml
IF:
  - Enterprise customer requests >10 AND
  - ARR potential >$500K AND
  - Team infrastructure feasible (development cost justified)

THEN: Develop team/KOBİ features

ELSE: Focus on individual enhancement
```

**MCP Integration:**
```yaml
IF:
  - >15 integrations planned OR
  - Third-party developer interest validated OR
  - Integration maintenance cost >30% dev time

THEN: Migrate to MCP

ELSE: Continue port architecture
```

---

## 📋 **Critical TBDs (To Be Determined)**

### **Open Beta TBDs**
- [ ] LLM routing strategy finalized (cost vs quality balance)
- [ ] Web dashboard scope (read-only vs full parity)
- [ ] Plugin system performance (sandboxing, security)

### **MVP TBDs**
- [ ] Pricing tiers finalized (cost analysis complete)
- [ ] Plugin launch decision (Finance? Student? None?)
- [ ] Deployment provider (Vercel vs Cloudflare)

### **Post-Release TBDs**
- [ ] Vertical path activation (market demand validation)
- [ ] Team/KOBİ path activation (enterprise interest)
- [ ] MCP migration decision (ecosystem maturity)

---

## 🔗 **Cross-References**

**Strategic Foundation:**
- [Project Vision](../vision/PROJECT_VISION.md) - Why we build YBIS
- [PRD](../prd/PRODUCT_REQUIREMENTS.md) - Product requirements
- [Market Research](../strategy/MARKET_RESEARCH.md) - User insights (TBD)
- [Competitive Strategy](../strategy/COMPETITIVE_STRATEGY.md) - Positioning (TBD)

**Technical Implementation:**
- [Tasks](../Güncel/tasks.md) - 165 executable tasks
- [Development Log](../Güncel/DEVELOPMENT_LOG.md) - AD-001 to AD-020
- [Tech Stack](../Güncel/tech-stack.md) - Package versions
- [Architecture](../Güncel/Architecture_better.md) - Tech decisions

**Detailed Scopes (Archive):**
- [Closed Beta Scope](../Archive/Product-Roadmap/closed-beta-scope.md) - Feature details
- [Open Beta Scope](../Archive/Product-Roadmap/open-beta-scope.md) - Scale features
- [MVP Scope](../Archive/Product-Roadmap/mvp-release-scope.md) - Production features

---

**Last Updated:** 2025-10-12  
**Next Review:** Week 2 (Closed Beta checkpoint)  
**Strategic Review:** Post-MVP (Conditional path decisions)

