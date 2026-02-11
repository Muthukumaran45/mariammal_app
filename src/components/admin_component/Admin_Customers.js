"use client"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native"
import { getFirestore, collection, onSnapshot, getDocs } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { styles } from "../../styles/admin_style/Admin_style" // Import the updated styles
import UserDetailsModal from "./UserDetailModal"

const PRIMARY_COLOR = "#4CAD73"
const TEXT_COLOR = "#333"
const LIGHT_TEXT_COLOR = "#666"
const BACKGROUND_COLOR = "#F8F8F8"

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    normalUsers: 0,
    retailUsers: 0,
    wholesaleUsers: 0,
  })

  const [activeFilter, setActiveFilter] = useState("all") // 'all', 'normal', 'retail_user', 'wholesale_user'

  const app = getApp()
  const db = getFirestore(app)

  const fetchCustomersAndStats = useCallback(() => {
    setLoading(true)
    const usersCollectionRef = collection(db, "users")
    const bookingsCollectionRef = collection(db, "bookings")

    const unsubscribe = onSnapshot(
      usersCollectionRef,
      async (userSnapshot) => {
        const fetchedCustomers = []
        let totalCustomers = 0
        let normalUsers = 0
        let retailUsers = 0
        let wholesaleUsers = 0

        // Fetch all bookings once to optimize performance
        const allBookingsSnapshot = await getDocs(bookingsCollectionRef)
        const allBookings = allBookingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        for (const userDoc of userSnapshot.docs) {
          const userData = { id: userDoc.id, ...userDoc.data() }
          totalCustomers++

          // Count users by type
          const userType = userData.userType || "normal"
          switch (userType) {
            case "normal":
              normalUsers++
              break
            case "retail_user":
              retailUsers++
              break
            case "wholesale_user":
              wholesaleUsers++
              break
            default:
              normalUsers++ // Default to normal if unknown type
          }

          // Filter bookings for the current user
          const userBookings = allBookings.filter((booking) => booking.userId === userData.id)
          const totalOrders = userBookings.length
          const totalSpent = userBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)

          // Determine customer status based on order count
          let customerStatus = "New"
          if (totalOrders > 0) {
            customerStatus = "Active"
          }

          fetchedCustomers.push({
            id: userData.id,
            name: userData.name || "N/A",
            email: userData.email || "N/A",
            phone: userData.phoneNumber || "N/A",
            totalOrders: totalOrders,
            totalSpent: totalSpent.toFixed(2),
            status: customerStatus,
            userType: userType,
          })
        }

        // Sort customers by name
        fetchedCustomers.sort((a, b) => a.name.localeCompare(b.name))

        setCustomers(fetchedCustomers)
        setStats({
          totalCustomers: totalCustomers,
          normalUsers: normalUsers,
          retailUsers: retailUsers,
          wholesaleUsers: wholesaleUsers,
        })
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching customers:", error)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [db])

  useEffect(() => {
    const unsubscribe = fetchCustomersAndStats()
    return () => unsubscribe()
  }, [fetchCustomersAndStats])

  const handleCustomerPress = (customer) => {
    setSelectedCustomer(customer)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedCustomer(null)
  }

  const handleFilterPress = (filterType) => {
    setActiveFilter(filterType)
  }

  const getCustomerStatusColor = (status) => {
    switch (status) {
      case "Active":
        return { backgroundColor: "#D1FAE5" } // Light Green
      case "New":
        return { backgroundColor: "#DBEAFE" } // Light Blue
      default:
        return { backgroundColor: "#F3F4F6" }
    }
  }

  const getCustomerStatusTextColor = (status) => {
    switch (status) {
      case "Active":
        return { color: "#065F46" } // Dark Green
      case "New":
        return { color: "#1E40AF" } // Dark Blue
      default:
        return { color: "#374151" }
    }
  }

  const renderStatCard = (title, value, icon, color, filterType) => (
    <TouchableOpacity onPress={() => handleFilterPress(filterType)}>
      <LinearGradient
        colors={color}
        style={[styles.statCard, activeFilter === filterType && { borderWidth: 3, borderColor: "#FFFFFF" }]}
      >
        <View style={styles.statCardHeader}>
          <Text style={styles.statCardTitle}>{title}</Text>
          <Icon name={icon} size={wp("6%")} color="#FFFFFF" />
        </View>
        <Text style={styles.statCardValue}>{value}</Text>
        {activeFilter === filterType && (
          <View style={{ position: "absolute", top: 5, right: 5 }}>
            <Icon name="checkmark-circle" size={wp("4%")} color="#FFFFFF" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )

  const filteredCustomers =
    activeFilter === "all" ? customers : customers.filter((customer) => customer.userType === activeFilter)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Customers</Text>
          <Text style={styles.contentSubtitle}>Manage your customer relationships and data</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: hp("2%"),
            paddingVertical: hp("2%"),
            marginBottom: hp("5%"),
          }}
        >
          {renderStatCard("Total Customers", stats.totalCustomers, "people-outline", ["#3B82F6", "#1D4ED8"], "all")}
          {renderStatCard("Normal Users", stats.normalUsers, "person-outline", ["#10B981", "#059669"], "normal")}
          {renderStatCard(
            "Retail Users",
            stats.retailUsers,
            "storefront-outline",
            ["#F59E0B", "#D97706"],
            "retail_user",
          )}
          {renderStatCard(
            "Wholesale Users",
            stats.wholesaleUsers,
            "business-outline",
            ["#8B5CF6", "#7C3AED"],
            "wholesale_user",
          )}
        </ScrollView>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={{ marginTop: hp("1%"), color: LIGHT_TEXT_COLOR }}>Loading customers...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.customerCard}
                onPress={() => handleCustomerPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.customerInfo}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerInitial}>
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View style={styles.customerDetails}>
                    <Text style={styles.customerName}>{item.name}</Text>
                    <Text style={styles.customerEmail}>{item.email}</Text>
                    <Text style={styles.customerPhone}>{item.phone}</Text>
                  </View>
                </View>
                <View style={styles.customerStats}>
                  <Text style={styles.customerOrders}>{item.totalOrders} orders</Text>
                  <Text style={styles.customerSpent}>₹{item.totalSpent}</Text>
                  <View style={[styles.statusBadge, getCustomerStatusColor(item.status)]}>
                    <Text style={[styles.statusText, getCustomerStatusTextColor(item.status)]}>{item.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp("8%"),
              marginTop: hp(3),
            }}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: hp("5%") }}>
                <Icon name="people-outline" size={wp("15%")} color={LIGHT_TEXT_COLOR} style={{ opacity: 0.5 }} />
                <Text style={{ fontSize: wp("4.5%"), fontWeight: "600", color: TEXT_COLOR, marginTop: hp("2%") }}>
                  {activeFilter === "all"
                    ? "No customers found."
                    : `No ${activeFilter === "normal" ? "normal" : activeFilter === "retail_user" ? "retail" : "wholesale"} users found.`}
                </Text>
                <Text
                  style={{ fontSize: wp("3.5%"), color: LIGHT_TEXT_COLOR, textAlign: "center", marginTop: hp("1%") }}
                >
                  {activeFilter === "all" ? "New users will appear here." : "Try selecting a different filter."}
                </Text>
              </View>
            )}
          />
        )}

        <UserDetailsModal visible={modalVisible} onClose={handleCloseModal} customer={selectedCustomer} />
      </View>
    </SafeAreaView>
  )
}

export default AdminCustomers
