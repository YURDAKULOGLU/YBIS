import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Bell, User } from '@tamagui/lucide-icons';

/**
 * Main Navigation Layout
 *
 * Custom header with:
 * - Left: "Home" title (centered)
 * - Right: Navigation buttons (Menu, Notifications, Profile)
 * - No bottom tab bar
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          display: 'none',
          height: 0,
          position: 'absolute',
        }, // Completely hide bottom tab bar
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e5e5',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => console.log('Menu pressed')}
            >
              <Menu size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log('Notifications pressed')}
              >
                <Bell size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log('Profile pressed')}
              >
                <User size={22} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {/* Other screens hidden but accessible via navigation */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // Hide from navigation
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
});


