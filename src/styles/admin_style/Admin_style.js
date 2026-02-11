import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const PRIMARY_COLOR = "#4CAD73"


export const styles = StyleSheet.create({

  statusPending: { backgroundColor: "#FFD70030", color: "#92400E" }, // Yellowish for pending/processing
  statusCompleted: { backgroundColor: PRIMARY_COLOR + "30", color: PRIMARY_COLOR }, // Greenish for completed
  statusCancelled: { backgroundColor: "#FEE2E2", color: "#991B1B" },

  // banner style start--------------------
  headerButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: hp(2)
  },

  // Banner section
  bannerSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bannerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  bannerList: {
    paddingVertical: 4,
  },

  bannerItem: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },

  bannerImage: {
    width: 150,
    height: 75,
    borderRadius: 8,
  },

  deleteBannerButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  closeButton: {
    padding: 4,
  },

  modalBody: {
    padding: hp(2),
  },

  uploadButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    width: '100%',
  },

  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },

  uploadInfo: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 16,
    lineHeight: 20,
  },
  // banner style end-----------------------


  // store information admin start -------------------------
  businessHourRow: {
    flexDirection: 'column',
    paddingVertical: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  // Day label container with leave button
  dayLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp('2%'),
  },

  dayLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },

  // Leave button styles
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('1.5%'),
    borderRadius: wp('2%'),
    minWidth: wp('20%'),
    justifyContent: 'center',
  },

  leaveButtonText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontWeight: '600',
    marginLeft: wp('1%'),
  },

  // Time inputs container
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: wp('2%'),
  },

  timeInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('2%'),
    fontSize: wp('3.5%'),
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },

  toText: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginHorizontal: wp('2%'),
    fontWeight: '500',
  },

  // Leave indicator for closed days
  leaveIndicator: {
    alignItems: 'center',
    paddingVertical: wp('2%'),
    paddingLeft: wp('2%'),
  },

  leaveText: {
    fontSize: wp('4%'),
    color: '#EF4444',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Enhanced save button
  saveButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: wp('4%'),
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },

  // Input group styles
  inputGroup: {
    marginBottom: wp('4%'),
  },

  inputLabel: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#374151',
    marginBottom: wp('2%'),
  },

  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('2.5%'),
    fontSize: wp('3.5%'),
    color: '#374151',
  },

  textArea: {
    height: wp('20%'),
    textAlignVertical: 'top',
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp('4%'),
  },

  inputHalf: {
    flex: 1,
    marginRight: wp('2%'),
  },

  // Settings card styles
  settingsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('4%'),
    marginBottom: wp('4%'),
    padding: wp('4%'),
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: hp(2)
  },

  settingsCardTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: wp('1%'),
  },

  settingsCardSubtitle: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: wp('4%'),
  },

  // store information admin end -------------------------
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: hp('8%'),
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: wp('2%'),
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: wp('2%'),
  },
  notificationBadge: {
    position: 'absolute',
    top: wp('1%'),
    right: wp('1%'),
    backgroundColor: '#EF4444',
    borderRadius: wp('2%'),
    width: wp('4%'),
    height: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
  },
  profileButton: {
    width: wp('8%'),
    height: wp('8%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#10B981',
  },
  mainContainer: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: -wp('65%'),
    width: wp('65%'),
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: wp('8%'),
    height: wp('8%'),
    backgroundColor: '#10B981',
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },

  logoText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#111827',
  },
  logoSubtext: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
  closeButton: {
    padding: wp('2%'),
  },
  sidebarMenu: {
    flex: 1,
    padding: wp('4%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  activeMenuItem: {
    backgroundColor: '#10B981',
  },
  menuItemText: {
    marginLeft: wp('3%'),
    fontSize: wp('4%'),
    color: '#6B7280',
  },
  activeMenuItemText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutText: {
    marginLeft: wp('3%'),
    fontSize: wp('4%'),
    color: '#EF4444',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#111827',
  },
  contentSubtitle: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginTop: hp('0.5%'),
  },
  addButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: wp('2%'),
    fontWeight: '600',
    fontSize: wp('3.5%'),
  },

  statCard: {
    width: wp('50%'),
    height: hp('10%'),
    borderRadius: wp('3%'),
    marginRight: wp('4%'),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1)
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  statCardTitle: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statCardValue: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp('0.5%'),
  },
  statCardChange: {
    fontSize: wp('3%'),
    color: '#FFFFFF',
    opacity: 0.8,
  },
  dashboardCards: {
    padding: wp('5%'),
    gap: hp('2%'),
  },
  dashboardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardCardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: hp('0.5%'),
  },
  dashboardCardSubtitle: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('2%'),
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111827',
  },
  orderCustomer: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginTop: hp('0.3%'),
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
    marginBottom: hp('0.5%'),
  },
  statusText: {
    fontSize: wp('3%'),
    fontWeight: '600',
  },
  orderAmount: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111827',
  },
  lowStockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  productName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111827',
  },
  productCategory: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
  stockBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
  },
  stockText: {
    fontSize: wp('3%'),
    color: '#991B1B',
    fontWeight: '600',
  },
  searchContainer: {
    padding: wp('5%'),
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('3%'),
    fontSize: wp('4%'),
    color: '#111827',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    padding: wp('4%'),
    borderRadius: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: wp('12%'),
    height: wp('12%'),
    backgroundColor: '#F3F4F6',
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  productDetails: {
    flex: 1,
  },
  productPrice: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#111827',
    marginTop: hp('0.3%'),
  },
  productActions: {
    alignItems: 'flex-end',
  },
  productStock: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('0.5%'),
  },
  actionButton: {
    padding: wp('2%'),
    marginTop: hp('0.5%'),
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    padding: wp('4%'),
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  orderEmail: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('1%'),
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
  orderDate: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    padding: wp('4%'),
    borderRadius: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: wp('12%'),
    height: wp('12%'),
    backgroundColor: '#D1FAE5',
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  customerInitial: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#065F46',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111827',
  },
  customerEmail: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginTop: hp('0.3%'),
  },
  customerPhone: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginTop: hp('0.3%'),
  },
  customerStats: {
    alignItems: 'flex-end',
  },
  customerOrders: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('0.3%'),
  },
  customerSpent: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: hp('0.5%'),
  },
  analyticsGrid: {
    padding: wp('5%'),
    gap: hp('2%'),
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: hp('0.5%'),
  },
  chartSubtitle: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginBottom: hp('4%'),
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: hp('15%'),
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
  bar: {
    backgroundColor: '#10B981',
    width: '80%',
    borderRadius: wp('1%'),
    marginBottom: hp('1%'),
  },
  chartLabel: {
    fontSize: wp('3%'),
    color: '#6B7280',
  },
  topProductsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productRank: {
    width: wp('8%'),
    height: wp('8%'),
    backgroundColor: '#D1FAE5',
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  rankNumber: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#065F46',
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#111827',
  },
  topProductUnits: {
    fontSize: wp('3.5%'),
    color: '#6B7280',
    marginTop: hp('0.3%'),
  },
  topProductRevenue: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#111827',
  },

  // product

  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: wp('4%'),
    color: '#374151',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Image upload styles
  imageUploadContainer: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: hp(2)
  },
  imageUploadContainerWithImage: {
    borderStyle: 'solid',
    borderColor: '#10B981',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  imageUploadText: {
    marginTop: 8,
    fontSize: wp('3.5%'),
    color: '#9CA3AF',
  },

  // Save button styles
  saveProductButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveProductButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveProductButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: 8,
  },
  dropdownMenu: {
    marginTop: hp(1),
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // for Android shadow
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  dropdownOptionText: {
    color: '#374151',
    fontSize: hp(1.8),
  },
  dropdownOptionTextSelected: {
    fontWeight: 'bold',
    color: '#2563EB',
  },

  // Modal height adjustment
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },

});

