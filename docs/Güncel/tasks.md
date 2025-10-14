# Tasks: YBIS Closed Beta (Phase 0)

**Input**:
- `development-plan.md` (6-week roadmap)
- `package-structure.md` v3.0 (Hybrid: npm → NX, Expo Managed → Bare)
- `Architecture_better.md` (tech stack decisions)
- `YBIS_PROJE_ANAYASASI.md` v2.0.0 (Hybrid approaches + 17 ports)

**Timeline**: 6 weeks (42 days)
**Target**: Closed Beta launch with 100-200 testers
**Last Updated**: 2025-10-12

**Strategy**: Hybrid/Progressive Enhancement
- **Week 1-2**: npm workspaces + Expo Managed (zero learning curve)
- **Week 3+**: NX migration (when complexity increases)

---

## Execution Flow

This task list breaks down the 6-week development plan into executable, dependency-ordered tasks with parallel execution opportunities marked [P].

---

## Phase 0.1: Setup & Infrastructure (Week 1: Days 1-7)

### Setup (Days 1-2) - npm workspaces ONLY

- [x] T001 Create root workspace with npm workspaces ✅ (Day 1)
  - Path: Root `/`
  - Commands:
    ```bash
    mkdir ybis && cd ybis
    npm init -y
    # Add "workspaces": ["apps/*", "packages/*"] to package.json
    ```
  - NO NX yet (Week 3+)

- [x] T002 [P] Create root configuration files ✅ (Day 1)
  - Files: `tsconfig.base.json`, `.eslintrc.js`, `.prettierrc`
  - Copy configs from package-structure.md v3.0
  - ⚠️ NO `nx.json` yet (Week 3+)

- [x] T003 [P] Create package directories ✅ (Day 1)
  - Command: `mkdir -p apps/mobile apps/web apps/backend packages/ui packages/core packages/chat packages/auth packages/database packages/llm packages/theme packages/i18n`

- [x] T004 [P] Create package.json for each package ✅ (Day 1)
  - Files: `apps/mobile/package.json`, `apps/backend/package.json`, `apps/web/package.json`, `packages/*/package.json`
  - Copy from package-structure.md v3.0
  - ⚠️ Use Week 1-2 npm workspace scripts (no nx commands)

- [x] T005 Install root dependencies ✅ (Day 1)
  - Command: `npm install`
  - Verify all packages link correctly via npm workspaces

### Mobile App Boilerplate (Day 3) - Expo Managed Workflow

- [x] T006 Initialize Expo Managed app in apps/mobile/ ✅ (Day 2)
  - Command: `cd apps/mobile && npx create-expo-app@latest . --template blank-typescript`
  - Version: Expo SDK 52 (latest stable)
  - ⚠️ Managed workflow: NO ios/ android/ folders created
  - Builds handled by EAS Build in cloud

- [x] T007 [P] Configure Expo Router ✅ (Day 2)
  - Files: `apps/mobile/app/_layout.tsx`, `apps/mobile/app/index.tsx`
  - Install: `npx expo install expo-router@~4.0.0`

- [x] T008 [P] Install mobile dependencies ✅ (Day 2)
  - Packages: `tamagui`, `zustand`, `@tanstack/react-query`, `react-hook-form`, `react-native-gifted-chat`, `expo-auth-session`, `expo-web-browser`, `expo-secure-store`, `expo-notifications`
  - Use `npx expo install` for Expo-compatible versions

- [x] T009 [P] Create mobile folder structure ✅ (Day 2)
  - Directories: `apps/mobile/src/components/`, `apps/mobile/src/services/`, `apps/mobile/src/stores/`, `apps/mobile/src/hooks/`, `apps/mobile/src/utils/`

- [x] T010 Configure Metro for monorepo ✅ (Day 2)
  - File: `apps/mobile/metro.config.js`
  - Add workspace paths from package-structure.md v3.0

- [x] T011 Test mobile app launch (Managed workflow) ✅ (Day 2)
  - Commands: `cd apps/mobile && npm start` (opens Expo Go)
  - Verify blank app runs on iOS/Android via Expo Go
  - Web test: `npm start -- --web` (Expo Web instant preview)

### Backend Boilerplate (Day 4)
- [x] T013 [P] Initialize Hono backend ✅ (Day 3)
  - Path: `apps/backend/src/index.ts`
  - Install: `hono@^4.6.14`, `@hono/node-server@^1.13.7`

- [x] T014 [P] Create backend route structure ✅ (Day 3)
  - Files: `apps/backend/src/routes/auth.ts`, `apps/backend/src/routes/tasks.ts`, `apps/backend/src/routes/notes.ts`, `apps/backend/src/routes/chat.ts`, `apps/backend/src/routes/index.ts`

- [x] T015 [P] Create backend middleware ✅ (Day 3)
  - Files: `apps/backend/src/middleware/auth.ts`, `apps/backend/src/middleware/errorHandler.ts`, `apps/backend/src/middleware/logger.ts`, `apps/backend/src/middleware/cors.ts`

- [x] T016 [P] Install backend dependencies ✅ (Day 3)
  - Packages: `openai@^4.73.1`, `@anthropic-ai/sdk@^0.34.1`, `@supabase/supabase-js@^2.47.10`, `zod@^3.24.1`
  - Note: No firebase-admin (using Expo Auth)

- [x] T017 Create health check endpoint ✅ (Day 3)
  - File: `apps/backend/src/index.ts`
  - Endpoint: `GET /api/health` returns `{ status: 'ok' }`

- [x] T018 Test local backend ✅ (Day 3)
  - Command: `npm run backend`
  - Verify: `curl http://localhost:3000/api/health`

- [ ] T019 Deploy backend to Vercel ⏳ (Pending)
  - File: `apps/backend/vercel.json`
  - Command: `vercel --prod`
  - Verify deployed endpoint responds

### Expo Auth Session Integration (Day 5)
- [ ] T020 Setup Google Cloud Console OAuth ⏳ (Pending)
  - Console: https://console.cloud.google.com/apis/credentials
  - Create OAuth Client IDs: Android, iOS, Web
  - Configure: Redirect URIs (ybis://auth/callback)
  - Note: NO Firebase project needed

- [ ] T021 Configure Expo Auth in mobile app ⏳ (Pending)
  - File: `apps/mobile/app.json`
  - Add: `scheme: "ybis"` for redirect URI
  - Install: `expo-auth-session`, `expo-web-browser`, `expo-crypto`
  - No Firebase plugins required

- [x] T022 Implement ExpoAuthAdapter (AuthPort) ✅ (Day 3)
  - File: `packages/auth/src/adapters/ExpoAuthAdapter.ts`
  - Implements: `AuthPort` interface
  - Methods: `signInWithOAuth()`, `signOut()`, `getCurrentUser()`
  - Status: ✅ IMPLEMENTED (310 lines, production-ready)

- [x] T023 Create AuthPort interface ✅ (Day 3)
  - File: `packages/core/src/ports/AuthPort.ts`
  - Interface: signInWithOAuth, signOut, getCurrentUser, refreshToken
  - Status: ✅ EXISTS

- [ ] T024 Implement Google Sign-In flow in mobile ⏳ (Pending - Story 2.1)
  - File: `apps/mobile/app/(auth)/login.tsx`
  - Use: `@ybis/auth` ExpoAuthAdapter
  - Status: ⏳ PENDING (Story 2.1)

- [ ] T025 Create auth store (Zustand) ⏳ (Pending)
  - File: `apps/mobile/src/stores/authStore.ts`
  - State: currentUser, isAuthenticated, signIn, signOut

- [ ] T026 Test end-to-end auth flow ⏳ (Pending)
  - Test: Mobile → Google OAuth → ID token → Backend validates token
  - Verify: User can sign in, token is valid
  - No Firebase dependencies

### Supabase Setup (Days 6-7)
- [x] T027 Create Supabase project ✅ (Day 3)
  - Console: https://supabase.com
  - Note: Project URL and anon key

- [x] T028 Create database schema ✅ (Day 3)
  - Tables: `users`, `tasks`, `notes`, `calendar_events`, `chat_messages`, `workflows`
  - File: `apps/backend/supabase/schema.sql` (create locally)

- [x] T029 Implement SupabaseAdapter (DatabasePort) ✅ (Day 3)
  - File: `packages/database/src/adapters/SupabaseAdapter.ts`
  - Copy from package-structure.md

- [x] T030 Create DatabasePort interface ✅ (Day 3)
  - File: `packages/core/src/ports/DatabasePort.ts`
  - Methods: query, findById, insert, update, delete, subscribe

- [x] T031 Test Supabase connection ✅ (Day 3)
  - File: `apps/backend/src/services/database/supabaseClient.ts`
  - Test: Insert/query sample data

---

## Phase 0.2: Core Features - Local First (Week 2: Days 8-14)

### Task Management (Days 8-9)
- [ ] T032 [P] Create Task type
  - File: `packages/core/src/types/task.ts`
  - Interface: Task, CreateTaskDTO, UpdateTaskDTO

- [ ] T033 [P] Create TaskService (domain logic)
  - File: `packages/core/src/domain/task/TaskService.ts`
  - Methods: validateTask, calculatePriority, filterTasks

- [ ] T034 Create task table in Supabase
  - Run migration: `tasks` table (id, title, description, status, priority, dueDate, userId, createdAt, updatedAt)

- [ ] T035 Create taskStore (Zustand)
  - File: `apps/mobile/src/stores/taskStore.ts`
  - Actions: loadTasks, addTask, updateTask, deleteTask, completeTask
  - Uses: `@ybis/database` SupabaseAdapter

- [ ] T036 [P] Create TaskList component
  - File: `apps/mobile/src/components/tasks/TaskList.tsx`
  - Uses: Tamagui components from `@ybis/ui`

- [ ] T037 [P] Create TaskItem component
  - File: `apps/mobile/src/components/tasks/TaskItem.tsx`
  - Features: Swipe actions, priority badge, due date

- [ ] T038 Create Tasks screen
  - File: `apps/mobile/app/(tabs)/tasks.tsx`
  - Integrates: TaskList, add task button

- [ ] T039 Test task CRUD
  - Test: Create, update, complete, delete tasks
  - Verify: Data persists in Supabase

### Note Management (Days 10-11)
- [ ] T040 [P] Create Note type
  - File: `packages/core/src/types/note.ts`
  - Interface: Note, CreateNoteDTO, UpdateNoteDTO

- [ ] T041 [P] Create NoteService
  - File: `packages/core/src/domain/note/NoteService.ts`
  - Methods: searchNotes, extractTags, formatNote

- [ ] T042 Create notes table in Supabase
  - Table: `notes` (id, title, content, tags, userId, createdAt, updatedAt)

- [ ] T043 Create noteStore (Zustand)
  - File: `apps/mobile/src/stores/noteStore.ts`
  - Actions: loadNotes, addNote, updateNote, deleteNote, searchNotes

- [ ] T044 [P] Create NoteList component
  - File: `apps/mobile/src/components/notes/NoteList.tsx`

- [ ] T045 [P] Create NoteEditor component
  - File: `apps/mobile/src/components/notes/NoteEditor.tsx`
  - Editor: Plain text (Phase 0), markdown Phase 1+

- [ ] T046 Create Notes screen
  - File: `apps/mobile/app/(tabs)/notes.tsx`
  - Features: Search bar, tag filter

- [ ] T047 Test note CRUD
  - Test: Create, edit, search, delete notes
  - Verify: Supabase sync works

### Calendar Management (Days 12-13)
- [ ] T048 [P] Create CalendarEvent type
  - File: `packages/core/src/types/calendar.ts`

- [ ] T049 Create calendar_events table in Supabase
  - Table: `calendar_events` (id, title, startTime, endTime, description, userId, createdAt)

- [ ] T050 Create calendarStore (Zustand)
  - File: `apps/mobile/src/stores/calendarStore.ts`
  - Actions: loadEvents, addEvent, updateEvent, deleteEvent

- [ ] T051 [P] Create DailyView component
  - File: `apps/mobile/src/components/calendar/DailyView.tsx`
  - Shows: Events for selected day

- [ ] T052 [P] Create EventCard component
  - File: `apps/mobile/src/components/calendar/EventCard.tsx`

- [ ] T053 Create Plan screen (calendar view)
  - File: `apps/mobile/app/(tabs)/plan.tsx`
  - Date picker: `react-native-date-picker`

- [ ] T054 Test calendar CRUD
  - Test: Create, view, edit events
  - Verify: Supabase sync

### UI/UX Polish First Pass (Day 14)
- [ ] T055 [P] Create theme configuration
  - File: `packages/theme/src/theme.ts`
  - Copy Tamagui config from package-structure.md

- [ ] T056 [P] Create reusable UI components
  - Files: `packages/ui/src/Button.tsx`, `packages/ui/src/Input.tsx`, `packages/ui/src/Card.tsx`, `packages/ui/src/Text.tsx`, `packages/ui/src/Skeleton.tsx`

- [ ] T057 Implement dark mode
  - Use: Tamagui theme switching
  - Test: Light/dark mode toggle

- [ ] T058 [P] Add loading states
  - Components: Skeleton loaders for lists

- [ ] T059 [P] Add empty states
  - Components: "No tasks yet", "No notes yet", etc.

- [ ] T060 Test UI on different screen sizes
  - Devices: Small (iPhone SE), Large (iPhone 13 Pro Max)

---

## Phase 0.3: AI Integration (Week 3: Days 15-21)

###  Migration (Day 15 - MorningNX) - Hybrid Approach

**Trigger**: Week 3 reached OR build time >2min OR >5 packages created

- [ ] T060A Run NX initialization
  - Command: `npx nx init`
  - Effect: Adds NX layer on top of npm workspaces (non-breaking)
  - Files created: `nx.json`, `node_modules/.bin/nx`
  - Workspace config: Keeps existing `workspaces: ["apps/*", "packages/*"]`

- [ ] T060B [P] Add project.json to apps
  - Files: `apps/mobile/project.json`, `apps/backend/project.json`, `apps/web/project.json`
  - Copy from package-structure.md v3.0 (Week 3+ section)

- [ ] T060C Update root package.json scripts
  - Replace npm workspace scripts with nx commands
  - New scripts: `"mobile": "nx run mobile:start"`, `"build": "nx run-many --target=build --all"`, etc.
  - Copy from package-structure.md v3.0 (Week 3+ section)

- [ ] T060D Test NX caching
  - Command: `nx build mobile` (twice)
  - Verify: Second run uses cache (faster)
  - Command: `nx affected:test` (verify affected detection)

- [ ] T060E Test NX graph
  - Command: `nx graph`
  - Verify: Dependency graph shows all apps/packages

**Migration Time:** 2-3 hours
**Risk:** LOW (nx init is additive, reversible)

---

### OpenAI Integration (Days 15-16)
- [ ] T061 Create OpenAI API key
  - Platform: https://platform.openai.com

- [ ] T062 [P] Create LLMPort interface
  - File: `packages/core/src/ports/LLMPort.ts`
  - Methods: chat, estimateCost

- [ ] T063 [P] Implement OpenAIAdapter
  - File: `packages/llm/src/adapters/OpenAIAdapter.ts`
  - Copy from package-structure.md

- [ ] T064 Create /api/chat/message endpoint
  - File: `apps/backend/src/routes/chat.ts`
  - Uses: `@ybis/llm` OpenAIAdapter

- [ ] T065 Define AI tool schemas
  - Tools: `create_task`, `list_tasks`, `update_task`, `create_note`, `list_notes`, `get_calendar`
  - File: `apps/backend/src/services/llm/tools.ts`

- [ ] T066 Implement tool calling handler
  - File: `apps/backend/src/services/llm/toolHandler.ts`
  - Execute tools based on AI response

- [ ] T067 Test OpenAI API calls
  - Tool: Postman/Insomnia
  - Endpoint: `POST /api/chat/message`

### Chat UI Implementation (Days 17-18)
- [ ] T068 [P] Create ChatPort interface
  - File: `packages/core/src/ports/ChatPort.ts`
  - Copy from package-structure.md

- [ ] T069 [P] Implement GiftedChatAdapter
  - File: `packages/chat/src/adapters/GiftedChatAdapter.tsx`
  - Uses: `react-native-gifted-chat`

- [ ] T070 Create chatStore (Zustand)
  - File: `apps/mobile/src/stores/chatStore.ts`
  - Actions: sendMessage, loadMessages, clearHistory

- [ ] T071 [P] Create ChatContainer component
  - File: `apps/mobile/src/components/chat/ChatContainer.tsx`
  - Uses: GiftedChatAdapter from `@ybis/chat`

- [ ] T072 Integrate chat into Dashboard
  - Files: All tab screens
  - Chat always visible at bottom

- [ ] T073 [P] Add loading indicator
  - UI: "AI is thinking..." spinner

- [ ] T074 Test chat UI
  - Test: Send message, receive response
  - Verify: Gifted Chat renders correctly

### Tool Calling Integration (Days 19-20)
- [ ] T075 Connect create_task tool to Supabase
  - File: `apps/backend/src/services/llm/toolHandler.ts`
  - Flow: AI → create_task → SupabaseAdapter.insert('tasks', data)

- [ ] T076 Connect list_tasks tool
  - Flow: AI → list_tasks → SupabaseAdapter.query('tasks', filters)

- [ ] T077 Connect create_note tool
  - Flow: AI → create_note → SupabaseAdapter.insert('notes', data)

- [ ] T078 Connect get_calendar tool
  - Flow: AI → get_calendar → SupabaseAdapter.query('calendar_events', filters)

- [ ] T079 Test end-to-end tool calling
  - Test: "Create task: Buy groceries tomorrow" → Task appears in Tasks tab
  - Verify: All tools execute correctly

- [ ] T080 [P] Add confirmation UI
  - Show: "AI created task: Buy groceries" notification

- [ ] T081 [P] Handle AI errors gracefully
  - Cases: API timeout, invalid tool call, execution error

### Conversation History (Day 21)
- [ ] T082 Create chat_messages table in Supabase
  - Table: `chat_messages` (id, text, userId, isAI, metadata, createdAt)

- [ ] T083 Store chat messages in Supabase
  - File: `apps/mobile/src/stores/chatStore.ts`
  - Save: Each user message and AI response

- [ ] T084 Load conversation history on app launch
  - Limit: Last 50 messages (performance)

- [ ] T085 Test conversation context
  - Test: AI remembers previous messages
  - Example: "Create task" → "What task?" → "Buy milk" (context works)

- [ ] T086 [P] Add "Clear chat history" button
  - Location: Settings screen

---

## Phase 0.4: Workflows & Dashboard (Week 4: Days 22-28)

### Workflow Templates (Days 22-23)
- [ ] T087 [P] Create WorkflowTemplate type
  - File: `packages/core/src/types/workflow.ts`

- [ ] T088 Create workflows table in Supabase
  - Table: `workflows` (id, name, steps, userId, createdAt)

- [ ] T089 Define 3 workflow templates
  - File: `apps/backend/src/services/workflow/templates.ts`
  - Templates: Morning Routine, Daily Planning, Evening Review

- [ ] T090 Implement workflow execution engine
  - File: `packages/core/src/domain/workflow/WorkflowEngine.ts`
  - Method: executeWorkflow(template, context)

- [ ] T091 Test workflow: Morning Routine
  - Steps: Get calendar → List tasks → Send summary message

- [ ] T092 Test workflow: Daily Planning
  - Steps: Create note for tomorrow → Suggest tasks

- [ ] T093 Test workflow: Evening Review
  - Steps: Get completed tasks → Create review note

### Workflow UI (Day 24)
- [ ] T094 [P] Create WorkflowList component
  - File: `apps/mobile/src/components/workflow/WorkflowList.tsx`

- [ ] T095 [P] Create WorkflowCard component
  - File: `apps/mobile/src/components/workflow/WorkflowCard.tsx`
  - Shows: Template name, description, execute button

- [ ] T096 Add workflows to Plan tab
  - File: `apps/mobile/app/(tabs)/plan.tsx`
  - Section: "Quick Workflows"

- [ ] T097 Add workflow execution to chat
  - Command: User types "Run morning routine" → Executes workflow

- [ ] T098 Test workflow UI
  - Test: Execute each workflow from UI and chat

### Single-Screen Dashboard (Days 25-26)
- [ ] T099 Create tab layout
  - File: `apps/mobile/app/(tabs)/_layout.tsx`
  - Top tabs: Plan, Tasks, Notes
  - Uses: Expo Router tabs

- [ ] T100 Create dashboard header
  - Components: Profile avatar, settings icon
  - File: `apps/mobile/src/components/dashboard/Header.tsx`

- [ ] T101 Integrate chat across all tabs
  - Position: Bottom of screen, always visible
  - Resizable: Can expand/collapse

- [ ] T102 [P] Add Quick Action FAB
  - Button: Floating Action Button
  - Actions: Quick add task, note, event

- [ ] T103 Test tab switching
  - Verify: Content changes, chat persists

- [ ] T104 Polish animations
  - Transitions: Tab switch, chat expand/collapse
  - Use: `react-native-reanimated@~4.1.0`

### Push Notifications (Day 27)
- [ ] T105 Setup Firebase Cloud Messaging
  - Firebase Console: Enable FCM
  - Install: `expo-notifications@~0.29.0`

- [ ] T106 Request notification permissions
  - File: `apps/mobile/src/utils/permissions.ts`
  - iOS: Request on first launch

- [ ] T107 Implement task reminder notifications
  - File: `apps/mobile/src/services/notifications.ts`
  - Trigger: 1 hour before task due time

- [ ] T108 Test notification delivery
  - Test: Create task with due time → Receive notification

- [ ] T109 [P] Add notification settings toggle
  - File: Settings screen
  - Options: Enable/disable notifications

### UX Polish Second Pass (Day 28)
- [ ] T110 [P] Refine spacing and colors
  - Use: Design tokens from `@ybis/theme`

- [ ] T111 [P] Add micro-interactions
  - Examples: Button press feedback, swipe haptics

- [ ] T112 [P] Improve loading states
  - Add: Skeleton screens for all lists

- [ ] T113 [P] Test accessibility
  - Check: Screen reader, font scaling

- [ ] T114 Fix UI bugs
  - Review: All screens, fix inconsistencies

---

## Phase 0.5: Testing & Bug Fixes (Week 5: Days 29-35)

### Manual Testing iOS (Days 29-30)
- [ ] T115 Test on iPhone SE (small screen)
  - All features: Tasks, Notes, Calendar, Chat, Workflows

- [ ] T116 Test on iPhone 13 (mid)
  - Focus: Performance, battery usage

- [ ] T117 Test on iPhone 13 Pro Max (large)
  - Focus: Layout responsiveness

- [ ] T118 Test edge cases
  - Cases: Empty states, 100+ tasks, offline mode, app backgrounding

- [ ] T119 Document iOS bugs
  - Tool: GitHub Issues
  - Priority: P0 (critical), P1 (high), P2 (medium)

### Manual Testing Android (Days 31-32)
- [ ] T120 Test on Samsung Galaxy A52 (budget)
  - All features + edge cases

- [ ] T121 Test on Google Pixel 6 (mid)
  - Focus: Android-specific features (back button)

- [ ] T122 Test on Samsung S22 (flagship)
  - Focus: Performance

- [ ] T123 Compare iOS vs Android behavior
  - Verify: Consistency across platforms

- [ ] T124 Document Android bugs
  - Priority: P0, P1, P2

### Bug Fixes P0 (Days 33-34)
- [ ] T125 Fix P0 crash bugs
  - Examples: App crashes on launch, null pointer errors

- [ ] T126 Fix P0 data loss bugs
  - Examples: Tasks not saving, Supabase sync failures

- [ ] T127 Fix P0 auth bugs
  - Examples: Google Sign-In fails, token refresh issues

- [ ] T128 Fix P0 AI bugs
  - Examples: Tool calling errors, API timeouts

- [ ] T129 Re-test all P0 fixes
  - Regression test: Verify fixes don't break other features

### Performance Optimization (Day 35)
- [ ] T130 Optimize Supabase queries
  - Add: Indexes on userId, createdAt columns
  - Batch: Multiple queries into single call

- [ ] T131 Optimize React re-renders
  - Add: React.memo, useMemo where needed

- [ ] T132 Reduce bundle size
  - Remove: Unused dependencies
  - Check: `npx react-native bundle-visualizer`

- [ ] T133 Optimize images
  - Compress: All assets
  - Format: Use WebP where supported

- [ ] T134 Test performance targets
  - Metrics: App launch <2s, AI response <5s

---

## Phase 0.6: Beta Preparation & Launch (Week 6: Days 36-42)

### App Store Setup iOS (Days 36-37)
- [ ] T135 Create Apple Developer account
  - Cost: $99/year
  - URL: https://developer.apple.com

- [ ] T136 Create App ID
  - Bundle ID: com.ybis.app

- [ ] T137 Configure app in App Store Connect
  - Info: Name, description, keywords, screenshots

- [ ] T138 Create TestFlight beta group
  - Group name: "Closed Beta"

- [ ] T139 Build and upload to TestFlight
  - Command: EAS Build OR Xcode Archive
  - Verify: Build processes successfully

- [ ] T140 Invite first 10 iOS testers
  - Source: Personal network

### Play Store Setup Android (Day 38)
- [ ] T141 Create Google Play Console account
  - Cost: $25 one-time
  - URL: https://play.google.com/console

- [ ] T142 Configure app in Play Console
  - Info: Name, description, screenshots

- [ ] T143 Create closed beta track
  - Track name: "Closed Beta"

- [ ] T144 Build and upload APK/AAB
  - Command: EAS Build OR Android Studio Build

- [ ] T145 Invite first 10 Android testers
  - Email list

### Feedback Collection Setup (Day 39)
- [ ] T146 Create Google Form for feedback
  - Questions: NPS, feature requests, bugs

- [ ] T147 Add in-app feedback button
  - Location: Settings screen
  - Action: Opens Google Form

- [ ] T148 [P] Setup Sentry error tracking
  - Install: `@sentry/react-native`
  - Configure: DSN in environment variables

- [ ] T149 [P] Create Discord server for beta community
  - Channels: #feedback, #bugs, #announcements

- [ ] T150 Prepare onboarding email template
  - Content: How to use app, where to give feedback

### Beta Tester Recruitment (Day 40)
- [ ] T151 Recruit from personal network
  - Target: 20 signups

- [ ] T152 Post on Reddit
  - Subreddits: r/productivity, r/betatesting, r/ADHD

- [ ] T153 Post on ProductHunt Ship
  - Create: Ship page for YBIS

- [ ] T154 Invite ADHD community
  - Forums, Discord servers

- [ ] T155 Target: 50+ beta signups

### Soft Launch (Day 41)
- [ ] T156 Send onboarding emails to first 10-20 testers
  - Include: TestFlight/Play Store links, instructions

- [ ] T157 Monitor app installs
  - Check: TestFlight/Play Console analytics

- [ ] T158 Watch for crash reports
  - Monitor: Sentry dashboard

- [ ] T159 Collect initial feedback
  - Channels: Discord, Google Form

- [ ] T160 Hotfix critical issues if needed
  - Priority: Any P0 bugs reported

### Post-Launch Monitoring (Day 42)
- [ ] T161 Daily check-ins with testers
  - Discord: Post daily updates

- [ ] T162 Review feedback responses
  - Analyze: Google Form results

- [ ] T163 Triage bugs
  - Create: GitHub issues for all reported bugs

- [ ] T164 Plan Week 7+ iterations
  - Prioritize: Features based on feedback

- [ ] T165 Celebrate launch! 🎉

---

## Dependencies

### Critical Path
```
Setup (T001-T006)
  → Mobile (T007-T012)
  → Backend (T013-T019)
  → Auth (T020-T026)
  → Supabase (T027-T031)
  → Core Features (T032-T060)
  → AI Integration (T061-T086)
  → Workflows (T087-T114)
  → Testing (T115-T134)
  → Launch (T135-T165)
```

### Parallel Execution Opportunities

**Week 1 Setup** (can run in parallel):
- T002 (root configs)
- T003 (directories)
- T004 (package.json files)
- T005 (project.json files)

**Week 2 Core Features** (can run in parallel after T031):
- T032-T033 (Task types & service)
- T040-T041 (Note types & service)
- T048 (Calendar types)
- T055-T056 (Theme & UI components)

**Week 3 AI** (can run in parallel after T061):
- T062-T063 (LLM Port & OpenAI adapter)
- T068-T069 (Chat Port & Gifted adapter)

**Week 5 Testing** (can run in parallel):
- T115-T117 (iOS testing on different devices)
- T120-T122 (Android testing on different devices)

**Week 6 Launch** (can run in parallel):
- T148 (Sentry setup)
- T149 (Discord server)

---

## Parallel Execution Examples

### Example 1: Root Configuration (Week 1, Day 2)
```bash
# Launch in parallel
Task T002: "Create root configuration files"
Task T003: "Create package directories"
Task T004: "Create package.json for each package"
Task T005: "Create project.json for NX integration"
```

### Example 2: Mobile Dependencies (Week 1, Day 3)
```bash
# Launch in parallel
Task T009: "Install mobile dependencies"
Task T010: "Create mobile folder structure"
```

### Example 3: Core Feature Types (Week 2, Days 8-9)
```bash
# Launch in parallel
Task T032: "Create Task type"
Task T033: "Create TaskService"
Task T036: "Create TaskList component"
Task T037: "Create TaskItem component"
```

---

## Validation Checklist

Before starting development, verify:
- [ ] All design documents read (development-plan.md, package-structure.md, Architecture_better.md)
- [ ] NX workspace structure understood
- [ ] Port architecture pattern clear (AuthPort, ChatPort, etc.)
- [ ] Supabase schema designed
- [ ] Firebase project ready
- [ ] OpenAI API key obtained

Before Closed Beta launch, verify:
- [ ] All P0 tasks completed
- [ ] Performance targets met (<2s launch, <5s AI response)
- [ ] iOS + Android tested on 3+ devices each
- [ ] TestFlight + Play Console configured
- [ ] 50+ beta testers recruited
- [ ] Feedback infrastructure working

---

## Notes

- **[P] = Parallelizable** - Tasks can run simultaneously (different files, no dependencies)
- **Commit after each task** - Small, frequent commits
- **Test incrementally** - Don't wait until end of week
- **Speed > Perfection** - Phase 0 focuses on validation, not polish
- **Port architecture** - All adapters (Firebase, Gifted Chat) are swappable

---

## Hybrid Approach Decision Points

### NX Migration (Week 3)
**Automatic Trigger**: Week 3 reached (T060A-T060E)
**Early Trigger**: Build time >2min OR >5 packages OR team >1 person
**Effort**: 2-3 hours
**Risk**: LOW (additive, reversible)

### Expo Bare Migration (IF NEEDED)
**Trigger**: Custom native module required (rare for Phase 0)
**Command**: `cd apps/mobile && npx expo prebuild`
**Effort**: 0.5 day prebuild + 1 day testing = 1.5 days
**Risk**: MEDIUM (creates ios/ android/ folders, requires native dev setup)
**When to do it**: ONLY if Expo config plugins insufficient

**Example native needs:**
- Custom Bluetooth/NFC module
- Advanced camera features beyond expo-camera
- Custom iOS/Android UI components

**Phase 0 Verdict**: UNLIKELY needed (Expo plugins cover 95% of use cases)

### Next.js Migration (Open Beta)
**Automatic**: Stay on Expo Web (fast, works)
**Optional**: Migrate to Next.js if SEO/SSR critical for web launch
**Trigger**: Web performance <70 Lighthouse OR SEO requirements
**Effort**: 5 days (routing port + custom Chat UI)

---

**Total Tasks**: 165 + 5 (NX migration tasks)
**Timeline**: 6 weeks (42 days)
**Strategy**: Hybrid/Progressive Enhancement
**Status**: Ready for execution
