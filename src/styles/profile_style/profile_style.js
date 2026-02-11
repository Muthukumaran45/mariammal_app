import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const COLORS = {
  bgColor: "#F8F9FA",
  primary: "#2ECC71",
  secondary: "#27AE60",
  text: "#2C3E50",
  textLight: "#7F8C8D",
  white: "#FFFFFF",
  border: "#E8E8E8",
  danger: "#E74C3C",
  accent: "#3498DB",
  warning: "#F39C12",
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgColor,
  },
  header: {
    backgroundColor: "#53B175",
    paddingTop: hp("3%"),
    paddingBottom: hp("3%"),
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    paddingHorizontal: wp("5%"),
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hp(3),
    marginBottom: hp(2)
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: wp("11%"),
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    marginLeft: hp("2%"),
    flex: 1,
  },
  profileBio: {
    marginTop: 4,
    opacity: 0.9,
    fontSize: 16,
    fontWeight: "600",
  },
  memberSince: {
    marginTop: 2,
    opacity: 0.8,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    opacity: 0.9,
  },
  editProfileButton: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("6%"),
    borderRadius: 25,
    alignSelf: "center",
  },
  editButtonText: {
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: wp("5%"),
    marginTop: -hp("2%"),
    borderRadius: 15,
    flexDirection: "row",
    paddingVertical: hp("2.5%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: hp("1%"),
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  quickActionsContainer: {
    marginHorizontal: wp("5%"),
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingVertical: hp("2%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionItem: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
  },
  menuContainer: {
    flex: 1,
    marginTop: hp("3%"),
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: wp("5%"),
    borderRadius: 15,
    paddingVertical: hp("2%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: hp("3%"),
    marginTop: hp(3)
  },
  sectionTitle: {
    paddingHorizontal: wp("5%"),
    marginBottom: hp("1%"),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIconContainer: {
    backgroundColor: `${COLORS.danger}15`,
  },
  menuItemTextContainer: {
    marginLeft: wp("4%"),
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
})