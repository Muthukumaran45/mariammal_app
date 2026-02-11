import { View, Image, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Text, Linking, Alert, Platform, PermissionsAndroid } from "react-native"
import {
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Edit3,
  ChevronRight,
  Star,
  User,
  MessageCircle,
} from "lucide-react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/profile_style/profile_style";
import useUserStore from "../../stores/user_store";
import { useEffect, useState } from "react";
import { subscribeToUserStats } from "../../utils/firebase_user_stats";

// Image picker imports
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
// Firebase imports
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

// MMKV Storage
import { MMKVLoader } from 'react-native-mmkv-storage';
const storage = new MMKVLoader().initialize();

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "dnzxttpjy";
const CLOUDINARY_UPLOAD_PRESET = "mariammal_store"

// Enhanced colors for better user profile experience
const COLORS = {
  bgColor: "#F8F9FA",
  primary: "#2ECC71",
  secondary: "#27AE60",
  text: "#2C3E50",
  textLight: "#7F8C8D",
  white: "#FFFFFF",
  border: "#E8E8E8",
  danger: "#E74C3C",
  accent: "#3498DB",
  warning: "#F39C12",
}

// Enhanced CustomText component
const CustomText = ({ children, size = 1, fontFamily, fontWeight = "400", color = COLORS.text, style, ...props }) => (
  <Text
    style={[
      {
        fontSize: size === 1 ? 14 : size === 2 ? 18 : size === 3 ? 22 : size === 4 ? 26 : 16,
        fontWeight,
        color,
        fontFamily,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
)

const Profile_Screen = () => {
  const navigation = useNavigation();
  // Get user data from Zustand store
  const { user, isLoggedIn, logoutUser, loadUserFromStorage, updateUser } = useUserStore();

  // State for additional user data that might come from Firebase
  const [userStats, setUserStats] = useState({
    completedOrders: 0,
    favoriteItems: 0,
    pendingOrders: 0,
  });

  // State for image upload
  const [isUploading, setIsUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImage || null);

  useEffect(() => {
    // Load user data from storage if not already loaded
    if (!user && !isLoggedIn) {
      loadUserFromStorage();
    }

    // Update profile image URL when user data changes
    if (user?.profileImage) {
      setProfileImageUrl(user.profileImage);
    }

    let unsubscribeStats;
    // Set up real-time listener for user statistics when user is available
    if (user?.userId) {
      unsubscribeStats = subscribeToUserStats(user.userId, (updatedStats) => {
        setUserStats(prevStats => ({ ...prevStats, ...updatedStats }));
      });
    } else {
      // If user logs out or is not logged in, reset stats to 0
      setUserStats({ completedOrders: 0, favoriteItems: 0, pendingOrders: 0 });
    }

    return () => {
      if (unsubscribeStats) {
        unsubscribeStats();
      }
    };
  }, [user, isLoggedIn, loadUserFromStorage]);

  // Function to upload image to Cloudinary
  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile_image.jpg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Function to update user profile image in Firebase
  const updateProfileImageInFirebase = async (imageUrl) => {
    try {
      const app = getApp();
      const firestore = getFirestore(app);

      await updateDoc(doc(firestore, 'users', user.userId), {
        profileImage: imageUrl,
        updatedAt: new Date(),
      });

      console.log('Profile image updated in Firebase');
    } catch (error) {
      console.error('Firebase update error:', error);
      throw error;
    }
  };

  // Function to update user data locally
  const updateUserDataLocally = async (imageUrl) => {
    try {
      const updatedUserData = {
        ...user,
        profileImage: imageUrl,
      };

      // Update in Zustand store
      updateUser(updatedUserData);

      // Update in MMKV storage
      storage.setString('userData', JSON.stringify(updatedUserData));

      console.log('User data updated locally');
    } catch (error) {
      console.error('Error updating user data locally:', error);
      throw error;
    }
  };

  // Function to request camera permission
  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take profile pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return cameraGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS permissions are handled automatically
    } catch (err) {
      console.warn('Camera permission error:', err);
      return false;
    }
  };

  // Function to request gallery permission
  const requestGalleryPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const galleryGranted = await PermissionsAndroid.request(
          permission,
          {
            title: 'Gallery Permission',
            message: 'This app needs access to your photos to select a profile picture.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return galleryGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS permissions are handled automatically
    } catch (err) {
      console.warn('Gallery permission error:', err);
      return false;
    }
  };

  // Function to show image picker options with permission handling
  const showImagePickerOptions = async () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to select your profile picture',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
              openCamera();
            } else {
              Alert.alert(
                'Permission Required',
                'Camera permission is required to take photos. Please enable it in your device settings.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Settings', onPress: () => openAppSettings() }
                ]
              );
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const hasPermission = await requestGalleryPermission();
            if (hasPermission) {
              openGallery();
            } else {
              Alert.alert(
                'Permission Required',
                'Gallery permission is required to select photos. Please enable it in your device settings.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Settings', onPress: () => openAppSettings() }
                ]
              );
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Function to open app settings
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Function to open camera with better error handling
  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (response.error) {
        console.log('Camera Error: ', response.error);
        Alert.alert('Camera Error', 'Unable to open camera. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        handleImageSelected(response.assets[0].uri);
      }
    });
  };

  // Function to open gallery with better error handling
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }

      if (response.error) {
        console.log('Gallery Error: ', response.error);
        Alert.alert('Gallery Error', 'Unable to open gallery. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        handleImageSelected(response.assets[0].uri);
      }
    });
  };

  // Function to handle selected image
  const handleImageSelected = async (imageUri) => {
    if (!imageUri) return;

    setIsUploading(true);

    try {
      // Show loading alert
      Alert.alert('Uploading', 'Please wait while we update your profile picture...');

      // Upload image to Cloudinary
      const cloudinaryUrl = await uploadImageToCloudinary(imageUri);

      // Update profile image in Firebase
      await updateProfileImageInFirebase(cloudinaryUrl);

      // Update user data locally
      await updateUserDataLocally(cloudinaryUrl);

      // Update local state
      setProfileImageUrl(cloudinaryUrl);

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to format member since date
  const formatMemberSince = (dateString) => {
    if (!dateString) return "Recently joined";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch (error) {
      return "Recently joined";
    }
  };

  // Helper function to determine membership tier
  const getMembershipTier = (completedOrders) => {
    if (completedOrders >= 50) return "Premium Customer";
    if (completedOrders >= 20) return "Gold Customer";
    if (completedOrders >= 10) return "Silver Customer";
    return "Regular Customer";
  };

  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        navigation?.navigate('LoginScreen')
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback navigation even if logout fails
      navigation.navigate("LoginScreen");
    }
  }

  // Create userData object with real data from store and calculated values
  const userData = {
    name: user?.userName || "Guest User",
    email: user?.userEmail || "No email provided",
    phone: user?.userPhone || "No phone number",
    memberSince: formatMemberSince(user?.registrationDate),
    completedOrders: userStats.completedOrders,
    favoriteItems: userStats.favoriteItems,
    pendingOrders: userStats.pendingOrders,
    membershipTier: getMembershipTier(userStats.completedOrders),
    rating: 4.8, // This could also come from Firebase
    userRole: user?.userRole || "user",
    userType: user?.userType || "normal",
  }

  // If user is not logged in, show login prompt
  if (!isLoggedIn || !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <CustomText size={2} fontWeight="600" color={COLORS.text}>
          Please log in to view your profile
        </CustomText>
        <TouchableOpacity
          style={[styles.menuItem, { marginTop: 20, backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <CustomText color={COLORS.white} fontWeight="600">
            Go to Login
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    {
      icon: User,
      text: "Personal Information",
      onPress: () => console.log("Personal Info"),
      subtitle: "Name, email, phone number",
    },
    {
      icon: ShoppingBag,
      text: "Order History",
      onPress: () => navigation.navigate('MyOrders', { initialTab: 'completed' }),
      badge: userData.completedOrders.toString(),
      subtitle: "View your pickup history",
    },
    {
      icon: Clock,
      text: "Pending Orders",
      onPress: () => navigation.navigate('MyOrders', { initialTab: 'pending' }),
      badge: userData.pendingOrders.toString(),
      subtitle: "Orders being prepared",
    },
    {
      icon: Heart,
      text: "My Favorites",
      onPress: () => navigation.navigate('WishlistScreen'),
      badge: userData.favoriteItems.toString(),
      subtitle: "Your saved items",
    },
    {
      icon: MapPin,
      text: "Shop Location & Hours",
      onPress: () => navigation.navigate("ShopLocationScreen"),
      subtitle: "Find us and check timings",
    },
    {
      icon: HelpCircle,
      text: "Help & Support",
      onPress: () => navigation.navigate("SupportScreen"),
      subtitle: "Contact shop support",
    },
  ]

  const openMap = () => {
    const latitude = 12.98201308198525;
    const longitude = 80.23512332706731;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#53B175"} barStyle="light-content" />
      {/* Enhanced Header with user info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
          <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
         
            <View style={styles.profileInfo}>
              <CustomText size={3} fontWeight="700" color={COLORS.white}>
                {userData.name}
              </CustomText>
              <CustomText color={COLORS.white} style={styles.profileBio}>
                {userData.membershipTier}
              </CustomText>
     
              {/* Show user role for debugging (remove in production) */}
              {userData.userRole !== 'user' && (
                <CustomText color={COLORS.white} style={styles.memberSince}>
                  Role: {userData.userRole}
                </CustomText>
              )}
            </View>
          </View>
       
        </View>
      </View>
      {/* Enhanced Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <CustomText size={2} fontWeight="700" color={COLORS.primary}>
            {userData.completedOrders}
          </CustomText>
          <CustomText color={COLORS.textLight} style={styles.statLabel}>
            Completed
          </CustomText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <CustomText size={2} fontWeight="700" color={COLORS.warning}>
            {userData.pendingOrders}
          </CustomText>
          <CustomText color={COLORS.textLight} style={styles.statLabel}>
            Pending
          </CustomText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <CustomText size={2} fontWeight="700" color={COLORS.accent}>
            {userData.favoriteItems}
          </CustomText>
          <CustomText color={COLORS.textLight} style={styles.statLabel}>
            Favorites
          </CustomText>
        </View>
      </View>
      {/* Quick Actions */}
      <ScrollView style={{ flex: 1, marginTop: hp("3%"), }} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActionsContainer}>
          <CustomText size={2} fontWeight="600" color={COLORS.text} style={styles.sectionTitle}>
            Quick Actions
          </CustomText>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('MyOrders', { initialTab: 'completed' })}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                <ShoppingBag size={24} color={COLORS.primary} />
              </View>
              <CustomText style={styles.quickActionText}>Completed</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem} onPress={() => navigation.navigate('MyOrders', { initialTab: 'pending' })}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.warning}15` }]}>
                <Clock size={24} color={COLORS.warning} />
              </View>
              <CustomText style={styles.quickActionText}>Pending</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem} onPress={openMap}>
              <View style={[styles.quickActionIcon, { backgroundColor: `${COLORS.accent}15` }]}>
                <MapPin size={24} color={COLORS.accent} />
              </View>
              <CustomText style={styles.quickActionText}>Shop Info</CustomText>
            </TouchableOpacity>
          </View>
        </View>
        {/* Menu Items */}
        <View style={styles.menuSection}>
          <CustomText size={2} fontWeight="600" color={COLORS.text} style={styles.sectionTitle}>
            My Account
          </CustomText>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              text={item.text}
              subtitle={item.subtitle}
              onPress={item.onPress}
              badge={item.badge}
            />
          ))}
          {/* Logout Button */}
          <MenuItem icon={LogOut} text="Log Out" subtitle="Sign out of your account" onPress={handleLogout} isLogout />
        </View>
      </ScrollView>
    </View>
  )
}

const MenuItem = ({ icon: Icon, text, subtitle, onPress, isLogout = false, badge }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
        <Icon size={20} color={isLogout ? COLORS.danger : COLORS.primary} />
      </View>
      <View style={styles.menuItemTextContainer}>
        <CustomText fontWeight="500" color={isLogout ? COLORS.danger : COLORS.text} style={styles.menuItemText}>
          {text}
        </CustomText>
        {subtitle && (
          <CustomText color={COLORS.textLight} style={styles.menuItemSubtitle}>
            {subtitle}
          </CustomText>
        )}
      </View>
      {/* Badge will always render if provided, including '0' */}
      {badge !== undefined && (
        <View style={styles.badge}>
          <CustomText color={COLORS.white} style={styles.badgeText}>
            {badge}
          </CustomText>
        </View>
      )}
    </View>
    <ChevronRight size={18} color={COLORS.textLight} />
  </TouchableOpacity>
)

export default Profile_Screen;