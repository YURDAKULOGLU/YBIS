import React from 'react';
import { YStack, XStack, Text, Card } from '@ybis/ui';
import { useWindowDimensions } from 'react-native';
import type { SuggestionPrompt } from '../types';

interface SuggestionPromptsProps {
  isFirstSession: boolean;
  onboardingPrompts: SuggestionPrompt[];
  regularPrompts: SuggestionPrompt[];
  handlePromptClick: (prompt: SuggestionPrompt) => void;
}

export function SuggestionPrompts({
  isFirstSession,
  onboardingPrompts,
  regularPrompts,
  handlePromptClick,
}: SuggestionPromptsProps): React.ReactElement {
  const { height: screenHeight } = useWindowDimensions();
  const prompts = isFirstSession ? onboardingPrompts : regularPrompts;

  if (isFirstSession && prompts.length > 0) {
    const prompt = prompts[0]!;
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$4">
        <Card
          width="100%"
          maxWidth={400}
          height={screenHeight * 0.5}
          paddingHorizontal="$6"
          paddingVertical="$8"
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$10"
          pressStyle={{ scale: 0.98, backgroundColor: '$gray3' }}
          animation="bouncy"
          onPress={() => handlePromptClick(prompt)}
          justifyContent="center"
          alignItems="center"
        >
          <YStack gap="$5" alignItems="center" width="100%">
            <Text fontSize={64}>{prompt.icon}</Text>
            <YStack gap="$3" alignItems="center" width="100%">
              <Text fontSize="$7" fontWeight="700" color="$color" textAlign="center">
                {prompt.title}
              </Text>
              <Text fontSize="$4" color="$gray11" textAlign="center" lineHeight={22}>
                {prompt.description}
              </Text>
            </YStack>
          </YStack>
        </Card>
      </YStack>
    );
  }

  return (
    <YStack paddingTop="$4" paddingHorizontal="$4" gap="$3">
      {prompts.map((prompt) => (
        <Card
          key={prompt.id}
          padding="$4"
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray5"
          borderRadius="$6"
          pressStyle={{ scale: 0.96, backgroundColor: '$gray3' }}
          animation="bouncy"
          onPress={() => handlePromptClick(prompt)}
        >
          <XStack gap="$3" alignItems="center">
            <Text fontSize="$7">{prompt.icon}</Text>
            <YStack gap="$1" flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color">
                {prompt.title}
              </Text>
              <Text fontSize="$3" color="$gray11">
                {prompt.description}
              </Text>
            </YStack>
          </XStack>
        </Card>
      ))}
    </YStack>
  );
}
