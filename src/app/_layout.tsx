import '@/global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/AnimatedIcon';
import { Brand, Colors } from '@/constants/theme';
import '@/i18n'; // Initialize i18next
import { DayPlanProvider } from '@/storage/DayPlanContext';

type TabIconProps = { color: string; size: number };

function HomeIcon({ color, size }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: 'house.fill', android: 'home', web: 'home' }}
      tintColor={color}
      size={size}
    />
  );
}

function ReflectIcon({ color, size }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' }}
      tintColor={color}
      size={size}
    />
  );
}

function OverviewIcon({ color, size }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
      tintColor={color}
      size={size}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  const { t } = useTranslation();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DayPlanProvider>
        <AnimatedSplashOverlay />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Brand.orange,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: colors.backgroundElement,
              borderTopWidth: 1,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: t('tabs.home'),
              tabBarIcon: (props) => <HomeIcon {...props} />,
            }}
          />
          <Tabs.Screen
            name="reflect"
            options={{
              title: t('tabs.reflect'),
              tabBarIcon: (props) => <ReflectIcon {...props} />,
            }}
          />
          <Tabs.Screen
            name="overview"
            options={{
              title: t('tabs.overview'),
              tabBarIcon: (props) => <OverviewIcon {...props} />,
            }}
          />
          {/* Legacy starter screen — hidden from tab bar */}
          <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
      </DayPlanProvider>
    </ThemeProvider>
  );
}
