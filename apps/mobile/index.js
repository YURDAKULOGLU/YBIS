/* eslint-disable */
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Entry point for Expo Router in monorepo
// Issue #14 (Story 1.1): Explicit require.context for web bundling
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function App() {
  const ctx = require.context('./app');
  // eslint-disable-next-line react/jsx-filename-extension
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
