import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate,
  withTiming
} from 'react-native-reanimated';
import { Camera, Users, MessageCircle, CircleUser as UserCircle } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Share Your Moments',
    description: 'Capture and share your favorite moments with friends and family.',
    icon: <Camera size={100} color="#5271FF" />,
  },
  {
    id: '2',
    title: 'Connect with Friends',
    description: 'Find and connect with friends, family, and interesting people.',
    icon: <Users size={100} color="#5271FF" />,
  },
  {
    id: '3',
    title: 'Chat Anytime',
    description: 'Stay in touch with real-time messaging and group chats.',
    icon: <MessageCircle size={100} color="#5271FF" />,
  },
  {
    id: '4',
    title: 'Customize Your Profile',
    description: 'Create a unique profile that represents who you are.',
    icon: <UserCircle size={100} color="#5271FF" />,
  },
];

// New SlideItem component
const SlideItem = ({ item, index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [100, 0, 100],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {item.icon}
      </Animated.View>
      <Animated.Text style={[styles.title, animatedStyle]}>{item.title}</Animated.Text>
      <Animated.Text style={[styles.description, animatedStyle]}>{item.description}</Animated.Text>
    </View>
  );
};

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);

  const onScroll = (event) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX.value / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const goToAuth = () => {
    router.replace('/(auth)/login');
  };

  const renderItem = ({ item, index }) => {
    return <SlideItem item={item} index={index} scrollX={scrollX} />;
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = interpolate(
              scrollX.value,
              inputRange,
              [8, 20, 8],
              Extrapolate.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            return {
              width: dotWidth,
              opacity,
            };
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[styles.dot, animatedDotStyle, { backgroundColor: '#5271FF' }]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={goToAuth}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.bottomContainer}>
        <Pagination />
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#5271FF',
    fontFamily: 'Poppins-Medium',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#5271FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});