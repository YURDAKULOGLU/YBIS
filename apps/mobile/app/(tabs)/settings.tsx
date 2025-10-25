import React from 'react';
import {
  H3,
  YStack,
  ScrollView,
  Sheet,
  Button,
  Check,
  Bell,
  Globe,
  LogOut,
  Moon,
  Palette,
  BrainCircuit,
  DatabaseBackup,
  Trash2,
  SettingsGroup,
  SettingsItem,
  UserInfoCard,
  AppInfoCard,
} from '@ybis/ui';
import { useMockAuth } from '../../src/stores/useMockAuth';
import { useThemeStore } from '@ybis/theme';
import { useTranslation } from 'react-i18next';
import { UniversalLayout } from '../../src/layouts/UniversalLayout';
import { Navbar } from '../../src/components/layout/Navbar';
import { SafeAreaView } from '../../src/components/layout/SafeAreaView';

/**
 * Settings Screen - Refined & Functional
 */
export default function SettingsScreen(): React.ReactElement {
  const { user, logout } = useMockAuth();
  const { currentTheme, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation(['common', 'settings']);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const changeLanguage = (lng: 'tr' | 'en'): void => {
    void i18n.changeLanguage(lng);
    setSheetOpen(false);
  };

  return (
    <UniversalLayout>
      <>
        {/* SafeAreaView: flex: 1, handles top safe area only (tab bar manages bottom) */}
        <SafeAreaView edges={['top']} flex={1}>
          <Navbar title={t('settings:title')} />

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <YStack padding="$4" gap="$4">
              <UserInfoCard user={user} />

            <SettingsGroup icon={Palette} title={t('settings:appearance.title')}>
              <SettingsItem
                label={t('settings:appearance.darkMode')}
                type="switch"
                icon={Moon}
                switchProps={{
                  checked: currentTheme === 'dark',
                  onCheckedChange: (isChecked: boolean) => setTheme(isChecked ? 'dark' : 'light'),
                }}
              />
            </SettingsGroup>

            <SettingsGroup icon={Globe} title={t('settings:language.title')}>
              <SettingsItem
                label={t('settings:language.appLanguage')}
                value={i18n.language === 'tr' ? 'Türkçe' : 'English'}
                onPress={() => setSheetOpen(true)}
              />
            </SettingsGroup>

            <SettingsGroup icon={Bell} title={t('settings:notifications.title')}>
              <SettingsItem label={t('settings:notifications.push')} type="switch" switchProps={{ checked: true, disabled: true }} />
              <SettingsItem label={t('settings:notifications.emailSummaries')} value={t('settings:comingSoon')} disabled />
            </SettingsGroup>

            <SettingsGroup icon={BrainCircuit} title={t('settings:ai.title')}>
              <SettingsItem label={t('settings:ai.modelSelection')} value={t('settings:comingSoon')} disabled />
            </SettingsGroup>

            <SettingsGroup icon={DatabaseBackup} title={t('settings:data.title')}>
              <SettingsItem label={t('settings:data.export')} value={t('settings:comingSoon')} disabled />
            </SettingsGroup>

            <SettingsGroup icon={Trash2} title={t('settings:account.title')}>
              <SettingsItem label={t('settings:account.logout')} icon={LogOut} color="$red10" onPress={() => { void handleLogout(); }} />
            </SettingsGroup>

            <AppInfoCard />
            </YStack>
          </ScrollView>
        </SafeAreaView>

        <Sheet
          modal
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          snapPoints={[25]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Frame padding="$4" gap="$3">
            <H3>{t('settings:language.selectLanguage')}</H3>
            <Button
              icon={i18n.language === 'tr' ? Check : null}
              onPress={() => changeLanguage('tr')}
              theme={i18n.language === 'tr' ? 'blue' : undefined}
            >
              Türkçe
            </Button>
            <Button
              icon={i18n.language === 'en' ? Check : null}
              onPress={() => changeLanguage('en')}
              theme={i18n.language === 'en' ? 'blue' : undefined}
            >
              English
            </Button>
          </Sheet.Frame>
        </Sheet>
      </>
    </UniversalLayout>
  );
}
