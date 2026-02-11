import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: hp('10%'),
    right: wp('-10%'),
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: hp('15%'),
    left: wp('-8%'),
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    backgroundColor: '#F1F5F9',
    opacity: 0.4,
  },
  backgroundCircle3: {
    position: 'absolute',
    top: hp('30%'),
    left: wp('70%'),
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#E2E8F0',
    opacity: 0.3,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: hp('4%'),
  },
  logoBackground: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E293B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  logoIcon: {
    fontSize: wp('12%'),
    color: '#FFFFFF',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: wp('8%'),
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
    marginBottom: hp('2%'),
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#64748B',
    marginHorizontal: wp('1%'),
  },
});