"use client"
import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator, Modal } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import Icon from "react-native-vector-icons/Ionicons"
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import { styles } from "../../styles/admin_style/Admin_style"
import ProductAddModal from "./ProductAddModal"

const BASE_CATEGORIES = [
  { label: "All", value: "All" },
  { label: "Snacks", value: "Snacks" },
  { label: "Cigarette", value: "Cigarette" },
  { label: "Juice", value: "Juice" },
  { label: "Daily Essentials", value: "Daily Essentials" },
  { label: "Personal Care", value: "Personal Care" },
]

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showProductModal, setShowProductModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [customCategories, setCustomCategories] = useState([])
  const [newCategoryInput, setNewCategoryInput] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)

  const categoryOptions = [
    ...BASE_CATEGORIES,
    ...customCategories.map((c) => ({ label: c, value: c })),
  ]

  const firestore = getFirestore(getApp())

  useEffect(() => {
    fetchProducts()
    fetchCustomCategories()
  }, [])

  const fetchCustomCategories = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "categories"))
      const cats = snapshot.docs.map((d) => d.data().name).filter(Boolean)
      setCustomCategories(cats)
    } catch (error) {
      console.log("No custom categories found:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const productsCollection = collection(firestore, "products")
      const productsSnapshot = await getDocs(productsCollection)
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      Alert.alert("Error", "Failed to fetch products")
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleCreateCategory = async () => {
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return
    if (categoryOptions.find((o) => o.value.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Error", "This category already exists")
      return
    }
    try {
      await setDoc(doc(firestore, "categories", trimmed), { name: trimmed, createdAt: new Date() })
      setCustomCategories((prev) => [...prev, trimmed])
      setSelectedCategory(trimmed)
      setNewCategoryInput("")
      setShowNewCategoryInput(false)
      setShowCategoryDropdown(false)
    } catch (error) {
      console.error("Error saving category:", error)
      Alert.alert("Error", "Failed to save category")
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsEditMode(true)
    setShowActionsModal(false)
    setShowProductModal(true)
  }

  const handleDeleteProduct = (product) => {
    Alert.alert("Delete Product", `Are you sure you want to delete "${product.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(firestore, "products", product.id))
            fetchProducts()
            Alert.alert("Success", "Product deleted successfully!")
          } catch (error) {
            console.error("Error deleting product:", error)
            Alert.alert("Error", "Failed to delete product")
          }
          setShowActionsModal(false)
        },
      },
    ])
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsEditMode(false)
    setShowProductModal(true)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowCategoryDropdown(false)
    setShowNewCategoryInput(false)
    setNewCategoryInput("")
  }

  const getProductStatusColor = (status) => {
    switch (status) {
      case "Active": return { backgroundColor: "#D1FAE5" }
      case "Low Stock": return { backgroundColor: "#FEF3C7" }
      case "Out of Stock": return { backgroundColor: "#FEE2E2" }
      case "Inactive": return { backgroundColor: "#F3F4F6" }
      default: return { backgroundColor: "#F3F4F6" }
    }
  }

  const getProductStatusTextColor = (status) => {
    switch (status) {
      case "Active": return { color: "#065F46" }
      case "Low Stock": return { color: "#92400E" }
      case "Out of Stock": return { color: "#991B1B" }
      case "Inactive": return { color: "#374151" }
      default: return { color: "#374151" }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || (product.category && product.category === selectedCategory)
    return matchesSearch && matchesCategory
  })

  const renderProductItem = ({ item }) => {
    const isFirebaseProduct = typeof item.id === "string" && item.id.length > 10
    const displayPrice = item.normalPrice || item.price || 0
    const mrpPrice = item.mrpPrice || item.mrp || 0

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <View style={styles.productIcon}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={{ width: wp("12%"), height: wp("12%"), borderRadius: 8 }} />
            ) : (
              <Icon name="cube-outline" size={wp("6%")} color="#6B7280" />
            )}
          </View>

          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category || "General"}</Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {mrpPrice > 0 && (
                <Text style={{ fontSize: wp("3.5%"), color: "#9CA3AF", textDecorationLine: "line-through", marginRight: wp("2%") }}>
                  ₹{typeof mrpPrice === "number" ? mrpPrice.toFixed(2) : mrpPrice}
                </Text>
              )}
              <Text style={styles.productPrice}>
                ₹{typeof displayPrice === "number" ? displayPrice.toFixed(2) : displayPrice}
              </Text>
            </View>

            {item.isWholesaleProduct && (
              <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: wp("2%"), paddingVertical: hp("0.5%"), borderRadius: wp("1%"), marginTop: hp("0.5%") }}>
                <Text style={{ fontSize: wp("3%"), color: "#92400E", fontWeight: "500" }}>Wholesale Only</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.productActions}>
          <Text style={styles.productStock}>Stock: {item.quantity || item.stock}</Text>
          <View style={[styles.statusBadge, getProductStatusColor(item.status)]}>
            <Text style={[styles.statusText, getProductStatusTextColor(item.status)]}>{item.status}</Text>
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (isFirebaseProduct) {
                setSelectedProduct(item)
                setShowActionsModal(true)
              }
            }}
          >
            <Icon name="ellipsis-vertical" size={wp("4%")} color={isFirebaseProduct ? "#6B7280" : "#D1D5DB"} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.contentContainer}>
        <View style={styles.contentHeaderRow}>
          <View>
            <Text style={styles.contentTitle}>Products</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Icon name="add" size={wp("5%")} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search-outline" size={wp("5%")} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Filter */}
      <View style={adminStyles.filterContainer}>
        <View style={adminStyles.categoryFilterContainer}>
          <Icon name="filter-outline" size={wp("4.5%")} color="#6B7280" style={adminStyles.filterIcon} />
          <TouchableOpacity
            style={adminStyles.categoryDropdown}
            onPress={() => {
              setShowCategoryDropdown(!showCategoryDropdown)
              setShowNewCategoryInput(false)
              setNewCategoryInput("")
            }}
          >
            <Text style={adminStyles.categoryDropdownText}>{selectedCategory}</Text>
            <Icon name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={wp("4%")} color="#9CA3AF" />
          </TouchableOpacity>

          {showCategoryDropdown && (
            <View style={adminStyles.categoryDropdownMenu}>
              {categoryOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    adminStyles.categoryDropdownOption,
                    selectedCategory === option.value && adminStyles.categoryDropdownOptionSelected,
                  ]}
                  onPress={() => handleCategorySelect(option.value)}
                >
                  <Text
                    style={[
                      adminStyles.categoryDropdownOptionText,
                      selectedCategory === option.value && adminStyles.categoryDropdownOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selectedCategory === option.value && <Icon name="checkmark" size={wp("4%")} color="#3B82F6" />}
                </TouchableOpacity>
              ))}

              {/* Create Category Row */}
              <View style={adminStyles.createCategoryRow}>
                {!showNewCategoryInput ? (
                  <TouchableOpacity
                    style={adminStyles.createCategoryTrigger}
                    onPress={() => setShowNewCategoryInput(true)}
                  >
                    <View style={adminStyles.createCategoryIconWrap}>
                      <Icon name="add" size={wp("3.5%")} color="#3B82F6" />
                    </View>
                    <Text style={adminStyles.createCategoryLabel}>Create category</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={adminStyles.createCategoryInputRow}>
                    <TextInput
                      style={adminStyles.createCategoryInput}
                      placeholder="New category name"
                      placeholderTextColor="#9CA3AF"
                      value={newCategoryInput}
                      onChangeText={setNewCategoryInput}
                      autoFocus
                    />
                    <TouchableOpacity style={adminStyles.createCategoryAddBtn} onPress={handleCreateCategory}>
                      <Text style={adminStyles.createCategoryAddBtnText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={adminStyles.createCategoryCancelBtn}
                      onPress={() => {
                        setShowNewCategoryInput(false)
                        setNewCategoryInput("")
                      }}
                    >
                      <Icon name="close" size={wp("4%")} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <Text style={adminStyles.productCount}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </Text>
      </View>

      {/* Products List */}
      {loadingProducts ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50 }}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50 }}>
              <Icon name="cube-outline" size={wp("15%")} color="#9CA3AF" style={{ opacity: 0.5 }} />
              <Text style={{ color: "#6B7280", fontSize: wp("4%"), fontWeight: "600", marginTop: hp("2%") }}>
                No products found
              </Text>
              <Text style={{ color: "#9CA3AF", fontSize: wp("3.5%"), marginTop: hp("1%"), textAlign: "center" }}>
                {selectedCategory !== "All"
                  ? `No products found in "${selectedCategory}" category`
                  : "Try adjusting your search or filters"}
              </Text>
            </View>
          }
        />
      )}

      {/* Product Actions Modal */}
      <Modal
        visible={showActionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionsModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionsModal(false)}>
          <View style={{ backgroundColor: "#fff", padding: hp(3), borderRadius: hp(2) }}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", paddingBottom: hp(2) }}
              onPress={() => handleEditProduct(selectedProduct)}
            >
              <Icon name="create-outline" size={wp("5%")} color="#3B82F6" />
              <Text style={{ marginLeft: hp(1.5) }}>Edit Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB", flexDirection: "row", alignItems: "center", paddingTop: hp(2) }}
              onPress={() => handleDeleteProduct(selectedProduct)}
            >
              <Icon name="trash-outline" size={wp("5%")} color="#EF4444" />
              <Text style={[styles.actionOptionText, { color: "#EF4444" }]}>Delete Product</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Product Add/Edit Modal */}
      <ProductAddModal
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        selectedProduct={selectedProduct}
        isEditMode={isEditMode}
        onProductSaved={() => {
          fetchProducts()
          fetchCustomCategories()
        }}
      />
    </View>
  )
}

const adminStyles = {
  filterContainer: {
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    zIndex: 1000,
  },
  categoryFilterContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: hp("1%"),
    zIndex: 1000,
  },
  filterIcon: {
    marginRight: wp("2%"),
  },
  categoryDropdown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryDropdownText: {
    fontSize: wp("4%"),
    color: "#374151",
    fontWeight: "500",
  },
  categoryDropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: wp("2%"),
    elevation: 8,
    zIndex: 1000,
    marginTop: hp("0.5%"),
  },
  categoryDropdownOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryDropdownOptionSelected: {
    backgroundColor: "#EBF8FF",
  },
  categoryDropdownOptionText: {
    fontSize: wp("4%"),
    color: "#374151",
  },
  categoryDropdownOptionTextSelected: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  productCount: {
    fontSize: wp("3.5%"),
    color: "#6B7280",
    fontWeight: "500",
  },
  // Create category styles
  createCategoryRow: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
  },
  createCategoryTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  createCategoryIconWrap: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    backgroundColor: "#EBF8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  createCategoryLabel: {
    fontSize: wp("4%"),
    color: "#3B82F6",
    fontWeight: "500",
  },
  createCategoryInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  createCategoryInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    fontSize: wp("3.5%"),
    color: "#374151",
    backgroundColor: "#FFFFFF",
  },
  createCategoryAddBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
  },
  createCategoryAddBtnText: {
    color: "#FFFFFF",
    fontSize: wp("3.5%"),
    fontWeight: "500",
  },
  createCategoryCancelBtn: {
    padding: wp("1%"),
  },
}

export default AdminProducts