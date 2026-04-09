
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PRIMARY_COLOR = "#4CAD73"
const TEXT_COLOR = "#333"
const LIGHT_TEXT_COLOR = "#666"
const BACKGROUND_COLOR = "#F8F8F8"
const WHOLESALE_COLOR = "#F59E0B"

export const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    zIndex: 1000
  },
  categoryFilterContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterIcon: {
    marginRight: wp("2%"),
  },
  categoryDropdown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryDropdownText: {
    fontSize: wp("4%"),
    color: "#374151",
    fontWeight: "500",
  },
  categoryDropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: wp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    marginTop: hp("0.5%"),
  },
  categoryDropdownOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryDropdownOptionSelected: {
    backgroundColor: "#EBF8FF",
  },
  categoryDropdownOptionText: {
    fontSize: wp("4%"),
    color: "#374151",
  },
  categoryDropdownOptionTextSelected: {
    color: "#4CAD73",
    fontWeight: "600",
  },




  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: hp("2%"),
    alignItems: "center",

    paddingTop: hp("2%"),
    flexDirection: "row",
    paddingLeft: hp(2)
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: wp("4%"),
    marginTop: hp("2%"),
    borderRadius: 10,
    padding: wp("1%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.5%"),
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  activeTabButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabIcon: {
    marginRight: wp("2%"),
  },
  tabButtonText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: LIGHT_TEXT_COLOR,
  },
  activeTabButtonText: {
    color: "#FFFFFF",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: wp("4%"),
    marginVertical: hp("2%"),
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: wp("2%"),
  },
  searchInput: {
    flex: 1,
    height: hp("5.5%"),
    fontSize: wp("4%"),
    color: TEXT_COLOR,
  },
  productCountContainer: {
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1%"),
  },
  productCountText: {
    fontSize: wp("3.5%"),
    color: LIGHT_TEXT_COLOR,
    fontWeight: "500",
  },
  productList: {
    paddingHorizontal: wp("2%"),
    paddingBottom: hp("2%"),
  },
  productCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    margin: wp("2%"),
    alignItems: "center",

    elevation: 3,
    maxWidth: "46%",
  },
  wholesaleProductCard: {
    borderWidth: 2,
    borderColor: "#FEF3C7",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
  },
  productImage: {
    width: "100%",
    height: hp(15),
    resizeMode: "contain",
    borderTopRightRadius: hp(2),
    borderTopLeftRadius: hp(2),
    marginBottom: hp(1),
  },
  wholesaleBadge: {
    position: "absolute",
    top: hp("0.5%"),
    right: wp("2%"),
    backgroundColor: WHOLESALE_COLOR,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("3%"),
  },
  wholesaleBadgeText: {
    color: "#FFFFFF",
    fontSize: wp("2.5%"),
    fontWeight: "bold",
    marginLeft: wp("1%"),
  },
  productInfo: {
    width: "100%",
    paddingHorizontal: hp(1),
    paddingBottom: hp(2)
  },
  productName: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: hp("0.5%"),
  },
  priceContainer: {
    alignItems: "baseline",
    marginBottom: hp("0.5%"),
  },
  productPrice: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    color: PRIMARY_COLOR,
    marginRight: wp("1%"),
  },
  productOriginalPrice: {
    fontSize: wp("3.5%"),
    color: LIGHT_TEXT_COLOR,
    textDecorationLine: "line-through",
  },
  productUnit: {
    fontSize: wp("3.2%"),
    color: LIGHT_TEXT_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp("1%"),
    fontSize: wp("4%"),
    color: LIGHT_TEXT_COLOR,
  },
  loadingMoreContainer: {
    paddingVertical: hp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: hp("1%"),
    fontSize: wp("3.5%"),
    color: LIGHT_TEXT_COLOR,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp("5%"),
  },
  emptyStateText: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: TEXT_COLOR,
    marginTop: hp("2%"),
  },
  emptyStateSubText: {
    fontSize: wp("3.5%"),
    color: LIGHT_TEXT_COLOR,
    textAlign: "center",
    marginTop: hp("1%"),
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 8,
    marginTop: hp("2%"),
  },
  retryButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  loadAllButton: {
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: wp("4%"),
    marginVertical: hp("1%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 10,
    alignItems: "center",
  },
  wholesaleLoadButton: {
    backgroundColor: WHOLESALE_COLOR,
  },
  loadAllButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
})