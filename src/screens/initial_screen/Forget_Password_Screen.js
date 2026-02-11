import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { COLORS } from '../../styles/Color';
import { styles } from '../../styles/IntialScreen/password_reset_style';

// Firebase v9+ modular SDK imports
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

const ForgotPasswordScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: New Password
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isFocused, setIsFocused] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
  });

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const validateEmail = () => {
    const trimmedEmail = formData.email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const validatePasswordForm = () => {
    if (!formData.newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    return true;
  };

  const checkEmailInFirebase = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    
    try {
      const trimmedEmail = formData.email.trim().toLowerCase();
      
      // Get Firebase app instance and services
      const app = getApp();
      const firestore = getFirestore(app);

      console.log('Checking email in Firebase:', trimmedEmail);

      // Query Firestore to check if email exists
      // Note: This approach searches through all users. For better performance in production,
      // consider using Firebase Auth's fetchSignInMethodsForEmail (if available in your version)
      // or maintain an email index collection
      
      // For now, we'll use a more direct approach with Firebase Auth
      const auth = getAuth(app);
      
      try {
        // Try to send password reset email - this will fail if email doesn't exist
        await sendPasswordResetEmail(auth, trimmedEmail);
        
        // Email exists, directly proceed to password reset step
        setVerifiedEmail(trimmedEmail);
        setResetStep(2);
        
      } catch (authError) {
        console.error('Auth error:', authError);
        
        if (authError.code === 'auth/user-not-found') {
          Alert.alert(
            'Email Not Found',
            'This email address is not registered with us. Please check your email or create a new account.',
            [
              {
                text: 'Try Again',
                style: 'default'
              },
              {
                text: 'Sign Up',
                onPress: () => navigation.navigate('SignUpScreen')
              }
            ]
          );
        } else if (authError.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Please enter a valid email address');
        } else {
          Alert.alert('Error', 'Failed to send reset email. Please try again.');
        }
      }

    } catch (error) {
      console.error('Error checking email:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPasswordReset = async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    
    try {
      const app = getApp();
      const auth = getAuth(app);
      const firestore = getFirestore(app);

      console.log('Performing manual password reset for:', verifiedEmail);

      // Note: Direct password update requires the user to be authenticated
      // In a real app, you might want to implement this differently
      // This is a simplified approach for demonstration

      // For manual reset, we'll update the user document with a timestamp
      // and show success (actual password change would require re-authentication)
      
      // Find user document by email
      // This is a simplified approach - you might want to maintain an email->uid mapping
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', verifiedEmail));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(firestore, 'users', userDoc.id), {
          passwordResetAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        Alert.alert(
          'Password Reset Requested',
          'Your password reset request has been recorded. For security reasons, please use the email reset link or contact support.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LoginScreen')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'User not found in database');
      }

    } catch (error) {
      console.error('Manual reset error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again or use the email reset option.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[
          styles.textInputContainer,
          isFocused.email && styles.inputFocused
        ]}>
          <View style={styles.inputIconContainer}>
            <Icon name="mail-outline" size={wp('5%')} color={isFocused.email ? "#2E7D32" : "#B0B0B0"} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your registered email"
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

      <TouchableOpacity 
        style={[styles.resetButton, isLoading && styles.buttonDisabled]}
        onPress={checkEmailInFirebase}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.resetButtonText}>
          {isLoading ? 'Checking Email...' : 'Reset'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.textInputContainer}>
          <View style={styles.inputIconContainer}>
            <Icon name="mail-outline" size={wp('5%')} color="#2E7D32" />
          </View>
          <Text style={[styles.textInput, { color: '#2E7D32', fontWeight: '500' }]}>
            {verifiedEmail}
          </Text>
          <Icon name="checkmark-circle" size={wp('5%')} color="#2E7D32" />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <View style={[
          styles.textInputContainer,
          isFocused.newPassword && styles.inputFocused
        ]}>
          <View style={styles.inputIconContainer}>
            <Icon name="lock-closed-outline" size={wp('5%')} color={isFocused.newPassword ? "#2E7D32" : "#B0B0B0"} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Enter new password"
            placeholderTextColor="#B0B0B0"
            value={formData.newPassword}
            onChangeText={(value) => handleInputChange('newPassword', value)}
            secureTextEntry={!showPassword}
            onFocus={() => handleFocus('newPassword')}
            onBlur={() => handleBlur('newPassword')}
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

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirm New Password</Text>
        <View style={[
          styles.textInputContainer,
          isFocused.confirmPassword && styles.inputFocused
        ]}>
          <View style={styles.inputIconContainer}>
            <Icon name="lock-closed-outline" size={wp('5%')} color={isFocused.confirmPassword ? "#2E7D32" : "#B0B0B0"} />
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm new password"
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

      <TouchableOpacity 
        style={[styles.resetButton, isLoading && styles.buttonDisabled]}
        onPress={handleManualPasswordReset}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.resetButtonText}>
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>

 
    </>
  );

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
          {/* Top Section */}
          <View style={styles.topSection}>
            <View style={styles.gradient}>
              {/* Back Button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={wp('8%')} color="#FFFFFF" />
              </TouchableOpacity>
              
              {/* Content Container */}
              <View style={styles.contentContainer}>
                {/* Title Section */}
                <View style={styles.titleContainer}>
                  <Text style={styles.welcomeText}>
                    {resetStep === 1 ? 'Reset Password' : 'Set New Password'}
                  </Text>
                  <Text style={styles.subtitleText}>
                    {resetStep === 1 
                      ? 'Enter your email to receive reset instructions' 
                      : 'Create a secure new password'
                    }
                  </Text>
                </View>
                
              
              </View>
            </View>
            
            {/* Bottom Curved Section */}
            <View style={styles.bottomCurve} />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {resetStep === 1 ? renderEmailStep() : renderPasswordStep()}
            
            {/* Back to Login Link */}
            <View style={styles.backToLoginContainer}>
              <Text style={styles.backToLoginText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.backToLoginLink}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;