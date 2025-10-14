# YBIS Product Requirements Document (PRD)

**Version:** 2.0  
**Last Updated:** 2025-10-12  
**Status:** Active  
**Product:** YBIS - AI Productivity Orchestrator

---

## 📋 Document Information

**Cross-References:**
- [Project Constitution](../YBIS_PROJE_ANAYASASI.md) - Technical principles
- [Development Log](../Güncel/DEVELOPMENT_LOG.md) - Architecture decisions
- [Tech Stack](../Güncel/tech-stack.md) - Implementation details
- [Product Roadmap](../roadmap/PRODUCT_ROADMAP.md) - Timeline & milestones

**Migration Note:** This document is updated from `docs/Archive/Legacy/prd.md` (v1.0, 2025-01-05)

---

## 🎯 Executive Summary

YBIS is an **AI-first productivity orchestrator** that connects and automates workflows across users' existing productivity tools (Notion, Todoist, Gmail, Google Calendar) through a simple **chat interface**. Unlike traditional productivity apps that require data migration, YBIS works WITH users' favorite tools, becoming the AI layer that makes them collaborate effortlessly.

**Current Status:** October 2025 - Closed Beta Development (Week 1, ~45% complete)  
**Target Launch:** Closed Beta - November 2025 (100-200 users)  
**Primary Users:** Tech-savvy professionals (16-35), ADHD individuals, freelancers, students  
**Business Model:** Freemium SaaS (pricing TBD post-cost analysis)

**Key Metrics:**
- Year 1: 5,000 users, NPS >50
- Year 2: 20,000 users, $1-2M ARR
- Year 5: 60,000 users, $5M ARR

---

## 🌟 Product Vision & Strategy

### Vision Statement

> "By 2030, YBIS is the de facto AI orchestration layer for 1M+ knowledge workers, making multi-tool productivity chaos obsolete through intelligent automation."

### Strategic Positioning

**Category:** Productivity Orchestrator (Blue Ocean, no direct competitors)  
**Positioning:** "Chat with all your productivity tools at once"  
**Differentiation:** Integration-first + Chat UX + Port Architecture (easy swapping)

**Not This:**
- ❌ "Better Notion" or "Todoist killer"
- ❌ All-in-one workspace replacement

**This:**
- ✅ AI layer that orchestrates existing tools
- ✅ Complement, not substitute
- ✅ Simple chat interface for complex workflows

**Architecture Advantage (NEW):**
- ✅ Port/Adapter pattern → Easy to swap providers
- ✅ Expo Auth Session → Simple OAuth (no Firebase lock-in)
- ✅ React 19.1 + Expo SDK 54 → Modern, performant

---

## 🎯 Goals & Success Criteria

### Business Goals

**Phase 0 (Closed Beta - Months 1-4):**
- **Goal:** Validate product-market fit
- **Success Criteria:**
  - 100-200 engaged users
  - NPS >40
  - Day 30 retention >20%
  - Qualitative: "Very disappointed" if product disappeared >40%

**Phase 1 (Open Beta - Months 5-7):**
- **Goal:** Validate cost structure and pricing
- **Success Criteria:**
  - 4,000-5,000 users
  - AI cost per user measured (<$5/month target)
  - Pricing tiers defined (Free/Lite/Full/Pro)
  - Infrastructure costs <20% of projected revenue

**Phase 2 (MVP Release - Months 8-11):**
- **Goal:** Launch monetization, achieve sustainability
- **Success Criteria:**
  - 20,000+ users
  - $200K+ ARR (Year 2 target)
  - Free → Paid conversion >5%
  - CAC <$25, LTV:CAC >3:1

---

### User Goals

**Functional Goal:**
> "Help me accomplish my daily responsibilities across all my tools without forgetting, missing deadlines, or feeling overwhelmed."

**Emotional Goal:**
> "Feel in control and confident about my productivity, with less stress and guilt."

**Social Goal:**
> "Be perceived as reliable, organized, and professional by peers and clients."

---

## 👥 Target Users & Personas

### Primary Persona: Alex the Tech-Savvy Professional

**Demographics:**
- Age: 24 years old
- Occupation: Junior Software Developer / Freelance Designer
- Location: Istanbul, Turkey (Phase 0), expands to US/UK (Phase 2+)
- Income: $30K/year
- Device: iPhone 13, uses mobile 80% of the time

**Behaviors:**
- Uses 7-8 productivity apps daily (Notion, Todoist, Google Calendar, Gmail, Slack, Spotify, WhatsApp)
- Switches apps 25+ times per day
- Tries new productivity systems monthly (low tool loyalty)
- Active on Reddit (r/productivity), TikTok (productivity hacks), Instagram

**Pain Points:**
- **Integration Chaos:** "I spend 30 minutes manually syncing tasks from emails to Todoist to Calendar"
- **Context Switching:** "Every app switch costs me 5 minutes to remember what I was doing"
- **Overwhelm:** "I have 10 productivity apps but still feel disorganized"
- **Inconsistency:** "I start new systems but never stick with them"

**Jobs-to-be-Done:**
- Functional: "Coordinate my tasks, emails, and calendar without manual work"
- Emotional: "Stop feeling guilty about productivity failures"
- Social: "Impress clients with my responsiveness and organization"

**YBIS Value for Alex:**
- "Chat with YBIS to check all my apps at once"
- "YBIS automatically syncs Gmail tasks to Todoist and Calendar"
- "Simple interface I can use on my phone during commute"
- "AI remembers my work patterns and suggests workflows"

---

### Secondary Persona: Sam the ADHD Student

**Demographics:**
- Age: 19 years old
- Occupation: University student (Computer Science)
- Location: Ankara, Turkey
- Income: $0 (supported by family)
- Device: Android phone (budget-conscious)

**ADHD-Specific Needs:**
- Executive function support (planning, prioritization)
- External memory (forgets tasks/deadlines frequently)
- Distraction management (focus modes, reminders)
- Positive reinforcement (gamification, progress tracking)

**Pain Points:**
- **Forgetfulness:** "I forget assignments until the night before"
- **Overwhelm:** "Complex UIs shut down my brain"
- **Procrastination:** "I know what to do but can't start"
- **Consistency:** "I lose track of my planner after 2 weeks"

**YBIS Value for Sam:**
- "Chat interface (no complex UI to learn)"
- "AI reminds me of deadlines without manual setup"
- "Visual progress (streaks, achievements)"
- "Simple enough I won't abandon it"

---

## ✅ Functional Requirements (High-Priority)

### FR-001: AI Chat Interface (MUST HAVE - Phase 0)
**Description:** Users interact with YBIS through natural language chat to manage tasks, notes, calendar, and workflows.

**User Stories:**
- As Alex, I want to ask "What's on my schedule today?" and get a summary without opening Google Calendar
- As Sam, I want to say "Remind me to study at 7pm" and YBIS creates a task + calendar event automatically

**Acceptance Criteria:**
- ✅ Chat UI supports text input + voice input (Phase 1+)
- ✅ AI responds within 5 seconds (95th percentile)
- ✅ Conversation context maintained (5+ messages)
- ✅ AI suggests follow-up actions (quick reply buttons)

**Technical Implementation:**
- Chat UI: Gifted Chat (Phase 0) → Custom Chat (Phase 1+)
- AI Provider: OpenAI GPT-4o-mini (via LLMPort)
- State: Zustand chat store
- Persistence: AsyncStorage (offline support)

**Success Metric:** >70% users complete first AI interaction within 5 minutes

---

### FR-002: Task Management (MUST HAVE - Phase 0)
**Description:** Users can create, view, update, and complete tasks via chat or UI.

**User Stories:**
- As Alex, I want to add tasks via chat ("Add task: review PR") and see them in the Tasks screen
- As Sam, I want to check off tasks and see visual progress (streak counter)

**Acceptance Criteria:**
- ✅ Create task via chat + manual UI
- ✅ View tasks (list, filters: today, upcoming, completed)
- ✅ Update task (title, due date, priority)
- ✅ Complete task (swipe gesture OR checkbox)
- ✅ Task persistence (Supabase sync)

**Technical Implementation:**
- Database: Supabase `tasks` table
- State: Zustand taskStore
- UI: Tamagui components (Button, Input, Card)

**Success Metric:** >60% users create 3+ tasks in first week

---

### FR-003: Calendar Integration (MUST HAVE - Phase 0)
**Description:** Users can view and create calendar events via YBIS.

**User Stories:**
- As Alex, I want to ask "What's my schedule tomorrow?" and get events from Google Calendar
- As Sam, I want to block study time ("Block 2 hours for studying") and YBIS creates calendar event

**Acceptance Criteria:**
- ✅ View calendar events (today, this week)
- ✅ Create event via chat ("Meeting at 3pm tomorrow")
- ✅ Google Calendar sync (OAuth via Expo Auth Session)
- ✅ Offline support (cache last sync)

**Technical Implementation:**
- Integration: Google Calendar API (via CalendarPort)
- Auth: Expo Auth Session (OAuth 2.0 + PKCE)
- Database: Supabase `calendar_events` table
- Sync: Real-time (WebSocket) for active users, batch (30s) for background

**Success Metric:** >50% users connect Google Calendar in first week

---

## 🔒 Non-Functional Requirements

### NFR-001: Performance - Response Time (CRITICAL)
**Description:** YBIS must feel fast and responsive.

**Requirements:**
- App launch: <2 seconds (cold start)
- Screen navigation: <200ms
- AI response: <5 seconds (95th percentile)
- Task creation: <500ms (instant feedback)

**Technical Approach:**
- React 19.1.0 Suspense + transitions
- Tamagui (native performance)
- Optimistic UI updates (no waiting for API)
- AI streaming (show response as it generates - Phase 1+)

**Alignment with AD-002 (Development Log):**  
React 19.1.0 chosen specifically for performance targets above.

---

### NFR-002: Security - Authentication (CRITICAL)
**Description:** Secure, simple user authentication.

**Requirements:**
- OAuth 2.0 for Google Sign-In
- PKCE flow (no client secret exposure)
- Secure token storage (Expo SecureStore)
- Auto-refresh tokens (seamless UX)

**Technical Approach:**
- **Expo Auth Session** (NOT Firebase Auth) → AD-015 decision
- No password management (delegated to Google)
- ID token validation on backend (Google public keys)

**Why Expo Auth Session (from AD-015):**
- ✅ No Firebase dependency
- ✅ Pure JavaScript (Expo Managed compatible)
- ✅ Multi-provider support (Google, GitHub, Apple)
- ✅ Backend control (we manage tokens)

**Success Metric:** <3% auth error rate, >90% successful sign-ins

---

### NFR-003: Scalability (HIGH)
**Description:** System scales to support user growth.

**Requirements:**
- Phase 0: 100-200 users (<5% error rate)
- Phase 1: 5,000 users (<2% error rate)
- Phase 2: 20,000 users (<1% error rate)

**Technical Approach:**
- **Serverless:** Vercel Edge Functions (Phase 0) → DeploymentPort for easy swap
- **Database:** Supabase (managed PostgreSQL)
- **CDN:** Vercel CDN (static assets)
- **Queue:** Redis/Bull (Phase 2+, background jobs)

**DeploymentPort Strategy (NEW):**
- ✅ **Port Architecture:** Backend deployment also uses port/adapter pattern
- ✅ **Phase 0:** VercelEdgeAdapter (quick start, zero config)
- ✅ **Phase 1:** Evaluate CloudflareWorkerAdapter (10x cheaper, faster)
- ✅ **Phase 2+:** Hybrid deployment (edge + long-running servers if needed)
- **Benefit:** Zero vendor lock-in, swap providers based on cost/performance

**Uptime Target:** >99.5% (Phase 1), >99.9% (Phase 2+)

---

## 🏗️ Technical Architecture

### Phase 0 Architecture Principles 🎯

**Core Philosophy: "Build for Scale, Ship Minimal"**

Phase 0'ın en büyük önceliği **sağlam, scalable temeller** atmaktır. Sadece feature yapmak değil, gelecekteki genişlemeyi kolay hale getirecek infrastructure kurmak.

**Prensip 1: Multi-Support Infrastructure (Ship Minimal)**
```yaml
ThemePort:
  infrastructure: "Unlimited theme support"
  phase_0_ships: "Only dark + light"
  future: "Ocean, Forest, Custom themes (zero code change)"
  
LLMPort:
  infrastructure: "Multi-provider + fallback system"
  phase_0_ships: "Only OpenAI"
  future: "Anthropic, Gemini, Custom LLMs (plug & play)"
  
LanguagePort:
  infrastructure: "Multi-language framework"
  phase_0_ships: "Only TR + EN"
  future: "Spanish, French, Arabic (just add translations)"
```

**Prensip 2: Plugin-Based Features (Vertical Scalability)**
```yaml
UI_Architecture:
  pattern: "Feature registration system"
  phase_0_ships: "4 verticals (Tasks, Calendar, Notes, Flows)"
  future: "Finance, Health, CRM verticals (no core changes)"
  benefit: "Add/remove features without touching core"
  
Widget_System:
  pattern: "Dynamic widget slots"
  phase_0_ships: "Simple summary widgets"
  future: "Custom widgets, third-party extensions"
```

**Prensip 3: Future-Proof Interfaces**
```yaml
All_Ports:
  design: "Interface > Implementation"
  phase_0: "Single adapter per port (speed)"
  future: "Multiple adapters (flexibility)"
  migration: "Swap adapter, not rewrite core"

Examples:
  - AuthPort: ExpoAuth → SupabaseAuth (seamless swap)
  - DeploymentPort: Vercel → Cloudflare (cost optimize)
  - ChatPort: Gifted → Custom (UX control)
```

**Prensip 4: No Forced Architecture (Graceful Growth)**
```yaml
New_Features:
  requirement: "Must NOT force architectural changes"
  test: "Can we add vertical X without touching core Y?"
  
Example - Finance Vertical:
  ✅ Register as new feature
  ✅ Add own widget
  ✅ Own screen + routes
  ❌ NO changes to Tasks/Calendar/Core
```

**Success Criteria:**
- ✅ New theme addable in <1 hour (just config)
- ✅ New LLM provider addable in <2 hours (just adapter)
- ✅ New vertical feature addable in <1 day (no core changes)
- ✅ Migration to new provider possible in <1 week

**Trade-off:**
- ❌ More abstraction = slightly more code upfront
- ✅ But: 10x faster iterations in Phase 1+
- ✅ Zero technical debt from "temporary solutions"

---

### Current Tech Stack (as of October 2025)

**Aligned with [YBIS_PROJE_ANAYASASI.md](../YBIS_PROJE_ANAYASASI.md) + [Development Log AD-XXX](../Güncel/DEVELOPMENT_LOG.md)**

**Mobile:**
- **Expo SDK 54** + **React 19.1.0** (AD-002)
- **Expo Managed Workflow** (AD-001) → Expo Bare if native needed
- **Expo Router 6.0** (file-based routing)
- **Tamagui 1.135** (universal UI, mobile+web)
- **Zustand** (state management)
- **React Query** (data fetching, caching)

**Backend:**
- **Hono 4.6** (API server)
- **Vercel** (deployment, serverless)
- **Supabase** (PostgreSQL database, real-time)

**Auth:**
- **Expo Auth Session 7.0** (OAuth 2.0 + PKCE) → AD-015
- **NO Firebase Auth** (removed to avoid vendor lock-in)
- **AuthPort interface** → Easy to swap providers later

**AI:**
- **OpenAI GPT-4o-mini** (via LLMPort)
- **LLMPort interface** → Multi-provider support (Phase 1+)

**Integrations:**
- **Google Calendar API** (via CalendarPort)
- **Notion API** (Phase 1+, via NotionPort)
- **Todoist API** (Phase 1+, via TodoistPort)

**Port Architecture (from Anayasa):**
- **AuthPort** → ExpoAuthAdapter (now), SupabaseAuthAdapter (Open Beta)
- **LLMPort** → OpenAIAdapter (now), MultiLLMAdapter (Open Beta)
- **ChatPort** → GiftedChatAdapter (now), CustomChatAdapter (Open Beta)
- **DatabasePort** → SupabaseDatabaseAdapter (stable)
- **ThemePort** → TamaguiThemeAdapter (stable)
- **LanguagePort** → i18nextAdapter (TR+EN Day 1)
- **DeploymentPort** → VercelEdgeAdapter (now), CloudflareWorkerAdapter (Phase 1+) 🆕

**Architecture Benefit:**
- 🔄 Easy provider swap (no code rewrite, just adapter change)
- 💰 Cost optimization (migrate to cheaper providers without risk)
- 🚀 Performance tuning (test different platforms, pick best)
- 🛡️ Zero vendor lock-in (freedom to move anytime)

---

## 🎨 User Experience Requirements

### UX-001: Onboarding Flow

**Goal:** Get user to first value (AI interaction) within 5 minutes.

**Flow:**
```
1. Welcome Screen
   ├─> "YBIS orchestrates all your productivity tools"
   └─> CTA: "Sign in with Google"

2. Google Sign-In (Expo Auth Session)
   ├─> OAuth flow (PKCE, no Firebase)
   └─> Permission: Email, basic profile

3. Personalization (Optional)
   ├─> "Which tools do you use?" (Notion, Todoist, Google, Other)
   └─> Skip option (defer to later)

4. First Workflow
   ├─> "Try asking: 'What's on my schedule today?'"
   ├─> AI responds with example data (if no calendar yet)
   └─> Success: User sees AI chat working

5. Integration Setup (Deferred)
   ├─> "Connect Google Calendar for real data"
   └─> CTA: "Connect Later" (don't force)
```

**Success Metric:** >70% users complete first AI interaction within 5 minutes.

**Alignment with AD-015:**  
Simple OAuth flow (no complex Firebase setup) supports 5-minute onboarding goal.

---

### UX-002: Mobile-First Design

**Screen Sizes:** ✅ **CONFIRMED**
- Small: iPhone SE (4.7", 375x667)
- Medium: iPhone 13 (6.1", 390x844)
- Large: iPhone 13 Pro Max (6.7", 428x926)
- Tablet: iPad (10.2", 810x1080) - Phase 2+

**Navigation:** ⚠️ **UPDATED - NEW DESIGN IMPLEMENTED**
- ~~Bottom tab bar (5 tabs max)~~ → **DEPRECATED ❌**
- **Current Implementation (as of Oct 2025):**
  - Top header: Menu (left), Notifications + Profile (right)
  - Slidable horizontal tabs: Notes, Tasks, Calendar, Flows
  - Widget area (1/5 screen, sticky)
  - Chat area (center, scrollable)
  - Input bar (bottom, fixed)
- **Design Decision:** Widget-based + chat-centric approach
- **Future:** May evolve based on user feedback

**Gestures:** 🔄 **TBD (Not Finalized)**
- ~~Swipe to complete task~~ → **NOT IMPLEMENTED YET**
- ~~Pull to refresh~~ → **TBD**
- ~~Long-press for context menu~~ → **TBD**
- **Note:** Gesture interactions under evaluation in UX testing

**Dark Mode:** ✅ **CONFIRMED**
- System dark mode (iOS/Android)
- Auto-switch based on time (optional)

---

## 📊 Success Metrics & KPIs

### North Star Metric
**Daily Active Workflows Executed per User**
- Measures: Engagement + Value delivery + Retention
- Target: 1+ workflow/day per active user (Phase 2+)

### Acquisition Metrics
| Metric | Phase 0 | Phase 1 | Phase 2 | Phase 3+ |
|--------|---------|---------|---------|----------|
| Total Users | 100-200 | 4,000-5,000 | 20,000+ | 100,000+ |
| User Growth (MoM) | N/A | 50-100% | 20-30% | 15-25% |
| CAC | N/A (organic) | <$15 | <$25 | <$20 |
| Organic % | 100% | >60% | >40% | >50% |

### Activation Metrics
| Metric | Target | Phase |
|--------|--------|-------|
| Time to First AI Interaction | <5 minutes | All |
| Integration Setup Rate | >60% | Phase 1+ |
| First Workflow Execution | >70% | All |

### Engagement Metrics
| Metric | Target | Phase |
|--------|--------|-------|
| DAU/MAU Ratio | >40% | Phase 2+ |
| Sessions per Week | >3 | All |
| Session Duration | >8 minutes | All |

### Retention Metrics
| Metric | Phase 0 | Phase 1+ | Phase 2+ |
|--------|---------|----------|----------|
| Day 7 Retention | >40% | >45% | >50% |
| Day 30 Retention | >20% | >25% | >30% |
| Churn Rate (Paid) | N/A | <7% | <5% |

---

## 🚧 Open Questions & Decisions

### Product Decisions 🔄 **TBD - Requires User Feedback**

**Q1: Integration Priority** ⏳ **PENDING DECISION**
- **Status:** 🔄 TBD (Closed Beta feedback needed)
- **Options:** 
  - A) Google → Todoist → Notion (easier API first)
  - B) Google → Notion → Todoist (user demand priority)
- **Decision Criteria:** User demand (beta feedback), integration complexity
- **Timeline:** ⏰ Decide by Week 4 (Closed Beta user interviews)
- **Current Recommendation:** Option A (Todoist simpler API)

**Q2: Pricing Tiers** ⏳ **PENDING COST ANALYSIS**
- **Status:** 🔄 TBD (Open Beta cost data needed)
- **Options:**
  - Simple: Free + Pro ($10/month)
  - Standard: Free + Lite ($5) + Pro ($15) ⭐
  - Complex: Free + Lite ($5) + Full ($12) + Pro ($20)
- **Decision Criteria:** Unit economics (AI cost per user), competitive analysis, conversion rates
- **Timeline:** ⏰ Decide by Phase 1 (Open Beta, Month 5)
- **Current Recommendation:** Standard (3 tiers), validate with data

**Q3: Web Dashboard** ✅ **CONFIRMED - Open Beta Launch**
- **Status:** ✅ FINALIZED
- **Decision:** Mobile-only (Closed Beta) → **Mobile + Web (Open Beta)**
- **Rationale:** 
  - Web dashboard essential for power users
  - Competitive parity (Motion, Akiflow have web)
  - Desktop workflow support (larger screens for planning)
- **Timeline:** ⏰ Open Beta launch (Month 5-7)
- **Scope:** Read-only dashboard initially, full feature parity Phase 2+

**Q4: Navigation Pattern** ✅ **CORE DESIGN CONFIRMED (Details TBD)**
- **Status:** ✅ Main screen design finalized, widget specifics TBD
- **Main Screen (Confirmed):**
  - Widget-based layout + slidable horizontal tabs ✅
  - Top header (menu, notifications, profile) ✅
  - Widget area (1/5 screen, sticky) ✅
  - Chat area (center, scrollable) ✅
  - Input bar (bottom, fixed) ✅
- **Widget Interaction (Confirmed):**
  - Widget design: Minimal + functional
  - Widget click: Navigate to detail page (Tasks, Calendar, etc.)
- **TBD (Week 3):**
  - Widget content/layout specifics
  - Interaction patterns (hover, long-press, etc.)
- **Other Screens:** Settings, task detail pages (standard navigation)

**Q5: Gesture Interactions** ⚠️ **NEW - NOT IMPLEMENTED**
- **Status:** 🔄 TBD (Design exploration needed)
- **Proposed:** Swipe to complete, pull to refresh, long-press menus
- **Decision Criteria:** Platform conventions, accessibility, user preference
- **Timeline:** ⏰ Design + test in Phase 1
- **Note:** Currently not implemented, may add based on feedback

### Technical Decisions 🔧

**MCP Integration Timeline** ✅ **FINALIZED**
- **Status:** ✅ Timeline confirmed
- **Decision:** Post Open Beta → Pre-Release (Month 8-10)
- **Trigger Conditions:**
  - Open Beta success validated (retention, engagement)
  - >15 integrations planned OR third-party developer interest
- **Current Strategy:** Port Architecture (Phase 0-1), MCP evaluation in Open Beta
- **Rationale:** Need production data + cost analysis before MCP commitment
- **Fallback:** Continue port architecture if MCP criteria not met
- **Reference:** [INTEGRATION_ROADMAP.md](../Güncel/INTEGRATION_ROADMAP.md)

**Scalability Strategy ("Build for Scale, Ship Minimal")** 🔄 **UNDER REFINEMENT**
- **Status:** ⚠️ Principle defined, implementation details TBD
- **Closed Beta Strategy:** Development speed + solid foundation **balance**
  - **Fully Scalable Now:** AuthPort, DatabasePort, DeploymentPort (easy swap)
  - **Temporary/Discardable:** ChatPort (Gifted → Custom Open Beta), UI layouts (may evolve)
  - **Trade-off Debate:** Upfront abstraction cost vs future refactor cost
- **Open Beta Strategy:** Full scalable infrastructure
- **Decision Timeline:** ⏰ Week 2-3 (finalize which ports are scalable vs temporary)
- **Key Question:** Where to draw the line between speed and scalability?

**Competitive Analysis** 🔄 **PENDING (Critical Missing)**
- **Status:** ⚠️ NOT DONE - Identified gap in planning
- **Competitors:** Motion, Akiflow, Sunsama, Reclaim, Notion Calendar
- **Timeline:** ⏰ Open Beta preparation (before launch)
- **Scope:** Feature comparison, pricing analysis, UX patterns, differentiation strategy
- **Impact:** Affects positioning, pricing, feature priorities
- **Note:** Kaçmış planlamada - kritik eksik!

---

## 🔗 Cross-References & Dependencies

### Strategic Documents (Tier -1)
- [Project Vision](../vision/PROJECT_VISION.md) - Why we build
- [Market Research](../strategy/MARKET_RESEARCH.md) - User insights
- [Competitive Strategy](../strategy/COMPETITIVE_STRATEGY.md) - Positioning
- [Product Roadmap](../roadmap/PRODUCT_ROADMAP.md) - Timeline

### Technical Documents (Tier 0)
- [YBIS_PROJE_ANAYASASI.md](../YBIS_PROJE_ANAYASASI.md) - Architecture principles
- [DEVELOPMENT_LOG.md](../Güncel/DEVELOPMENT_LOG.md) - AD-XXX decisions

### Implementation (Tier 1-2)
- [tech-stack.md](../Güncel/tech-stack.md) - Package versions
- [package-structure.md](../Güncel/package-structure.md) - Monorepo layout
- [tasks.md](../Güncel/tasks.md) - 165 executable tasks

**Key Dependencies:**
- User personas (this doc) → Architecture principles (Anayasa)
- Feature priorities (this doc) → Technical decisions (Development Log)
- Success metrics (this doc) → Quality gates (Anayasa)
- Timeline (this doc) → Task breakdown (tasks.md, Roadmap)

---

## 📝 Document History

**v2.0 (2025-10-12):**
- ✅ Updated tech stack (Firebase → Expo Auth Session)
- ✅ Aligned with current architecture decisions (AD-001, AD-002, AD-015, AD-016)
- ✅ Updated timeline (October 2025, Closed Beta development)
- ✅ Added cross-references to Tier -1 (Strategy) and Tier 0 (Technical) docs
- ✅ Added DeploymentPort strategy (backend deployment portlama)
- 🎯 **Added Phase 0 Architecture Principles:**
  - "Build for Scale, Ship Minimal" philosophy
  - Multi-support infrastructure (themes, LLMs, languages)
  - Plugin-based features (vertical scalability)
  - Future-proof interfaces (graceful growth)
  - Success criteria: <1hr theme, <2hr LLM, <1day vertical
- ✅ **Finalized Key Decisions (from user notes):**
  - Q3: Web Dashboard → Confirmed for Open Beta ✅
  - Q4: Navigation → Main screen design confirmed (widget details TBD)
  - MCP Integration → Timeline finalized (Post Open Beta)
  - Scalability Strategy → Debate ongoing (scalable vs discardable)
  - Competitive Analysis → Identified as critical missing item
- ⚠️ **Marked deprecated/TBD items:**
  - Navigation: Bottom tab bar → DEPRECATED (new widget-based design)
  - Gestures: Swipe/pull/long-press → TBD (not implemented)
  - Widget specifics → TBD (Week 3)
  - Scalability balance → Under refinement
- ✅ Preserved core product vision, personas, and requirements

**v1.0 (2025-01-05):**
- Initial draft (archived at `docs/Archive/Legacy/prd.md`)

