# YBIS Technical Architecture

**Version:** 1.0
**Last Updated:** 2025-01-05
**Status:** Closed Beta Architecture
**Scope:** Phase 0 (Closed Beta - 100-200 users)

---

## Executive Summary

YBIS Closed Beta architecture focuses on **simplicity, speed, and validation**. We build a **local-first, AI-powered productivity core** with minimal external dependencies. MCP (Model Context Protocol) groundwork is laid for future extensibility, but Phase 0 uses **simple adapter pattern** for speed.

**Key Decisions:**
- ✅ **MCP Foundation:** Build MCP-compatible adapter layer (future-proof)
- ✅ **React Native 0.81.4 + React 18.3.1** (ecosystem stability)
- ✅ **Single Screen Dashboard** with 3 top tabs (Chat focus, minimal navigation)
- ✅ **Local-First:** Tasks, Notes, Calendar work offline (AsyncStorage)
- ✅ **No Integrations in Phase 0** (Google Auth only, deferred to Open Beta)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              YBIS Mobile App                        │
│           (React Native 0.81.4)                     │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │   Main Dashboard (Single Screen)            │  │
│  │                                              │  │
│  │   [Top 3 Tabs: Plan | Tasks | Notes]       │  │
│  │                                              │  │
│  │   ┌────────────────────────────────────┐    │  │
│  │   │      AI Chat Interface             │    │  │
│  │   │   (Primary interaction layer)      │    │  │
│  │   └────────────────────────────────────┘    │  │
│  │                                              │  │
│  │   [Calendar View - Daily/Week Toggle]       │  │
│  │   [Task List - Priority Sorted]             │  │
│  │   [Quick Actions - Floating Button]         │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│           Zustand State Management                  │
│           AsyncStorage (Offline First)              │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS (TLS 1.3)
                   │
         ┌─────────▼──────────┐
         │   API Gateway      │
         │  (Hono + Vercel)   │
         └─────────┬──────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    ┌────▼─────┐      ┌───────▼────────┐
    │   AI     │      │  MCP Adapter   │
    │ Service  │      │  Layer (Future)│
    │(OpenAI/  │      │                │
    │Claude)   │      │  [Gmail MCP]   │
    │          │      │  [Cal MCP]     │
    │          │      │  [Tasks MCP]   │
    └──────────┘      └────────────────┘
                              │
                      ┌───────▼─────────┐
                      │   Database      │
                      │  (AsyncStorage  │
                      │   Phase 0)      │
                      │                 │
                      │  (Supabase OR   │
                      │   Serverless    │
                      │   Phase 1+)     │
                      └─────────────────┘
```

---

## UX Architecture: Single Screen Dashboard

### Design Philosophy
**"One screen to rule them all"** - User spends 90% of time in main dashboard.

### Layout Structure

```
┌──────────────────────────────────────────┐
│  [☰ Menu]   YBIS    [Profile] [Settings]│  Header
├──────────────────────────────────────────┤
│  [ Plan ]  [ Tasks ]  [ Notes ]          │  Top 3 Tabs
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  💬 Chat with YBIS                 │ │  Chat (Always Visible)
│  │  ────────────────────────────────  │ │
│  │  User: What's on my schedule?      │ │
│  │  AI: You have 3 tasks today...     │ │
│  │  [Voice Input] [Quick Actions]     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ╔════════════════════════════════════╗ │
│  ║  Context-Aware Content Area        ║ │  Dynamic Content
│  ║  (Changes based on selected tab)   ║ │
│  ║                                    ║ │
│  ║  [Plan Tab]:                       ║ │
│  ║    - Today's Calendar (Daily View) ║ │
│  ║    - Top 3 Priority Tasks          ║ │
│  ║    - Upcoming Events               ║ │
│  ║                                    ║ │
│  ║  [Tasks Tab]:                      ║ │
│  ║    - Task List (Swipe Actions)     ║ │
│  ║    - Priority Filters              ║ │
│  ║    - Due Date Grouping             ║ │
│  ║                                    ║ │
│  ║  [Notes Tab]:                      ║ │
│  ║    - Recent Notes                  ║ │
│  ║    - Search & Tags                 ║ │
│  ║    - Quick Note Creation           ║ │
│  ╚════════════════════════════════════╝ │
│                                          │
│  [➕ Quick Action FAB]                   │  Floating Action
└──────────────────────────────────────────┘
```

### Navigation Rules
1. **No Bottom Tab Bar** (reduces clutter)
2. **Top 3 Tabs Only** (Plan = default, Tasks, Notes)
3. **Chat Always Visible** (primary interaction)
4. **Content Area Dynamic** (changes with tab, but chat stays)
5. **Swipe Gestures** (swipe between tabs for power users)

---

## Frontend Architecture (React Native)

### Tech Stack
```yaml
Core:
  React Native: 0.81.4
  React: 18.3.1 (NOT 19 - ecosystem stability)
  TypeScript: 5.x (strict mode)

State Management:
  Zustand: 4.x (lightweight, performant)
  React Query: Optional (Phase 1+ for server state)

Navigation:
  React Navigation: 7.x
  Pattern: Stack Navigator (minimal screens)

UI Library:
  Custom Components (no heavy library in Phase 0)
  React Native Paper: Optional (Phase 1+)

Storage:
  AsyncStorage: @react-native-async-storage/async-storage
  MMKV: Optional (Phase 1+ if performance critical)

AI/LLM:
  OpenAI API: GPT-4o-mini (cost-effective)
  Anthropic Claude: 3.5 Haiku (fallback/comparison)

Notifications:
  Firebase Cloud Messaging (FCM)
  react-native-push-notification

Auth:
  Firebase Auth (Google Sign-In only Phase 0)
```

### Project Structure (Monorepo)

```
YBIS/
├── apps/
│   └── mobile/                    # React Native app
│       ├── src/
│       │   ├── screens/
│       │   │   ├── Dashboard.tsx  # Main single-screen dashboard
│       │   │   ├── Settings.tsx   # Settings (modal)
│       │   │   └── Onboarding.tsx # First-time user flow
│       │   ├── components/
│       │   │   ├── Chat/
│       │   │   │   ├── ChatInterface.tsx
│       │   │   │   ├── MessageBubble.tsx
│       │   │   │   └── QuickActions.tsx
│       │   │   ├── Tasks/
│       │   │   │   ├── TaskList.tsx
│       │   │   │   ├── TaskItem.tsx
│       │   │   │   └── TaskFilters.tsx
│       │   │   ├── Calendar/
│       │   │   │   ├── DailyView.tsx
│       │   │   │   ├── WeekView.tsx
│       │   │   │   └── EventCard.tsx
│       │   │   └── Notes/
│       │   │       ├── NoteList.tsx
│       │   │       ├── NoteEditor.tsx
│       │   │       └── NoteSearch.tsx
│       │   ├── store/
│       │   │   ├── useAuthStore.ts
│       │   │   ├── useChatStore.ts
│       │   │   ├── useTaskStore.ts
│       │   │   ├── useNoteStore.ts
│       │   │   └── useCalendarStore.ts
│       │   ├── services/
│       │   │   ├── ai/
│       │   │   │   ├── openai.ts
│       │   │   │   ├── claude.ts
│       │   │   │   └── mcp-adapter.ts    # MCP foundation
│       │   │   ├── storage/
│       │   │   │   └── asyncStorage.ts
│       │   │   └── auth/
│       │   │       └── firebase.ts
│       │   ├── hooks/
│       │   │   ├── useChat.ts
│       │   │   ├── useTasks.ts
│       │   │   └── useWorkflows.ts
│       │   └── utils/
│       │       ├── date.ts
│       │       └── validation.ts
│       └── package.json
│
├── packages/
│   ├── core/                      # Shared types, schemas
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── task.ts
│   │   │   │   ├── note.ts
│   │   │   │   ├── calendar.ts
│   │   │   │   └── workflow.ts
│   │   │   └── schemas/
│   │   │       └── validation.ts  # Zod schemas
│   │   └── package.json
│   │
│   └── mcp-core/                  # MCP foundation (future)
│       ├── src/
│       │   ├── protocol/
│       │   │   ├── types.ts       # MCP protocol types
│       │   │   └── validator.ts
│       │   └── adapters/
│       │       ├── base.ts        # Base adapter interface
│       │       ├── gmail.ts       # Gmail MCP adapter (stub)
│       │       └── calendar.ts    # Calendar MCP adapter (stub)
│       └── package.json
│
└── backend/
    ├── src/
    │   ├── index.ts               # Hono app entry
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── chat.ts
    │   │   ├── tasks.ts
    │   │   ├── notes.ts
    │   │   └── workflows.ts
    │   ├── middleware/
    │   │   ├── auth.ts
    │   │   └── rateLimit.ts
    │   ├── services/
    │   │   ├── ai/
    │   │   │   ├── openai.ts
    │   │   │   └── claude.ts
    │   │   └── mcp/
    │   │       └── adapter-manager.ts  # MCP adapter orchestration
    │   └── utils/
    │       └── logger.ts
    └── package.json
```

---

## MCP (Model Context Protocol) Strategy

### Phase 0 Approach: MCP Foundation

**What is MCP?**
MCP (Model Context Protocol) is Anthropic's specification for standardized tool/integration interfaces for AI agents.

**Why MCP?**
- Future-proof: Industry standard emerging
- Extensibility: Easy to add new integrations
- Ecosystem: Community-driven MCP adapters
- Marketplace-ready: Phase 3+ MCP marketplace

**Phase 0 Implementation:**
```typescript
// MCP Adapter Interface (stub for Phase 0, full in Phase 1+)
interface MCPAdapter {
  name: string;
  version: string;

  // Core MCP methods
  initialize(config: AdapterConfig): Promise<void>;
  execute(action: MCPAction): Promise<MCPResult>;
  dispose(): Promise<void>;

  // Phase 0: Simple wrapper around existing logic
  // Phase 1+: Full MCP protocol compliance
}

// Example: Gmail MCP Adapter (stub)
class GmailMCPAdapter implements MCPAdapter {
  name = 'gmail';
  version = '1.0.0';

  async initialize(config) {
    // OAuth setup (Phase 1+)
    console.log('Gmail MCP adapter stub initialized');
  }

  async execute(action: MCPAction) {
    // Phase 0: Return mock data
    // Phase 1+: Real Gmail API calls
    return { status: 'success', data: [] };
  }

  async dispose() {
    // Cleanup
  }
}
```

**Phase 0 Focus:**
- ✅ Define MCP adapter interfaces
- ✅ Create stub adapters (Gmail, Calendar, Tasks)
- ❌ Don't implement full MCP protocol (Phase 1+)
- ❌ Don't build MCP marketplace (Phase 3+)

**Benefit:** When Open Beta adds integrations, we drop in real MCP adapters without refactoring.

---

## Backend Architecture (Hono + Vercel)

### Tech Stack
```yaml
Framework: Hono (edge-optimized, lightweight)
Runtime: Node.js 20.11.0 LTS
Hosting: Vercel Edge Functions (serverless)
Database: AsyncStorage (Phase 0), Supabase/Serverless (Phase 1+)
Auth: Firebase Auth (Google Sign-In)
AI: OpenAI GPT-4o-mini, Anthropic Claude 3.5 Haiku
```

### API Design

**RESTful Endpoints (Phase 0 - Minimal):**

```typescript
// Auth
POST   /api/auth/google           // Google Sign-In
GET    /api/auth/me                // Get current user
POST   /api/auth/logout            // Sign out

// AI Chat
POST   /api/chat/message           // Send message to AI
GET    /api/chat/history           // Get conversation history

// Tasks (Local-first, sync optional Phase 1+)
GET    /api/tasks                  // List tasks
POST   /api/tasks                  // Create task
PATCH  /api/tasks/:id              // Update task
DELETE /api/tasks/:id              // Delete task

// Notes
GET    /api/notes                  // List notes
POST   /api/notes                  // Create note
PATCH  /api/notes/:id              // Update note
DELETE /api/notes/:id              // Delete note

// Calendar
GET    /api/calendar/events        // List events (local)
POST   /api/calendar/events        // Create event
PATCH  /api/calendar/events/:id    // Update event
DELETE /api/calendar/events/:id    // Delete event

// Workflows
GET    /api/workflows              // List templates
POST   /api/workflows/:id/execute  // Execute workflow
```

### Hono App Structure

```typescript
// backend/src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import taskRoutes from './routes/tasks';
import noteRoutes from './routes/notes';
import calendarRoutes from './routes/calendar';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/chat', chatRoutes);
app.route('/api/tasks', taskRoutes);
app.route('/api/notes', noteRoutes);
app.route('/api/calendar', calendarRoutes);

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
```

---

## Data Architecture

### Phase 0: Local-First (AsyncStorage)

**Data Models:**

```typescript
// User
interface User {
  id: string;              // Firebase UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'tr' | 'en';
    notifications: boolean;
  };
}

// Task
interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Phase 1+: source, externalId for integrations
}

// Note
interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;            // Markdown or plain text
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// CalendarEvent
interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  allDay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ChatMessage
interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // Phase 1+: tokensUsed, model, etc.
}

// Workflow
interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  trigger: 'manual' | 'scheduled';
  schedule?: string;       // Cron expression
  createdAt: Date;
  lastExecuted?: Date;
}

interface WorkflowStep {
  id: string;
  type: 'check_calendar' | 'list_tasks' | 'send_message' | 'create_note';
  params: Record<string, any>;
  order: number;
}
```

### AsyncStorage Strategy

```typescript
// Storage Keys
const STORAGE_KEYS = {
  USER: '@ybis:user',
  TASKS: '@ybis:tasks',
  NOTES: '@ybis:notes',
  EVENTS: '@ybis:events',
  MESSAGES: '@ybis:messages',
  WORKFLOWS: '@ybis:workflows',
};

// Example: Task Storage Service
class TaskStorageService {
  async getTasks(userId: string): Promise<Task[]> {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    const allTasks = tasksJson ? JSON.parse(tasksJson) : [];
    return allTasks.filter(t => t.userId === userId);
  }

  async createTask(task: Task): Promise<Task> {
    const tasks = await this.getTasks(task.userId);
    tasks.push(task);
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return task;
  }

  // ... update, delete methods
}
```

**Phase 1+ Migration:**
When moving to Supabase/Serverless:
- Keep AsyncStorage for offline cache
- Sync to cloud database when online
- Conflict resolution: last-write-wins (simple) or user-prompted (complex)

---

## AI Integration Architecture

### OpenAI Integration (Primary)

```typescript
// services/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function sendMessage(
  messages: ChatMessage[],
  userId: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',  // Cost-effective
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
    tools: [
      {
        type: 'function',
        function: {
          name: 'create_task',
          description: 'Create a new task',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              dueDate: { type: 'string', format: 'date' },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
            },
            required: ['title'],
          },
        },
      },
      // ... other tools (create_note, get_calendar, etc.)
    ],
    tool_choice: 'auto',
  });

  const choice = response.choices[0];

  // Handle function calls
  if (choice.message.tool_calls) {
    for (const toolCall of choice.message.tool_calls) {
      if (toolCall.function.name === 'create_task') {
        const args = JSON.parse(toolCall.function.arguments);
        await createTask(userId, args);
      }
      // ... handle other function calls
    }
  }

  return choice.message.content || 'I completed the action.';
}
```

### Tool Calling (AI Function Execution)

**Phase 0 Tools:**
```typescript
const PHASE_0_TOOLS = [
  {
    name: 'create_task',
    description: 'Create a new task with title, due date, and priority',
    parameters: { /* ... */ },
  },
  {
    name: 'list_tasks',
    description: 'List all tasks, optionally filtered by priority or due date',
    parameters: { /* ... */ },
  },
  {
    name: 'create_note',
    description: 'Create a new note with title and content',
    parameters: { /* ... */ },
  },
  {
    name: 'search_notes',
    description: 'Search notes by keyword or tag',
    parameters: { /* ... */ },
  },
  {
    name: 'get_calendar',
    description: 'Get calendar events for a specific date range',
    parameters: { /* ... */ },
  },
  {
    name: 'execute_workflow',
    description: 'Execute a predefined workflow template',
    parameters: { /* ... */ },
  },
];
```

---

## Workflow Engine (Phase 0)

### Pre-defined Workflow Templates

```typescript
// Workflow Templates (Hardcoded in Phase 0)
const WORKFLOW_TEMPLATES = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Daily briefing with calendar, tasks, and priorities',
    steps: [
      {
        type: 'get_calendar',
        params: { timeframe: 'today' },
      },
      {
        type: 'list_tasks',
        params: { filter: 'today', priority: 'high' },
      },
      {
        type: 'send_message',
        params: {
          template: 'Good morning! Here\'s your day:\n\n📅 Calendar: {{calendar}}\n✅ Tasks: {{tasks}}',
        },
      },
    ],
  },
  {
    id: 'daily-planning',
    name: 'Daily Planning',
    description: 'Plan tomorrow based on uncompleted tasks and calendar',
    steps: [
      {
        type: 'list_tasks',
        params: { filter: 'incomplete' },
      },
      {
        type: 'get_calendar',
        params: { timeframe: 'tomorrow' },
      },
      {
        type: 'create_note',
        params: {
          title: 'Tomorrow\'s Plan',
          body: 'Tasks to complete:\n{{tasks}}\n\nSchedule:\n{{calendar}}',
        },
      },
    ],
  },
  {
    id: 'evening-review',
    name: 'Evening Review',
    description: 'Review today\'s accomplishments and prepare for tomorrow',
    steps: [
      {
        type: 'list_tasks',
        params: { filter: 'completed_today' },
      },
      {
        type: 'send_message',
        params: {
          template: 'Great work today! ✅ Completed: {{completedCount}} tasks.\n\n{{tasks}}',
        },
      },
    ],
  },
];
```

### Workflow Execution Engine

```typescript
// services/workflows/executor.ts
export async function executeWorkflow(
  workflowId: string,
  userId: string
): Promise<WorkflowExecutionResult> {
  const template = WORKFLOW_TEMPLATES.find(t => t.id === workflowId);
  if (!template) throw new Error('Workflow not found');

  const context: any = {};

  for (const step of template.steps) {
    switch (step.type) {
      case 'get_calendar':
        context.calendar = await getCalendarEvents(userId, step.params);
        break;
      case 'list_tasks':
        context.tasks = await getTasks(userId, step.params);
        break;
      case 'send_message':
        const message = renderTemplate(step.params.template, context);
        await sendChatMessage(userId, message);
        break;
      case 'create_note':
        const noteBody = renderTemplate(step.params.body, context);
        await createNote(userId, { ...step.params, body: noteBody });
        break;
    }
  }

  return { status: 'success', context };
}
```

---

## Security Architecture

### Authentication (Firebase Auth)

```typescript
// Firebase Auth Setup (Google Sign-In Only)
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(): Promise<User> {
  // Get Google credentials
  const { idToken } = await GoogleSignin.signIn();

  // Create Firebase credential
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign in to Firebase
  const userCredential = await auth().signInWithCredential(googleCredential);

  return userCredential.user;
}
```

### API Security

```typescript
// Middleware: Auth verification
import { verify } from 'hono/jwt';

export async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verify(token, process.env.JWT_SECRET);
    c.set('userId', decoded.sub);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

// Rate Limiting (Simple, Phase 0)
const requestCounts = new Map<string, number>();

export async function rateLimitMiddleware(c, next) {
  const userId = c.get('userId');
  const count = requestCounts.get(userId) || 0;

  if (count > 100) {  // 100 requests per minute
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }

  requestCounts.set(userId, count + 1);
  setTimeout(() => requestCounts.delete(userId), 60000);  // Reset after 1 min

  await next();
}
```

---

## Deployment Architecture

### Vercel Deployment (Backend)

```bash
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key",
    "FIREBASE_PROJECT_ID": "@firebase-project-id"
  }
}
```

### Mobile App Deployment

**iOS (TestFlight):**
- Build with Xcode
- Upload to App Store Connect
- Invite beta testers (up to 10,000)

**Android (Google Play Console - Closed Beta):**
- Build APK/AAB with Gradle
- Upload to Play Console
- Invite beta testers via email list

---

## Performance Targets

### Phase 0 Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| App Launch (Cold Start) | <2 seconds | iPhone 11, Android mid-range |
| AI Chat Response | <5 seconds | Including LLM processing |
| Task CRUD Operations | <500ms | Local AsyncStorage |
| Calendar Rendering | <1 second | 30 events daily view |
| Note Search | <1 second | 100 notes corpus |
| Workflow Execution | <10 seconds | 5-step workflow |

---

## Testing Strategy

### Phase 0 Testing

**Unit Tests (Target: 50%+ coverage):**
- Utilities (date formatting, validation)
- Store logic (Zustand actions)
- Service layer (AI tools, storage)

**Integration Tests:**
- Workflow execution (end-to-end)
- AI tool calling (mock OpenAI responses)

**Manual Testing:**
- UX flows (onboarding, daily usage)
- Device compatibility (iOS + Android)
- Performance on low-end devices

---

## Critical TBD Items (Requires Decision Before Development)

### 1. Database Strategy (CRITICAL - Week 1)
**Options:**
- **A) AsyncStorage Only (Phase 0):** Simplest, fastest
- **B) Supabase from Day 1:** Harder but enables sync
- **C) Hybrid:** AsyncStorage + Supabase later

**Recommendation:** **Option A** (AsyncStorage only Phase 0) → Supabase in Open Beta

---

### 2. Sync Strategy (Medium Priority - Phase 1)
**Options:**
- **A) Real-time:** WebSockets, live updates
- **B) Batch:** Poll every 30 seconds
- **C) Manual:** User-triggered sync

**Recommendation:** **Option C** (Phase 0) → **Option B** (Open Beta) → **Option A** (MVP)

---

### 3. AI Cost Management (CRITICAL - Week 2)
**Strategy:**
- Phase 0: No limits (track costs during beta)
- Open Beta: Implement quotas (e.g., 100 messages/month free tier)
- MVP: Pricing tiers based on cost data

**Monitoring:** Track token usage per user, alert if >$5/month/user

---

## Next Steps (Implementation Order)

### Week 1: Project Setup & Foundation
1. ✅ Monorepo setup (npm workspaces)
2. ✅ React Native 0.81.4 + TypeScript boilerplate
3. ✅ Hono backend skeleton
4. ✅ Firebase Auth setup
5. ✅ AsyncStorage integration

### Week 2: Core Features (Local-First)
1. Task management (CRUD operations)
2. Note management (CRUD + search)
3. Calendar view (daily, basic)
4. AsyncStorage persistence

### Week 3: AI Integration
1. OpenAI API integration
2. Tool calling (create_task, list_tasks, etc.)
3. Chat UI implementation
4. Conversation history

### Week 4: Workflows & UX Polish
1. Workflow templates (3-5 presets)
2. Workflow execution engine
3. Single-screen dashboard UI
4. Push notifications

### Week 5-6: Testing & Beta Prep
1. Manual testing (iOS + Android)
2. Performance optimization
3. Bug fixes
4. TestFlight/Play Console beta setup

---

**End of Architecture Document**

**Next Action:** Create `development-plan.md` with detailed week-by-week tasks, or run `/YBIS:plan` to generate implementation plan.
