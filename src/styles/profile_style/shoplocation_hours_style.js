import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: wp('4%'),
    color: '#6B7280',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerIcon: {
    backgroundColor: '#F0F9FF',
    padding: wp('4%'),
    borderRadius: wp('15%'),
    marginBottom: hp('2%'),
  },
  shopName: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    padding: wp('5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: wp('3%'),
  },
  description: {
    fontSize: wp('4%'),
    color: '#6B7280',
    lineHeight: wp('6%'),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactIcon: {
    backgroundColor: '#F0F9FF',
    padding: wp('3%'),
    borderRadius: wp('10%'),
    marginRight: wp('4%'),
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('0.3%'),
  },
  contactValue: {
    fontSize: wp('4%'),
    color: '#1F2937',
    fontWeight: '500',
  },
  hoursContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp('3%'),
    padding: wp('4%'),
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  todayRow: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    borderBottomWidth: 0,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayName: {
    fontSize: wp('4%'),
    color: '#374151',
    fontWeight: '500',
  },
  todayText: {
    color: '#4CAD73',
    fontWeight: 'bold',
  },
  todayIndicator: {
    width: wp('2%'),
    height: wp('2%'),
    backgroundColor: '#4CAD73',
    borderRadius: wp('1%'),
    marginLeft: wp('2%'),
  },
  dayHours: {
    fontSize: wp('3.8%'),
    color: '#6B7280',
  },
  closedText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  noHoursText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: wp('4%'),
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#4CAD73',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('3%'),
    flex: 0.48,
  },
  actionButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
});