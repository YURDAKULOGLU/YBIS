// @ybis/ui - Tamagui UI Components
// Re-export Tamagui components for use in apps, following the Curated UI Export Principle.

export {
  // Hooks
  useTheme,

  // Components
  Avatar,
  Button,
  Card,
  H1,
  H2,
  H3,
  Input,
  ScrollView,
  Separator,
  Spinner,
  Switch,
  Text,
  XStack,
  YStack,
} from 'tamagui';

// Re-export all icons from lucide-icons for convenience.
// This still centralizes the dependency through @ybis/ui.
export * from '@tamagui/lucide-icons';



