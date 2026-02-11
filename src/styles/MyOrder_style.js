import { StyleSheet, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const PRIMARY_COLOR = '#4CAD73';
const TEXT_COLOR = '#333';
const LIGHT_TEXT_COLOR = '#666';
const BORDER_COLOR = '#E0E0E0';
const BACKGROUND_COLOR = '#F8F8F8';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || hp('2%'),
  },
  headerTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('1%'),
    fontSize: wp('4%'),
    color: LIGHT_TEXT_COLOR,
  },
  loadingSubText: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 10,
    marginTop: hp('2%'),
  },
  loginButtonText: {
    color: 'white',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: PRIMARY_COLOR,
  },
  tabButtonText: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: LIGHT_TEXT_COLOR,
  },
  activeTabButtonText: {
    color: PRIMARY_COLOR,
  },
  orderListContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  orderId: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    color: LIGHT_TEXT_COLOR,
  },
  orderStatus: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 5,
  },
  statusPending: {
    backgroundColor: '#FFD70030', // Light yellow
    color: '#FFD700',
  },
  statusCompleted: {
    backgroundColor: PRIMARY_COLOR + '30', // Light green
    color: PRIMARY_COLOR,
  },
  orderDetails: {
    marginBottom: hp('1.5%'),
  },
  orderInfo: {
    fontSize: wp('3.8%'),
    color: TEXT_COLOR,
    marginBottom: hp('0.5%'),
  },
  orderDate: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
    marginTop: hp('0.5%'),
  },
  orderItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: hp('1.5%'),
    marginBottom: hp('1%'),
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  orderItemImage: {
    width: wp('8%'),
    height: wp('8%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
  },
  orderItemText: {
    fontSize: wp('3.8%'),
    color: TEXT_COLOR,
  },
  moreItemsText: {
    fontSize: wp('3.5%'),
    color: PRIMARY_COLOR,
    textAlign: 'right',
    marginTop: hp('0.5%'),
  },
  viewDetailsButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('1.2%'),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('5%'),
    paddingHorizontal: wp('5%'),
  },
  emptyStateText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: TEXT_COLOR,
    marginTop: hp('2%'),
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
    textAlign: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  browseButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 10,
  },
  browseButtonText: {
    color: 'white',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});