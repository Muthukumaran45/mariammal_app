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

const CLOUDINARY_CLOUD_NAME = "dnzxttpjy"
const CLOUDINARY_UPLOAD_PRESET = "mariammal_store"

const ProductAddModal = ({ visible, onClose, selectedProduct, isEditMode, onProductSaved }) => {
  const [uploading, setUploading] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const firestore = getFirestore(getApp())

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    mrpPrice: "",
    normalPrice: "",
    retailPrice: "",
    wholesalePrice: "",
    quantity: "",
    description: "",
    imageUrl: "",
    status: "Active",
    isWholesaleProduct: false,
  })

  React.useEffect(() => {
    if (visible) {
      if (isEditMode && selectedProduct) {
        setProductForm({
          name: selectedProduct.name || "",
          category: selectedProduct.category || "",
          mrpPrice: selectedProduct.mrpPrice?.toString() || "",
          normalPrice:
            selectedProduct.normalPrice?.toString() ||
            selectedProduct.price?.toString() ||
            "",
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
      mrpPrice: "",
      normalPrice: "",
      retailPrice: "",
      wholesalePrice: "",
      quantity: "",
      description: "",
      imageUrl: "",
      status: "Active",
      isWholesaleProduct: false,
    })
  }

  const validateForm = () => {
    if (!productForm.name.trim()) {
      infoAlert({ message: "Product name is required." })
      return false
    }

    if (!productForm.category.trim()) {
      Alert.alert("Error", "Product category is required")
      return false
    }

    if (!productForm.mrpPrice.trim()) {
      Alert.alert("Error", "MRP price is required")
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

        mrpPrice: Number(productForm.mrpPrice),

        normalPrice: Number(productForm.normalPrice),
        retailPrice: Number(productForm.retailPrice),
        wholesalePrice: Number(productForm.wholesalePrice),

        price: Number(productForm.normalPrice),

        quantity: Number(productForm.quantity),
        description: productForm.description.trim(),
        imageUrl: productForm.imageUrl,

        status: productForm.status,
        isActive: productForm.status === "Active",
        isWholesaleProduct: productForm.isWholesaleProduct,

        updatedAt: new Date(),
      }

      if (isEditMode && selectedProduct) {
        const productRef = doc(firestore, "products", selectedProduct.id)

        await updateDoc(productRef, productData)

        Alert.alert("Success", "Product updated successfully!")
      } else {
        const productsCollection = collection(firestore, "products")

        productData.createdAt = new Date()

        await addDoc(productsCollection, productData)

        Alert.alert("Success", "Product added successfully!")
      }

      if (onProductSaved) {
        onProductSaved()
      }

      onClose()
      resetProductForm()
    } catch (error) {
      console.error("Error saving product:", error)
      Alert.alert("Error", "Failed to save product")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>
              {isEditMode ? "Edit Product" : "Add Product"}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={wp("6%")} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView>

            {/* MRP PRICE */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                MRP Price (₹) *
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="Enter MRP price"
                keyboardType="decimal-pad"
                value={productForm.mrpPrice}
                onChangeText={(text) =>
                  setProductForm((prev) => ({
                    ...prev,
                    mrpPrice: text,
                  }))
                }
              />
            </View>

            {/* NORMAL PRICE */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Normal User Price (₹) *
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="000"
                keyboardType="decimal-pad"
                value={productForm.normalPrice}
                onChangeText={(text) =>
                  setProductForm((prev) => ({
                    ...prev,
                    normalPrice: text,
                  }))
                }
              />
            </View>

            {/* RETAIL PRICE */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Retail User Price (₹) *
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="000"
                keyboardType="decimal-pad"
                value={productForm.retailPrice}
                onChangeText={(text) =>
                  setProductForm((prev) => ({
                    ...prev,
                    retailPrice: text,
                  }))
                }
              />
            </View>

            {/* WHOLESALE PRICE */}

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Wholesale User Price (₹) *
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="000"
                keyboardType="decimal-pad"
                value={productForm.wholesalePrice}
                onChangeText={(text) =>
                  setProductForm((prev) => ({
                    ...prev,
                    wholesalePrice: text,
                  }))
                }
              />
            </View>

          </ScrollView>

          <TouchableOpacity
            style={modalStyles.saveButton}
            onPress={saveProductToFirebase}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={modalStyles.saveButtonText}>
                {isEditMode ? "Update Product" : "Save Product"}
              </Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  )
}

const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp("90%"),
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
}

export default ProductAddModal