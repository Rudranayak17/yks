import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const { isAuthenticated } = useAuth();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(navigateNext)();
        }
      })
    );

    scale.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(1.1, { duration: 1500 }),
      withTiming(1.2, { duration: 500 })
    );
  }, []);

  const navigateNext = () => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logoText}>YKS</Text>
        <Text style={styles.tagline}>Connect. Share. Thrive.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 72,
    fontFamily: 'Poppins-Bold',
    color: '#5271FF',
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
});