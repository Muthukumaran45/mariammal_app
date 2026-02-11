"use client"
import React, { useState } from "react"
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native"
import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore"
import { getApp } from "@react-native-firebase/app"
import Icon from "react-native-vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"

const PRIMARY_COLOR = "#4CAD73"
const TEXT_COLOR = "#333"
const LIGHT_TEXT_COLOR = "#666"
const BACKGROUND_COLOR = "#F8F8F8"

const UserDetailsModal = ({ visible, onClose, customer }) => {
  const [selectedUserType, setSelectedUserType] = useState(customer?.userType || "normal")
  const [updating, setUpdating] = useState(false)

  const app = getApp()
  const db = getFirestore(app)

  const userTypeOptions = [
    { label: "Normal", value: "normal" },
    { label: "Retail User", value: "retail_user" },
    { label: "Wholesale User", value: "wholesale_user" },
  ]

  React.useEffect(() => {
    if (customer) {
      setSelectedUserType(customer.userType || "normal")
    }
  }, [customer])

  const handleUpdateUserType = async () => {
    if (!customer) return

    try {
      setUpdating(true)
      const userDocRef = doc(db, "users", customer.id)

      await updateDoc(userDocRef, {
        userType: selectedUserType,
        updatedAt: new Date(),
      })

      Alert.alert("Success", "User type updated successfully!")
      onClose()
    } catch (error) {
      console.error("Error updating user type:", error)
      Alert.alert("Error", "Failed to update user type. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  if (!customer) return null

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Fixed Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.headerTitle}>Customer Details</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Icon name="close" size={wp("6%")} color={TEXT_COLOR} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={modalStyles.scrollContainer}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Customer Avatar */}
            <View style={modalStyles.avatarContainer}>
              <View style={modalStyles.avatar}>
                <Text style={modalStyles.avatarText}>
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <Text style={modalStyles.customerName}>{customer.name}</Text>
            </View>

            {/* Customer Information */}
            <View style={modalStyles.infoSection}>
              <View style={modalStyles.infoRow}>
                <Icon name="mail-outline" size={wp("5%")} color={PRIMARY_COLOR} />
                <View style={modalStyles.infoContent}>
                  <Text style={modalStyles.infoLabel}>Email</Text>
                  <Text style={modalStyles.infoValue}>{customer.email}</Text>
                </View>
              </View>

              <View style={modalStyles.infoRow}>
                <Icon name="call-outline" size={wp("5%")} color={PRIMARY_COLOR} />
                <View style={modalStyles.infoContent}>
                  <Text style={modalStyles.infoLabel}>Phone</Text>
                  <Text style={modalStyles.infoValue}>{customer.phone}</Text>
                </View>
              </View>

              <View style={modalStyles.infoRow}>
                <Icon name="bag-outline" size={wp("5%")} color={PRIMARY_COLOR} />
                <View style={modalStyles.infoContent}>
                  <Text style={modalStyles.infoLabel}>Total Orders</Text>
                  <Text style={modalStyles.infoValue}>{customer.totalOrders}</Text>
                </View>
              </View>

              <View style={modalStyles.infoRow}>
                <Icon name="card-outline" size={wp("5%")} color={PRIMARY_COLOR} />
                <View style={modalStyles.infoContent}>
                  <Text style={modalStyles.infoLabel}>Total Spent</Text>
                  <Text style={modalStyles.infoValue}>₹{customer.totalSpent}</Text>
                </View>
              </View>

              <View style={modalStyles.infoRow}>
                <Icon name="person-outline" size={wp("5%")} color={PRIMARY_COLOR} />
                <View style={modalStyles.infoContent}>
                  <Text style={modalStyles.infoLabel}>Status</Text>
                  <Text style={modalStyles.infoValue}>{customer.status}</Text>
                </View>
              </View>
            </View>

            {/* User Type Section */}
            <View style={modalStyles.userTypeSection}>
              <Text style={modalStyles.sectionTitle}>User Type</Text>
              <View style={modalStyles.pickerContainer}>
                <Picker
                  selectedValue={selectedUserType}
                  onValueChange={(itemValue) => setSelectedUserType(itemValue)}
                  style={modalStyles.picker}
                >
                  {userTypeOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Action Buttons */}
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={updating}>
              <Text style={modalStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.updateButton, updating && modalStyles.updateButtonDisabled]}
              onPress={handleUpdateUserType}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={modalStyles.updateButtonText}>Update</Text>
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
    maxHeight: hp("85%"),
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
    color: TEXT_COLOR,
  },
  closeButton: {
    padding: wp("2%"),
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  avatar: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  avatarText: {
    fontSize: wp("6%"),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  customerName: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: TEXT_COLOR,
  },
  infoSection: {
    marginBottom: hp("3%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoContent: {
    marginLeft: wp("4%"),
    flex: 1,
  },
  infoLabel: {
    fontSize: wp("3.5%"),
    color: LIGHT_TEXT_COLOR,
    marginBottom: hp("0.5%"),
  },
  infoValue: {
    fontSize: wp("4%"),
    fontWeight: "500",
    color: TEXT_COLOR,
  },
  userTypeSection: {
    marginBottom: hp("3%"),
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: TEXT_COLOR,
    marginBottom: hp("1%"),
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: wp("2%"),
    backgroundColor: BACKGROUND_COLOR,
  },
  picker: {
    height: hp("6%"),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("3%"),
    paddingTop: hp("2%"),
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: wp("4%"),
    color: TEXT_COLOR,
    fontWeight: "500",
  },
  updateButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    backgroundColor: PRIMARY_COLOR,
    alignItems: "center",
  },
  updateButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  updateButtonText: {
    fontSize: wp("4%"),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scrollContainer: {
    marginBottom: hp("2%"),
  },
  scrollContent: {
    paddingBottom: hp("2%"),
  },
}

export default UserDetailsModal
