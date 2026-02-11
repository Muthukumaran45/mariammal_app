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
  ActivityIndicator
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/Color';
import { styles } from '../../styles/IntialScreen/signup_screen_style';

// Firebase v9+ modular SDK imports
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

// MMKV Storage
import { MMKVLoader } from 'react-native-mmkv-storage';
const storage = new MMKVLoader().initialize();

// Import FCM Store
import useFcmStore from '../../stores/useFcmStore';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // Get FCM token from Zustand store
  const { fcmToken } = useFcmStore();

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
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };

    if (!trimmedData.fullName) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!trimmedData.phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(trimmedData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }

    if (!trimmedData.email) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!trimmedData.password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    // Password strength validation
    if (trimmedData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  // Function to store user data in MMKV
  const storeUserDataLocally = async (userData) => {
    try {
      // Store individual user data
      storage.setString('userId', userData.userId);
      storage.setString('userName', userData.userName);
      storage.setString('userEmail', userData.userEmail);
      storage.setString('userPhone', userData.userPhone);
      storage.setString('userRole', userData.userRole);
      storage.setBool('isLoggedIn', true);

      // Store FCM token locally as well
      if (userData.fcmToken) {
        storage.setString('fcmToken', userData.fcmToken);
      }

      // Store complete user object as JSON string for easy retrieval
      storage.setString('userData', JSON.stringify(userData));

      console.log('User data stored locally in MMKV');
    } catch (error) {
      console.error('Error storing user data locally:', error);
    }
  };

  const handleSignUp = async () => {
    // First validate the form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Extract and trim form data
      const { fullName, phoneNumber, email, password } = formData;
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = fullName.trim();
      const trimmedPhone = phoneNumber.trim();

      console.log('Creating user account...', { email: trimmedEmail, name: trimmedName });
      console.log('FCM Token available:', fcmToken ? 'Yes' : 'No');

      // Get Firebase app instance and services
      const app = getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      // Create user with email and password using v9+ modular SDK
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      console.log('User created successfully:', user.uid);

      // Update user profile with display name
      await updateProfile(user, {
        displayName: trimmedName,
      });

      // Prepare user data for Firestore (including FCM token)
      const firestoreUserData = {
        name: trimmedName,
        phoneNumber: trimmedPhone,
        email: trimmedEmail,
        role: 'user',
        userType: 'normal',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Store FCM token for push notifications
        fcmToken: fcmToken || null,
        // Track when FCM token was last updated
        fcmTokenUpdatedAt: fcmToken ? serverTimestamp() : null,
        // Don't store password in Firestore - Firebase Auth handles this
      };

      // Save additional user data to Firestore using v9+ modular SDK
      await setDoc(doc(firestore, 'users', user.uid), firestoreUserData);

      console.log('User data saved to Firestore with FCM token');

      // Prepare user data for local storage
      const userData = {
        userId: user.uid,
        userName: trimmedName,
        userEmail: trimmedEmail,
        userPhone: trimmedPhone,
        userRole: 'user',
        userType: 'normal',
        fcmToken: fcmToken || null,
        registrationDate: new Date().toISOString(),
      };

      // Store user data locally in MMKV
      await storeUserDataLocally(userData);

      navigation.replace('BottomNavigation', userData);

    } catch (error) {
      console.error('Signup Error:', error);

      let errorMessage = 'An error occurred during signup';

      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred';
      }

      Alert.alert('Signup Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("LoginScreen");
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
          {/* Top Section with Wave */}
          <View style={styles.topSection}>
            <View
              style={{ backgroundColor: COLORS.primary, flex: 1 }}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={wp('8%')} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Sign Up Title */}
              <Text style={styles.welcomeText}>Create Account</Text>


              {/* Wave SVG */}
              <View style={styles.waveContainer}>
                <Svg
                  height="100%"
                  width="100%"
                  viewBox="50 0 1040 320"
                  style={styles.wave}
                >
                  <Path
                    fill="#FFFFFF"
                    d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  />
                </Svg>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.fullName && styles.inputFocused
              ]}>
                <Icon name="person-outline" size={wp('5%')} color={isFocused.fullName ? "#2E7D32" : "#B0B0B0"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#B0B0B0"
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  onFocus={() => handleFocus('fullName')}
                  onBlur={() => handleBlur('fullName')}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.phoneNumber && styles.inputFocused
              ]}>
                <Icon name="call-outline" size={wp('5%')} color={isFocused.phoneNumber ? "#2E7D32" : "#B0B0B0"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#B0B0B0"
                  value={formData.phoneNumber}
                  maxLength={10}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                  onFocus={() => handleFocus('phoneNumber')}
                  onBlur={() => handleBlur('phoneNumber')}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.email && styles.inputFocused
              ]}>
                <Icon name="mail-outline" size={wp('5%')} color={isFocused.email ? "#2E7D32" : "#B0B0B0"} />
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
                <Icon name="lock-closed-outline" size={wp('5%')} color={isFocused.password ? "#2E7D32" : "#B0B0B0"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create password"
                  placeholderTextColor="#B0B0B0"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye" : "eye-off"}
                    size={wp('5%')}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[
                styles.textInputContainer,
                isFocused.confirmPassword && styles.inputFocused
              ]}>
                <Icon name="lock-closed-outline" size={wp('5%')} color={isFocused.confirmPassword ? "#2E7D32" : "#B0B0B0"} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm password"
                  placeholderTextColor="#B0B0B0"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={wp('5%')}
                    color="#B0B0B0"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Icon name="checkmark" size={wp('4%')} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                (!acceptTerms) && styles.buttonDisabled
              ]}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={!acceptTerms || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>


            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;