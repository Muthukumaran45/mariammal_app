"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, SafeAreaView, StatusBar } from "react-native"
import { getFirestore, collection, getDocs, query, orderBy, limit } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { styles } from "../../styles/admin_style/Admin_style"

const PRIMARY_COLOR = "#4CAD73"
const TEXT_COLOR = "#333"
const LIGHT_TEXT_COLOR = "#666"
const BACKGROUND_COLOR = "#F8F8F8"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeCustomers: 0,
  })
  const [recentOrdersData, setRecentOrdersData] = useState([])
  const [lowStockData, setLowStockData] = useState([])

  const app = getApp()
  const db = getFirestore(app)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch all bookings
      const bookingsSnapshot = await getDocs(collection(db, "bookings"))
      const allBookings = bookingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // Fetch all products
      const productsSnapshot = await getDocs(collection(db, "products"))
      const allProducts = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const allUsers = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // --- Calculate Core Stats ---
      let totalRevenue = 0
      const totalOrders = allBookings.length
      const totalProducts = allProducts.length
      const activeCustomers = new Set()

      const completedBookings = allBookings.filter((booking) => booking.status === "completed")
      completedBookings.forEach((booking) => {
        totalRevenue += booking.totalAmount || 0
        activeCustomers.add(booking.userId)
      })

      setDashboardStats({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: totalOrders,
        totalProducts: totalProducts,
        activeCustomers: activeCustomers.size,
      })

      // --- Recent Orders (Latest 4) ---
      const recentOrdersQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(4))
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
      const fetchedRecentOrders = recentOrdersSnapshot.docs.map((doc) => {
        const orderData = doc.data()
        const user = allUsers.find((u) => u.id === orderData.userId)
        return {
          id: orderData.bookingId?.substring(0, 8) || doc.id?.substring(0, 8),
          customer: user?.name || "N/A",
          status: orderData.status,
          amount: `₹${(orderData.totalAmount || 0).toFixed(2)}`,
        }
      })
      setRecentOrdersData(fetchedRecentOrders)

      // --- Low Stock Alert (Top 3 low stock products) ---
      const lowStockThreshold = 10 // Define your low stock threshold
      const lowStockProducts = allProducts
        .filter((product) => product.stock !== undefined && product.stock <= lowStockThreshold)
        .slice(0, 3) // Get up to 3 low stock products
        .map((product) => ({
          name: product.name,
          category: product.category || "N/A",
          stock: product.stock,
        }))
      setLowStockData(lowStockProducts)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [db])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const renderStatCard = (title, value, icon, color) => (
    <LinearGradient colors={color} style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Icon name={icon} size={wp("6%")} color="#FFFFFF" />
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      {/* Removed change text as it's not directly from Firestore stats */}
    </LinearGradient>
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return { backgroundColor: styles.statusCompleted.backgroundColor }
      case "pending":
        return { backgroundColor: styles.statusPending.backgroundColor }
      case "preparing":
      case "ready":
        return { backgroundColor: styles.statusPending.backgroundColor } // Use pending color for processing states
      case "cancelled":
        return { backgroundColor: styles.statusCancelled.backgroundColor }
      default:
        return { backgroundColor: "#F3F4F6" }
    }
  }

  const getStatusTextColor = (status) => {
    switch (status) {
      case "completed":
        return { color: styles.statusCompleted.color }
      case "pending":
        return { color: styles.statusPending.color }
      case "preparing":
      case "ready":
        return { color: styles.statusPending.color }
      case "cancelled":
        return { color: styles.statusCancelled.color }
      default:
        return { color: "#374151" }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Dashboard</Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: hp("50%") }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={{ marginTop: hp("1%"), color: LIGHT_TEXT_COLOR }}>Loading dashboard...</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              marginBottom: hp('5%'),
              marginLeft: hp(2),
            }}>
              {renderStatCard("Total Revenue", `₹${dashboardStats.totalRevenue}`, "cash-outline", [
                "#3B82F6",
                "#1D4ED8",
              ])}
              {renderStatCard("Total Orders", dashboardStats.totalOrders, "bag-outline", ["#10B981", "#059669"])}
              {renderStatCard("Products", dashboardStats.totalProducts, "cube-outline", ["#8B5CF6", "#7C3AED"])}
              {renderStatCard("Active Customers", dashboardStats.activeCustomers, "people-outline", [
                "#F59E0B",
                "#D97706",
              ])}
            </ScrollView>

            <View style={styles.dashboardCards}>
              {/* Recent Orders Card */}
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>Recent Orders</Text>
                <Text style={styles.dashboardCardSubtitle}>Latest orders from your customers</Text>
                {recentOrdersData.length > 0 ? (
                  recentOrdersData.map((order, index) => (
                    <View key={index} style={styles.orderItem}>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>Booking ID: {order.id}</Text>
                        <Text style={styles.orderCustomer}>User: {order.customer}</Text>
                      </View>
                      <View style={styles.orderStatus}>
                        <View style={[styles.statusBadge, getStatusColor(order.status)]}>
                          <Text style={[styles.statusText, getStatusTextColor(order.status)]}>
                            {order.status?.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.orderAmount}>{order.amount}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.dashboardCardSubtitle}>No recent orders found.</Text>
                )}
              </View>

              {/* Low Stock Alert Card */}
              <View style={styles.dashboardCard}>
                <Text style={styles.dashboardCardTitle}>Low Stock Alert</Text>
                <Text style={styles.dashboardCardSubtitle}>Products that need restocking</Text>
                {lowStockData.length > 0 ? (
                  lowStockData.map((product, index) => (
                    <View key={index} style={styles.lowStockItem}>
                      <View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productCategory}>{product.category}</Text>
                      </View>
                      <View style={styles.stockBadge}>
                        <Text style={styles.stockText}>{product.stock} left</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.dashboardCardSubtitle}>No products currently low on stock.</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminDashboard
