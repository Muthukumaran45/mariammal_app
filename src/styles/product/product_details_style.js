import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  shareButton: {
    padding: wp('2%'),
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    backgroundColor: '#fff',
    marginHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    marginBottom: hp('2.5%'),
  },
  productImage: {
    width: wp('50%'),
    height: hp('25%'),
  },
  imageIndicator: {
    flexDirection: 'row',
    marginTop: hp('2%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#E0E0E0',
    marginHorizontal: wp('1%'),
  },
  activeDot: {
    backgroundColor: '#53B175',
  },
  productInfo: {
    paddingHorizontal: wp('5%'),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('2.5%'),
  },
  titleContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#181725',
    marginBottom: hp('0.5%'),
  },
  productWeight: {
    fontSize: wp('4%'),
    color: '#7C7C7C',
  },
  favoriteButton: {
    padding: wp('1.5%'),
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#F2F3F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#181725',
    marginHorizontal: wp('5%'),
    minWidth: wp('5%'),
    textAlign: 'center',
  },
  price: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#181725',
  },
  detailSection: {
    marginBottom: hp('2.5%'),
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  detailTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#181725',
  },
  detailText: {
    fontSize: wp('3.3%'),
    color: '#7C7C7C',
    lineHeight: hp('2.5%'),
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    paddingVertical: hp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#181725',
    flex: 1,
  },
  nutritionBadge: {
    backgroundColor: '#F2F3F2',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.5%'),
    marginRight: wp('2.5%'),
  },
  nutritionText: {
    fontSize: wp('3%'),
    color: '#7C7C7C',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: wp('2.5%'),
  },
  bottomContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2.5%'),
    paddingTop: hp('1.5%'),
    backgroundColor: '#fff',
  },
  addToBasketButton: {
    backgroundColor: '#53B175',
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
  },
  addToBasketText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});