# React Native & Expo Best Practices

**Version:** 1.0
**Last Updated:** 2025-01-20
**Purpose:** Mobile-specific patterns to prevent common issues

---

## 🚨 Critical Patterns (Learned from Experience)

### 1. Expo Router Folder Structure

**Rule:** `app/` = routes only, `src/` = everything else

```
apps/mobile/
├── app/                    # Expo Router (routes only)
│   ├── (tabs)/
│   │   ├── _layout.tsx    # ✅ Route
│   │   └── index.tsx      # ✅ Route
│   └── _layout.tsx         # ✅ Route
│
└── src/                    # Everything else
    ├── components/         # ✅ UI components
    │   └── drawer/
    ├── hooks/              # ✅ Custom hooks
    ├── stores/             # ✅ Zustand stores
    └── utils/              # ✅ Helper functions
```

**Why:** Expo Router treats everything in `app/` as a potential route.

**Symptoms of violation:**
- `WARN Route "./components/Foo.tsx" is missing default export`
- Components showing up in navigation

**Fix:** Move to `src/` immediately.

---

## 2. Modal + Animation Lifecycle

**Problem:** Animated modals "spawn" on 2nd+ open (no slide animation).

**Root Cause:** Animation state not reset after close.

**Correct Pattern:**

```tsx
function AnimatedModal({ open, onOpenChange }) {
  // Internal state (synced with animation lifecycle)
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values (start off-screen)
  const slideAnim = useRef(new Animated.Value(-WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      // Step 1: Show modal (but off-screen)
      setModalVisible(true);

      // Step 2: Animate in
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, ... }),
        Animated.timing(opacityAnim, { toValue: 1, ... }),
      ]).start();

    } else if (modalVisible) {
      // Step 1: Animate out
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -WIDTH, ... }),
        Animated.timing(opacityAnim, { toValue: 0, ... }),
      ]).start(() => {
        // Step 2: After animation completes
        setModalVisible(false);           // Hide modal
        slideAnim.setValue(-WIDTH);       // RESET position
        opacityAnim.setValue(0);          // RESET opacity
      });
    }
  }, [open, modalVisible]);

  return (
    <Modal visible={modalVisible} transparent animationType="none">
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        {/* Content */}
      </Animated.View>
    </Modal>
  );
}
```

**Key Points:**
1. ✅ Internal `modalVisible` state (don't use `open` directly)
2. ✅ Reset animation values **in callback** (after animation completes)
3. ✅ `animationType="none"` (we handle animation ourselves)

**Test Requirement:** Open/close 3+ times to verify smooth animation every time.

---

## 3. Layout & Safe Area

**Pattern:** Always use safe area insets for edge-to-edge layouts.

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyComponent() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 16),      // Notch
        paddingBottom: Math.max(insets.bottom, 16), // Home indicator
      }}
    >
      {/* Content */}
    </View>
  );
}
```

**Test Devices:**
- iPhone with notch (insets.top > 0)
- Android with gesture bar (insets.bottom > 0)
- Tablet (different aspect ratio)

---

## 4. Keyboard Handling

**Pattern:** Input bar should follow keyboard position.

```tsx
import { Keyboard, Animated } from 'react-native';

function ChatScreen() {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    const hide = Keyboard.addListener('keyboardDidHide', (e) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Animated.View style={{ bottom: keyboardHeight }}>
      <Input />
    </Animated.View>
  );
}
```

**Key:** Use keyboard's own duration for smooth sync.

---

## 5. "Fancy Features" Approval Rule

**Rule:** Ask user before adding "cool" features.

**Requires approval:**
- ✋ Haptic feedback (vibrations)
- ✋ Sound effects
- ✋ Complex animations (spring physics)
- ✋ Gesture recognizers (swipe, long-press)
- ✋ 3D effects / transforms

**Default approach:** Professional but minimal.

**Why:** User preferences vary. What's "cool" to you might be annoying to user.

**Example:**
```
AI: "Drawer açılınca hafif titreşim ekleyeyim mi? (haptic feedback)"
User: "Hayır, sadece visual yeter"
AI: ✅ Haptic ekleme
```

---

## 6. Component Testing Checklist

### Before Delivering:
- [ ] **Multiple cycles:** Open/close/interact 3+ times
- [ ] **Safe area:** Test on notched device
- [ ] **Keyboard:** Test with keyboard open/closed
- [ ] **Scroll:** Ensure no overflow issues
- [ ] **Theme:** Test dark + light mode
- [ ] **Navigation:** Test back button, deep links

### Layout Specific:
- [ ] Small screen (iPhone SE)
- [ ] Large screen (iPhone Pro Max)
- [ ] Tablet (iPad)
- [ ] Landscape orientation

---

## 7. Common Pitfalls

### ❌ Don't:
```tsx
// 1. Using app/ for components
apps/mobile/app/components/Foo.tsx  // ❌ Route conflict

// 2. Not resetting animation state
useEffect(() => {
  if (open) {
    Animated.timing(...).start();
  } else {
    Animated.timing(...).start();  // ❌ No reset!
  }
}, [open]);

// 3. Hardcoded padding (no safe area)
<View style={{ paddingTop: 44 }}>  // ❌ Breaks on notch

// 4. Adding fancy features without asking
void Haptics.impactAsync(...);  // ❌ User didn't approve
```

### ✅ Do:
```tsx
// 1. Use src/ for components
apps/mobile/src/components/Foo.tsx  // ✅ Correct

// 2. Reset animation state in callback
Animated.timing(...).start(() => {
  anim.setValue(INITIAL);  // ✅ Reset
});

// 3. Use safe area insets
paddingTop: Math.max(insets.top, 16)  // ✅ Adaptive

// 4. Ask before fancy features
// "Haptic feedback ekleyeyim mi?"  // ✅ Get approval
```

---

## 8. When to Create a Port (Mobile Context)

**Port Criteria (from YBIS_PROJE_ANAYASASI.md):**
- ✅ External vendor/service (swap potential)
- ❌ Framework part (Expo Router, React Navigation)
- ❌ Stable library (single implementation)

**Examples:**
- ✅ **StoragePort** - File storage (S3 vs GCS vs Supabase)
- ❌ **AsyncStorage** - Local key-value (stable, no alternatives)
- ❌ **Expo Router** - Framework part
- ❌ **Tamagui** - UI library (swap = full rewrite anyway)
- ✅ **AuthPort** - OAuth providers (Google vs Firebase vs Supabase)

---

## 9. Architecture Decision Template

When making a mobile architecture decision:

**Ask:**
1. Is this a route or component? (`app/` vs `src/`)
2. Does animation state reset? (test 3+ cycles)
3. Does it handle safe area? (notch/home indicator)
4. Is this a "fancy feature"? (ask user first)
5. Do we need a port? (vendor swap potential?)

**Document:**
- Update `DEVELOPMENT_LOG.md` with AD-XXX
- Add pattern to this file if reusable

---

## 10. Gesture Implementation Strategy (Learned 2025-01-20)

### Problem: Gestures Are Complex

**Attempted:** PanResponder + react-native-gesture-handler for drawer swipe
**Result:** App lock/freeze, "fixing loop", production blocker

**Root Causes:**
1. ❌ **Touch event conflicts** - Gesture handlers block other interactions
2. ❌ **State management complexity** - Gesture state + animation state conflicts
3. ❌ **Production instability** - Works 1st time, breaks on 2nd+ interaction
4. ❌ **Over-engineering** - Complex solution for simple problem

---

### Rule: "Start Simple, Add Gestures Later"

**✅ DO:**
```tsx
// Phase 1: Ship with button-only (WORKING)
<Button onPress={openDrawer}>Menu</Button>

// Animation: Fast + smooth easing
Animated.timing(slideAnim, {
  duration: 180,  // Fast
  easing: Easing.out(Easing.cubic),  // Smooth deceleration
  useNativeDriver: true
})
```

**❌ DON'T:**
```tsx
// Phase 1: Try to add gestures immediately
// Result: App lock, fixing loop, production risk
```

---

### When To Add Gestures

**Criteria:**
1. ✅ **User feedback** - Users explicitly request swipe support
2. ✅ **Stable base** - Button version works flawlessly (3+ weeks production)
3. ✅ **Dedicated time** - Have 2-3 days for testing + iteration
4. ✅ **Library choice** - Use proven solution (react-native-gesture-handler)

**Implementation Path:**
```
Week 1-2: Button only (fast + smooth) → SHIP
Week 3-4: Production feedback collection
Week 5-6: IF users want swipe → Implement with library
         ELSE → Keep button-only
```

---

### Gesture Library Comparison

#### ❌ **PanResponder (React Native built-in)**
```
Pros:
- Zero dependency
- Built-in

Cons:
- ❌ Touch event conflicts (blocks other interactions)
- ❌ Complex state management
- ❌ Production bugs (works 1st, fails 2nd+)
- ❌ "Fixing loop" risk
```

#### ✅ **react-native-gesture-handler (Recommended)**
```
Pros:
- ✅ Proven, battle-tested
- ✅ Better touch event handling
- ✅ Simpler API
- ✅ Already in project (Expo Router dependency)

Cons:
- ⚠️ Requires GestureHandlerRootView at app root
- ⚠️ Global side effect (but acceptable)

When:
- Use ONLY after stable button version ships
- Use when user feedback demands it
```

---

### Animation Easing (Working Pattern)

**Problem:** Linear animation feels robotic, "eziyetli" (sluggish)

**Solution:** Cubic easing for natural deceleration

```tsx
// ❌ Linear (robotic)
Animated.timing(slideAnim, {
  duration: 250,
  // No easing = linear
})

// ✅ Smooth (natural)
Animated.timing(slideAnim, {
  duration: 180,  // Fast
  easing: Easing.out(Easing.cubic),  // Smooth deceleration
  useNativeDriver: true
})
```

**Feel:**
- `Easing.out(Easing.cubic)` → Fast start, smooth slow-down (iOS native feel)
- `Easing.linear` → Constant speed (robotic)
- `Easing.bounce` → Cartoonish (avoid unless intentional)

**Duration:**
- 180ms → Fast, snappy (drawer, modals)
- 300ms → Standard (page transitions)
- 500ms → Slow (avoid for frequent interactions)

---

### Lesson: "Working > Complex"

**Philosophy:**
1. ✅ **Ship working feature** (button + smooth animation)
2. ✅ **Collect user feedback** (do they want swipe?)
3. ✅ **Add complexity if needed** (not premature)

**Anti-pattern:**
1. ❌ Implement complex gesture system immediately
2. ❌ App locks/freezes
3. ❌ Enter "fixing loop"
4. ❌ Production blocked

**Result This Session:**
- ❌ Gesture attempt: App lock, fixing loop
- ✅ Reverted to button: Fast (180ms) + smooth (cubic easing)
- ✅ Production-ready: Works every time, no spawn bug

---

## 11. Maintenance

**This file should be updated when:**
- New mobile-specific pattern discovered
- Bug prevented by following a pattern here
- Common mistake repeated across features

**Owned by:** Mobile development (all agents)
**Review:** After each mobile feature implementation

---

**Version History:**
- v1.0 (2025-01-20): Initial version (Drawer Menu learnings)
- v1.1 (2025-01-20): Added Section 10 (Gesture implementation strategy, animation easing patterns)
