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

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeCustomers: 0,
  })
  const [monthlySalesData, setMonthlySalesData] = useState([])
  const [topProductsData, setTopProductsData] = useState([])
  const [recentOrdersData, setRecentOrdersData] = useState([])
  const [lowStockData, setLowStockData] = useState([])

  const app = getApp()
  const db = getFirestore(app)

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Fetch all bookings
      const bookingsSnapshot = await getDocs(collection(db, "bookings"))
      const allBookings = bookingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // 2. Fetch all products
      const productsSnapshot = await getDocs(collection(db, "products"))
      const allProducts = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // 3. Fetch all users
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

      setAnalyticsData({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders: totalOrders,
        totalProducts: totalProducts,
        activeCustomers: activeCustomers.size,
      })

      // --- Monthly Sales Data (Last 6 months) ---
      const salesByMonth = {}
      const now = new Date()
      for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthYear = date.toLocaleString("en-US", { month: "short", year: "2-digit" })
        salesByMonth[monthYear] = 0
      }

      completedBookings.forEach((booking) => {
        const bookingDate = booking.createdAt?.toDate()
        if (bookingDate) {
          const monthYear = bookingDate.toLocaleString("en-US", { month: "short", year: "2-digit" })
          if (salesByMonth.hasOwnProperty(monthYear)) {
            salesByMonth[monthYear] += booking.totalAmount || 0
          }
        }
      })

      const sortedMonthlySales = Object.keys(salesByMonth)
        .sort((a, b) => {
          const [monthA, yearA] = a.split(" ")
          const [monthB, yearB] = b.split(" ")
          const dateA = new Date(`01 ${monthA} 20${yearA}`)
          const dateB = new Date(`01 ${monthB} 20${yearB}`)
          return dateA.getTime() - dateB.getTime()
        })
        .map((monthYear) => ({
          month: monthYear,
          sales: salesByMonth[monthYear],
        }))

      setMonthlySalesData(sortedMonthlySales)

      // --- Top Selling Products ---
      const productSalesMap = {}
      allBookings.forEach((booking) => {
        booking.items?.forEach((item) => {
          const productId = item.productId || item.id // Use productId or id from item
          if (productId) {
            if (!productSalesMap[productId]) {
              productSalesMap[productId] = {
                quantity: 0,
                revenue: 0,
                name: item.name || "Unknown Product", // Use item name as fallback
              }
            }
            productSalesMap[productId].quantity += item.quantity || 0
            productSalesMap[productId].revenue += (item.price || 0) * (item.quantity || 0)
          }
        })
      })

      const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.quantity - a.quantity) // Sort by quantity sold
        .slice(0, 3) // Get top 3
        .map((product) => ({
          name: product.name,
          units: `${product.quantity} units sold`,
          revenue: `₹${product.revenue.toFixed(2)}`,
        }))
      setTopProductsData(topProducts)

      // --- Recent Orders ---
      const recentOrdersQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5))
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

      // --- Low Stock Alert ---
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
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [db])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  const onRefresh = () => {
    setRefreshing(true)
    fetchAnalyticsData()
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
          <Text style={styles.contentTitle}>Analytics</Text>
          <Text style={styles.contentSubtitle}>Track your store's performance and insights</Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: hp("50%") }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={{ marginTop: hp("1%"), color: LIGHT_TEXT_COLOR }}>Loading analytics...</Text>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
              marginBottom: hp('5%'),
              marginLeft: hp(2),
            }}>
              {renderStatCard("Revenue", `₹${analyticsData.totalRevenue}`, "cash-outline", ["#3B82F6", "#1D4ED8"])}
              {renderStatCard("Orders", analyticsData.totalOrders, "bag-outline", ["#10B981", "#059669"])}
              {renderStatCard("Customers", analyticsData.activeCustomers, "people-outline", ["#8B5CF6", "#7C3AED"])}
              {renderStatCard("Products", analyticsData.totalProducts, "cube-outline", ["#EF4444", "#DC2626"])}
            </ScrollView>

            <View style={styles.analyticsGrid}>
              {/* Monthly Sales Chart */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Monthly Sales</Text>
                <Text style={styles.chartSubtitle}>Sales performance over the last 6 months</Text>
                <View style={styles.chartContainer}>
                  {monthlySalesData.map((data, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height:
                              (data.sales / Math.max(...monthlySalesData.map((d) => d.sales), 1)) * hp("10%") +
                              hp("5%"),
                          },
                        ]}
                      />
                      <Text style={styles.chartLabel}>{data.month}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Top Selling Products */}
              <View style={styles.topProductsCard}>
                <Text style={styles.chartTitle}>Top Selling Products</Text>
                <Text style={styles.chartSubtitle}>Best performing products this month</Text>
                {topProductsData.length > 0 ? (
                  topProductsData.map((product, index) => (
                    <View key={index} style={styles.topProductItem}>
                      <View style={styles.productRank}>
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                      </View>
                      <View style={styles.topProductInfo}>
                        <Text style={styles.topProductName}>{product.name}</Text>
                        <Text style={styles.topProductUnits}>{product.units}</Text>
                      </View>
                      <Text style={styles.topProductRevenue}>{product.revenue}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.chartSubtitle}>No top selling products data available.</Text>
                )}
              </View>

              {/* Recent Orders Section */}
              <View style={styles.recentOrdersCard}>
                <Text style={styles.chartTitle}>Recent Orders</Text>
                <Text style={styles.chartSubtitle}>Latest customer orders</Text>
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
                  <Text style={styles.chartSubtitle}>No recent orders found.</Text>
                )}
              </View>

              {/* Low Stock Alert */}
              <View style={styles.lowStockCard}>
                <Text style={styles.chartTitle}>Low Stock Alert</Text>
                <Text style={styles.chartSubtitle}>Products running out of stock</Text>
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
                  <Text style={styles.chartSubtitle}>No products currently low on stock.</Text>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminAnalytics
