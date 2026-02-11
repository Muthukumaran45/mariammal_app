import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../styles/Color';
import { styles } from '../../styles/IntialScreen/login_screen_style';

// Firebase v9+ modular SDK imports
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

// Zustand store
import useUserStore from '../../stores/user_store';

import { errorAlert, successAlert } from '../../components/ToastServices';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Zustand store actions
  const { loginUser, setLoading } = useUserStore();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    // Trim whitespace and check for empty fields
    const trimmedData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
    };

    if (!trimmedData.email) {
      errorAlert({ message: "Please enter your email address" });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!trimmedData.password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    return true;
  };


  const handleLogin = async () => {
    // First validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoading(true); // Update Zustand loading state

    try {
      // Extract and trim form data
      const { email, password } = formData;
      const trimmedEmail = email.trim().toLowerCase();

      console.log('Attempting to sign in...', { email: trimmedEmail });

      // Get Firebase app instance and services
      const app = getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      console.log('User signed in successfully:', user.uid);

      // Get additional user data from Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data retrieved from Firestore:', userData);

        const userRole = userData.role || 'user';
        const userType = userData.userType || 'normal';

        // PREPARE USER DATA FOR STORAGE
        const userDataForStorage = {
          userId: user.uid,
          userName: userData.name || user.displayName || 'User',
          userEmail: userData.email || user.email,
          userPhone: userData.phoneNumber || '',
          userRole: userRole,
          userType: userType,
          loginDate: new Date().toISOString(),
        };

        // STORE USER DATA IN ZUSTAND AND MMKV
        const success = await loginUser(userDataForStorage);

        if (success) {
          successAlert({ message: "Login Successful" });
        

          // Navigate after a short delay to allow toast to show
          setTimeout(() => {
            // Check if user is admin and navigate accordingly
            if (userRole === 'admin') {
              navigation.replace('AdminScreen', userDataForStorage);
            } else {
              // Navigate to regular user interface
              navigation.replace('BottomNavigation', userDataForStorage);
            }
          }, 1000);
        } else {
          errorAlert({ message: "Failed to store user data" });

        }
      } else {
        // User document doesn't exist in Firestore, but authentication succeeded
        console.log('User document not found in Firestore');

        // PREPARE DEFAULT USER DATA
        const defaultUserData = {
          userId: user.uid,
          userName: user.displayName || 'User',
          userEmail: user.email,
          userPhone: '',
          userRole: 'user',
          userType: 'normal',
          loginDate: new Date().toISOString(),
        };

        // STORE DEFAULT USER DATA IN ZUSTAND AND MMKV
        const success = await loginUser(defaultUserData);

        if (success) {
            successAlert({ message: "Login Successful" });

          // Navigate after a short delay to allow toast to show
          setTimeout(() => {
            // Default to regular user navigation since no role is defined in Firestore
            navigation.replace('BottomNavigation', defaultUserData);
          }, 1000);
        } else {
          errorAlert({ message: "Failed to store user data" });

        }
      }

    } catch (error) {
      console.error('Login Error:', error);

      let errorMessage = 'An error occurred during login';

      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred';
      }

      errorAlert({ message: "Login Error" });

    } finally {
      setIsLoading(false);
      setLoading(false); // Update Zustand loading state
    }
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgetPasswordScreen");
  };

  const handleRegister = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View
            style={styles.headerSection}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Icon name="arrow-back" size={wp('10%')} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Logo and Welcome Content */}
            <View style={styles.headerContent}>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
              </View>

            
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Login</Text>
              <Text style={styles.formSubtitle}>Enter your credentials to access your account</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.email && styles.inputFocused
              ]}>
                <View style={styles.inputIconContainer}>
                  <Icon name="mail-outline" size={wp('5%')} color={isFocused.email ? COLORS.primary : "#B0B0B0"} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor="#B0B0B0"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.password && styles.inputFocused
              ]}>
                <View style={styles.inputIconContainer}>
                  <Icon name="lock-closed-outline" size={wp('5%')} color={isFocused.password ? COLORS.primary : "#B0B0B0"} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#B0B0B0"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-off"}
                    size={wp('5%')}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#ccc', '#999'] : [COLORS.primary, '#4CAF50']}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
                {!isLoading && (
                  <Icon name="arrow-forward" size={wp('5%')} color="#FFFFFF" style={styles.loginButtonIcon} />
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
                <Text style={[
                  styles.registerLink,
                  isLoading && { opacity: 0.5 }
                ]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;