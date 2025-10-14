# YBIS Closed Beta Development Plan

**Version:** 1.0
**Last Updated:** 2025-01-05
**Scope:** Phase 0 (Closed Beta)
**Timeline:** 6 weeks (Solo development)
**Target:** 100-200 beta users, core value validation

---

## Overview

This plan outlines the **6-week development roadmap** for YBIS Closed Beta. Focus: **Speed, simplicity, validation**. No over-engineering, no scope creep.

**Success Criteria:**
- ✅ App launches on iOS + Android
- ✅ Core features work offline (Tasks, Notes, Calendar)
- ✅ AI chat functional (OpenAI integration)
- ✅ 3-5 workflow templates executable
- ✅ 100+ beta testers recruited

---

## Week 1: Foundation & Setup

### Goals
- Monorepo infrastructure ready
- React Native app boots
- Hono backend responds
- Firebase Auth works

### Tasks

#### Day 1-2: Monorepo Setup
- [ ] Initialize npm workspaces structure
- [ ] Create `apps/mobile/` (React Native 0.81.4 + React 18.3.1)
- [ ] Create `backend/` (Hono + Node.js 20.11.0)
- [ ] Create `packages/core/` (shared types)
- [ ] Create `packages/mcp-core/` (MCP foundation stubs)
- [ ] Configure TypeScript (strict mode, path aliases)
- [ ] Set up ESLint + Prettier
- [ ] Create `.env.example` files

**Deliverable:** `npm install` works across all packages

---

#### Day 3: Mobile App Boilerplate
- [ ] React Native init (`npx react-native@0.81.4 init`)
- [ ] Install dependencies:
  - `zustand` (state management)
  - `react-navigation` (navigation)
  - `@react-native-async-storage/async-storage` (storage)
  - `@react-native-firebase/auth` (Firebase Auth)
  - `@react-native-google-signin/google-signin` (Google Sign-In)
- [ ] Configure metro.config.js (monorepo support)
- [ ] Create basic folder structure (screens, components, store, services)
- [ ] Test app launch (iOS Simulator + Android Emulator)

**Deliverable:** Blank RN app runs on both platforms

---

#### Day 4: Backend Boilerplate
- [ ] Install Hono (`npm install hono`)
- [ ] Create basic Hono app (`backend/src/index.ts`)
- [ ] Set up routes (`/api/health`, `/api/auth/*`)
- [ ] Configure CORS middleware
- [ ] Create `.env` file (API keys placeholders)
- [ ] Test local server (`npm run dev`)
- [ ] Deploy to Vercel (test deployment)

**Deliverable:** `GET /api/health` returns `{ status: 'ok' }`

---

#### Day 5: Firebase Auth Integration
- [ ] Create Firebase project (Firebase Console)
- [ ] Enable Google Sign-In authentication
- [ ] Configure OAuth consent screen
- [ ] Download `google-services.json` (Android) + `GoogleService-Info.plist` (iOS)
- [ ] Implement Google Sign-In flow in mobile app
- [ ] Create `/api/auth/google` endpoint (backend)
- [ ] Test end-to-end: Mobile → Google OAuth → Firebase token → Backend verification

**Deliverable:** User can sign in with Google, backend receives valid token

---

#### Day 6-7: AsyncStorage Integration
- [ ] Create `TaskStorageService` (AsyncStorage wrapper)
- [ ] Create `NoteStorageService`
- [ ] Create `CalendarStorageService`
- [ ] Implement CRUD operations (create, read, update, delete)
- [ ] Write unit tests for storage services (Jest)
- [ ] Test data persistence (app restart)

**Deliverable:** Data persists locally across app restarts

---

### Week 1 Checkpoint
**Review:**
- ✅ Monorepo builds successfully
- ✅ Mobile app runs (iOS + Android)
- ✅ Backend deployed (Vercel)
- ✅ Auth works (Google Sign-In)
- ✅ AsyncStorage functional

**Risks to Address:**
- Metro config issues (monorepo path resolution)
- Firebase Auth configuration errors
- Vercel deployment environment variables

---

## Week 2: Core Features (Local-First)

### Goals
- Task management CRUD
- Note management CRUD
- Calendar basic view
- All features work offline

### Tasks

#### Day 8-9: Task Management
- [ ] Create `Task` TypeScript interface (`packages/core/src/types/task.ts`)
- [ ] Create Zustand `useTaskStore` (state management)
- [ ] Implement task CRUD actions (create, update, complete, delete)
- [ ] Create `TaskList` component (UI)
- [ ] Create `TaskItem` component (swipe actions)
- [ ] Add task priority (high, medium, low)
- [ ] Add due date picker
- [ ] Test offline functionality

**Deliverable:** User can create, complete, and delete tasks offline

---

#### Day 10-11: Note Management
- [ ] Create `Note` TypeScript interface
- [ ] Create Zustand `useNoteStore`
- [ ] Implement note CRUD actions
- [ ] Create `NoteList` component
- [ ] Create `NoteEditor` component (plain text for MVP, markdown Phase 1+)
- [ ] Add note search (simple string matching)
- [ ] Add tag system (comma-separated tags)
- [ ] Test offline functionality

**Deliverable:** User can create, edit, search notes offline

---

#### Day 12-13: Calendar Management
- [ ] Create `CalendarEvent` TypeScript interface
- [ ] Create Zustand `useCalendarStore`
- [ ] Implement event CRUD actions
- [ ] Create `DailyView` component (list of events for selected day)
- [ ] Create `EventCard` component
- [ ] Add date picker (react-native-date-picker)
- [ ] Test offline functionality

**Deliverable:** User can view and create local calendar events

---

#### Day 14: UI/UX Polish (First Pass)
- [ ] Design token system (colors, spacing, typography)
- [ ] Create reusable components (Button, Input, Card)
- [ ] Implement dark mode (system preference)
- [ ] Add loading states
- [ ] Add error states
- [ ] Test UI on different screen sizes

**Deliverable:** Consistent UI across all screens

---

### Week 2 Checkpoint
**Review:**
- ✅ Tasks work (create, complete, delete)
- ✅ Notes work (create, edit, search)
- ✅ Calendar works (daily view, events)
- ✅ All offline (AsyncStorage)
- ✅ Basic UI polish

**Risks:**
- Performance issues with large datasets (100+ tasks/notes)
- UI responsiveness on low-end Android devices

---

## Week 3: AI Integration

### Goals
- OpenAI API connected
- AI chat interface functional
- Tool calling works (create task, note, etc.)
- Conversation history persists

### Tasks

#### Day 15-16: OpenAI Integration
- [ ] Create OpenAI API key (platform.openai.com)
- [ ] Install `openai` npm package (backend)
- [ ] Create `/api/chat/message` endpoint
- [ ] Implement chat completion (GPT-4o-mini)
- [ ] Define tool schemas (create_task, list_tasks, create_note, get_calendar)
- [ ] Implement tool calling handler
- [ ] Test API calls (Postman/Insomnia)

**Deliverable:** Backend can call OpenAI and execute tools

---

#### Day 17-18: Chat UI Implementation
- [ ] Create `ChatInterface` component
- [ ] Create `MessageBubble` component (user vs. AI)
- [ ] Create Zustand `useChatStore`
- [ ] Implement message sending (mobile → backend → OpenAI)
- [ ] Display AI responses
- [ ] Add loading indicator ("AI is thinking...")
- [ ] Add quick action buttons (suggested actions)

**Deliverable:** User can chat with AI, see responses

---

#### Day 19-20: Tool Calling Integration
- [ ] Connect AI tool calls to local storage
  - `create_task` → `TaskStorageService.createTask()`
  - `list_tasks` → `TaskStorageService.getTasks()`
  - `create_note` → `NoteStorageService.createNote()`
  - `get_calendar` → `CalendarStorageService.getEvents()`
- [ ] Test end-to-end: "Create task: Buy groceries tomorrow" → Task created
- [ ] Handle errors gracefully (AI call fails, tool execution fails)
- [ ] Add confirmation UI (show what AI created)

**Deliverable:** AI can create tasks, notes, fetch calendar via chat

---

#### Day 21: Conversation History
- [ ] Store chat messages in AsyncStorage
- [ ] Load conversation history on app launch
- [ ] Limit history to last 50 messages (performance)
- [ ] Add "Clear chat history" button (Settings)
- [ ] Test conversation context (AI remembers previous messages)

**Deliverable:** Conversation persists, AI has context

---

### Week 3 Checkpoint
**Review:**
- ✅ OpenAI API integrated
- ✅ Chat UI functional
- ✅ AI can create tasks, notes, check calendar
- ✅ Conversation history works

**Risks:**
- OpenAI API latency (>5s response times)
- Token costs (if beta users spam)
- Tool calling errors (AI hallucinations)

---

## Week 4: Workflows & Dashboard UI

### Goals
- 3-5 workflow templates implemented
- Workflow execution engine works
- Single-screen dashboard UI complete
- Push notifications basic setup

### Tasks

#### Day 22-23: Workflow Templates
- [ ] Define 3 workflow templates (hardcoded):
  1. Morning Routine (calendar + tasks summary)
  2. Daily Planning (plan tomorrow)
  3. Evening Review (today's accomplishments)
- [ ] Create `WorkflowTemplate` TypeScript interface
- [ ] Create workflow execution engine (`executeWorkflow()`)
- [ ] Implement workflow steps:
  - `get_calendar` (fetch events)
  - `list_tasks` (fetch tasks with filters)
  - `send_message` (send chat message to user)
  - `create_note` (create note with template)
- [ ] Test each workflow manually

**Deliverable:** 3 workflows execute successfully

---

#### Day 24: Workflow UI
- [ ] Create `WorkflowList` component (show available templates)
- [ ] Create `WorkflowCard` component (template info + execute button)
- [ ] Add workflow execution to chat (user can trigger via message)
- [ ] Add workflow scheduling (Phase 1 - stub for now)
- [ ] Test workflow execution from UI

**Deliverable:** User can execute workflows from UI or chat

---

#### Day 25-26: Single-Screen Dashboard
- [ ] Implement top 3 tabs (Plan, Tasks, Notes)
- [ ] Create `Dashboard` screen (main screen)
- [ ] Layout:
  - Header (profile, settings)
  - Top tabs (switch context)
  - Chat interface (always visible)
  - Dynamic content area (changes with tab)
  - Quick action FAB (floating action button)
- [ ] Implement tab switching logic
- [ ] Polish animations and transitions
- [ ] Test on different screen sizes

**Deliverable:** Single-screen dashboard functional, intuitive

---

#### Day 27: Push Notifications (Basic)
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Install `@react-native-firebase/messaging`
- [ ] Request notification permissions
- [ ] Implement local notifications (task reminders)
- [ ] Test notification delivery
- [ ] Add notification settings toggle

**Deliverable:** User receives task reminder notifications

---

#### Day 28: UX Polish (Second Pass)
- [ ] Refine UI spacing, colors, fonts
- [ ] Add micro-interactions (button press, swipe feedback)
- [ ] Improve loading states (skeleton screens)
- [ ] Add empty states ("No tasks yet")
- [ ] Test accessibility (screen reader, font scaling)
- [ ] Fix any remaining UI bugs

**Deliverable:** App feels polished and professional

---

### Week 4 Checkpoint
**Review:**
- ✅ 3-5 workflows work
- ✅ Dashboard UI complete
- ✅ Push notifications functional
- ✅ UX polished

**Risks:**
- Workflow execution bugs (edge cases)
- Dashboard performance (re-renders)
- Notification permission denied (user opt-out)

---

## Week 5: Testing & Bug Fixes

### Goals
- Manual testing (iOS + Android)
- Performance optimization
- Critical bug fixes
- Beta feedback collection setup

### Tasks

#### Day 29-30: Manual Testing (iOS)
- [ ] Test on multiple iOS devices (iPhone SE, iPhone 13, iPhone 13 Pro Max)
- [ ] Test all features (tasks, notes, calendar, chat, workflows)
- [ ] Test edge cases:
  - Empty states
  - Large datasets (100+ tasks/notes)
  - Offline → Online transitions
  - App backgrounding/foregrounding
- [ ] Document bugs (create issue tracker)

**Deliverable:** Bug list prioritized (P0, P1, P2)

---

#### Day 31-32: Manual Testing (Android)
- [ ] Test on multiple Android devices (Samsung Galaxy, Pixel, OnePlus)
- [ ] Test Android-specific features (back button, notifications)
- [ ] Test edge cases (same as iOS)
- [ ] Compare iOS vs. Android behavior (consistency check)
- [ ] Document Android-specific bugs

**Deliverable:** Android bug list

---

#### Day 33-34: Bug Fixes (Critical P0 Bugs)
- [ ] Fix crash bugs (highest priority)
- [ ] Fix data loss bugs (AsyncStorage failures)
- [ ] Fix authentication bugs (Google Sign-In issues)
- [ ] Fix AI integration bugs (tool calling errors)
- [ ] Re-test fixed bugs (regression testing)

**Deliverable:** All P0 bugs resolved

---

#### Day 35: Performance Optimization
- [ ] Optimize AsyncStorage queries (batch reads)
- [ ] Optimize re-renders (React.memo, useMemo)
- [ ] Reduce app bundle size (remove unused dependencies)
- [ ] Optimize images (compress, use WebP)
- [ ] Test app launch time (<2s target)
- [ ] Test AI response time (<5s target)

**Deliverable:** Performance targets met

---

### Week 5 Checkpoint
**Review:**
- ✅ Manual testing complete (iOS + Android)
- ✅ Critical bugs fixed
- ✅ Performance optimized
- ✅ App stable for beta

**Risks:**
- Unforeseen critical bugs (late discovery)
- Performance issues on low-end devices

---

## Week 6: Beta Preparation & Launch

### Goals
- App Store / Play Store setup
- Beta tester recruitment
- Feedback collection infrastructure
- Soft launch to first 10-20 testers

### Tasks

#### Day 36-37: App Store Setup (iOS)
- [ ] Create Apple Developer account ($99/year)
- [ ] Create App ID (com.ybis.app)
- [ ] Configure app in App Store Connect
- [ ] Upload app icon, screenshots, description
- [ ] Create TestFlight beta group
- [ ] Upload beta build (via Xcode)
- [ ] Invite first 10 testers (personal network)

**Deliverable:** iOS beta available on TestFlight

---

#### Day 38: Play Store Setup (Android)
- [ ] Create Google Play Console account ($25 one-time)
- [ ] Configure app in Play Console
- [ ] Upload app icon, screenshots, description
- [ ] Create closed beta track
- [ ] Upload APK/AAB (via Android Studio)
- [ ] Invite first 10 testers (email list)

**Deliverable:** Android beta available on Play Console

---

#### Day 39: Feedback Collection Setup
- [ ] Create Google Form (beta feedback survey)
- [ ] Add in-app feedback button (Settings screen)
- [ ] Set up Sentry (error tracking) - optional
- [ ] Create Discord server OR Slack channel (beta community)
- [ ] Prepare onboarding email (instructions for testers)

**Deliverable:** Feedback infrastructure ready

---

#### Day 40: Beta Tester Recruitment
- [ ] Recruit from personal network (friends, colleagues)
- [ ] Post on Reddit (r/productivity, r/betatesting)
- [ ] Post on ProductHunt (Ship page)
- [ ] Invite ADHD community members (r/ADHD)
- [ ] Target: 50 testers recruited (10 active minimum)

**Deliverable:** 50+ beta signup requests

---

#### Day 41: Soft Launch (First 10-20 Testers)
- [ ] Send onboarding emails
- [ ] Monitor TestFlight/Play Console installs
- [ ] Watch for crash reports (Sentry or native)
- [ ] Collect initial feedback (Discord/Slack)
- [ ] Fix critical issues reported (hotfix if needed)

**Deliverable:** First 10-20 testers using the app

---

#### Day 42: Post-Launch Monitoring
- [ ] Daily check-ins with testers
- [ ] Review feedback (Google Form responses)
- [ ] Triage bugs (create GitHub issues)
- [ ] Plan Week 7+ (feature iterations based on feedback)
- [ ] Celebrate! 🎉 (Closed Beta launched)

**Deliverable:** Beta is live, feedback flowing

---

### Week 6 Checkpoint
**Review:**
- ✅ iOS beta live (TestFlight)
- ✅ Android beta live (Play Console)
- ✅ 10-20 active testers
- ✅ Feedback collection working

**Risks:**
- Low tester engagement (need to nurture community)
- Critical bugs discovered post-launch

---

## Post-Week 6: Iteration & Feedback Loop

### Week 7-12 Goals
- Gather user feedback (weekly interviews, surveys)
- Iterate on features (based on pain points)
- Fix bugs (prioritize based on severity)
- Prepare for Open Beta (Google integration planning)

### Weekly Cadence
- **Monday:** Review last week's feedback
- **Tuesday-Thursday:** Implement fixes/improvements
- **Friday:** Deploy updates (TestFlight/Play Console)
- **Weekly:** User interview (1-2 testers, 30 min each)

---

## Success Metrics (End of Closed Beta)

| Metric | Target | Status |
|--------|--------|--------|
| Beta Testers Recruited | 100-200 | TBD |
| Active Users (DAU) | 20-40 | TBD |
| App Crashes | <1% | TBD |
| NPS Score | >40 | TBD |
| Day 7 Retention | >40% | TBD |
| Day 30 Retention | >20% | TBD |
| AI Engagement | >70% use chat | TBD |
| Workflow Usage | >30% execute workflows | TBD |

---

## Risk Management

### High-Risk Items
1. **OpenAI API Costs:** Monitor token usage, set alerts if >$100/month
2. **App Store Rejection:** Follow guidelines, prepare appeal
3. **Firebase Auth Issues:** Have backup plan (email/password auth)
4. **Tester Churn:** Engage community, reward active feedback

### Mitigation Strategies
- Weekly risk review
- Contingency planning for critical dependencies (OpenAI, Firebase)
- Over-communicate with testers (transparency builds trust)

---

## Tools & Resources

### Development Tools
- **IDE:** VS Code (React Native Debugger, ESLint, Prettier)
- **Design:** Figma (UI mockups)
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions (optional, Phase 1+)
- **Error Tracking:** Sentry OR Firebase Crashlytics

### Communication Tools
- **Beta Community:** Discord OR Slack
- **Feedback:** Google Forms + In-app feedback button
- **User Interviews:** Calendly + Zoom

### Testing Devices
- **iOS:** iPhone SE (budget), iPhone 13 (mid), iPhone 13 Pro Max (flagship)
- **Android:** Samsung Galaxy A52 (budget), Pixel 6 (mid), Samsung S22 (flagship)

---

## Next Action

**Ready to start?** Choose one:

**A) Start Week 1 Now** → Create monorepo, set up boilerplate
**B) Use YBIS Agents** → Run `/YBIS:implement` to auto-generate tasks from this plan
**C) Refine Plan** → Adjust timeline, add/remove tasks

**Recommendation:** Start with **Option B** (YBIS agents) to generate actionable task list, then execute Week 1.

---

**End of Development Plan**

**Estimated Total Effort:** 6 weeks (240 hours solo, ~40 hours/week)
**Launch Target:** End of Week 6 (Soft launch to 10-20 testers)
**Scale Target:** Week 12 (100-200 active beta testers)
