---
title: "Widget Expansion Roadmap (v1 → v2 → v3)"
description: "Phased approach to building adaptive widget system"
version: "1.0.0"
status: "roadmap"
created: "2025-10-27"
owner: "@ybis-master"
tags: ["widget", "roadmap", "phases"]
related_docs:
  - "./widget-architecture-v1.md"
  - "../stories/1.1.mobile-app-foundation.md"
---

# Widget Expansion Roadmap

## Quick Reference

| Version | States | Gestures | AI Features | Timeline |
|---------|--------|----------|-------------|----------|
| v1.0    | 2 (Normal/Mini) | None | None | NOW |
| v1.5    | 2 | Swipe widget | None | +1 week |
| v2.0    | 3 (+ Expanded) | Swipe + Tap | Auto-expand | +2 weeks |
| v3.0    | 3 | All | Context-aware | Future |

---

## v1.0 - MVP Foundation (Current Sprint)

**Goal:** Fix keyboard/layout bugs, validate overlay architecture

### Features
- ✅ Widget overlay (position: absolute)
- ✅ FlatList for chat (replace ScrollView)
- ✅ 2 states: Normal (25%) / Mini (5%)
- ✅ Keyboard triggers mini mode
- ✅ Tab bar (button-based, no swipe yet)

### What's NOT in v1.0
- ❌ Expanded mode
- ❌ Gesture controls
- ❌ Auto-expand on AI activity
- ❌ Widget input handling

### Success Criteria
- [ ] Keyboard open/close 10x → No bugs
- [ ] Chat scrolls independently of widget state
- [ ] Widget animations smooth (60fps)
- [ ] Code simpler than current implementation

---

## v1.5 - Gesture Controls (+1 week)

**Goal:** Add swipe gestures for better UX

### Features
- ✅ Swipe down on widget → Mini mode
- ✅ Swipe up on widget → Normal mode
- ✅ Swipe left/right → Change tabs
- ✅ Spring animations (replace linear)

### Implementation
- Use `react-native-gesture-handler`
- Pan gesture on widget container
- Animated spring transitions

### Success Criteria
- [ ] Swipe feels natural (not laggy)
- [ ] No accidental tab switches
- [ ] Gestures + buttons both work

---

## v2.0 - Full Adaptive System (+2 weeks)

**Goal:** Add Expanded mode, AI triggers

### Features
- ✅ 3rd state: Expanded (50% screen)
- ✅ Tap widget background → Toggle expand
- ✅ AI activity → Auto-expand 3s → Return
- ✅ Widget input handling (expanded mode)
- ✅ Chat dimming when widget expanded

### AI Triggers
```typescript
// Example: AI adds task
onAIAction('task_added', () => {
  widgetExpand(); // Expand to 50%
  setTimeout(() => widgetNormal(), 3000); // Back to 25% after 3s
});
```

### Success Criteria
- [ ] User can edit tasks in widget without leaving chat
- [ ] AI actions visible in real-time
- [ ] Widget input doesn't conflict with chat input

---

## v3.0 - AI Context-Aware (Future)

**Goal:** Widget knows what to show and when

### Features
- ✅ AI predicts optimal widget size based on content
- ✅ Pre-expand before AI responds (user intent detection)
- ✅ Smart tab switching (user says "calendar" → Auto-switch)
- ✅ Content-aware sizing (1 task = normal, 5 tasks = expand)

### ML/AI Integration
- User message analysis (predict widget needs)
- Content size detection (auto-size widget)
- Usage patterns (learn user preferences)

### Success Criteria
- [ ] 80% accuracy on size prediction
- [ ] User rarely needs to manually expand
- [ ] Widget feels like "AI co-pilot"

---

## Design Trade-offs

### Why Not Start with v3.0?
**Risk:** Over-engineering before validating basic architecture

**Approach:** Ship minimal (v1), validate, iterate
- v1.0 = Prove overlay works, fix keyboard
- v1.5 = Add polish (gestures)
- v2.0 = Add power (expansion)
- v3.0 = Add intelligence (AI-driven)

### Why 3 Versions?
- **Learn fast:** Each version teaches us something
- **Risk mitigation:** Don't bet on complex features
- **User feedback:** Real usage informs design

---

## Open Questions (To Decide Later)

### Widget Persistence
- Remember last tab when app reopens?
- Remember last widget state (mini/normal/expanded)?
- Store widget preferences per-user?

### Widget Content Loading
- Lazy load tab content?
- Pre-fetch all tabs?
- Cache strategy?

### Multi-Widget Support (Future)
- Can multiple widgets stack?
- Picture-in-picture widget?
- Widget on other screens (not just chat)?

---

**Next Steps:**
1. Implement v1.0 (refactor current index.tsx)
2. Test keyboard behavior extensively
3. Gather feedback on 2-state system
4. Plan v1.5 gestures based on user feedback
