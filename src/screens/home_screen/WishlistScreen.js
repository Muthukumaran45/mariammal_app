import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Heart, ShoppingBag, X, ChevronLeft, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, collection, doc, getDocs, getDoc, deleteDoc, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import useUserStore from '../../stores/user_store'; // Assuming this path is correct
import { styles } from "../../styles/wishlist_style"; // Assuming this path is correct

// Colors matching the profile screen
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
};

// Mock CustomText component (keep as it's used in the original code)
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
);

const WishlistScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, isLoggedIn, getUserId } = useUserStore();
  const userId = getUserId();

  const app = getApp();
  const db = getFirestore(app);

  // Fetch favorite items from Firebase
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const wishlistCollectionRef = collection(db, 'users', userId, 'wishlist');
      const wishlistSnapshot = await getDocs(wishlistCollectionRef);
      const favoriteItemsArray = [];

      for (const favDoc of wishlistSnapshot.docs) {
        const productId = favDoc.id;
        const favData = favDoc.data();

        // Fetch product details from 'products' collection for up-to-date info
        const productDocRef = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDocRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          favoriteItemsArray.push({
            id: productId,
            name: productData.name,
            price: productData.price,
            unit: productData.unit || 'piece',
            image: productData.imageUrl, // Use imageUrl from product data
            category: productData.category || 'General',
            inStock: productData.isActive && (productData.quantity || 0) > 0,
            addedAt: favData.addedAt, // Keep original addedAt from wishlist
          });
        } else {
          // If product no longer exists, consider removing it from wishlist
          console.warn(`Product ${productId} not found in 'products' collection. Removing from wishlist.`);
          await deleteDoc(doc(db, 'users', userId, 'wishlist', productId));
        }
      }
      // Sort by addedAt timestamp (newest first)
      favoriteItemsArray.sort((a, b) => {
        if (a.addedAt && b.addedAt) {
          const aTime = a.addedAt.seconds || a.addedAt.getTime() / 1000;
          const bTime = b.addedAt.seconds || b.addedAt.getTime() / 1000;
          return bTime - aTime;
        }
        return 0;
      });
      setFavorites(favoriteItemsArray);
    } catch (error) {
      console.error('Error fetching favorite items:', error);
      Alert.alert('Error', 'Failed to fetch wishlist items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId, db]);

  // Set up real-time listener for wishlist changes
  useEffect(() => {


    const wishlistCollectionRef = collection(db, 'users', userId, 'wishlist');
    const unsubscribe = onSnapshot(
      wishlistCollectionRef,
      (snapshot) => {
        // This listener will trigger fetchFavorites whenever the wishlist changes
        console.log('Wishlist collection changed, refreshing...');
        fetchFavorites();
      },
      (error) => {
        console.error('Error listening to wishlist changes:', error);
        Alert.alert('Error', 'Failed to listen for wishlist updates.');
      }
    );

    // Initial fetch
    fetchFavorites();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoggedIn, userId, db, fetchFavorites, navigation]);

  // Remove from favorites
  const removeFromFavorites = async (id, name) => {
    if (!userId) return;
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${name}" from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const wishlistDocRef = doc(db, 'users', userId, 'wishlist', id);
              await deleteDoc(wishlistDocRef);
              // The onSnapshot listener will automatically update the state
              Alert.alert('Success', `${name} removed from wishlist.`);
            } catch (error) {
              console.error('Error removing item from favorites:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            }
          }
        }
      ]
    );
  };


const addToCart = (item) => {
  console.log("Navigating to product details for: " + item.name);
  
  // Get user type from your user store if available
  const userType = user?.userType || "normal"; // Adjust based on your user store structure
  
  // Get appropriate price based on user type (similar to ProductCard logic)
  const getPrice = () => {
    switch (userType) {
      case "retail_user":
        return item?.retailPrice || item?.price || 0;
      case "wholesale_user":
        return item?.wholesalePrice || item?.price || 0;
      case "normal":
      default:
        return item?.normalPrice || item?.price || 0;
    }
  };
  
  const displayPrice = getPrice();
  
  // Navigate to ProductDetailsScreen with the item data
  navigation.navigate("ProductDetailsScreen", {
    productDetails: {
      ...item,
      displayPrice: displayPrice,
      imageUrl: item.image, // Map image to imageUrl if the ProductDetailsScreen expects imageUrl
    },
  });
};

  // Render each wishlist item
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <CustomText color={COLORS.white} style={styles.outOfStockText}>
              Out of Stock
            </CustomText>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <CustomText fontWeight="600" style={styles.itemName}>
            {item.name}
          </CustomText>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromFavorites(item.id, item.name)}>
            <X size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
        <CustomText color={COLORS.textLight} style={styles.itemCategory}>
          {item.category}
        </CustomText>
        <View style={styles.itemFooter}>
          <View>
            <CustomText fontWeight="700" size={2} color={COLORS.primary}>
              {"₹" + item.price.toFixed(2)}
            </CustomText>
            <CustomText color={COLORS.textLight} style={styles.itemUnit}>
              {"per " + item.unit}
            </CustomText>
          </View>
          <TouchableOpacity
            style={[styles.addToCartButton, !item.inStock && styles.disabledButton]}
            onPress={() => item.inStock && addToCart(item)}
            disabled={!item.inStock}
          >
            <ShoppingBag size={16} color={COLORS.white} />
            <CustomText color={COLORS.white} fontWeight="600" style={styles.addToCartText}>
              Add
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Empty state when no favorites
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Heart size={80} color={COLORS.textLight} style={{ opacity: 0.3 }} />
      <CustomText size={2} fontWeight="600" style={styles.emptyStateTitle}>
        Your wishlist is empty
      </CustomText>
      <CustomText color={COLORS.textLight} style={styles.emptyStateText}>
        Items you save will appear here for easy access
      </CustomText>
      <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('BottomNavigation')}>
        <CustomText color={COLORS.white} fontWeight="600">
          Browse Products
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={COLORS.white} />
            </TouchableOpacity>
            <CustomText size={2} fontWeight="700" color={COLORS.white}>
              My Favorites
            </CustomText>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: hp(2), fontSize: wp(4), color: COLORS.textLight }}>Loading wishlist...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
          <CustomText size={2} fontWeight="700" color={COLORS.white}>
            My Favorites
          </CustomText>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default WishlistScreen;