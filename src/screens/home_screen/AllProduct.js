"use client"

import { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { getFirestore, collection, query, orderBy, limit, startAfter, getDocs } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import { useNavigation, useRoute } from "@react-navigation/native"
import { styles } from "../../styles/product/All_Product_Style"

// Define some basic colors and styles for the component
const PRIMARY_COLOR = "#4CAD73"
const TEXT_COLOR = "#333"
const LIGHT_TEXT_COLOR = "#666"
const BORDER_COLOR = "#E0E0E0"
const BACKGROUND_COLOR = "#F8F8F8"
const WHOLESALE_COLOR = "#F59E0B"

const AllProduct = ({ userType = "normal" }) => {
  const navigation = useNavigation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastVisible, setLastVisible] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [allProductsLoaded, setAllProductsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("products") // 'products' or 'wholesale'
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Category options
  const categoryOptions = [
    { label: "All", value: "All" },
    { label: "Snacks", value: "Snacks" },
    { label: "Cigarette", value: "Cigarette" },
    { label: "Juice", value: "Juice" },
    { label: "Daily Essentials", value: "Daily Essentials" },
    { label: "Personal Care", value: "Personal Care" },
  ]

  const route = useRoute()

  const app = getApp()
  const db = getFirestore(app)
  const PRODUCTS_PER_PAGE = 20

  // Get price based on user type
  const getPrice = (item) => {
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

  const fetchProducts = useCallback(
    async (isInitialLoad = true) => {
      if (isInitialLoad) {
        setLoading(true)
        setProducts([])
        setLastVisible(null)
        setAllProductsLoaded(false)
      } else if (loadingMore || allProductsLoaded) {
        return
      }

      setLoadingMore(true)

      try {
        let productsQuery = collection(db, "products")

        // Try to order by createdAt, but fallback if it doesn't exist
        try {
          productsQuery = query(productsQuery, orderBy("createdAt", "desc"), limit(PRODUCTS_PER_PAGE))
        } catch (orderError) {
          console.log("createdAt field not found, ordering by document ID instead")
          productsQuery = query(productsQuery, limit(PRODUCTS_PER_PAGE))
        }

        if (lastVisible && !isInitialLoad) {
          productsQuery = query(productsQuery, startAfter(lastVisible))
        }

        const documentSnapshots = await getDocs(productsQuery)
        const newProducts = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Filter products based on active tab
        const filteredProducts = newProducts.filter((product) => {
          const isActive = product.isActive === true || product.status === "Active"
          if (!isActive) return false

          if (activeTab === "wholesale") {
            return product.isWholesaleProduct === true
          } else {
            return !product.isWholesaleProduct
          }
        })

        console.log(`Fetched ${newProducts.length} products, ${filteredProducts.length} filtered for ${activeTab}`)

        if (newProducts.length < PRODUCTS_PER_PAGE) {
          setAllProductsLoaded(true)
        }

        setProducts((prevProducts) => (isInitialLoad ? filteredProducts : [...prevProducts, ...filteredProducts]))

        if (documentSnapshots.docs.length > 0) {
          setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        Alert.alert("Error", "Failed to fetch products. Please try again.")
      } finally {
        setLoading(false)
        setLoadingMore(false)
        setIsRefreshing(false)
      }
    },
    [db, lastVisible, loadingMore, allProductsLoaded, activeTab],
  )

  useEffect(() => {
    fetchProducts(true)
  }, [activeTab])

  // Handle route parameters for category selection
  useEffect(() => {
    if (route.params?.category && route.params.category !== selectedCategory) {
      setSelectedCategory(route.params.category)
    }
  }, [route.params?.category])

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab)
      setSearchQuery("") // Clear search when switching tabs
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && !allProductsLoaded) {
      fetchProducts(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchProducts(true)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategoryDropdown(false)
  }

  // Filter products based on search query and category with better error handling
  const filteredProducts = products.filter((product) => {
    if (!searchQuery && selectedCategory === "All") return true

    const searchLower = searchQuery.toLowerCase()
    const name = product.name ? product.name.toLowerCase() : ""
    const category = product.category ? product.category.toLowerCase() : ""
    const description = product.description ? product.description.toLowerCase() : ""

    const matchesSearch =
      !searchQuery || name.includes(searchLower) || category.includes(searchLower) || description.includes(searchLower)
    const matchesCategory = selectedCategory === "All" || (product.category && product.category === selectedCategory)

    return matchesSearch && matchesCategory
  })

  const renderProductItem = ({ item }) => {
    const displayPrice = getPrice(item)

    return (
      <TouchableOpacity
        style={[styles.productCard, activeTab === "wholesale" && styles.wholesaleProductCard]}
        onPress={() => navigation.navigate("ProductDetailsScreen", { productDetails: { ...item, displayPrice } })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }} style={styles.productImage} />
          {activeTab === "wholesale" && (
            <View style={styles.wholesaleBadge}>
              <Ionicons name="business" size={wp("3%")} color="#FFFFFF" />
              <Text style={styles.wholesaleBadgeText}>Wholesale</Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name || "No Name"}
          </Text>
          <View style={styles.priceContainer}>

           {item?.mrpPrice != null && Number(item.mrpPrice) > 0 && (
            <Text style={styles.mrpPrice}>
              MRP : <Text style={{
                color: "#888",
                textDecorationLine: "line-through",
              }}>₹{Number(item.mrpPrice).toFixed(2)}</Text>
            </Text>
          )}
            <Text style={styles.productPrice}>₹{displayPrice?.toFixed(2) || "0.00"}</Text>
            {item.originalPrice && item.originalPrice > displayPrice && (
              <Text style={styles.productOriginalPrice}>₹{item.originalPrice.toFixed(2)}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderFooter = () => {
    if (!loadingMore) return null
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    )
  }

  const renderEmptyState = () => {
    if (loading) return null
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons
          name={activeTab === "wholesale" ? "business-outline" : "cube-outline"}
          size={wp("15%")}
          color={LIGHT_TEXT_COLOR}
          style={{ opacity: 0.5 }}
        />
        <Text style={styles.emptyStateText}>
          {activeTab === "wholesale" ? "No wholesale products found." : "No products found."}
          {selectedCategory !== "All" && ` in ${selectedCategory} category.`}
        </Text>
        {searchQuery !== "" && <Text style={styles.emptyStateSubText}>Try adjusting your search or filters.</Text>}
        {products.length === 0 && !searchQuery && (
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts(true)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  const renderTabButton = (tab, title, icon) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => handleTabChange(tab)}
    >
      <Ionicons
        name={icon}
        size={wp("4.5%")}
        color={activeTab === tab ? "#FFFFFF" : LIGHT_TEXT_COLOR}
        style={styles.tabIcon}
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>{title}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
          <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>All Products</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton("products", "Products", "cube-outline")}
        {renderTabButton("wholesale", "Wholesale", "business-outline")}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={wp("5%")} color={LIGHT_TEXT_COLOR} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab === "wholesale" ? "wholesale " : ""}products...`}
          placeholderTextColor={LIGHT_TEXT_COLOR}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.categoryFilterContainer}>
          <Ionicons name="filter-outline" size={wp("4.5%")} color="#6B7280" style={styles.filterIcon} />
          <TouchableOpacity
            style={styles.categoryDropdown}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.categoryDropdownText}>{selectedCategory}</Text>
            <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={wp("4%")} color="#9CA3AF" />
          </TouchableOpacity>
          {showCategoryDropdown && (
            <View style={styles.categoryDropdownMenu}>
              {categoryOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.categoryDropdownOption,
                    selectedCategory === option.value && styles.categoryDropdownOptionSelected,
                  ]}
                  onPress={() => handleCategorySelect(option.value)}
                >
                  <Text
                    style={[
                      styles.categoryDropdownOptionText,
                      selectedCategory === option.value && styles.categoryDropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedCategory === option.value && <Ionicons name="checkmark" size={wp("4%")} color="#4CAD73" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Fetching {activeTab === "wholesale" ? "wholesale " : ""}products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}


    </SafeAreaView>
  )
}

export default AllProduct




