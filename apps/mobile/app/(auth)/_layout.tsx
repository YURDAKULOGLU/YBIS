import { Stack } from 'expo-router';

/**
 * Authentication Layout
 * 
 * Stack navigator for authentication screens (login, register, etc.)
 * No header for cleaner auth UI
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}


