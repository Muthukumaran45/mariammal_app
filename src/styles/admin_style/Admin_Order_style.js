import { StyleSheet, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PRIMARY_COLOR = '#4CAD73';
const TEXT_COLOR = '#333';
const LIGHT_TEXT_COLOR = '#666';
const BORDER_COLOR = '#E0E0E0';
const BACKGROUND_COLOR = '#F8F8F8';
const ACCENT_COLOR = '#3498DB';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
    paddingTop: hp('2%'),
  },
  contentContainer: {
    marginBottom: hp('2%'),
    marginLeft: hp(2)
  },
  contentTitle: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  contentSubtitle: {
    fontSize: wp('4%'),
    color: LIGHT_TEXT_COLOR,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: hp('5%'),
    marginLeft: hp(2),

  },
  statCard: {
    width: wp('40%'), // Adjust width for horizontal scroll
    height: hp('10%'),
    borderRadius: 10,
    padding: wp('4%'),
    marginRight: wp('4%'),
    justifyContent: 'space-between',

    elevation: 3,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardTitle: {
    fontSize: wp('4%'),
    color: 'white',
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: 'white',
  },
  statCardChange: {
    fontSize: wp('3.5%'),
    color: 'rgba(255,255,255,0.8)',
  },
  orderList: {
    paddingBottom: hp('10%'), 
     marginHorizontal: hp(2)
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
  orderNumber: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  statusBadge: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 5,
  },
  statusText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  // Status specific colors
  statusPending: { backgroundColor: '#FFD70030', color: '#92400E' }, // Yellowish for pending/processing
  statusCompleted: { backgroundColor: PRIMARY_COLOR + '30', color: PRIMARY_COLOR }, // Greenish for completed
  statusCancelled: { backgroundColor: '#FEE2E2', color: '#991B1B' }, // Reddish for cancelled

  orderCustomer: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: hp('0.5%'),
  },
  orderEmail: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
    marginBottom: hp('1%'),
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: hp('1%'),
    marginTop: hp('1%'),
  },
  orderItems: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
  },
  orderAmount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  orderDate: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 15,
    width: wp('90%'),
    maxHeight: hp('80%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: hp('1.5%'),
  },
  modalTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },
  closeButton: {
    padding: wp('1%'),
  },
  modalSectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: hp('1.5%'),
    marginTop: hp('1%'),
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.8%'),
  },
  modalDetailLabel: {
    fontSize: wp('3.8%'),
    color: LIGHT_TEXT_COLOR,
  },
  modalDetailValue: {
    fontSize: wp('3.8%'),
    fontWeight: '500',
    color: TEXT_COLOR,
    flexShrink: 1, // Allow text to wrap
    textAlign: 'right',
  },
  modalProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modalProductImage: {
    width: wp('15%'),
    height: wp('15%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
  },
  modalProductInfo: {
    flex: 1,
  },
  modalProductName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: hp('0.3%'),
  },
  modalProductDetails: {
    fontSize: wp('3.5%'),
    color: LIGHT_TEXT_COLOR,
  },
  modalProductPrice: {
    fontSize: wp('3.8%'),
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginTop: hp('0.5%'),
  },
  // New style for the "Complete Order" button
  completeButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp('1.8%'),
    borderRadius: 10,
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  completeButtonText: {
    color: 'white',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc', // Grey out when disabled
  },
  // Styles for the filter tabs
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: hp('2%'),
    padding: wp('1%'),
    marginHorizontal: hp(2),
    elevation: 1,
  },
  filterButton: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: LIGHT_TEXT_COLOR,
  },
  activeFilterButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  activeFilterButtonText: {
    color: 'white',
  },
});