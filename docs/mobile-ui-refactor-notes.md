# Mobile UI Refactor - Chat Store Architecture Notes

**Date:** 2025-10-28
**Status:** DEFERRED - UI öncelikli, store refactor sonraya kaldı

## Current Problems

### 1. Chat State Management
- ❌ `useChat` hook uses local `useState` → messages lost on unmount
- ❌ No persistence (AsyncStorage/SecureStore)
- ❌ No conversation history
- ❌ Single session only (no multi-chat support)
- ❌ Not ready for chat list screen

### 2. Current Structure
```typescript
// apps/mobile/src/features/chat/hooks/useChat.ts
const [messages, setMessages] = useState<Message[]>([]); // ← Component-local, ephemeral
```

## Proposed Solution: Zustand Chat Store

### Architecture Overview
```
useChatStore (Zustand + AsyncStorage)
  ↓
  ├── conversations: Conversation[]
  ├── activeConversationId: string | null
  ├── createConversation()
  ├── addMessage()
  ├── deleteConversation()
  └── setActiveConversation()
```

### 1. Create Chat Store (`apps/mobile/src/stores/useChatStore.ts`)

```typescript
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  clearConversation: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: () => {
        const id = nanoid();
        const newConv: Conversation = {
          id,
          title: 'New Chat',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        };
        set(state => ({
          conversations: [...state.conversations, newConv],
          activeConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId, message) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                  // Auto-title from first message
                  title: conv.messages.length === 0
                    ? message.text.slice(0, 30) + '...'
                    : conv.title,
                }
              : conv
          ),
        }));
      },

      deleteConversation: (id) => {
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeConversationId: state.activeConversationId === id
            ? null
            : state.activeConversationId,
        }));
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      clearConversation: (id) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, messages: [] } : conv
          ),
        }));
      },
    }),
    {
      name: 'ybis-chat-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 2. Refactor useChat Hook

```typescript
// apps/mobile/src/features/chat/hooks/useChat.ts

export function useChat() {
  const {
    conversations,
    activeConversationId,
    addMessage,
    createConversation,
  } = useChatStore();

  const [inputText, setInputText] = useState('');

  // Get active conversation messages
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages ?? [];
  const isFirstSession = messages.length === 0;

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    // Create conversation if none active
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    addMessage(convId, userMessage);
    setInputText('');

    // AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getMockAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      addMessage(convId, aiMessage);
    }, 1500);
  }, [inputText, activeConversationId, addMessage, createConversation]);

  return {
    messages,
    inputText,
    isFirstSession,
    setInputText,
    handleSendMessage,
    handlePromptClick,
  };
}
```

### 3. Chat List Screen (`apps/mobile/app/(tabs)/chat.tsx`)

```typescript
export default function ChatListScreen() {
  const { conversations, createConversation, setActiveConversation, deleteConversation } = useChatStore();
  const router = useRouter();

  const handleNewChat = () => {
    const id = createConversation();
    router.push('/(tabs)'); // Go to home with new chat
  };

  const handleSelectChat = (id: string) => {
    setActiveConversation(id);
    router.push('/(tabs)'); // Go to home with selected chat
  };

  return (
    <UniversalLayout>
      <Navbar title="Conversations" />

      <FlatList
        data={conversations.sort((a, b) => b.updatedAt - a.updatedAt)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            title={item.title}
            lastMessage={item.messages[item.messages.length - 1]?.text}
            timestamp={item.updatedAt}
            onPress={() => handleSelectChat(item.id)}
            onDelete={() => deleteConversation(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyChatsView />}
      />

      <FAB onPress={handleNewChat} icon={Plus} />
    </UniversalLayout>
  );
}
```

## Benefits

✅ **Persistence** - AsyncStorage integration, survives app restarts
✅ **Multi-conversation** - Chat history preserved
✅ **Centralized state** - All screens use same store
✅ **Port architecture ready** - Easy to swap AsyncStorage → Supabase
✅ **Testable** - Store logic separate from UI
✅ **Performance** - Zustand optimized for React
✅ **Auto-titling** - First message becomes conversation title

## Implementation Order (WHEN DOING THIS)

1. ✅ Create `useChatStore.ts` with Zustand + persist
2. ✅ Refactor `useChat.ts` to consume store
3. ✅ Update `index.tsx` (home chat screen)
4. ✅ Create `ChatListItem.tsx` component
5. ✅ Create `chat.tsx` screen (conversation list)
6. ✅ Add FAB component for new chat
7. ✅ Test persistence (kill app, reopen)
8. ✅ Add swipe-to-delete for conversations

## Dependencies to Add

```bash
pnpm add nanoid
```

## Notes

- Store follows same pattern as `useMockAuth` (Zustand best practice)
- Zustand already in project, no new dependency
- AsyncStorage already available via Expo
- Conversation ID = nanoid (short, URL-safe)
- First message text = conversation title (auto-generated)

## Current UI Work Priority

**DEFERRED TO:** After UI polish is complete
- Widget animations polished
- Keyboard handling finalized
- Layout system stable
- Design system consistent

Then we tackle the store refactor above.

---

**Last Updated:** 2025-10-28
**Author:** AI Agent (Sonnet 4.5)
