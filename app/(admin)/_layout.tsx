import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="addAdmin"
        options={{
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="userApprove"
        options={{
          headerBackVisible: false,
        }}
      />
     <Stack.Screen
        name="AddSociety"
        options={{
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="chat"
        options={{
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
