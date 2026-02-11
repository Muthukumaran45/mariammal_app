import { StyleSheet, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PRIMARY_COLOR = '#4CAD73';
const TEXT_COLOR = '#333';
const LIGHT_TEXT_COLOR = '#666';
const BORDER_COLOR = '#E0E0E0';
const BACKGROUND_COLOR = '#F8F8F8';
const ACCENT_COLOR = '#3498DB'; // For links/buttons

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp('4%'),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: 'white',
    paddingRight: hp(18)
  },
  scrollViewContent: {
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: TEXT_COLOR,
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  contactItemLast: {
    borderBottomWidth: 0, // No border for the last item
  },
  contactIcon: {
    marginRight: wp('3%'),
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: wp('3.8%'),
    color: LIGHT_TEXT_COLOR,
  },
  contactValue: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: TEXT_COLOR,
  },
  contactLink: {
    color: ACCENT_COLOR,
    textDecorationLine: 'underline',
  },
  faqItem: {
    marginBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: hp('1.5%'),
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  faqQuestion: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: TEXT_COLOR,
    flex: 1,
    marginRight: wp('2%'),
  },
  faqAnswer: {
    fontSize: wp('3.8%'),
    color: LIGHT_TEXT_COLOR,
    marginTop: hp('1%'),
    lineHeight: hp('2.5%'),
  },
  hoursText: {
    fontSize: wp('4%'),
    color: TEXT_COLOR,
    marginBottom: hp('0.8%'),
  },
  hoursNote: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
    fontStyle: 'italic',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  socialIconWrapper: {
    padding: wp('3%'),
    borderRadius: 10,
    backgroundColor: `${ACCENT_COLOR}15`, // Light tint of accent color
  },
});