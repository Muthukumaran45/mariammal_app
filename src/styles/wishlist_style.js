import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from './Color';



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgColor,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: hp("5%"),
    paddingBottom: hp("2%"),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.2%"),
    alignItems: "center",
    marginRight: wp("2%"),
  },
  searchPlaceholder: {
    marginLeft: wp("2%"),
  },
  filterButton: {
    backgroundColor: COLORS.white,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  countContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("1%"),
    marginTop: hp(2)
  },
  listContainer: {
    padding: wp("5%"),
    paddingTop: hp("1%"),
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: hp("2%"),
    flexDirection: "row",
    overflow: "hidden",

  },
  itemImageContainer: {
    width: wp("25%"),
    height: hp("12%"),
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 4,
    alignItems: "center",
  },
  outOfStockText: {
    fontSize: 10,
    fontWeight: "600",
  },
  itemDetails: {
    flex: 1,
    padding: wp("3%"),
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    flex: 1,
    marginRight: wp("2%"),
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgColor,
    justifyContent: "center",
    alignItems: "center",
  },
  itemCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: hp("1%"),
  },
  itemUnit: {
    fontSize: 12,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.textLight,
    opacity: 0.5,
  },
  addToCartText: {
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("10%"),
  },
  emptyStateTitle: {
    marginTop: hp("2%"),
  },
  emptyStateText: {
    marginTop: hp("1%"),
    marginBottom: hp("3%"),
    textAlign: "center",
    paddingHorizontal: wp("10%"),
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("8%"),
    borderRadius: 25,
  },
})