"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import { COLORS } from "../../styles/Color"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Ionicons"

// Render individual wholesale product card
const RenderWholesaleItem = ({ item, userType }) => {
  const navigation = useNavigation()

  // Get price based on user type for wholesale products
  const getPrice = () => {
    switch (userType) {
      case "retail_user":
        return item?.retailPrice || item?.price || 0
      case "wholesale_user":
        return item?.wholesalePrice || item?.price || 0
      case "normal":
      default:
        return item?.normalPrice || item?.price || 0
    }
  }

  const displayPrice = getPrice()

  return (
    <TouchableOpacity
      style={styles.wholesaleCard}
      onPress={() =>
        navigation?.navigate("ProductDetailsScreen", {
          productDetails: { ...item, displayPrice },
        })
      }
    >
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: item?.imageUrl }} style={styles.image} />
        {/* Wholesale Badge */}
        <View style={styles.wholesaleBadge}>
          <Icon name="business-outline" size={wp("3%")} color="#FFFFFF" />
          <Text style={styles.wholesaleBadgeText}>Wholesale</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: hp(1), paddingBottom: hp(1) }}>
        <Text style={styles.name} numberOfLines={2}>
          {item?.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item?.description}
        </Text>


      </View>



      <View style={styles.footer}>

        <View>
          {item?.mrpPrice != null && Number(item.mrpPrice) > 0 && (
            <Text style={{ fontSize: 12, }}>
              MRP : <Text style={{
                fontSize: 12,
                color: "#888",
                textDecorationLine: "line-through",
              }}>₹{Number(item.mrpPrice).toFixed(2)}</Text>
            </Text>
          )}
          <Text style={styles.price}>₹{displayPrice?.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const WholesaleProducts = ({ userType = "normal" }) => {
  const [wholesaleProducts, setWholesaleProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const firestore = getFirestore(getApp())

  useEffect(() => {
    fetchWholesaleProducts()
  }, [])

  const fetchWholesaleProducts = async () => {
    try {
      setLoading(true)
      const productsCollection = collection(firestore, "products")
      const productsSnapshot = await getDocs(productsCollection)
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Filter only active wholesale products
      const wholesaleOnly = productsData.filter(
        (product) => (product.isActive === true || product.status === "Active") && product.isWholesaleProduct === true,
      )

      setWholesaleProducts(wholesaleOnly)
    } catch (error) {
      console.error("Error fetching wholesale products:", error)
      setWholesaleProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading wholesale products...</Text>
      </View>
    )
  }

  // Don't render anything if no wholesale products available
  if (!wholesaleProducts || wholesaleProducts.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>

      {/* Horizontal Scroll */}
      <FlatList
        data={wholesaleProducts}
        contentContainerStyle={{ paddingLeft: hp(2) }}
        renderItem={({ item }) => <RenderWholesaleItem item={item} userType={userType} />}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 5,
    color: "#666",
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hp(2),
    marginBottom: hp(1.5),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#000",
    marginLeft: wp(2),
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: hp(2),
    color: COLORS.primary,
    marginRight: wp(1),
  },
  wholesaleCard: {
    width: hp(20),
    backgroundColor: "#fff",
    borderRadius: hp(2),
    marginRight: hp(1.5),
    elevation: 3,
    marginBottom: hp(2),
    borderWidth: 2,
    borderColor: "#FEF3C7", // Light yellow border for wholesale products
  },
  image: {
    width: "100%",
    height: hp(15),
    resizeMode: "contain",
    borderTopRightRadius: hp(2),
    borderTopLeftRadius: hp(2),
    marginBottom: hp(1),
  },
  wholesaleBadge: {
    position: "absolute",
    top: hp(1),
    right: hp(1),
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  wholesaleBadgeText: {
    color: "#FFFFFF",
    fontSize: wp(2.5),
    fontWeight: "bold",
    marginLeft: wp(1),
  },
  name: {
    fontWeight: "bold",
    fontSize: hp(2.3),
    marginBottom: hp(1),
    color: "#000",
  },
  description: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
    lineHeight: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingHorizontal: hp(1),
    paddingBottom: hp(1),
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: hp(4),
    height: hp(4),
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: hp(2.5),
    fontWeight: "bold",
  },
})

export default WholesaleProducts
