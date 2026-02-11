import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';




export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    height: hp('40%'),
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? hp('4%') : 0,
  },
  backButton: {
    position: 'absolute',
    left: wp('5%'),
    zIndex: 10,
    padding: wp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp('60%'),
    top: hp(3)
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  logoIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  logoEmoji: {
    fontSize: wp('6%'),
  },
  logoText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: hp('8%'),
  },
  subtitleText: {
    fontSize: wp('4%'),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: hp('1%'),
    zIndex: 1,
  },
  illustration: {
    width: wp('25%'),
    height: hp('12%'),
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
  formSection: {
    flex: 1,
    paddingHorizontal: wp('7%'),
    paddingTop: hp('2%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  inputLabel: {
    fontSize: wp('4%'),
    color: '#2C3E50',
    marginBottom: hp('1%'),
    fontWeight: '600',
    paddingLeft: wp('1%'),
  },
  textInputContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#2E7D32',
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },
  textInput: {
    flex: 1,
    paddingVertical: hp('1.8%'),
    fontSize: wp('4%'),
    color: '#2C3E50',
    marginLeft: wp('2%'),
  },
  eyeIcon: {
    padding: wp('2%'),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('1%'),
  },
  checkbox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: wp('1%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2E7D32',
  },
  termsText: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: '#757575',
  },
  termsLink: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#2E7D32',
    borderRadius: wp('3%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2.5%'),
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
    marginBottom: hp('2.5%'),
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  loginText: {
    color: '#757575',
    fontSize: wp('4%'),
  },
  loginLink: {
    color: '#2E7D32',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});