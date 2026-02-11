"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import { COLORS } from "../../styles/Color"
import { useNavigation } from "@react-navigation/native"

// Render individual card
const RenderItem = ({ item, userType }) => {
  const navigation = useNavigation()

  // Get price based on user type
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
      style={styles.card}
      onPress={() =>
        navigation?.navigate("ProductDetailsScreen", {
          productDetails: { ...item, displayPrice },
        })
      }
    >

      {/* image */}
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: item?.imageUrl }} style={styles.image} />
      </View>


      <View style={{ paddingHorizontal: hp(1), paddingBottom: hp(1), }}>

        {/* name */}
        <Text style={styles.name} numberOfLines={2}>
          {item?.name}
        </Text>

        {/* descrption */}
        <Text style={styles.description} numberOfLines={2}>
          {item?.description}
        </Text>


      </View>

      {/* price and add button */}
      <View style={styles.footer}>
        <Text style={styles.price}>₹{displayPrice?.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() =>
          navigation?.navigate("ProductDetailsScreen", {
            productDetails: { ...item, displayPrice },
          })
        }>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const ProductCard = ({ userType = "normal" }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const firestore = getFirestore(getApp())

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const productsCollection = collection(firestore, "products")
      const productsSnapshot = await getDocs(productsCollection)
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Filter only active products that are NOT wholesale products
      const regularProducts = productsData.filter(
        (product) => (product.isActive === true || product.status === "Active") && !product.isWholesaleProduct,
      )

      setProducts(regularProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    )
  }

  // Don't render anything if no products available
  if (!products || products.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        contentContainerStyle={{ paddingLeft: hp(2) }}
        renderItem={({ item }) => <RenderItem item={item} userType={userType} />}
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
  card: {
    width: hp(20),
    backgroundColor: "#fff",
    borderRadius: hp(2),
    marginRight: hp(1.5),
    elevation: 3,
    marginBottom: hp(2),
  },
  image: {
    width: "100%",
    height: hp(15),
    resizeMode: "contain",
    borderTopRightRadius: hp(2),
    borderTopLeftRadius: hp(2),
    marginBottom: hp(1),
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
    color: COLORS.primary,
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

export default ProductCard
