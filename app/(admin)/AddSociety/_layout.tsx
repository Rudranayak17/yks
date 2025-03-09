import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerBackVisible: false // Hides the back button on index screen
        }}
      />

    </Stack>
  );
}