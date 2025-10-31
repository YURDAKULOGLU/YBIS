import React from 'react';
import { YStack, XStack, Text, Card } from '@ybis/ui';
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
  const prompts = isFirstSession ? onboardingPrompts : regularPrompts;

  if (isFirstSession && prompts.length > 0) {
    const prompt = prompts[0]!;
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$5" gap="$6">
        {/* Welcome Header */}
        <YStack gap="$3" alignItems="center">
          <Text fontSize="$9" fontWeight="800" color="$color" textAlign="center">
            YBIS
          </Text>
          <Text fontSize="$5" color="$gray11" textAlign="center" fontWeight="500">
            AI destekli iş asistanınız
          </Text>
        </YStack>

        {/* Feature Cards */}
        <YStack gap="$3" width="100%" maxWidth={360}>
          {[
            { icon: '📝', title: 'Notlar', desc: 'Fikirlerinizi hızlıca kaydedin' },
            { icon: '✅', title: 'Görevler', desc: 'İşlerinizi takip edin' },
            { icon: '📅', title: 'Planlama', desc: 'Zamanınızı yönetin' },
            { icon: '🤖', title: 'AI Asistan', desc: 'Yapay zeka ile çalışın' },
          ].map((feature, index) => (
            <Card
              key={index}
              padding="$3"
              backgroundColor="$gray2"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$4"
            >
              <XStack gap="$3" alignItems="center">
                <Text fontSize={28}>{feature.icon}</Text>
                <YStack gap="$1" flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="$color">
                    {feature.title}
                  </Text>
                  <Text fontSize="$2" color="$gray11">
                    {feature.desc}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ))}
        </YStack>

        {/* Start Button */}
        <Card
          width="100%"
          maxWidth={360}
          padding="$4"
          backgroundColor="$blue9"
          borderWidth={0}
          borderRadius="$4"
          pressStyle={{ scale: 0.96, backgroundColor: '$blue10' }}
          animation="bouncy"
          onPress={() => handlePromptClick(prompt)}
        >
          <Text fontSize="$5" fontWeight="700" color="white" textAlign="center">
            Başlayın
          </Text>
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
