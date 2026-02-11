"use client"
import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Switch,
} from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import Icon from "react-native-vector-icons/Ionicons"
import { launchImageLibrary } from "react-native-image-picker"
import { getFirestore, collection, addDoc, doc, updateDoc } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import { infoAlert } from "../ToastServices"
import { styles } from "../../styles/admin_style/Admin_style"

const CLOUDINARY_CLOUD_NAME = "dnzxttpjy";
const CLOUDINARY_UPLOAD_PRESET = "mariammal_store"

const ProductAddModal = ({ visible, onClose, selectedProduct, isEditMode, onProductSaved }) => {
  const [uploading, setUploading] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Status options for dropdown
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Out of Stock", value: "Out of Stock" },
    { label: "Low Stock", value: "Low Stock" },
    { label: "Inactive", value: "Inactive" },
  ]

  // Category options
  const categoryOptions = [
    { label: "Snacks", value: "Snacks" },
    { label: "Cigarette", value: "Cigarette" },
    { label: "Juice", value: "Juice" },
    { label: "Daily Essentials", value: "Daily Essentials" },
    { label: "Personal Care", value: "Personal Care" },
  ]

  // Product form state with multiple prices and category
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    normalPrice: "",
    retailPrice: "",
    wholesalePrice: "",
    quantity: "",
    description: "",
    imageUrl: "",
    status: "Active",
    isWholesaleProduct: false,
  })

  const firestore = getFirestore(getApp())

  // Initialize form when modal opens or product changes
  React.useEffect(() => {
    if (visible) {
      if (isEditMode && selectedProduct) {
        setProductForm({
          name: selectedProduct.name || "",
          category: selectedProduct.category || "",
          normalPrice: selectedProduct.normalPrice?.toString() || selectedProduct.price?.toString() || "",
          retailPrice: selectedProduct.retailPrice?.toString() || "",
          wholesalePrice: selectedProduct.wholesalePrice?.toString() || "",
          quantity: selectedProduct.quantity?.toString() || "",
          description: selectedProduct.description || "",
          imageUrl: selectedProduct.imageUrl || "",
          status: selectedProduct.status || "Active",
          isWholesaleProduct: selectedProduct.isWholesaleProduct || false,
        })
      } else {
        resetProductForm()
      }
    }
  }, [visible, isEditMode, selectedProduct])

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "",
      normalPrice: "",
      retailPrice: "",
      wholesalePrice: "",
      quantity: "",
      description: "",
      imageUrl: "",
      status: "Active",
      isWholesaleProduct: false,
    })
    setShowStatusDropdown(false)
    setShowCategoryDropdown(false)
  }

  const selectProductImage = () => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    }

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.error) {
        return
      }
      if (response.assets && response.assets[0]) {
        uploadProductImageToCloudinary(response.assets[0])
      }
    })
  }

  const uploadProductImageToCloudinary = async (imageAsset) => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", {
        uri: imageAsset.uri,
        type: imageAsset.type,
        name: imageAsset.fileName || "product.jpg",
      })
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const data = await response.json()
      if (data.secure_url) {
        setProductForm((prev) => ({
          ...prev,
          imageUrl: data.secure_url,
        }))
        Alert.alert("Success", "Product image uploaded successfully!")
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading product image:", error)
      Alert.alert("Error", "Failed to upload product image")
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    if (!productForm.name.trim()) {
      infoAlert({ message: "Product name is required." });
  
      return false
    }
    if (!productForm.category.trim()) {
      Alert.alert("Error", "Product category is required")
      return false
    }
    if (!productForm.normalPrice.trim()) {
      Alert.alert("Error", "Normal user price is required")
      return false
    }
    if (!productForm.retailPrice.trim()) {
      Alert.alert("Error", "Retail user price is required")
      return false
    }
    if (!productForm.wholesalePrice.trim()) {
      Alert.alert("Error", "Wholesale user price is required")
      return false
    }
    if (!productForm.quantity.trim()) {
      Alert.alert("Error", "Product quantity is required")
      return false
    }
    if (!productForm.description.trim()) {
      Alert.alert("Error", "Product description is required")
      return false
    }
    if (!productForm.imageUrl) {
      Alert.alert("Error", "Product image is required")
      return false
    }
    return true
  }

  const saveProductToFirebase = async () => {
    if (!validateForm()) return

    try {
      setUploading(true)
      const productData = {
        name: productForm.name.trim(),
        category: productForm.category.trim(),
        normalPrice: Number.parseFloat(productForm.normalPrice),
        retailPrice: Number.parseFloat(productForm.retailPrice),
        wholesalePrice: Number.parseFloat(productForm.wholesalePrice),
        // Keep backward compatibility with existing price field
        price: Number.parseFloat(productForm.normalPrice),
        quantity: Number.parseInt(productForm.quantity),
        description: productForm.description.trim(),
        imageUrl: productForm.imageUrl,
        updatedAt: new Date(),
        status: productForm.status,
        isActive: productForm.status === "Active",
        isWholesaleProduct: productForm.isWholesaleProduct,
      }

      if (isEditMode && selectedProduct) {
        // Update existing product
        const productRef = doc(firestore, "products", selectedProduct.id)
        await updateDoc(productRef, productData)
        Alert.alert("Success", "Product updated successfully!")
      } else {
        // Add new product
        const productsCollection = collection(firestore, "products")
        productData.createdAt = new Date()
        await addDoc(productsCollection, productData)
        Alert.alert("Success", "Product added successfully!")
      }

      // Callback to refresh products list
      if (onProductSaved) {
        onProductSaved()
      }

      // Close modal and reset form
      onClose()
      resetProductForm()
    } catch (error) {
      console.error("Error saving product to Firebase:", error)
      Alert.alert("Error", "Failed to save product")
    } finally {
      setUploading(false)
    }
  }

  const handleStatusSelect = (status) => {
    setProductForm((prev) => ({ ...prev, status }))
    setShowStatusDropdown(false)
  }

  const handleCategorySelect = (category) => {
    setProductForm((prev) => ({ ...prev, category }))
    setShowCategoryDropdown(false)
  }

  const handleClose = () => {
    onClose()
    resetProductForm()
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Fixed Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>{isEditMode ? "Edit Product" : "Add New Product"}</Text>
            <TouchableOpacity onPress={handleClose} style={modalStyles.closeButton}>
              <Icon name="close" size={wp("6%")} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={modalStyles.scrollContainer}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Product Image Upload */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Product Image *</Text>
              <TouchableOpacity
                style={[styles.imageUploadContainer, productForm.imageUrl && styles.imageUploadContainerWithImage]}
                onPress={selectProductImage}
                disabled={uploading}
              >
                {productForm.imageUrl ? (
                  <Image source={{ uri: productForm.imageUrl }} style={styles.uploadedImage} />
                ) : (
                  <>
                    {uploading ? (
                      <ActivityIndicator size="large" color="#3B82F6" />
                    ) : (
                      <>
                        <Icon name="camera-outline" size={wp("8%")} color="#9CA3AF" />
                        <Text style={styles.imageUploadText}>Tap to select image</Text>
                      </>
                    )}
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Product Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Product Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter product name"
                placeholderTextColor="#9CA3AF"
                value={productForm.name}
                onChangeText={(text) => setProductForm((prev) => ({ ...prev, name: text }))}
              />
            </View>

            {/* Category Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category *</Text>
              <TouchableOpacity
                style={[styles.formInput, { flexDirection: "row", justifyContent: "space-between" }]}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text style={[{ color: productForm.category ? "#374151" : "#9CA3AF" }]}>
                  {productForm.category || "Select category"}
                </Text>
                <Icon name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={wp("4%")} color="#9CA3AF" />
              </TouchableOpacity>
              {showCategoryDropdown && (
                <View style={styles.dropdownMenu}>
                  {categoryOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownOption,
                        productForm.category === option.value && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => handleCategorySelect(option.value)}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          productForm.category === option.value && styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {productForm.category === option.value && (
                        <Icon name="checkmark" size={wp("4%")} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Price Fields */}
            <View style={modalStyles.priceSection}>
              <Text style={modalStyles.sectionTitle}>Pricing for Different User Types</Text>

              {/* Normal User Price */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Normal User Price (₹) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="000"
                  placeholderTextColor="#9CA3AF"
                  value={productForm.normalPrice}
                  onChangeText={(text) => setProductForm((prev) => ({ ...prev, normalPrice: text }))}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Retail User Price */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Retail User Price (₹) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="000"
                  placeholderTextColor="#9CA3AF"
                  value={productForm.retailPrice}
                  onChangeText={(text) => setProductForm((prev) => ({ ...prev, retailPrice: text }))}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Wholesale User Price */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Wholesale User Price (₹) *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="000"
                  placeholderTextColor="#9CA3AF"
                  value={productForm.wholesalePrice}
                  onChangeText={(text) => setProductForm((prev) => ({ ...prev, wholesalePrice: text }))}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Wholesale Product Toggle */}
            <View style={modalStyles.wholesaleSection}>
              <View style={modalStyles.switchContainer}>
                <View style={modalStyles.switchLabelContainer}>
                  <Text style={modalStyles.switchLabel}>Wholesale Product</Text>
                  <Text style={modalStyles.switchDescription}>
                    Enable if this product is only available for wholesale users
                  </Text>
                </View>
                <Switch
                  value={productForm.isWholesaleProduct}
                  onValueChange={(value) => setProductForm((prev) => ({ ...prev, isWholesaleProduct: value }))}
                  trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                  thumbColor={productForm.isWholesaleProduct ? "#FFFFFF" : "#FFFFFF"}
                />
              </View>
            </View>

            {/* Quantity */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Quantity *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={productForm.quantity}
                onChangeText={(text) => setProductForm((prev) => ({ ...prev, quantity: text }))}
                keyboardType="numeric"
              />
            </View>

            {/* Status Dropdown */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Status *</Text>
              <TouchableOpacity
                style={[styles.formInput, { flexDirection: "row", justifyContent: "space-between" }]}
                onPress={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                <Text style={[{ color: productForm.status ? "#374151" : "#9CA3AF" }]}>
                  {productForm.status || "Select status"}
                </Text>
                <Icon name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={wp("4%")} color="#9CA3AF" />
              </TouchableOpacity>
              {showStatusDropdown && (
                <View style={styles.dropdownMenu}>
                  {statusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownOption,
                        productForm.status === option.value && styles.dropdownOptionSelected,
                      ]}
                      onPress={() => handleStatusSelect(option.value)}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          productForm.status === option.value && styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {productForm.status === option.value && <Icon name="checkmark" size={wp("4%")} color="#3B82F6" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter product description"
                placeholderTextColor="#9CA3AF"
                value={productForm.description}
                onChangeText={(text) => setProductForm((prev) => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Fixed Save Button */}
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.saveButton, uploading && modalStyles.saveButtonDisabled]}
              onPress={saveProductToFirebase}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="checkmark" size={wp("5%")} color="#FFFFFF" />
                  <Text style={modalStyles.saveButtonText}>{isEditMode ? "Update Product" : "Save Product"}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp("4%"),
    width: wp("90%"),
    maxHeight: hp("90%"),
    padding: wp("5%"),
    paddingBottom: wp("3%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#374151",
  },
  closeButton: {
    padding: wp("2%"),
  },
  scrollContainer: {
    marginBottom: hp("2%"),
  },
  scrollContent: {
    paddingBottom: hp("2%"),
  },
  priceSection: {
    backgroundColor: "#F9FAFB",
    padding: wp("4%"),
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp("2%"),
  },
  wholesaleSection: {
    backgroundColor: "#FEF3C7",
    padding: wp("4%"),
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: wp("4%"),
  },
  switchLabel: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp("0.5%"),
  },
  switchDescription: {
    fontSize: wp("3.5%"),
    color: "#6B7280",
  },
  buttonContainer: {
    paddingTop: hp("2%"),
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    gap: wp("2%"),
  },
  saveButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
}

export default ProductAddModal
