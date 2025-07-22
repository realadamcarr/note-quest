import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

// Icon components moved outside for better performance
const NotesIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol 
    size={focused ? 32 : 28} 
    name="doc.text" 
    color={focused ? '#007AFF' : color}
    style={{
      transform: [{ scale: focused ? 1.1 : 1 }],
    }}
  />
);

const CharacterIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <IconSymbol 
    size={focused ? 32 : 28} 
    name="person.circle" 
    color={focused ? '#007AFF' : color}
    style={{
      transform: [{ scale: focused ? 1.1 : 1 }],
    }}
  />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0, 122, 255, 0.2)',
            paddingTop: 8,
            paddingBottom: 20,
            height: 90,
          },
          default: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 2,
            borderTopColor: 'rgba(0, 122, 255, 0.3)',
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
            elevation: 8,
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: NotesIcon,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Character',
          tabBarIcon: CharacterIcon,
        }}
      />
    </Tabs>
  );
}
