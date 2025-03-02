import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, CircleUser as UserCircle, SquarePlus as PlusSquare, MessageCircle } from 'lucide-react-native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5271FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
        },
        headerShown: true,
        headerStyle: {
          height: 100,
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'YKS',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MessageCircle size={24} color="#5271FF" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create Post',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color, size }) => (
            <PlusSquare size={size} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <UserCircle size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <MessageCircle size={24} color="#5271FF" />
            </TouchableOpacity>
          ),
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
  },
});