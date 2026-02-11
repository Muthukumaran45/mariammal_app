import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Svg, Path } from 'react-native-svg';
import { COLORS } from '../../styles/Color';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleRegister = () => {
    navigation.navigate("SignUpScreen");
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
    // Handle Google authentication
  };

  const handleAppleLogin = () => {
    console.log('Apple login pressed');
    // Handle Apple authentication
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Top Section with Wave */}
      <View style={styles.topSection}>
        <View

          style={styles.gradient}
        >
       

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../../assets/images/logo.jpg')}
              style={styles.illustration}
              resizeMode="cover"
            />
          </View>

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

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subtitleText}>Fresh groceries delivered to your doorstep</Text>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    height: hp('50%'),
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('10%'),
  },
  logoIconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  logoEmoji: {
    fontSize: wp('7%'),
  },
  logoText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: hp('10%'),
    zIndex: 1,
  },
  illustration: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: hp(2),
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: -hp('0.5%'),
    left: 0,
    right: 0,
    height: hp('15%'),
  },
  wave: {
    position: 'absolute',
    bottom: 0,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: wp('7%'),
    paddingTop: hp('2%'),
  },
  welcomeText: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: hp('1%'),
  },
  subtitleText: {
    fontSize: wp('4%'),
    color: '#757575',
    marginBottom: hp('3%'),
  },
  buttonsContainer: {
    marginBottom: hp('3%'),
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    paddingVertical: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    borderWidth: 0,
  },
  registerButtonText: {
    color: '#2E7D32',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: wp('3.5%'),
    color: '#757575',
    fontSize: wp('3.5%'),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    marginHorizontal: wp('1%'),
  },
  socialIconContainer: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIcon: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  googleIcon: {
    color: '#DB4437',
  },
  socialButtonText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#424242',
  },
  termsText: {
    fontSize: wp('3%'),
    color: '#757575',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  termsLink: {
    color: '#2E7D32',
    fontWeight: '500',
  },
});

export default RegisterScreen;