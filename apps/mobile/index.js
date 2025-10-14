import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Entry point for Expo Router in monorepo
// Issue #14 (Story 1.1): Explicit require.context for web bundling
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
