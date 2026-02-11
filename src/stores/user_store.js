"use client"

import { create } from "zustand"
import { MMKVLoader } from "react-native-mmkv-storage"

const storage = new MMKVLoader().initialize()

const useUserStore = create((set, get) => ({
  // User state
  user: null,
  isLoggedIn: false,
  isLoading: false,

  // Actions
  setUser: (userData) =>
    set((state) => ({
      user: userData,
      isLoggedIn: true,
    })),

  setLoading: (loading) =>
    set((state) => ({
      isLoading: loading,
    })),

  // Login action that stores in both Zustand and MMKV
  loginUser: async (userData) => {
    try {
      // Store in MMKV for persistence
      storage.setString("userId", userData.userId)
      storage.setString("userName", userData.userName)
      storage.setString("userEmail", userData.userEmail)
      storage.setString("userPhone", userData.userPhone || "")
      storage.setString("userRole", userData.userRole)
      storage.setString("userType", userData.userType || "normal")
      storage.setString("profileImage", userData.profileImage || "")
      storage.setString("registrationDate", userData.registrationDate || new Date().toISOString())
      storage.setBool("isLoggedIn", true)
      storage.setString("userData", JSON.stringify(userData))

      console.log("User data stored in MMKV and Zustand")

      // Update Zustand state
      set({
        user: userData,
        isLoggedIn: true,
      })

      return true
    } catch (error) {
      console.error("Error storing user data:", error)
      return false
    }
  },

  // Logout action
  logoutUser: () => {
    try {
      // Clear MMKV storage
      storage.removeItem("userId")
      storage.removeItem("userName")
      storage.removeItem("userEmail")
      storage.removeItem("userPhone")
      storage.removeItem("userRole")
      storage.removeItem("userType")
      storage.removeItem("profileImage")
      storage.removeItem("registrationDate")
      storage.setBool("isLoggedIn", false)
      storage.removeItem("userData")

      // Clear Zustand state
      set({
        user: null,
        isLoggedIn: false,
      })

      console.log("User logged out successfully")
      return true
    } catch (error) {
      console.error("Error during logout:", error)
      return false
    }
  },

  // Load user from MMKV on app start
  loadUserFromStorage: () => {
    try {
      const isLoggedIn = storage.getBool("isLoggedIn")

      if (isLoggedIn === true) {
        const userData = storage.getString("userData")

        if (userData) {
          const parsedUserData = JSON.parse(userData)

          // Ensure all fields are present (backward compatibility)
          const completeUserData = {
            userId: parsedUserData.userId || storage.getString("userId"),
            userName: parsedUserData.userName || storage.getString("userName"),
            userEmail: parsedUserData.userEmail || storage.getString("userEmail"),
            userPhone: parsedUserData.userPhone || storage.getString("userPhone") || "",
            userRole: parsedUserData.userRole || storage.getString("userRole"),
            userType: parsedUserData.userType || storage.getString("userType") || "normal",
            profileImage: parsedUserData.profileImage || storage.getString("profileImage") || "",
            registrationDate:
              parsedUserData.registrationDate || storage.getString("registrationDate") || new Date().toISOString(),
            ...parsedUserData, // Include any additional fields
          }

          set({
            user: completeUserData,
            isLoggedIn: true,
          })

          console.log("User data loaded from MMKV to Zustand:", completeUserData)
          return completeUserData
        }
      }

      // No user found
      set({
        user: null,
        isLoggedIn: false,
      })

      return null
    } catch (error) {
      console.error("Error loading user from storage:", error)
      set({
        user: null,
        isLoggedIn: false,
      })
      return null
    }
  },

  // Update user data
  updateUser: (updatedData) => {
    const currentUser = get().user
    if (currentUser) {
      const newUserData = { ...currentUser, ...updatedData }

      try {
        // Update individual fields in MMKV for easy access
        if (updatedData.userName) storage.setString("userName", updatedData.userName)
        if (updatedData.userEmail) storage.setString("userEmail", updatedData.userEmail)
        if (updatedData.userPhone !== undefined) storage.setString("userPhone", updatedData.userPhone)
        if (updatedData.userRole) storage.setString("userRole", updatedData.userRole)
        if (updatedData.userType) storage.setString("userType", updatedData.userType)
        if (updatedData.profileImage !== undefined) storage.setString("profileImage", updatedData.profileImage)
        if (updatedData.registrationDate) storage.setString("registrationDate", updatedData.registrationDate)

        // Update complete userData object
        storage.setString("userData", JSON.stringify(newUserData))

        // Update Zustand
        set({
          user: newUserData,
        })

        console.log("User data updated successfully:", updatedData)
        return true
      } catch (error) {
        console.error("Error updating user data:", error)
        return false
      }
    }
    return false
  },

  // Update profile image specifically
  updateProfileImage: (imageUrl) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, profileImage: imageUrl }

      try {
        storage.setString("profileImage", imageUrl)
        storage.setString("userData", JSON.stringify(updatedUser))

        set({
          user: updatedUser,
        })

        console.log("Profile image updated successfully:", imageUrl)
        return true
      } catch (error) {
        console.error("Error updating profile image:", error)
        return false
      }
    }
    return false
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = get().user
    return user?.userRole === role
  },

  // Check if user has specific type
  hasUserType: (type) => {
    const user = get().user
    return user?.userType === type
  },

  // Check if user is admin
  isAdmin: () => {
    const user = get().user
    return user?.userRole === "admin"
  },

  // Check if user is wholesale
  isWholesaleUser: () => {
    const user = get().user
    return user?.userType === "wholesale_user"
  },

  // Check if user is retail
  isRetailUser: () => {
    const user = get().user
    return user?.userType === "retail_user"
  },

  // Get user data
  getUserData: () => {
    return get().user
  },

  // Get user ID
  getUserId: () => {
    return get().user?.userId
  },

  // Get user type
  getUserType: () => {
    return get().user?.userType || "normal"
  },

  // Get user role
  getUserRole: () => {
    return get().user?.userRole || "user"
  },

  // Get profile image
  getProfileImage: () => {
    return get().user?.profileImage || ""
  },

  // Get user name
  getUserName: () => {
    return get().user?.userName || "Guest User"
  },

  // Get user email
  getUserEmail: () => {
    return get().user?.userEmail || ""
  },

  // Get user phone
  getUserPhone: () => {
    return get().user?.userPhone || ""
  },

  // Get registration date
  getRegistrationDate: () => {
    return get().user?.registrationDate || ""
  },

  // Clear user data (for debugging)
  clearUserData: () => {
    try {
      // Clear MMKV
      storage.clearStore()

      // Clear Zustand
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      })

      console.log("All user data cleared")
      return true
    } catch (error) {
      console.error("Error clearing user data:", error)
      return false
    }
  },

  // Refresh user data from storage
  refreshUserData: () => {
    return get().loadUserFromStorage()
  },

  // Check if user data is complete
  isUserDataComplete: () => {
    const user = get().user
    return !!(user?.userId && user?.userName && user?.userEmail)
  },

  // Get user display name (fallback to email if no name)
  getUserDisplayName: () => {
    const user = get().user
    return user?.userName || user?.userEmail || "Guest User"
  },

  // Update last login time
  updateLastLogin: () => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser = { ...currentUser, lastLogin: new Date().toISOString() }

      try {
        storage.setString("userData", JSON.stringify(updatedUser))
        set({ user: updatedUser })
        return true
      } catch (error) {
        console.error("Error updating last login:", error)
        return false
      }
    }
    return false
  },
}))

export default useUserStore
