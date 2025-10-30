# AI Theme Generation Architecture

**Vision:** AI can generate and apply custom themes on-the-fly, just like it navigates the app.

## Current System (Static)

**Status:** Light/Dark themes ONLY (Tamagui built-in)

```
apps/mobile/themes/          ← Prepared but NOT USED yet
├── dark.theme.ts           ← Complete token definitions
├── light.theme.ts          ← Complete token definitions
└── ocean.theme.ts          ← Complete token definitions (demo)
```

**Why not using custom themes yet:**
- ❌ Tamagui config expects specific token structure (not just color objects)
- ❌ Requires proper Tamagui createTokens() + createThemes() setup
- ❌ Would need workarounds → violates "Fix the Abstraction" principle
- ✅ Theme files ready for AI generation architecture
- ✅ Will implement properly when doing AI theme generation feature

**Current:**
- Using Tamagui's default light/dark themes
- Settings has theme picker (Light/Dark only)
- Theme store ready for expansion (`ThemeName` type)

## AI-Ready System (Dynamic)

### 1. Theme Schema (JSON-serializable)

```typescript
// packages/theme/src/schema/ThemeSchema.ts

export interface ThemeSchema {
  id: string;
  name: string;
  author: 'user' | 'ai' | 'system';
  createdAt: string;
  description?: string;

  colors: {
    // Base
    background: string;
    foreground: string;

    // Text
    color: string;
    colorHover: string;
    colorPress: string;

    // Grays
    gray1: string;
    gray2: string;
    // ... gray3-12

    // Brand
    blue1: string;
    // ... blue2-12

    // Status
    red9: string;
    green9: string;
    yellow9: string;
    orange9: string;

    // UI
    borderColor: string;
    borderColorHover: string;
    borderColorFocus: string;

    // Shadows
    shadowColor: string;
    shadowColorHover: string;
  };
}
```

### 2. Theme Store (Runtime Management)

```typescript
// packages/theme/src/stores/useThemeStore.ts

interface ThemeState {
  // Built-in themes (compile-time)
  systemThemes: Record<string, ThemeSchema>;

  // User/AI themes (runtime)
  customThemes: Record<string, ThemeSchema>;

  activeThemeId: string;

  // Actions
  addTheme: (theme: ThemeSchema) => void;
  removeTheme: (id: string) => void;
  updateTheme: (id: string, updates: Partial<ThemeSchema>) => void;
  setActiveTheme: (id: string) => void;

  // AI Actions
  generateThemeFromPrompt: (prompt: string) => Promise<ThemeSchema>;
  saveAITheme: (theme: ThemeSchema) => Promise<void>;
}
```

### 3. AI Theme Generation Flow

```typescript
// User: "Create a cyberpunk neon theme with purple and green"

// 1. AI Agent receives prompt
const themePrompt = "cyberpunk neon theme with purple and green";

// 2. AI calls theme generation function
const generatedTheme = await themeStore.generateThemeFromPrompt(themePrompt);

// generatedTheme = {
//   id: "ai-cyberpunk-neon-abc123",
//   name: "Cyberpunk Neon",
//   author: "ai",
//   createdAt: "2025-10-28T...",
//   description: "Cyberpunk-inspired theme with purple and neon green accents",
//   colors: {
//     background: "#0D0221",
//     foreground: "#00FF41",
//     color: "#E0E0FF",
//     gray1: "#1A0B2E",
//     // ... AI-generated color palette
//     blue9: "#9D00FF",  // Purple instead of blue
//     green9: "#00FF41", // Neon green
//   }
// }

// 3. Theme added to store
themeStore.addTheme(generatedTheme);

// 4. Theme activated
themeStore.setActiveTheme(generatedTheme.id);

// 5. UI instantly updates with new colors
```

### 4. AI Theme Generator Function

```typescript
// packages/theme/src/ai/generateTheme.ts

export async function generateThemeFromPrompt(
  prompt: string,
  aiClient: AIClient
): Promise<ThemeSchema> {
  const systemPrompt = `You are a professional UI/UX color designer.
Generate a complete theme palette based on user's description.

Requirements:
- All colors must be valid hex codes (#RRGGBB)
- Ensure sufficient contrast for accessibility (WCAG AA)
- Create harmonious color gradients for gray1-12 and blue1-12
- Choose appropriate status colors (red, green, yellow, orange)
- Return valid JSON matching ThemeSchema

User prompt: ${prompt}
`;

  const response = await aiClient.complete({
    model: 'claude-3-5-sonnet',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the theme as JSON' },
    ],
  });

  const themeSchema: ThemeSchema = JSON.parse(response);

  // Validate schema
  validateThemeSchema(themeSchema);

  return themeSchema;
}
```

### 5. Persistence Layer

```typescript
// Themes saved to AsyncStorage
// AI themes persist across app restarts

const STORAGE_KEY = 'ybis_custom_themes';

async function saveCustomThemes(themes: Record<string, ThemeSchema>) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

async function loadCustomThemes(): Promise<Record<string, ThemeSchema>> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : {};
}
```

### 6. UI: Theme Picker with AI Generator

```tsx
// apps/mobile/src/screens/ThemePickerScreen.tsx

export function ThemePickerScreen() {
  const { systemThemes, customThemes, activeThemeId, setActiveTheme } = useThemeStore();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const allThemes = { ...systemThemes, ...customThemes };

  const handleGenerateTheme = async () => {
    setIsGenerating(true);
    try {
      const newTheme = await generateThemeFromPrompt(aiPrompt, aiClient);
      await themeStore.addTheme(newTheme);
      themeStore.setActiveTheme(newTheme.id);
      setAiPrompt('');
    } catch (error) {
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <YStack flex={1} padding="$4">
      {/* AI Theme Generator */}
      <Card>
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600">AI Theme Generator</Text>
          <Input
            placeholder="Describe your theme: cyberpunk, forest, sunset..."
            value={aiPrompt}
            onChangeText={setAiPrompt}
          />
          <Button
            onPress={handleGenerateTheme}
            disabled={!aiPrompt.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : '✨ Generate Theme'}
          </Button>
        </YStack>
      </Card>

      {/* Theme List */}
      <YStack gap="$3" marginTop="$4">
        <Text fontSize="$4" fontWeight="600">Your Themes</Text>
        {Object.values(allThemes).map(theme => (
          <ThemePreviewCard
            key={theme.id}
            theme={theme}
            isActive={theme.id === activeThemeId}
            onSelect={() => setActiveTheme(theme.id)}
            onDelete={theme.author === 'ai' ? () => removeTheme(theme.id) : undefined}
          />
        ))}
      </YStack>
    </YStack>
  );
}
```

## Implementation Steps

### Phase 1: Foundation (Now)
1. ✅ Create ThemeSchema interface
2. ✅ Migrate existing themes to schema format
3. ✅ Update ThemeStore to support custom themes
4. ✅ Add AsyncStorage persistence

### Phase 2: UI (Next)
1. ⬜ Create ThemePickerScreen
2. ⬜ Add theme preview cards
3. ⬜ Implement theme deletion

### Phase 3: AI Integration (Later)
1. ⬜ Create AI theme generator function
2. ⬜ Add prompt engineering for color theory
3. ⬜ Implement validation & contrast checking
4. ⬜ Add theme refinement (AI iterates based on feedback)

## AI Agent Capabilities

```typescript
// AI can execute these theme commands:

// 1. Generate theme
"Create a dark forest theme with emerald greens"
→ AI generates JSON → Applies theme

// 2. Modify existing theme
"Make the ocean theme darker"
→ AI fetches ocean theme → Adjusts colors → Updates theme

// 3. Analyze current theme
"What colors are in the current theme?"
→ AI reads active theme → Describes palette

// 4. Theme recommendations
"Suggest a theme for late night reading"
→ AI suggests warm, low-contrast dark theme
```

## Benefits

✅ **Dynamic themes** - No code changes needed
✅ **AI-generated** - Natural language → theme
✅ **Persistent** - Themes saved across sessions
✅ **Shareable** - Export/import theme JSON
✅ **Real-time preview** - Live theme switching
✅ **Accessibility** - AI ensures WCAG contrast
✅ **Unlimited themes** - Not limited to 3 built-ins

## Example Prompts

```
User: "Create a cozy coffee shop theme"
AI: Generates warm browns, creams, subtle oranges

User: "I want a high-contrast theme for outdoor use"
AI: Generates bright backgrounds, dark text, bold colors

User: "Make me a theme inspired by a rainy London evening"
AI: Generates cool grays, muted blues, soft highlights

User: "Cyberpunk 2077 vibes"
AI: Generates neon purples, electric blues, dark backgrounds
```

## Technical Notes

- **Color validation:** Use `tinycolor2` or `chroma-js` for color manipulation
- **Contrast checking:** WCAG AA requires 4.5:1 for normal text
- **Theme export:** JSON format allows sharing via file/URL
- **Version control:** Each theme has version field for migrations
- **Fallback:** Invalid themes fallback to default dark/light

---

**Status:** Design phase
**Next:** Implement ThemeSchema and migrate existing themes
**Dependencies:** AI SDK integration (already exists for navigation)
