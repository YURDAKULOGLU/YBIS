import React from 'react';
import { YStack, XStack, Text, Card, Button } from '@ybis/ui';
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
  if (isFirstSession && onboardingPrompts.length > 0) {
    const [primaryPrompt, ...secondaryPrompts] = onboardingPrompts;

    return (
      <YStack padding="$4" gap="$4">
        {primaryPrompt && (
          <Card
            padding="$5"
            backgroundColor="$blue3"
            borderWidth={1}
            borderColor="$blue6"
            borderRadius="$8"
            pressStyle={{ scale: 0.98, backgroundColor: '$blue4' }}
            animation="bouncy"
            onPress={() => handlePromptClick(primaryPrompt)}
          >
            <YStack gap="$3" alignItems="center">
              <Text fontSize="$8">{primaryPrompt.icon}</Text>
              <Text fontSize="$5" fontWeight="700" color="$blue12" textAlign="center">
                {primaryPrompt.title}
              </Text>
              <Text fontSize="$3" color="$blue11" textAlign="center">
                {primaryPrompt.description}
              </Text>
              <Button
                size="$3"
                backgroundColor="$blue10"
                color="white"
                pressStyle={{ scale: 0.96, backgroundColor: '$blue11' }}
                animation="bouncy"
                onPress={() => handlePromptClick(primaryPrompt)}
              >
                {primaryPrompt.title}
              </Button>
            </YStack>
          </Card>
        )}

        {secondaryPrompts.length > 0 && (
          <XStack flexWrap="wrap" gap="$2">
            {secondaryPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                size="$3"
                backgroundColor="$gray3"
                color="$gray12"
                borderRadius="$10"
                pressStyle={{ scale: 0.95, backgroundColor: '$gray4' }}
                animation="bouncy"
                onPress={() => handlePromptClick(prompt)}
              >
                {prompt.icon} {prompt.title}
              </Button>
            ))}
          </XStack>
        )}
      </YStack>
    );
  }

  return (
    <YStack padding="$4" gap="$3">
      {regularPrompts.map((prompt) => (
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
            <Text fontSize="$6">{prompt.icon}</Text>
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
