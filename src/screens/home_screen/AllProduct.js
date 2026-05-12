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

// ✅ Dynamic categories hook – reads from the same Firestore 'categories'
//    collection that AdminProducts / ProductAddModal write to.
import useCategories from "../../stores/Usecategories"

const PRIMARY_COLOR   = "#4CAD73"
const LIGHT_TEXT_COLOR = "#666"

const AllProduct = ({ userType = "normal" }) => {
  const navigation = useNavigation()
  const route      = useRoute()

  const [products,          setProducts]          = useState([])
  const [loading,           setLoading]           = useState(true)
  const [loadingMore,       setLoadingMore]       = useState(false)
  const [lastVisible,       setLastVisible]       = useState(null)
  const [searchQuery,       setSearchQuery]       = useState("")
  const [isRefreshing,      setIsRefreshing]      = useState(false)
  const [allProductsLoaded, setAllProductsLoaded] = useState(false)
  const [activeTab,         setActiveTab]         = useState("products")
  const [selectedCategory,  setSelectedCategory]  = useState("All")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // ✅ Dynamic category list – updates in real-time when admin adds a category
  const { categoryOptions } = useCategories()

  const app = getApp()
  const db  = getFirestore(app)
  const PRODUCTS_PER_PAGE = 20

  // ── Price helper ────────────────────────────────────────────────────────────
  const getPrice = (item) => {
    switch (userType) {
      case "retail_user":    return item?.retailPrice    || item?.price || 0
      case "wholesale_user": return item?.wholesalePrice || item?.price || 0
      default:               return item?.normalPrice    || item?.price || 0
    }
  }

  // ── Fetch products ──────────────────────────────────────────────────────────
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

        try {
          productsQuery = query(productsQuery, orderBy("createdAt", "desc"), limit(PRODUCTS_PER_PAGE))
        } catch {
          productsQuery = query(productsQuery, limit(PRODUCTS_PER_PAGE))
        }

        if (lastVisible && !isInitialLoad) {
          productsQuery = query(productsQuery, startAfter(lastVisible))
        }

        const snapshot    = await getDocs(productsQuery)
        const newProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        const filtered = newProducts.filter((p) => {
          const isActive = p.isActive === true || p.status === "Active"
          if (!isActive) return false
          return activeTab === "wholesale" ? p.isWholesaleProduct === true : !p.isWholesaleProduct
        })

        if (newProducts.length < PRODUCTS_PER_PAGE) setAllProductsLoaded(true)

        setProducts((prev) => (isInitialLoad ? filtered : [...prev, ...filtered]))

        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1])
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

  useEffect(() => { fetchProducts(true) }, [activeTab])

  // Handle route param category pre-selection
  useEffect(() => {
    if (route.params?.category && route.params.category !== selectedCategory) {
      setSelectedCategory(route.params.category)
    }
  }, [route.params?.category])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleTabChange     = (tab) => { if (tab !== activeTab) { setActiveTab(tab); setSearchQuery("") } }
  const handleLoadMore      = ()    => { if (!loadingMore && !allProductsLoaded) fetchProducts(false) }
  const handleRefresh       = ()    => { setIsRefreshing(true); fetchProducts(true) }
  const handleCategorySelect = (cat) => { setSelectedCategory(cat); setShowCategoryDropdown(false) }

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    if (!searchQuery && selectedCategory === "All") return true

    const q    = searchQuery.toLowerCase()
    const name = (p.name        || "").toLowerCase()
    const cat  = (p.category    || "").toLowerCase()
    const desc = (p.description || "").toLowerCase()

    const matchesSearch   = !searchQuery || name.includes(q) || cat.includes(q) || desc.includes(q)
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // ── Renderers ───────────────────────────────────────────────────────────────
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
          <Text style={styles.productName} numberOfLines={2}>{item.name || "No Name"}</Text>
          <View style={styles.priceContainer}>
            {item?.mrpPrice != null && Number(item.mrpPrice) > 0 && (
              <Text style={styles.mrpPrice}>
                MRP : <Text style={{ color: "#888", textDecorationLine: "line-through" }}>
                  ₹{Number(item.mrpPrice).toFixed(2)}
                </Text>
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

  const renderFooter = () =>
    !loadingMore ? null : (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    )

  const renderEmptyState = () => {
    if (loading) return null
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons
          name={activeTab === "wholesale" ? "business-outline" : "cube-outline"}
          size={wp("15%")} color={LIGHT_TEXT_COLOR} style={{ opacity: 0.5 }}
        />
        <Text style={styles.emptyStateText}>
          {activeTab === "wholesale" ? "No wholesale products found." : "No products found."}
          {selectedCategory !== "All" && ` in ${selectedCategory} category.`}
        </Text>
        {searchQuery !== "" && (
          <Text style={styles.emptyStateSubText}>Try adjusting your search or filters.</Text>
        )}
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
        name={icon} size={wp("4.5%")}
        color={activeTab === tab ? "#FFFFFF" : LIGHT_TEXT_COLOR}
        style={styles.tabIcon}
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>{title}</Text>
    </TouchableOpacity>
  )

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
          <Ionicons name="arrow-back" size={wp("6%")} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Products</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton("products",  "Products",  "cube-outline")}
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

      {/* ✅ Category Filter – options come from useCategories (Firestore live) */}
      <View style={styles.filterContainer}>
        <View style={styles.categoryFilterContainer}>
          <Ionicons name="filter-outline" size={wp("4.5%")} color="#6B7280" style={styles.filterIcon} />
          <TouchableOpacity
            style={styles.categoryDropdown}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.categoryDropdownText}>{selectedCategory}</Text>
            <Ionicons
              name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
              size={wp("4%")} color="#9CA3AF"
            />
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
                  <Text style={[
                    styles.categoryDropdownOptionText,
                    selectedCategory === option.value && styles.categoryDropdownOptionTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                  {selectedCategory === option.value && (
                    <Ionicons name="checkmark" size={wp("4%")} color="#4CAD73" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>
            Fetching {activeTab === "wholesale" ? "wholesale " : ""}products...
          </Text>
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