import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { usePathname } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const pathname = usePathname();

  // Handle splash screen hiding when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    window.frameworkReady?.();
  }, [fontsLoaded]);

  // Log pathname changes
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  // Early return if fonts aren't loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Provider store={store}>
        <RootSiblingParent>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="(admin)" options={{ animation: 'none' }} />
            <Stack.Screen
              name="onboarding"
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen
              name="+not-found"
              options={{ presentation: 'modal' }}
            />
          </Stack>
          <StatusBar style="auto" />
        </RootSiblingParent>
      </Provider>
    </GestureHandlerRootView>
  );
}
