# Mobile App State Review — 27 Oct 2025 (Codex)

## 1. Snapshot
- Target: `apps/mobile` Expo SDK 54 app currently in progress for Story 1.1.
- Baseline verified with `pnpm --filter @ybis/mobile type-check` (passes).
- Testing performed via static analysis; runtime behaviour inferred from current implementation.

## 2. Key Findings

### 2.1 Navigation & Layout
- `app/_layout.tsx` wires Tamagui, theme store, and mock auth correctly, yet it always redirects unauthenticated users to `(auth)/login` even while `checkAuth` is still running (no loading guard). This can flash login before the state settles (`app/_layout.tsx:57-83`).
- Tab layout keeps a sibling `DrawerMenu` outside the router hierarchy (`app/(tabs)/_layout.tsx:42-105`). Drawer animation still renders on top of tab content and can steal gestures. Consider migrating to Expo Router’s built-in drawer wrapper or at least portal the drawer away from the tab stack.
- Safe-area handling is inconsistent: `SafeAreaView` defaults to protecting both top and bottom (`src/components/layout/SafeAreaView.tsx:56-73`), but screens override edges manually. Some screens (tasks, chat) still apply bespoke padding, leading to duplicated spacing.

### 2.2 Chat Experience
- Composer now supports multiline growth and an integrated `+` button, which improves usability (`ChatInput.tsx:41-111`). However:
  - Input height is limited to 140 px with no scroll inside the text area, so very long drafts push the send button off-screen.
  - There is no “send on Enter” behaviour or keyboard dismissal on send; we rely on default RN behaviour.
  - The microphone button does nothing beyond logging.
- Message list padding equals `chatInputHeight + bottomPadding` regardless of keyboard state (`app/(tabs)/index.tsx:35-52`). When the keyboard opens, we only add composer height, so the last message can still be covered if the keyboard height is smaller than the composer height. Consider using `keyboard.keyboardHeight` when shown.
- `useChat` still mocks responses via `setTimeout` (`useChat.ts:55-98`) and doesn’t persist conversation state; messages reset when navigating away.

### 2.3 Keyboard & FAB Behaviour
- Keyboard avoidance now offsets by `insets.top`, not tab bar height, which reduces bounce (`app/(tabs)/index.tsx:34-43`). The message list still lacks inertia smoothing; repeated toggling causes minor flicker because we recalculate padding on every content-size change.
- The floating action button uses a constant `TAB_BAR_HEIGHT = 60` to compute base offset (`ActionButton.tsx:13-44`). On devices where the tab bar is taller (large fonts, tablets) the FAB will overlap. Prefer reading the actual height (e.g., via context or props).
- `ActionButton` animates with `Animated.add(baseBottom, keyboardBottom)`, but the keyboard delta only subtracts `TAB_BAR_HEIGHT`. If the keyboard is smaller than the tab bar, the icon still sits high above the nav bar.

### 2.4 Drawer Menu
- Custom drawer (`DrawerMenu.tsx`) still manages its own `Modal` + animated values. It doesn’t lock body scroll or gestures under the drawer, and long lists inside the drawer aren’t scrollable because the modal intercepts the touch. This is the historical “jump” the user reported.

### 2.5 Other Screens
- Tasks screen ships with a temporary debug `TextInput` to test keyboard padding (`app/(tabs)/tasks.tsx:37-66`). It uses manual padding and border styling that diverge from the shared composer design.
- Notes/Plan/Settings screens inherit similar SafeArea logic but don’t integrate the new composer; verify they still meet design requirements.
- `useKeyboardAnimations.ts` was removed (`git shows deletion`) yet references to its behaviour remain commented in some components (e.g., old chat scrolling comments). Clean-up todo.

## 3. Suggested Actions
1. **Navigation**
   - Replace sibling `DrawerMenu` with Expo Router drawer nesting or portal it; ensures consistent gesture handling.
   - Add loading guard in `app/_layout.tsx` to avoid double redirects during `checkAuth`.
2. **Composer & Message List**
   - Clamp scroll padding using `keyboard.keyboardHeight` when the keyboard is visible, so the last message is never hidden.
   - Allow the text input to overflow/scroll internally after a threshold (set `maxHeight` + `scrollEnabled`).
   - Wire up send-on-submit and optional emoji/attachment workflows per design.
3. **Floating Action Button**
   - Accept a prop/context for actual tab bar height instead of the magic `60`. When the keyboard shows, offset by `max(0, keyboardHeight - insets.bottom)` only.
4. **Drawer**
   - Either adopt Expo Router’s drawer wrapper (`app/(drawer)/_layout.tsx`) or refactor `DrawerMenu` to anchor within a portal at root level to avoid affecting layout metrics.
5. **Safe Area Standardisation**
   - Decide on a single strategy: either keep `SafeAreaView` default edges and drop manual padding, or rely on Expo’s `useSafeAreaInsets` within each screen. Document in `DEVELOPMENT_GUIDELINES`.
6. **Cleaning & Testing**
   - Remove leftover debug input on Tasks screen before release.
   - Re-add automated keyboard tests (E2E) since prior `useKeyboardAnimations` helper is gone.
   - Verify on-device (iPhone with gesture nav + Android 14) to confirm nav height and composer spacing.

## 4. File Reference Summary
- `apps/mobile/app/_layout.tsx:57-88`
- `apps/mobile/app/(tabs)/_layout.tsx:42-105`
- `apps/mobile/app/(tabs)/index.tsx:35-126`
- `apps/mobile/src/features/chat/components/ChatInput.tsx:41-111`
- `apps/mobile/src/features/chat/hooks/useChat.ts:36-98`
- `apps/mobile/src/components/layout/ActionButton.tsx:11-54`
- `apps/mobile/src/components/layout/SafeAreaView.tsx:56-73`
- `apps/mobile/app/(tabs)/tasks.tsx:37-66`
- `apps/mobile/src/components/drawer/DrawerMenu.tsx:1-170`

---
Prepared by Codex CLI agent — 27 Oct 2025.  
Validation: `pnpm --filter @ybis/mobile type-check`
