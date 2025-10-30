---
title: "Widget Architecture & UX Design v1"
description: "Overlay-based widget system for single-screen AI workspace philosophy"
version: "1.0.0"
status: "design"
created: "2025-10-27"
owner: "@ybis-master"
tags: ["widget", "ui", "architecture", "single-screen", "overlay"]
related_docs:
  - "../YBIS_PROJE_ANAYASASI.md"
  - "../stories/1.1.mobile-app-foundation.md"
  - "./widget-expansion-roadmap.md"
---

# Widget Architecture & UX Design v1

## 🎯 Vision: Single-Screen Philosophy

**Core Concept:** Widget is the "AI workspace canvas" where users see AI actions happen live, while chat is the conversation layer. Both coexist on one screen without layout conflicts.

### Key Principles

1. **Widget = AI's Visible Workspace**
   - User sees what AI is doing in real-time
   - Example: "Add event tomorrow 3pm" → Calendar widget shows event being created live
   - Widget is interactive: user can intervene/edit while AI works

2. **Overlay Architecture (Zero Layout Conflict)**
   - Widget floats ABOVE chat (separate z-index layer)
   - Chat layout calculations completely independent
   - No ScrollView padding hacks, no animation sync issues

3. **Adaptive Size Based on Context**
   - Widget intelligently resizes based on what's happening
   - Chat always accessible (scroll works)
   - Keyboard never breaks layout

---

## 🏗️ Technical Architecture

### Layer Structure

```tsx
<UniversalLayout>
  {/* Layer 1: Chat (Base Layer) */}
  <YStack flex={1}>
    <KeyboardAvoidingView>
      <FlatList inverted />  {/* Messages - React Native best practice */}
      <ChatInput />
    </KeyboardAvoidingView>
  </YStack>

  {/* Layer 2: Widget (Overlay) */}
  <Animated.View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: widgetHeight,  // Dynamic
      zIndex: 100
    }}
  >
    <WidgetTabs />
    <Widget />
  </Animated.View>
</UniversalLayout>
```

### Why This Works

✅ **No Layout Conflicts:** Widget is `position: absolute`, doesn't affect chat flex calculations
✅ **Independent Keyboard Handling:** Each layer handles its own keyboard
✅ **Simple State:** Widget height is the only state, no complex sync
✅ **Performance:** FlatList for chat (optimized), widget overlay doesn't block scroll

---

## 📐 Widget Size States - Roadmap (v1 → v2 → v3)

### v1.0 - MVP (Current Implementation)

**Goal:** Get it working, validate architecture

#### 2 States Only:

**1. Normal Mode (Fixed 20-25% screen)**
```
┌─────────────────────┐
│ [📊] [✅] [📅] [⚙️] │ ← Widget tabs
│ Task content preview│
│ • Buy milk          │
├─────────────────────┤
│                     │
│   Chat Messages     │ (70% screen)
│                     │
├─────────────────────┤
│ [Input]        [Send]│ (10%)
└─────────────────────┘

When: Default state
```

**2. Mini Mode (5% screen - tab icons only)**
```
┌─────────────────────┐
│ 📊  ✅  📅  ⚙️       │ ← Just icons, no content
├─────────────────────┤
│                     │
│   Chat Messages     │ (85% screen)
│                     │
├─────────────────────┤
│ [Input]        [Send]│
│   [Keyboard]        │
└─────────────────────┘

When: User typing in chat (keyboard open)
```

**Triggers:**
- Keyboard opens (chat input focused) → Mini Mode
- Keyboard closes → Normal Mode

**Implementation:**
- Simple `Animated.Value` for height
- Keyboard listeners (`keyboardDidShow`, `keyboardDidHide`)
- No manual scroll management
- FlatList handles everything

---

### v1.5 - Enhanced Interaction

**Add:**
- Swipe gestures on widget (swipe down = mini, swipe up = normal)
- Tab switching (swipe left/right between tabs)
- Smooth animations (spring physics)

**Goal:** Better UX, muscle memory

---

### v2.0 - Full Adaptive System

**Add 3rd State: Expanded Mode (50% screen)**

```
┌─────────────────────┐
│ [📊] [✅] [📅] [⚙️] │
│                     │
│ Full widget content │
│ • Task 1            │
│ • Task 2            │
│ [Add task: ____]    │ ← Widget has input
├─────────────────────┤
│   Chat (40%)        │
│   (dimmed slightly) │
└─────────────────────┘

When:
- User taps widget area (toggle expand)
- AI is actively working in widget
- Widget needs input (e.g., editing task)
```

**Smart Triggers:**
1. **Auto-expand:** AI adds content to widget → Expand 3s → Return to normal
2. **Manual expand:** User taps widget background → Toggle expand/normal
3. **Input expand:** Widget input focused → Expand (until input blur)

**Gesture Map:**
- Swipe up widget → Expand
- Swipe down widget → Normal (or mini if keyboard open)
- Tap widget background → Toggle expand/normal
- Horizontal swipe → Change tabs

---

### v3.0 - AI Context-Aware (Future)

**Intelligent Sizing:**
- AI knows what content it's showing → Auto-sizes widget
- Example: Adding 1 task → Normal mode, Adding 5 tasks → Auto-expand
- Calendar with many events → Auto-expand
- Empty widget → Mini mode

**Predictive UX:**
- User says "add task" → Widget pre-expands to Task tab before AI responds
- User says "check calendar" → Widget switches to Calendar tab

---

## 🎨 Widget Tab System

### v1.0 - Basic Tabs

**Tabs:**
1. 📊 **Notes** - Recent notes preview
2. ✅ **Tasks** - Today's tasks
3. 📅 **Calendar** - Upcoming events
4. ⚙️ **Flows** - Automation status

**Interaction:**
- Tab bar always visible (even in mini mode, just icons)
- Click tab to switch
- **Future:** Swipe left/right to switch tabs

**Design:**
- Simple button-based tabs (no swipe in v1)
- Active tab highlighted
- Smooth transition between tab content

---

## 🚀 Implementation Phases

### Phase 1: Architecture Refactor (NOW)
**Goal:** Fix current keyboard/layout issues

**Tasks:**
1. ✅ Replace ScrollView → FlatList (chat messages)
2. ✅ Remove manual scroll tracking
3. ✅ Remove chatInputHeight state
4. ✅ Widget as absolute positioned overlay
5. ✅ Simple 2-state widget (normal/mini)
6. ✅ Keyboard listeners for widget collapse

**Success Criteria:**
- Keyboard opens/closes smoothly
- No jumping, no layout conflicts
- Chat scrolls independently
- Widget mini mode when keyboard open

---

### Phase 2: Widget Content (NEXT)
**Goal:** Make widget useful

**Tasks:**
1. Implement actual widget content (Notes, Tasks, Calendar, Flows)
2. Widget → Chat integration (click task → add to chat)
3. AI → Widget updates (mock: AI adds task, widget updates live)
4. Widget edit mode (tap task → edit inline)

---

### Phase 3: Gestures & Polish
**Goal:** Smooth UX

**Tasks:**
1. Swipe gestures (up/down for size, left/right for tabs)
2. Spring animations
3. Haptic feedback
4. Widget state persistence (remember which tab user was on)

---

### Phase 4: v2.0 Expansion System
**Goal:** Full adaptive widget

**Tasks:**
1. Add Expanded mode (50% screen)
2. Auto-expand triggers (AI activity, user tap)
3. Widget input handling (expanded mode)
4. Smart return to normal after auto-expand

---

## 📋 Design Decisions Log

### Decision 1: Why Overlay Instead of Flex?
**Problem:** Widget in flex layout causes keyboard conflicts
**Solution:** Absolute positioning (overlay)
**Trade-off:** More z-index management, but zero layout conflicts
**Result:** Clean separation, each layer independent

### Decision 2: Why FlatList Instead of ScrollView?
**Problem:** ScrollView doesn't handle keyboard well, manual scroll management
**Solution:** FlatList inverted (React Native best practice for chat)
**Trade-off:** None, FlatList is better for lists
**Result:** Auto-scroll, performance, keyboard handling built-in

### Decision 3: Why Mini Mode Instead of Hide?
**Problem:** Hiding widget completely loses context
**Solution:** Mini mode (tab icons only) keeps widget visible but compact
**Trade-off:** 5% screen space for context awareness
**Result:** User always knows widget exists, can switch tabs quickly

### Decision 4: Swipe + Buttons for Tabs?
**Problem:** Swipe-only = accidental changes, Buttons-only = less fluid
**Solution:** Both (swipe for power users, buttons for precision)
**Trade-off:** More gesture handling code
**Result:** Flexible UX, users choose preferred method

### Decision 5: Why Start with 2-State Instead of 3-State?
**Problem:** Risk of over-engineering before validating architecture
**Solution:** Ship v1 with 2 states (normal/mini), add expand later
**Trade-off:** Less features initially, but faster validation
**Result:** Follow "Ship Minimal, Build for Scale" principle (constitution)

---

## 🧪 Testing Strategy

### v1.0 Testing Checklist

**Widget Collapse:**
- [ ] Keyboard opens → Widget mini mode
- [ ] Keyboard closes → Widget normal mode
- [ ] Animation smooth (no jank)
- [ ] Tab icons visible in mini mode

**Chat Independence:**
- [ ] Chat scroll works with widget expanded
- [ ] Chat scroll works with widget mini
- [ ] New message → Auto-scroll to bottom
- [ ] Widget animations don't affect chat scroll

**Keyboard Handling:**
- [ ] iOS: KeyboardAvoidingView works
- [ ] Android: Keyboard doesn't break layout
- [ ] Input blur → Keyboard closes
- [ ] Keyboard close → Widget expands

**Multi-Cycle Test:**
- [ ] Open/close keyboard 10 times (no state bugs)
- [ ] Switch tabs 10 times (no memory leaks)
- [ ] Send 50 messages (FlatList performance)

---

## 📚 Related Documents

**Constitution Compliance:**
- ✅ "Fix the Abstraction" principle: We fixed overlay vs flex abstraction
- ✅ "Build for Scale, Ship Minimal": v1 = 2 states, v2 = 3 states (roadmap)
- ✅ React Native best practices: FlatList for chat, KeyboardAvoidingView

**Next Steps:**
- [ ] Create `widget-expansion-roadmap.md` (detailed v2.0 plan)
- [ ] Create `widget-content-design.md` (what each tab shows)
- [ ] Update `1.1.mobile-app-foundation.md` story (reflect new architecture)

---

## 🎯 Success Metrics

**v1.0:**
- Zero keyboard bugs
- Smooth animations (60fps)
- Chat scroll independent
- < 100 lines of widget logic

**v2.0:**
- User can work in widget without leaving chat
- AI actions visible in real-time
- < 3 taps to any widget function

**v3.0:**
- AI context-aware sizing (80% accuracy)
- User never needs to manually expand widget
- Widget feels like "AI co-pilot"

---

**Version:** 1.0.0
**Status:** Design → Implementation
**Next Review:** After v1.0 implementation (validate architecture)
