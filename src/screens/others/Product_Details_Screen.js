import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { styles } from '../../styles/product/product_details_style';
import { useNavigation } from '@react-navigation/native';
import useUserStore from '../../stores/user_store';
import LottieView from 'lottie-react-native'; // Make sure to install: npm install lottie-react-native

const { width, height } = Dimensions.get('window');

const Product_Details_Screen = ({ route }) => {
  // Extract product details from nested structure
  const productData = route?.params?.productDetails?.productDetails || route?.params?.productDetails;
  const [productDetails, setProductDetails] = useState(productData);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: 'Added',
    message: '',
    type: 'success', // 'success', 'error', 'wishlist-add', 'wishlist-remove'
    showButtons: false,
  });

  const navigation = useNavigation();

  // Get user data from store
  const { user, getUserId } = useUserStore();
  const userId = getUserId();

  // Initialize Firestore
  const app = getApp();
  const db = getFirestore(app);

  // Effect to check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (userId && productDetails && productDetails.id) {
        try {
          const wishlistDocRef = doc(db, 'users', userId, 'wishlist', productDetails.id);
          const docSnap = await getDoc(wishlistDocRef);
          setIsFavorite(docSnap.exists());
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [userId, productDetails, db]);

  useEffect(() => {
    console.log('Product Details:', productDetails);
    console.log('User ID:', userId);

  }, [productDetails, userId]);

  // Auto-close modal after 2.5 seconds
  useEffect(() => {
    let timer;
    if (showModal && !modalConfig.showButtons) {
      timer = setTimeout(() => {
        setShowModal(false);
      }, 2500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal, modalConfig.showButtons]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Show custom modal
  const showCustomModal = (config) => {
    setModalConfig(config);
    setShowModal(true);
  };

  // Handle toggling favorite status
  const toggleFavorite = async () => {
    if (!productDetails || !productDetails.id) {
      showCustomModal({
        title: 'Error',
        message: 'Product details are missing for wishlist operation.',
        type: 'error',
        showButtons: false,
      });
      return;
    }

    const wishlistDocRef = doc(db, 'users', userId, 'wishlist', productDetails.id);

    try {
      if (isFavorite) {
        // Remove from favorites
        await deleteDoc(wishlistDocRef);
        setIsFavorite(false);
        showCustomModal({
          title: 'Removed from Wishlist',
          message: `${productDetails.name} removed from your wishlist.`,
          type: 'wishlist-remove', // New type for wishlist removal
          showButtons: false,
        });
      } else {
        // Add to favorites
        await setDoc(wishlistDocRef, {
          productId: productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          originalPrice: productDetails.originalPrice || productDetails.price,
          unit: productDetails.unit || 'per piece',
          image: productDetails.imageUrl,
          category: productDetails.category || 'General',
          inStock: productDetails.isActive && (productDetails.quantity || 0) > 0,
          addedAt: new Date(),
        });
        setIsFavorite(true);
        showCustomModal({
          title: 'Added to Wishlist',
          message: `${productDetails.name} added to your wishlist!`,
          type: 'wishlist-add', // New type for wishlist addition
          showButtons: false,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showCustomModal({
        title: 'Error',
        message: 'Failed to update wishlist. Please try again.',
        type: 'error',
        showButtons: false,
      });
    }
  };

  // Calculate total price based on quantity
  const getTotalPrice = () => {
    return (productDetails?.price * quantity).toFixed(2);
  };

  // Handle adding product to cart
  const handleAddToCart = async () => {

    if (!productDetails) {
      showCustomModal({
        title: 'Error',
        message: 'Product details are missing',
        type: 'error',
        showButtons: false,
      });
      return;
    }
    // Check if product is in stock
    const availableStock = productDetails.quantity || 0;
    if (availableStock < quantity) {
      showCustomModal({
        title: 'Insufficient Stock',
        message: `Only ${availableStock} items available`,
        type: 'error',
        showButtons: false,
      });
      return;
    }
    if (availableStock === 0) {
      showCustomModal({
        title: 'Out of Stock',
        message: 'This product is currently out of stock',
        type: 'error',
        showButtons: false,
      });
      return;
    }
    setIsAddingToCart(true);

    try {
      // Reference to the user's cart document
      const userCartDocRef = doc(db, 'users', userId, 'cart', productDetails.id);
      // Check if item already exists in cart
      const existingItem = await getDoc(userCartDocRef);

      if (existingItem.exists()) {
        // If item exists, update quantity
        const currentQuantity = existingItem.data().quantity || 0;
        const newQuantity = currentQuantity + quantity;

        // Check if new quantity exceeds stock
        if (newQuantity > availableStock) {
          showCustomModal({
            title: 'Insufficient Stock',
            message: `Cannot add ${quantity} more items. Only ${availableStock - currentQuantity} items can be added.`,
            type: 'error',
            showButtons: false,
          });
          setIsAddingToCart(false);
          return;
        }

        await updateDoc(userCartDocRef, {
          quantity: newQuantity,
          addedAt: new Date(),
        });

        showCustomModal({
          title: '',
          message: `${productDetails.name} quantity updated in cart! (${newQuantity} items)`,
          type: 'success',
          showButtons: true,
        });
      } else {
        // If item doesn't exist, add new item
        await setDoc(userCartDocRef, {
          productId: productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          originalPrice: productDetails.originalPrice || productDetails.price,
          unit: productDetails.unit || 'per piece',
          image: productDetails.imageUrl,
          category: productDetails.category || 'General',
          quantity: quantity,
          addedAt: new Date(),
        });

        showCustomModal({
          title: 'Added to Cart!',
          message: `${productDetails.name} added to cart successfully! (${quantity} items)`,
          type: 'success',
          showButtons: true,
        });
      }

      // Reset quantity after adding to cart
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showCustomModal({
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.',
        type: 'error',
        showButtons: false,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Function to get the appropriate Lottie animation based on modal type
  const getLottieAnimation = () => {
    switch (modalConfig.type) {
      case 'wishlist-add':
        return require('../../../assets/lottifiles/heart.json'); // Add your heart/favorite animation
      case 'wishlist-remove':
        return require('../../../assets/lottifiles/heart.json'); // Add your heart remove animation
      case 'success':
        return require('../../../assets/lottifiles/success.json'); // Cart success animation
      case 'error':
        return require('../../../assets/animations/footer.json'); // Error animation
      default:
        return require('../../../assets/animations/footer.json'); // Default animation
    }
  };

  // Custom Modal Component
  const CustomModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          {/* Lottie Animation */}
          <View style={modalStyles.animationContainer}>
            <LottieView
              source={getLottieAnimation()}
              autoPlay
              loop={false}
              style={modalStyles.lottieAnimation}
            />
          </View>

          {/* Title */}
          <Text style={modalStyles.modalTitle}>{modalConfig.title}</Text>

          {/* Message */}
          <Text style={modalStyles.modalMessage}>{modalConfig.message}</Text>

          {/* Buttons (only show if showButtons is true) */}
          {modalConfig.showButtons && (
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.continueButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={modalStyles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cartButton]}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('CartScreen');
                }}
              >
                <Text style={modalStyles.cartButtonText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Auto-close indicator for non-button modals */}
          {!modalConfig.showButtons && (
            <View style={modalStyles.autoCloseContainer}>
              <ActivityIndicator size="small" color="#53B175" />
              <Text style={modalStyles.autoCloseText}>Auto-closing...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: productDetails?.imageUrl
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.productTitle}>{productDetails?.name}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FF6B6B" : "#B0B0B0"}
              />
            </TouchableOpacity>
          </View>

          {/* Quantity and Price */}
          <View style={styles.quantityPriceRow}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Ionicons name="remove" size={16} color="#53B175" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Ionicons name="add" size={16} color="#53B175" />
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>₹{getTotalPrice()}</Text>
          </View>

          {/* Product Detail */}
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Product Detail</Text>
            </View>

            <Text style={{

            }}>
              MRP : <Text style={{
                fontSize: 12,
                color: "#888",
                textDecorationLine: "line-through",
              }}>{productDetails?.mrpPrice}</Text>
            </Text>

            <Text>Price {productDetails?.price}</Text>


            <Text style={styles.detailText}>
              {productDetails?.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Basket Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.addToBasketButton,
            (isAddingToCart || !productDetails?.isActive || (productDetails?.quantity || 0) === 0) && styles.addToBasketButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={isAddingToCart || !productDetails?.isActive || (productDetails?.quantity || 0) === 0}
        >
          <Text style={styles.addToBasketText}>
            {isAddingToCart
              ? 'Adding to Cart...'
              : (productDetails?.quantity || 0) === 0
                ? 'Out of Stock'
                : !productDetails?.isActive
                  ? 'Product Unavailable'
                  : 'Add To Basket'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
      <CustomModal />
    </SafeAreaView>
  );
};

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animationContainer: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cartButton: {
    backgroundColor: '#53B175',
  },
  continueButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  autoCloseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  autoCloseText: {
    fontSize: 12,
    color: '#999',
  },
});

export default Product_Details_Screen;