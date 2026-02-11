import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getFirestore, collection, query, where, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { useNavigation, useRoute } from '@react-navigation/native'; // Added useRoute
import useUserStore from '../../stores/user_store'; // Assuming this path is correct
import { styles } from '../../styles/MyOrder_style';

const PRIMARY_COLOR = '#4CAD73';
const TEXT_COLOR = '#333';
const LIGHT_TEXT_COLOR = '#666';
const BORDER_COLOR = '#E0E0E0';
const BACKGROUND_COLOR = '#F8F8F8';

const MyOrders = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get route to access parameters
  
  // Get the initial tab from route params, default to 'pending' if not provided
  const initialTab = route.params?.initialTab || 'pending';
  
  const [activeTab, setActiveTab] = useState(initialTab); // Use initialTab instead of hardcoded 'pending'
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, getUserId } = useUserStore();
  const userId = getUserId();

  const app = getApp();
  const db = getFirestore(app);

  // Update activeTab when route params change (if user navigates to this screen again)
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  const fetchOrders = useCallback(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const bookingsCollectionRef = collection(db, 'bookings');
    // Removed orderBy to avoid requiring composite index
    const userBookingsQuery = query(
      bookingsCollectionRef,
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      userBookingsQuery,
      (snapshot) => {
        const allOrders = [];

        snapshot.docs.forEach(doc => {
          const orderData = { id: doc.id, ...doc.data() };
          allOrders.push(orderData);
        });

        // Sort by createdAt in JavaScript instead of Firestore
        allOrders.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA; // Descending order (newest first)
        });

        // Separate into pending and completed
        const fetchedPendingOrders = allOrders.filter(order => order.status === 'pending');
        const fetchedCompletedOrders = allOrders.filter(order => order.status === 'completed');

        setPendingOrders(fetchedPendingOrders);
        setCompletedOrders(fetchedCompletedOrders);
        setLoading(false);

        console.log(`Fetched ${allOrders.length} orders: ${fetchedPendingOrders.length} pending, ${fetchedCompletedOrders.length} completed`);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        Alert.alert('Error', 'Failed to fetch your orders. Please try again.');
        setLoading(false);
      }
    );

    return unsubscribe; // Return the unsubscribe function for cleanup
  }, [userId, db]);

  useEffect(() => {
    const unsubscribe = fetchOrders();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoggedIn, userId, fetchOrders, navigation]);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.bookingId?.substring(0, 8) || item.id?.substring(0, 8)}...</Text>
        <Text style={[styles.orderStatus, item.status === 'pending' ? styles.statusPending : styles.statusCompleted]}>
          {(item.status || 'pending').toUpperCase()}
        </Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderInfo}>Total Items: {item.items?.length || 0}</Text>
        <Text style={styles.orderInfo}>Total Amount: ₹{(item.totalAmount || 0).toFixed(2)}</Text>
        {item.estimatedReadyTime && (
          <Text style={styles.orderInfo}>Estimated Ready: {item.estimatedReadyTime} mins</Text>
        )}
        {item.selectedTimeSlot && (
          <Text style={styles.orderInfo}>Pickup Slot: {item.selectedTimeSlot}</Text>
        )}
        <Text style={styles.orderDate}>
          Placed On: {item.createdAt?.toDate?.()?.toLocaleString?.() || 'N/A'}
        </Text>
      </View>
      
      {item.items && item.items.length > 0 && (
        <View style={styles.orderItemsContainer}>
          {item.items.slice(0, 3).map((product, index) => (
            <View key={index} style={styles.orderItemRow}>
              <Image 
                source={{ uri: product.imageUrl || 'https://via.placeholder.com/50' }} 
                style={styles.orderItemImage} 
              />
              <Text style={styles.orderItemText}>{product.name || 'Product'} (x{product.quantity || 1})</Text>
            </View>
          ))}
          {item.items.length > 3 && (
            <Text style={styles.moreItemsText}>+{item.items.length - 3} more items</Text>
          )}
        </View>
      )}
      
      {/* You can add a "View Details" button here */}
      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = (tab) => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="receipt-outline" size={wp('15%')} color={LIGHT_TEXT_COLOR} style={{ opacity: 0.5 }} />
      <Text style={styles.emptyStateText}>No {tab} orders found.</Text>
      <Text style={styles.emptyStateSubText}>
        {tab === 'pending' ? 'Your active reservations will appear here.' : 'Your past orders will be listed here.'}
      </Text>
      <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('BottomNavigation')}>
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isLoggedIn || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="person-outline" size={wp('20%')} color="#ccc" />
          <Text style={styles.loadingText}>Login Required</Text>
          <Text style={styles.loadingSubText}>Please login to view your orders</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pending' && styles.activeTabButton]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'pending' && styles.activeTabButtonText]}>
            Pending ({pendingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'completed' && styles.activeTabButton]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'completed' && styles.activeTabButtonText]}>
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'pending' ? pendingOrders : completedOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.orderListContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => renderEmptyState(activeTab)}
      />
    </SafeAreaView>
  );
};

export default MyOrders;