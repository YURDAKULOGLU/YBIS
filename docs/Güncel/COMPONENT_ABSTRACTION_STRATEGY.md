# Component Abstraction Strategy

**Version:** 1.0.0
**Created:** 2025-10-15
**Status:** CANONICAL - Component Architecture

---

## 📦 Monorepo Shared Component Architecture

### Vision
Cross-platform component sharing (Mobile, Web, Desktop) with platform-specific optimizations.

---

## 🏗️ Package Structure

```
packages/
├── ui/                    # Tamagui primitives (already exists)
│   ├── src/
│   │   ├── primitives/   # Base components (Button, Input, Card)
│   │   └── index.ts
│
├── components/            # NEW - Business components
│   ├── src/
│   │   ├── chat/         # Chat-related components
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageStatus.tsx
│   │   │   └── index.ts
│   │   ├── navigation/   # Navigation components
│   │   │   ├── DrawerMenu.tsx
│   │   │   ├── TabBar.tsx
│   │   │   └── index.ts
│   │   ├── screens/      # Screen templates
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── ChatScreen.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│
├── hooks/                 # NEW - Shared hooks
│   ├── src/
│   │   ├── useChat.ts
│   │   ├── useTheme.ts
│   │   ├── useAuth.ts
│   │   └── index.ts
│
├── widgets/                 # NEW - Widget system
│   ├── src/
│   │   ├── registry/        # Widget registry system
│   │   │   ├── WidgetRegistry.ts
│   │   │   ├── WidgetDefinition.ts
│   │   │   └── index.ts
│   │   ├── components/     # Widget components
│   │   │   ├── MiniCalendar.tsx
│   │   │   ├── TaskSummary.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│
├── screens/                # NEW - Screen templates
│   ├── src/
│   │   ├── ChatScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   └── index.ts
│
├── plugins/                # NEW - Plugin implementations
│   ├── src/
│   │   ├── analytics/      # Analytics plugin
│   │   ├── themes/         # Theme plugin
│   │   ├── features/       # Feature plugins
│   │   └── index.ts
│
├── registry/               # NEW - Registry system
│   ├── src/
│   │   ├── PluginRegistry.ts
│   │   ├── WidgetRegistry.ts
│   │   ├── ComponentRegistry.ts
│   │   └── index.ts
```

---

## 🎨 Component Categories

### 1. **Primitives** (`@ybis/ui`)
**Already exists** - Tamagui-based UI primitives
- Button, Input, Card, Text, etc.
- Theme-aware, platform-agnostic
- No business logic

### 2. **Business Components** (`@ybis/components`) - **NEW**
Reusable components with business logic:

#### Chat Components
```typescript
// packages/components/src/chat/ChatBubble.tsx
export interface ChatBubbleProps {
  message: string;
  timestamp: string;
  sender: 'user' | 'ai';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  onPress?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ ... }) => {
  // WhatsApp-style bubble with status ticks
  return (
    <Card {...}>
      <YStack>
        <Text>{message}</Text>
        <XStack>
          <Text>{timestamp}</Text>
          <MessageStatus status={status} />
        </XStack>
      </YStack>
    </Card>
  );
};
```

#### Chat Input
```typescript
// packages/components/src/chat/ChatInput.tsx
export interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onVoiceRecord?: () => void;
  placeholder?: string;
  showQuickActions?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ ... }) => {
  // WhatsApp-style input with mic/send toggle
  const [text, setText] = useState('');

  return (
    <YStack>
      <XStack>
        <Button icon={Plus} /> {/* Quick actions */}
        <Input value={text} onChange={setText} />
        {text ? (
          <Button icon={Send} onPress={() => onSendMessage(text)} />
        ) : (
          <Button icon={Mic} onPress={onVoiceRecord} />
        )}
      </XStack>
    </YStack>
  );
};
```

### 3. **Screen Templates** (`@ybis/components/screens`)
Full screen compositions:

```typescript
// packages/components/src/screens/ChatScreen.tsx
export interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onVoiceRecord?: () => void;
  loading?: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ ... }) => {
  return (
    <YStack flex={1}>
      <ScrollView>
        {messages.map(msg => (
          <ChatBubble key={msg.id} {...msg} />
        ))}
      </ScrollView>
      <ChatInput onSendMessage={onSendMessage} />
    </YStack>
  );
};
```

### 5. **Widget System** (`@ybis/widgets`) - **NEW**
Dynamic widget components for main screen:

```typescript
// packages/widgets/src/registry/WidgetDefinition.ts
export interface WidgetDefinition {
  id: string;
  name: string;
  category: 'productivity' | 'calendar' | 'tasks' | 'notes';
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  configurable?: boolean;
  plugin?: string; // Optional plugin ID
}

// packages/widgets/src/registry/WidgetRegistry.ts
export class WidgetRegistry {
  private widgets = new Map<string, WidgetDefinition>();

  registerWidget(widget: WidgetDefinition) {
    this.widgets.set(widget.id, widget);
  }

  getWidget(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id);
  }

  getWidgetsByCategory(category: string): WidgetDefinition[] {
    return Array.from(this.widgets.values())
      .filter(w => w.category === category);
  }

  getAllWidgets(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }
}
```

#### Widget Components
```typescript
// packages/widgets/src/components/MiniCalendar.tsx
export interface MiniCalendarProps {
  onDateSelect?: (date: Date) => void;
  showToday?: boolean;
  compact?: boolean;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ ... }) => {
  return (
    <Card padding="$2">
      <YStack>
        <Text fontSize="$3" fontWeight="600">Today</Text>
        <Text fontSize="$2">{new Date().toLocaleDateString()}</Text>
        <Button size="$2" onPress={onDateSelect}>
          View Calendar
        </Button>
      </YStack>
    </Card>
  );
};

// packages/widgets/src/components/TaskSummary.tsx
export interface TaskSummaryProps {
  totalTasks: number;
  completedTasks: number;
  onViewTasks?: () => void;
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({ ... }) => {
  const completionRate = (completedTasks / totalTasks) * 100;
  
  return (
    <Card padding="$2">
      <YStack>
        <Text fontSize="$3" fontWeight="600">Tasks</Text>
        <Text fontSize="$2">{completedTasks}/{totalTasks}</Text>
        <Progress value={completionRate} />
        <Button size="$2" onPress={onViewTasks}>
          View All
        </Button>
      </YStack>
    </Card>
  );
};
```

### 6. **Screen Templates** (`@ybis/screens`) - **NEW**
Full screen compositions with plugin support:

```typescript
// packages/screens/src/ChatScreen.tsx
export interface ChatScreenProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onVoiceRecord?: () => void;
  loading?: boolean;
  plugins?: string[]; // Enabled plugin IDs
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  messages, 
  onSendMessage, 
  plugins = [] 
}) => {
  const pluginRegistry = usePluginRegistry();
  
  return (
    <YStack flex={1}>
      <ScrollView>
        {messages.map(msg => (
          <ChatBubble key={msg.id} {...msg} />
        ))}
      </ScrollView>
      
      {/* Plugin-specific chat enhancements */}
      {plugins.map(pluginId => {
        const plugin = pluginRegistry.get(pluginId);
        return plugin?.components?.ChatEnhancement && (
          <plugin.components.ChatEnhancement key={pluginId} />
        );
      })}
      
      <ChatInput onSendMessage={onSendMessage} />
    </YStack>
  );
};
```

---

## 🔌 Enhanced Plugin/Registry System

### Architecture
```typescript
// packages/registry/src/PluginRegistry.ts
export interface ComponentPlugin extends Plugin {
  id: string;
  name: string;
  version: string;
  initialize: () => void | Promise<void>;
  cleanup?: () => void;
  
  // Component registration
  components?: {
    [key: string]: React.ComponentType<any>;
  };
  
  // Widget registration
  widgets?: {
    [key: string]: WidgetDefinition;
  };
  
  // Screen enhancement
  screenEnhancements?: {
    [screenId: string]: React.ComponentType<any>;
  };
  
  // Theme customization
  themes?: {
    [themeId: string]: ThemeDefinition;
  };
  
  // Feature toggles
  features?: {
    [featureId: string]: boolean;
  };
}

export class PluginRegistry {
  private plugins = new Map<string, ComponentPlugin>();
  private widgetRegistry: WidgetRegistry;
  private componentRegistry: ComponentRegistry;

  constructor() {
    this.widgetRegistry = new WidgetRegistry();
    this.componentRegistry = new ComponentRegistry();
  }

  register(plugin: ComponentPlugin) {
    this.plugins.set(plugin.id, plugin);
    
    // Register plugin components
    if (plugin.components) {
      Object.entries(plugin.components).forEach(([key, component]) => {
        this.componentRegistry.register(`${plugin.id}.${key}`, component);
      });
    }
    
    // Register plugin widgets
    if (plugin.widgets) {
      Object.entries(plugin.widgets).forEach(([key, widget]) => {
        this.widgetRegistry.registerWidget({
          ...widget,
          plugin: plugin.id,
        });
      });
    }
    
    plugin.initialize();
  }

  unregister(pluginId: string) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      plugin.cleanup?.();
      
      // Unregister plugin components
      if (plugin.components) {
        Object.keys(plugin.components).forEach(key => {
          this.componentRegistry.unregister(`${pluginId}.${key}`);
        });
      }
      
      // Unregister plugin widgets
      if (plugin.widgets) {
        Object.keys(plugin.widgets).forEach(key => {
          this.widgetRegistry.unregisterWidget(`${pluginId}.${key}`);
        });
      }
      
      this.plugins.delete(pluginId);
    }
  }

  get(pluginId: string): ComponentPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getWidgetRegistry(): WidgetRegistry {
    return this.widgetRegistry;
  }

  getComponentRegistry(): ComponentRegistry {
    return this.componentRegistry;
  }
}

### Example Plugin
```typescript
// packages/plugins/src/finance/FinancePlugin.ts
export const FinancePlugin: ComponentPlugin = {
  id: 'finance',
  name: 'Finance Plugin',
  version: '1.0.0',

  // Register components
  components: {
    'BudgetWidget': BudgetWidget,
    'ExpenseTracker': ExpenseTracker,
    'InvestmentChart': InvestmentChart,
  },

  // Register widgets
  widgets: {
    'mini-budget': {
      id: 'mini-budget',
      name: 'Mini Budget',
      category: 'productivity',
      component: MiniBudgetWidget,
      size: 'small',
      configurable: true,
    },
    'expense-summary': {
      id: 'expense-summary',
      name: 'Expense Summary',
      category: 'productivity',
      component: ExpenseSummaryWidget,
      size: 'medium',
      configurable: true,
    },
  },

  // Screen enhancements
  screenEnhancements: {
    'chat': FinanceChatEnhancement,
    'settings': FinanceSettingsTab,
  },

  // Theme customization
  themes: {
    'finance-dark': {
      id: 'finance-dark',
      name: 'Finance Dark',
      colors: {
        primary: '#00C853',
        secondary: '#FF6B35',
        background: '#1A1A1A',
      },
    },
  },

  // Feature toggles
  features: {
    'budget-tracking': true,
    'investment-tracking': true,
    'expense-categorization': true,
  },

  initialize: async () => {
    // Initialize finance API connections
    await FinanceAPI.init();
  },

  cleanup: () => {
    FinanceAPI.shutdown();
  },
};

// Usage in apps
import { PluginRegistry } from '@ybis/registry';
import { FinancePlugin } from '@ybis/plugins/finance';

const registry = new PluginRegistry();
registry.register(FinancePlugin);

// Access plugin components
const BudgetWidget = registry.getComponentRegistry().get('finance.BudgetWidget');
const widgetRegistry = registry.getWidgetRegistry();
const budgetWidget = widgetRegistry.getWidget('mini-budget');
```

---

## 🌐 Platform-Specific Overrides

### Strategy
Use platform extensions for native optimizations:

```typescript
// packages/components/src/chat/ChatInput.tsx (base)
export const ChatInput = ({ ... }) => { ... };

// packages/components/src/chat/ChatInput.native.tsx (mobile override)
export const ChatInput = ({ ... }) => {
  // Use native keyboard, haptics, etc.
  return <NativeInput ... />;
};

// packages/components/src/chat/ChatInput.web.tsx (web override)
export const ChatInput = ({ ... }) => {
  // Use web-specific features
  return <WebInput ... />;
};
```

**Metro/Webpack resolves automatically:**
- Mobile: `ChatInput.native.tsx` → `ChatInput.tsx`
- Web: `ChatInput.web.tsx` → `ChatInput.tsx`

---

## 📱 Usage in Apps with Plugin System

### Mobile App with Widget System
```typescript
// apps/mobile/app/(tabs)/index.tsx
import { ChatScreen } from '@ybis/screens';
import { useChat } from '@ybis/hooks';
import { usePluginRegistry } from '@ybis/registry';
import { WidgetArea } from '@ybis/widgets';

export default function MainScreen() {
  const { messages, sendMessage } = useChat({
    onSend: async (text) => {
      await api.sendMessage(text);
    },
  });

  const pluginRegistry = usePluginRegistry();
  const widgetRegistry = pluginRegistry.getWidgetRegistry();
  
  // Get enabled widgets
  const enabledWidgets = widgetRegistry.getAllWidgets()
    .filter(w => w.plugin && pluginRegistry.get(w.plugin)?.features?.[w.id]);

  return (
    <YStack flex={1}>
      {/* Widget Area */}
      <WidgetArea 
        widgets={enabledWidgets}
        onWidgetPress={(widgetId) => {
          // Navigate to full screen
          router.push(`/widget/${widgetId}`);
        }}
      />
      
      {/* Chat Area */}
      <ChatScreen 
        messages={messages} 
        onSendMessage={sendMessage}
        plugins={['finance', 'analytics']} // Enabled plugins
      />
    </YStack>
  );
}
```

### Web App with Plugin Management
```typescript
// apps/web/src/pages/Dashboard.tsx
import { ChatScreen } from '@ybis/screens';
import { PluginManager } from '@ybis/plugins';
import { usePluginRegistry } from '@ybis/registry';

export default function DashboardPage() {
  const pluginRegistry = usePluginRegistry();
  const [enabledPlugins, setEnabledPlugins] = useState(['finance', 'analytics']);

  const togglePlugin = (pluginId: string) => {
    if (enabledPlugins.includes(pluginId)) {
      pluginRegistry.unregister(pluginId);
      setEnabledPlugins(prev => prev.filter(id => id !== pluginId));
    } else {
      // Load and register plugin
      import(`@ybis/plugins/${pluginId}`).then(module => {
        pluginRegistry.register(module.default);
        setEnabledPlugins(prev => [...prev, pluginId]);
      });
    }
  };

  return (
    <YStack flex={1}>
      {/* Plugin Management */}
      <PluginManager 
        availablePlugins={['finance', 'analytics', 'health']}
        enabledPlugins={enabledPlugins}
        onTogglePlugin={togglePlugin}
      />
      
      {/* Main Content */}
      <ChatScreen 
        messages={messages} 
        onSendMessage={sendMessage}
        plugins={enabledPlugins}
      />
    </YStack>
  );
}
```

---

## 🚀 Implementation Plan (Aligned with ChatKit Strategy)

### Phase 1: Tamagui Chat Enhancement (Week 2-3) - NO Voice
- [ ] Enhance existing Tamagui chat UI (WhatsApp-style)
- [ ] Integrate LLMPort with OpenAI API (real AI responses)
- [ ] Implement message streaming (real-time responses)
- [ ] Configure basic options (theme, placeholder, prompts)
- [ ] Test streaming and basic functionality
- [ ] Focus on core chat + Google Workspace integration
- [ ] NO voice input handling (Google TTS entegrasyonu yok)
- [ ] NO ChatKit dependency (vendor lock-in risk)

### Phase 2: Extract Navigation (Week 3)
- [ ] Extract DrawerMenu, TabBar
- [ ] Create platform-specific overrides (.native, .web)
- [ ] Test on both mobile and web

### Phase 3: Multiple LLM Provider Support (Week 4)
- [ ] Anthropic Claude integration (LLMPort)
- [ ] Google Gemini integration (LLMPort)
- [ ] Auto-routing system (cost optimization)
- [ ] Basic voice input as Tamagui component (mic button)
- [ ] Test multiple LLM providers

### Phase 4: Plugin Registry + Component Integration (Week 5)
- [ ] Create `packages/registry` package
- [ ] Implement enhanced PluginRegistry with Tamagui component support
- [ ] Create `packages/screens` package with Tamagui integration
- [ ] Build plugin-aware screen templates
- [ ] Test plugin component registration with ChatKit

### Phase 5: Plugin System Testing (Week 6)
- [ ] Create `packages/plugins` package
- [ ] Build FinancePlugin example with Tamagui components
- [ ] Test plugin loading/unloading
- [ ] Test plugin component integration
- [ ] Performance testing and optimization

### Phase 6: Plugin Marketplace Foundation (Open Beta)
- [ ] Plugin discovery system
- [ ] Plugin installation flow
- [ ] Plugin settings UI
- [ ] Plugin dependency management
- [ ] Third-party plugin support

### Phase 7: Full Plugin Ecosystem (MVP Release)
- [ ] Vertical plugins (Finance, Student, Health)
- [ ] Plugin marketplace
- [ ] Advanced plugin features
- [ ] Plugin analytics
- [ ] Enterprise plugin support

---

## 📦 Enhanced Package Dependencies

```
@ybis/ui (Tamagui primitives)
  ↓
@ybis/components (Business components)
  ↓ depends on ui
  ↓
@ybis/widgets (Widget system)
  ↓ depends on components
  ↓
@ybis/screens (Screen templates)
  ↓ depends on components + widgets
  ↓
@ybis/hooks (Shared hooks)
  ↓ uses components + widgets
  ↓
@ybis/registry (Plugin + Widget registries)
  ↓ manages all packages
  ↓
@ybis/plugins (Plugin implementations)
  ↓ uses registry + all packages
  ↓
apps/* (Mobile, Web, Desktop)
  ↓ uses all packages
```

**Rule:** Lower-level packages CANNOT depend on higher-level packages.
**Plugin Rule:** Plugins can depend on any package but must register through registry.

---

## 🎯 Enhanced Benefits

1. **Code Reuse:** Write once, use everywhere (mobile, web, desktop)
2. **Consistency:** Same UX across platforms
3. **Maintainability:** Fix bugs once, benefit all apps
4. **Performance:** Platform-specific optimizations when needed
5. **Type Safety:** Shared TypeScript interfaces
6. **Testing:** Test components in isolation
7. **Plugin System:** Extensible architecture for vertical expansion
8. **Widget System:** Dynamic main screen customization
9. **Plugin Marketplace:** Third-party developer ecosystem
10. **Enterprise Ready:** On-premise plugin support

---

## ⚠️ Enhanced Dos and Don'ts

### ✅ DO
- Keep components platform-agnostic by default
- Use platform extensions (.native, .web) for optimizations
- Extract reusable logic to hooks
- Document component APIs
- Write unit tests for components
- Register plugins through PluginRegistry
- Use WidgetRegistry for dynamic widgets
- Follow plugin naming conventions (pluginId.componentName)
- Implement proper plugin cleanup
- Use TypeScript interfaces for all plugin definitions

### ❌ DON'T
- Put app-specific logic in shared components
- Create circular dependencies
- Bypass type safety
- Hardcode platform checks in components
- Duplicate code across apps
- Register plugins directly without registry
- Create widgets without WidgetDefinition
- Bypass plugin lifecycle management
- Mix plugin logic with core components
- Create plugins without proper cleanup

---

**Next Steps (Aligned with Tamagui Strategy - Closed Beta Scope):**
1. **Week 2-3:** Tamagui Chat Enhancement (NO voice input handling)
2. **Week 3:** Extract navigation components with platform overrides
3. **Week 4:** Multiple LLM Provider Support + basic voice input (Open Beta)
4. **Week 5:** Plugin registry + Tamagui component integration
5. **Week 6:** Plugin system testing with Tamagui components
6. **Open Beta:** Plugin marketplace foundation
7. **MVP Release:** Full plugin ecosystem with Tamagui

**Cross-References:**
- [Tamagui Chat Strategy](../Güncel/DEVELOPMENT_LOG.md#AD-026)
- [Plugin System Timeline](../roadmap/DEVELOPMENT_ROADMAP.md#plugin-system-timeline)
- [3-Wave Plugin Strategy](../roadmap/PRODUCT_ROADMAP.md#plugin-system-timeline)
- [Port Architecture](../YBIS_PROJE_ANAYASASI.md#port-architecture)
