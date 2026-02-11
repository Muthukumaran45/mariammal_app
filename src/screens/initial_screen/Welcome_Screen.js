import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MMKVLoader } from 'react-native-mmkv-storage';
const storage = new MMKVLoader().initialize();
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { styles } from '../../styles/IntialScreen/welcom_screen_style';
import useUserStore from '../../stores/user_store'; // Import Zustand store

const { width, height } = Dimensions.get('window');

const Welcome_Screen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const brandFadeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  
  // Zustand store
  const { loadUserFromStorage } = useUserStore();

  const checkUserStatus = () => {
    try {
      // Load user data from MMKV into Zustand
      const userData = loadUserFromStorage();
      
      // Check if userData exists and is valid (user is logged in)
      if (userData && userData.userId) {
        console.log('User found in storage:', userData);
        
        // Navigate to appropriate screen based on user role after delay
        setTimeout(() => {
          if (userData.userRole === 'admin') {
            navigation.replace('AdminScreen', userData);
          } else {
            navigation.replace('BottomNavigation', userData);
          }
        }, 2000);
        return;
      }
       
      // No user data found - user needs to login/register
      console.log('No user data found in storage - navigating to login/register');
      setTimeout(() => {
        navigation.replace('RegisterScreen'); // or 'LoginScreen' if you have a separate login screen
      }, 2000);
      
    } catch (error) {
      console.log('Error checking user status:', error);
      // Default to registration/login screen if there's an error
      setTimeout(() => {
        navigation.replace('RegisterScreen');
      }, 2000);
    }
  };

  useEffect(() => {
    // Logo entrance animation
    const logoAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    // Brand name fade in
    const brandAnimation = Animated.timing(brandFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    });

    // Pulse effect
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Start animations
    logoAnimation.start(() => {
      brandAnimation.start();
      pulseAnimation.start();
    });

    // Check user login status and redirect accordingly
    checkUserStatus();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Subtle background elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />

      {/* Main content */}
      <View style={styles.contentContainer}>
        {/* Logo Animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
                { rotate: logoRotate }
              ],
            },
          ]}
        >
          <View style={styles.logoBackground}>
            <Text style={styles.logoIcon}>🛒</Text>
          </View>
        </Animated.View>

        {/* Brand Name */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandFadeAnim,
            },
          ]}
        >
          <Text style={styles.brandName}>Mariammal store</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default Welcome_Screen;