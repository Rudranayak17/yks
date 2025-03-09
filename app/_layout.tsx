import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { usePathname } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { useGet_profileQuery } from '@/store/api/auth';
import { clearError, setProfile } from '@/store/reducer/auth';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Inner component that uses Redux hooks
function AppContent() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data, isLoading } = useGet_profileQuery({}, { pollingInterval: 5000 });

  // Log pathname changes
  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  // Handle profile data and loading state
  useEffect(() => {
    if (data) {
      dispatch(setProfile({ user: data.user }));
    } else if (!isLoading) {
      dispatch(clearError());
    }
  }, [data, isLoading, dispatch]);

  return (
    <RootSiblingParent>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(admin)" options={{ animation: 'none' }} />
        <Stack.Screen
          name="onboarding"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="(auth)" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </RootSiblingParent>
  );
}

// Root layout component
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  // Handle splash screen hiding when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    window.frameworkReady?.();
  }, [fontsLoaded]);

  // Early return if fonts aren't loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}