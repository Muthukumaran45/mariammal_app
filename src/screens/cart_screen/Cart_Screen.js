import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
  FlatList,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  addDoc, 
  serverTimestamp, 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { COLORS } from '../../styles/Color';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/product/cart_style';
import useUserStore from '../../stores/user_store';
import useCartStore from '../../stores/cart_store';
import ConfirmationModal from '../../components/Toast/ConfirmationModal';

const PRIMARY_COLOR = '#4CAD73';
const SECONDARY_COLOR = '#2E8B57';

const Cart_Screen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('30-45 mins');
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isUpdatingRef = useRef(false);
  const lastUpdateTimeRef = useRef(Date.now());

  const { user, isLoggedIn, getUserId } = useUserStore();
  const userId = getUserId();

  const app = getApp();
  const db = getFirestore(app);

  const timeSlots = [
    { id: 1, time: '15-30 mins', label: 'ASAP', available: true },
    { id: 2, time: '30-45 mins', label: 'Standard', available: true },
    { id: 3, time: '1-2 hours', label: 'Later Today', available: true },
    { id: 4, time: '2-4 hours', label: 'This Evening', available: false },
  ];

  const fetchCartItems = useCallback(async (skipLoadingState = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      const cartCollectionRef = collection(db, 'users', userId, 'cart');
      const cartSnapshot = await getDocs(cartCollectionRef);
      const cartItemsArray = [];
      for (const cartDoc of cartSnapshot.docs) {
        const productId = cartDoc.id;
        const cartData = cartDoc.data();
        const quantity = cartData.quantity;

        const productDocRef = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productDocRef);
        if (productSnapshot.exists()) {
          const productData = productSnapshot.data();
          const cartItem = {
            id: productId,
            name: productData.name,
            price: productData.price,
            originalPrice: productData.originalPrice || productData.price,
            quantity: quantity,
            unit: productData.unit || 'per piece',
            image: productData.imageUrl,
            category: productData.category || 'General',
            availability: productData.isActive && productData.quantity > 0 ? 'in-stock' : 'out-of-stock',
            estimatedTime: productData.estimatedTime || '5 mins',
            discount: 0,
            description: productData.description,
            addedAt: cartData.addedAt,
            stockQuantity: productData.quantity || 0,
          };
          if (productData.originalPrice && productData.originalPrice > productData.price) {
            cartItem.discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
          }
          cartItemsArray.push(cartItem);
        }
      }
      cartItemsArray.sort((a, b) => {
        if (a.addedAt && b.addedAt) {
          const aTime = a.addedAt.seconds || a.addedAt.getTime() / 1000;
          const bTime = b.addedAt.seconds || b.addedAt.getTime() / 1000;
          return bTime - aTime;
        }
        return 0;
      });
      useCartStore.getState().addToCart(cartItemsArray);
      setCartItems(cartItemsArray);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to fetch cart items. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, db]);

  const updateQuantity = async (productId, change) => {
    if (!userId || isUpdatingRef.current) return;
    try {
      isUpdatingRef.current = true;
      const item = cartItems.find(item => item.id === productId);
      if (!item) return;
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        await removeItem(productId);
        return;
      }
      if (newQuantity > item.stockQuantity) {
        Alert.alert('Insufficient Stock', `Only ${item.stockQuantity} items available`);
        return;
      }
      const cartDocRef = doc(db, 'users', userId, 'cart', productId);
      await updateDoc(cartDocRef, {
        quantity: newQuantity,
      });
      setCartItems(prevItems =>
        prevItems.map(cartItem =>
          cartItem.id === productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const removeItem = async (productId) => {
    if (!userId || isUpdatingRef.current) return;
    try {
      isUpdatingRef.current = true;
      const cartDocRef = doc(db, 'users', userId, 'cart', productId);
      await deleteDoc(cartDocRef);
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item. Please try again.');
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const confirmRemoveItem = (productId, itemName) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${itemName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(productId)
        }
      ]
    );
  };

   

  const clearCart = async () => {
    if (!userId || isUpdatingRef.current) return;
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              isUpdatingRef.current = true;
              const batch = writeBatch(db);
              cartItems.forEach(item => {
                const docRef = doc(db, 'users', userId, 'cart', item.id);
                batch.delete(docRef);
              });
              await batch.commit();
              setCartItems([]);
              Alert.alert('Success', 'Cart cleared successfully');
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart. Please try again.');
            } finally {
              isUpdatingRef.current = false;
            }
          }
        }
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {

    fetchCartItems();
  }, [isLoggedIn, userId, fetchCartItems, navigation]);

  useEffect(() => {
    if (!userId) return;
    let unsubscribe;
    try {
      const cartCollectionRef = collection(db, 'users', userId, 'cart');
      unsubscribe = onSnapshot(
        cartCollectionRef,
        (snapshot) => {
          if (isUpdatingRef.current) {
            console.log('Skipping listener update - currently updating');
            return;
          }
          const now = Date.now();
          if (now - lastUpdateTimeRef.current < 1000) {
            console.log('Skipping listener update - too soon');
            return;
          }
          lastUpdateTimeRef.current = now;
          if (!loading && !refreshing) {
            console.log('Cart collection changed, refreshing...');
            fetchCartItems(true);
          }
        },
        (error) => {
          console.error('Error listening to cart changes:', error);
        }
      );
    } catch (error) {
      console.error('Error setting up cart listener:', error);
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, loading, refreshing, fetchCartItems, db]);

  const availableItems = cartItems.filter(item => item.availability !== 'out-of-stock');
  const subtotal = availableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = availableItems.reduce((sum, item) => {
    const originalTotal = item.originalPrice * item.quantity;
    const currentTotal = item.price * item.quantity;
    return sum + (originalTotal - currentTotal);
  }, 0);
  const reservationFee = 0;
  const total = subtotal;
  const maxPrepTime = Math.max(...availableItems.map(item => parseInt(item.estimatedTime) || 0));
  const estimatedReadyTime = maxPrepTime + 10;

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'in-stock': return PRIMARY_COLOR;
      case 'limited': return '#FF9800';
      case 'out-of-stock': return '#FF5252';
      default: return '#666';
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'in-stock': return 'Available';
      case 'limited': return 'Limited Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  // NEW: Handle placing the reservation and creating a booking
  const placeReservation = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const availableItemsCount = availableItems.length;
    const outOfStockCount = cartItems.length - availableItemsCount;

    if (availableItemsCount === 0) {
      Alert.alert('No Available Items', 'All items in your cart are out of stock.');
      return;
    }

    let message = `Reserve ${availableItemsCount} items for pickup?`;
    if (outOfStockCount > 0) {
      message += `\n\n${outOfStockCount} out-of-stock items will be removed.`;
    }
    message += `\n\nEstimated ready time: ${estimatedReadyTime} minutes`;

    Alert.alert(
      'Confirm Reservation',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Reserve',
          style: 'default',
          onPress: async () => {
            try {
              setLoading(true); // Show loading indicator during booking process
              const batch = writeBatch(db);

              // 1. Remove out of stock items from Firebase cart
              const outOfStockItems = cartItems.filter(item => item.availability === 'out-of-stock');
              for (const item of outOfStockItems) {
                const cartDocRef = doc(db, 'users', userId, 'cart', item.id);
                batch.delete(cartDocRef);
              }

              // 2. Prepare items for the booking (snapshot of current cart items)
              const itemsForBooking = availableItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.image,
                unit: item.unit,
                category: item.category,
                // Add any other relevant details you want to store with the order item
              }));

              // 3. Create a new booking document in 'bookings' collection
              const bookingsCollectionRef = collection(db, 'bookings');
              const newBookingRef = doc(bookingsCollectionRef); // Firestore generates a unique ID here

              const bookingData = {
                bookingId: newBookingRef.id, // Store the generated ID within the document
                userId: userId,
                items: itemsForBooking,
                totalAmount: total,
                estimatedReadyTime: estimatedReadyTime,
                selectedTimeSlot: selectedTimeSlot,
                status: 'pending', // Initial status
                createdAt: serverTimestamp(), // Use server timestamp
                updatedAt: serverTimestamp(),
              };

              batch.set(newBookingRef, bookingData);

              // 4. Clear all remaining items from the user's cart in Firebase
              availableItems.forEach(item => {
                const cartDocRef = doc(db, 'users', userId, 'cart', item.id);
                batch.delete(cartDocRef);
              });

              await batch.commit(); // Commit all batched operations

              // Update local state
              setCartItems([]);
              useCartStore.getState().clearCart(); // Clear cart in your store

              Alert.alert(
                'Reservation Confirmed!',
                `Your order (ID: ${newBookingRef.id}) has been sent to the store. You'll receive a notification when your items are ready for pickup.\n\nEstimated time: ${estimatedReadyTime} minutes`,
                [{ text: 'OK', onPress: () => navigation.navigate('MyOrders') }] // Navigate to MyOrders screen
              );
            } catch (error) {
              console.error('Error placing reservation:', error);
              Alert.alert('Error', 'Failed to place reservation. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItem, item.availability === 'out-of-stock' && styles.cartItemDisabled]}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
        {item.availability === 'out-of-stock' && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemName, item.availability === 'out-of-stock' && styles.itemNameDisabled]} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => confirmRemoveItem(item.id, item.name)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={wp('5%')} color="#FF5252" />
          </TouchableOpacity>
        </View>
        <View style={styles.itemMeta}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <View style={[styles.availabilityBadge, { backgroundColor: getAvailabilityColor(item.availability) + '20' }]}>
            <View style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor(item.availability) }]} />
            <Text style={[styles.availabilityText, { color: getAvailabilityColor(item.availability) }]}>
              {getAvailabilityText(item.availability)}
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, item.availability === 'out-of-stock' && styles.priceDisabled]}>
            ₹{item.price.toFixed(2)}
          </Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>₹{item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.unit}>{item.unit}</Text>
        </View>
        <View style={styles.itemFooter}>
          <View style={styles.prepTimeContainer}>
            <Ionicons name="time-outline" size={wp('3.5%')} color="#666" />
            <Text style={styles.prepTime}>Prep: {item.estimatedTime}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, (item.quantity <= 1 || item.availability === 'out-of-stock') && styles.quantityButtonDisabled]}
              onPress={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1 || item.availability === 'out-of-stock'}
            >
              <Ionicons name="remove" size={wp('4%')} color={(item.quantity <= 1 || item.availability === 'out-of-stock') ? '#ccc' : PRIMARY_COLOR} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, item.availability === 'out-of-stock' && styles.quantityButtonDisabled]}
              onPress={() => updateQuantity(item.id, 1)}
              disabled={item.availability === 'out-of-stock'}
            >
              <Ionicons name="add" size={wp('4%')} color={item.availability === 'out-of-stock' ? '#ccc' : PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTimeSlotModal = () => (
    <Modal
      visible={showTimeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Pickup Time</Text>
            <TouchableOpacity onPress={() => setShowTimeModal(false)}>
              <Ionicons name="close" size={wp('6%')} color="#666" />
            </TouchableOpacity>
          </View>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlotOption,
                selectedTimeSlot === slot.time && styles.timeSlotSelected,
                !slot.available && styles.timeSlotDisabled
              ]}
              onPress={() => {
                if (slot.available) {
                  setSelectedTimeSlot(slot.time);
                  setShowTimeModal(false);
                }
              }}
              disabled={!slot.available}
            >
              <View style={styles.timeSlotInfo}>
                <Text style={[
                  styles.timeSlotTime,
                  selectedTimeSlot === slot.time && styles.timeSlotTimeSelected,
                  !slot.available && styles.timeSlotTimeDisabled
                ]}>
                  {slot.time}
                </Text>
                <Text style={[
                  styles.timeSlotLabel,
                  selectedTimeSlot === slot.time && styles.timeSlotLabelSelected,
                  !slot.available && styles.timeSlotLabelDisabled
                ]}>
                  {slot.label}
                </Text>
              </View>
              {selectedTimeSlot === slot.time && (
                <Ionicons name="checkmark-circle" size={wp('5%')} color={PRIMARY_COLOR} />
              )}
              {!slot.available && (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCart}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }}
        style={styles.emptyCartImage}
      />
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartText}>Add items to reserve for pickup at the store!</Text>
      <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('AllProducts')}>
        <Text style={styles.shopNowText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
            <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reserve Items</Text>
          <View style={styles.headerRight} />
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    </SafeAreaView>
  );

  if (!isLoggedIn || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
              <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reserve Items</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        <View style={styles.emptyCart}>
          <Ionicons name="person-outline" size={wp('20%')} color="#ccc" />
          <Text style={styles.emptyCartTitle}>Login Required</Text>
          <Text style={styles.emptyCartText}>Please login to view your cart items</Text>
          <TouchableOpacity style={styles.shopNowButton} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.shopNowText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return renderLoadingScreen();
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
              <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reserve Items</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
            <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reserve Items</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PRIMARY_COLOR]}
          />
        }
      >
        {/* Clear Cart Button */}
        {cartItems.length > 0 && (
          <TouchableOpacity
            style=
            {{
              backgroundColor: "red",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: hp(2),
              paddingVertical: hp(2),
              marginHorizontal: hp(2),
              elevation: 3,
              borderRadius: hp(2)
            }} onPress={clearCart}>
            <Ionicons name="trash-outline" size={wp('4%')} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: hp(2) }}>Clear Cart</Text>
          </TouchableOpacity>
        )}
        {/* Estimated Ready Time */}
        <View style={styles.readyTimeCard}>
          <View style={styles.readyTimeHeader}>
            <Ionicons name="time" size={wp('5%')} color={PRIMARY_COLOR} />
            <Text style={styles.readyTimeTitle}>Estimated Ready Time</Text>
          </View>
          <Text style={styles.readyTimeValue}>{estimatedReadyTime} minutes</Text>
          <Text style={styles.readyTimeNote}>You'll get notified when ready</Text>
        </View>
        {/* Cart Items */}
        <View style={styles.cartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items to Reserve</Text>
            <Text style={styles.itemCount}>{cartItems.length} items</Text>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({availableItems.length} items)</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, styles.savingsLabel]}>You saved</Text>
              <Text style={[styles.summaryValue, styles.savingsValue]}>-₹{savings.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reservation Fee</Text>
            <Text style={[styles.summaryValue, styles.freeText]}>FREE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Pay at Store</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentNote}>
            <Ionicons name="information-circle-outline" size={wp('4%')} color="#666" />
            <Text style={styles.paymentNoteText}>
              Payment will be collected when you pick up your items at the store
            </Text>
          </View>
        </View>
        {/* Important Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <View style={styles.noteItem}>
            <Ionicons name="checkmark-circle" size={wp('4%')} color={PRIMARY_COLOR} />
            <Text style={styles.noteText}>Items will be reserved for 2 hours after notification</Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="checkmark-circle" size={wp('4%')} color={PRIMARY_COLOR} />
            <Text style={styles.noteText}>Bring your phone to show the reservation confirmation</Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="checkmark-circle" size={wp('4%')} color={PRIMARY_COLOR} />
            <Text style={styles.noteText}>Payment accepted: Cash, Card, Mobile Payment</Text>
          </View>
        </View>
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      {/* Reserve Button */}
      {availableItems.length > 0 && (
        <View style={styles.reserveContainer}>
          <LinearGradient colors={[PRIMARY_COLOR, SECONDARY_COLOR]} style={styles.reserveButton}>
            <TouchableOpacity style={styles.reserveButtonContent} onPress={placeReservation}>
              <View style={styles.reserveLeft}>
                <Text style={styles.reserveTotal}>₹{total.toFixed(2)}</Text>
                <Text style={styles.reserveItems}>{availableItems.length} items to reserve</Text>
              </View>
              <View style={styles.reserveRight}>
                <Text style={styles.reserveText}>Reserve Items</Text>
                <Ionicons name="arrow-forward" size={wp('5%')} color="#fff" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
      {renderTimeSlotModal()}
    </SafeAreaView>
  );
};

export default Cart_Screen;