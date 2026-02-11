

import { useState } from "react"
import { StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar, ScrollView } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import {
  Bell,
  ChevronLeft,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Settings,
  Trash2,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

// Colors matching the profile screen
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
  success: "#2ECC71",
}

// Mock CustomText component
const CustomText = ({ children, size = 1, fontFamily, fontWeight = "400", color = COLORS.text, style, ...props }) => (
  <Text
    style={[
      {
        fontSize: size === 1 ? 14 : size === 2 ? 18 : size === 3 ? 22 : size === 4 ? 26 : 16,
        fontWeight,
        color,
        fontFamily,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
)

const Notification_Screen = () => {
  const [notifications, setNotifications] = useState([
    // {
    //   id: "1",
    //   type: "order_ready",
    //   title: "Order Ready for Pickup!",
    //   message: "Your order #1234 is ready. Please visit our store to collect and pay.",
    //   time: "2 minutes ago",
    //   isRead: false,
    //   icon: CheckCircle,
    //   iconColor: COLORS.success,
    //   orderNumber: "#1234",
    // },
    // {
    //   id: "2",
    //   type: "order_preparing",
    //   title: "Order Being Prepared",
    //   message: "We've started preparing your order #1235. Estimated ready time: 15 minutes.",
    //   time: "10 minutes ago",
    //   isRead: false,
    //   icon: Clock,
    //   iconColor: COLORS.warning,
    //   orderNumber: "#1235",
    // },
    // {
    //   id: "3",
    //   type: "order_confirmed",
    //   title: "Order Confirmed",
    //   message: "Your order #1233 has been confirmed and will be ready in 20 minutes.",
    //   time: "25 minutes ago",
    //   isRead: true,
    //   icon: ShoppingBag,
    //   iconColor: COLORS.primary,
    //   orderNumber: "#1233",
    // },
    // {
    //   id: "4",
    //   type: "shop_announcement",
    //   title: "New Fresh Produce Arrived!",
    //   message: "Fresh organic vegetables and fruits just arrived. Visit us today for the best selection.",
    //   time: "2 hours ago",
    //   isRead: true,
    //   icon: Gift,
    //   iconColor: COLORS.accent,
    // },
    // {
    //   id: "5",
    //   type: "reminder",
    //   title: "Don't Forget Your Order",
    //   message: "Your order #1232 is still waiting for pickup. Store closes at 8 PM today.",
    //   time: "4 hours ago",
    //   isRead: true,
    //   icon: AlertCircle,
    //   iconColor: COLORS.danger,
    //   orderNumber: "#1232",
    // },
    // {
    //   id: "6",
    //   type: "shop_hours",
    //   title: "Extended Hours This Weekend",
    //   message: "We'll be open until 10 PM this Saturday and Sunday for your convenience.",
    //   time: "1 day ago",
    //   isRead: true,
    //   icon: Clock,
    //   iconColor: COLORS.accent,
    // },
  ])

  const [filter, setFilter] = useState("all") // all, unread, orders

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })))
  }

  // Filter notifications
  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter((notif) => !notif.isRead)
      case "orders":
        return notifications.filter((notif) =>
          ["order_ready", "order_preparing", "order_confirmed", "reminder"].includes(notif.type),
        )
      default:
        return notifications
    }
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  // Render each notification item
  const renderNotification = ({ item }) => {
    const IconComponent = item.icon

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, { backgroundColor: item.iconColor + "15" }]}>
            <IconComponent size={20} color={item.iconColor} />
          </View>

          <View style={styles.notificationText}>
            <View style={styles.notificationHeader}>
              <CustomText fontWeight="600" style={styles.notificationTitle}>
                {item.title}
              </CustomText>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            <CustomText color={COLORS.textLight} style={styles.notificationMessage}>
              {item.message}
            </CustomText>

            <View style={styles.notificationFooter}>
              <CustomText color={COLORS.textLight} style={styles.notificationTime}>
                {item.time}
              </CustomText>
              {item.orderNumber && (
                <CustomText color={COLORS.primary} fontWeight="600" style={styles.orderNumber}>
                  {item.orderNumber}
                </CustomText>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNotification(item.id)}>
            <Trash2 size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  // Filter tabs
  const FilterTab = ({ title, value, count }) => (
    <TouchableOpacity
      style={[styles.filterTab, filter === value && styles.activeFilterTab]}
      onPress={() => setFilter(value)}
    >
      <CustomText
        color={filter === value ? COLORS.white : COLORS.textLight}
        fontWeight={filter === value ? "600" : "400"}
      >
        {title}
        {count > 0 && filter === value && <CustomText color={COLORS.white}> ({count})</CustomText>}
      </CustomText>
    </TouchableOpacity>
  )

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Bell size={80} color={COLORS.textLight} style={{ opacity: 0.3 }} />
      <CustomText size={2} fontWeight="600" style={styles.emptyStateTitle}>
        No notifications
      </CustomText>
      <CustomText color={COLORS.textLight} style={styles.emptyStateText}>
        {filter === "unread"
          ? "All caught up! No unread notifications."
          : filter === "orders"
            ? "No order notifications at the moment."
            : "You'll see notifications here when they arrive."}
      </CustomText>
    </View>
  )

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <CustomText size={2} fontWeight="700" color={COLORS.white}>
              Notifications
            </CustomText>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <CustomText color={COLORS.primary} fontWeight="600" style={styles.headerBadgeText}>
                  {unreadCount}
                </CustomText>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <FilterTab title="All" value="all" count={notifications.length} />
          <FilterTab title="Unread" value="unread" count={unreadCount} />
          <FilterTab
            title="Orders"
            value="orders"
            count={
              notifications.filter((n) =>
                ["order_ready", "order_preparing", "order_confirmed", "reminder"].includes(n.type),
              ).length
            }
          />
        </ScrollView>

        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <CustomText color={COLORS.primary} fontWeight="600">
              Mark all read
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScroll: {
    flex: 1,
  },
  filterTab: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: 20,
    marginRight: wp("2%"),
    backgroundColor: COLORS.bgColor,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  markAllButton: {
    paddingHorizontal: wp("3%"),
  },
  listContainer: {
    padding: wp("5%"),
    paddingTop: hp("1%"),
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: hp("2%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationContent: {
    flexDirection: "row",
    padding: wp("4%"),
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTime: {
    fontSize: 12,
  },
  orderNumber: {
    fontSize: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgColor,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("15%"),
  },
  emptyStateTitle: {
    marginTop: hp("2%"),
  },
  emptyStateText: {
    marginTop: hp("1%"),
    textAlign: "center",
    paddingHorizontal: wp("10%"),
    lineHeight: 20,
  },
})

export default Notification_Screen
