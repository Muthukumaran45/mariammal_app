import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking, // Import Linking for dial pad functionality
} from 'react-native';
import { getFirestore, collection, query, onSnapshot, doc, getDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { styles } from '../../styles/admin_style/Admin_Order_style'; // Import the new styles

const PRIMARY_COLOR = '#4CAD73';
const TEXT_COLOR = '#333';
const LIGHT_TEXT_COLOR = '#666';
const BACKGROUND_COLOR = '#F8F8F8';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // New state for filtered orders
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'completed', 'processing', 'cancelled'
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  const app = getApp();
  const db = getFirestore(app);

  const fetchOrdersAndUsers = useCallback(() => {
    setLoading(true);
    const bookingsCollectionRef = collection(db, 'bookings');

    const unsubscribe = onSnapshot(bookingsCollectionRef, async (snapshot) => {
      const fetchedOrders = [];
      const userIds = new Set();

      snapshot.docs.forEach(doc => {
        const orderData = { id: doc.id, ...doc.data() };
        fetchedOrders.push(orderData);
        userIds.add(orderData.userId);
      });

      // Fetch user details for all unique user IDs
      const usersMap = new Map();
      if (userIds.size > 0) {
        const userPromises = Array.from(userIds).map(async (userId) => {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            usersMap.set(userId, userDocSnap.data());
          }
        });
        await Promise.all(userPromises);
      }

      // Combine order data with user data
      const ordersWithUserDetails = fetchedOrders.map(order => {
        const userDetails = usersMap.get(order.userId);
        return {
          ...order,
          userName: userDetails?.name || 'N/A', // Use 'name' field from user document
          userEmail: userDetails?.email || 'N/A', // Use 'email' field from user document
          userPhone: userDetails?.phoneNumber || 'N/A', // Use 'phoneNumber' field from user document
        };
      });

      // Sort orders by createdAt descending (newest first)
      ordersWithUserDetails.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setOrders(ordersWithUserDetails); // Store all fetched orders
      applyFilter(activeFilter, ordersWithUserDetails); // Apply current filter

      // Calculate stats
      let total = 0;
      let pending = 0;
      let processing = 0;
      let completed = 0;
      let cancelled = 0;

      ordersWithUserDetails.forEach(order => {
        total++;
        switch (order.status) {
          case 'pending':
            pending++;
            break;
          case 'preparing':
          case 'ready':
            processing++; // Group these into 'processing' for admin view
            break;
          case 'completed':
            completed++;
            break;
          case 'cancelled':
            cancelled++;
            break;
          default:
            break;
        }
      });

      setStats({
        totalOrders: total,
        pendingOrders: pending,
        processingOrders: processing,
        completedOrders: completed,
        cancelledOrders: cancelled,
      });

      setLoading(false);
    }, (error) => {
      console.error('Error fetching admin orders:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [db, activeFilter]); // Add activeFilter to dependencies

  useEffect(() => {
    const unsubscribe = fetchOrdersAndUsers();
    return () => unsubscribe();
  }, [fetchOrdersAndUsers]);

  // Function to apply filter
  const applyFilter = useCallback((filter, allOrdersData = orders) => {
    setActiveFilter(filter);
    let filtered = [];
    switch (filter) {
      case 'all':
        filtered = allOrdersData;
        break;
      case 'pending':
        filtered = allOrdersData.filter(order => order.status === 'pending');
        break;
      case 'completed':
        filtered = allOrdersData.filter(order => order.status === 'completed');
        break;
      case 'processing':
        filtered = allOrdersData.filter(order => ['preparing', 'ready'].includes(order.status));
        break;
      case 'cancelled':
        filtered = allOrdersData.filter(order => order.status === 'cancelled');
        break;
      default:
        filtered = allOrdersData;
        break;
    }
    setFilteredOrders(filtered);
  }, [orders]); // Depend on 'orders' to re-filter when base data changes

  const handleOrderCardPress = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const markOrderAsCompleted = async () => {
    if (!selectedOrder) return;

    Alert.alert(
      'Confirm Completion',
      `Are you sure you want to mark order ${selectedOrder.bookingId?.substring(0, 8)}... as COMPLETED?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: async () => {
            try {
              const orderDocRef = doc(db, 'bookings', selectedOrder.id);
              await updateDoc(orderDocRef, {
                status: 'completed',
                updatedAt: serverTimestamp(), // Update timestamp
                completedAt: serverTimestamp(), // Add a completed timestamp
              });
              Alert.alert('Success', `Order ${selectedOrder.bookingId?.substring(0, 8)}... marked as completed.`);
              setShowOrderDetailsModal(false); // Close modal after completion
              // The onSnapshot listener will automatically update the UI and re-filter
            } catch (error) {
              console.error('Error marking order as completed:', error);
              Alert.alert('Error', 'Failed to mark order as completed. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCallPress = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== 'N/A') {
      Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('Failed to open dialer:', err));
    } else {
      Alert.alert('No Phone Number', 'Phone number not available for this user.');
    }
  };

  const renderStatCard = (title, value, icon, color) => (
    <LinearGradient colors={color} style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Icon name={icon} size={wp('6%')} color="#FFFFFF" />
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
    </LinearGradient>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { backgroundColor: styles.statusCompleted.backgroundColor };
      case 'pending': return { backgroundColor: styles.statusPending.backgroundColor };
      case 'preparing':
      case 'ready': return { backgroundColor: styles.statusPending.backgroundColor }; // Use pending color for processing states
      case 'cancelled': return { backgroundColor: styles.statusCancelled.backgroundColor };
      default: return { backgroundColor: '#F3F4F6' };
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completed': return { color: styles.statusCompleted.color };
      case 'pending': return { color: styles.statusPending.color };
      case 'preparing':
      case 'ready': return { color: styles.statusPending.color };
      case 'cancelled': return { color: styles.statusCancelled.color };
      default: return { color: '#374151' };
    }
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const isOrderCompletedOrCancelled = selectedOrder.status === 'completed' || selectedOrder.status === 'cancelled';

    return (
      <Modal
        visible={showOrderDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOrderDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setShowOrderDetailsModal(false)} style={styles.closeButton}>
                <Icon name="close" size={wp('6%')} color={LIGHT_TEXT_COLOR} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>Order Information</Text>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Booking ID:</Text>
                <Text style={styles.modalDetailValue}>{selectedOrder.bookingId}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>User Name:</Text>
                <Text style={styles.modalDetailValue}>{selectedOrder.userName}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>User Email:</Text>
                <Text style={styles.modalDetailValue}>{selectedOrder.userEmail}</Text>
              </View>
              {/* New: User Phone Number with clickable functionality */}
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>User Phone:</Text>
                <TouchableOpacity onPress={() => handleCallPress(selectedOrder.userPhone)}>
                  <Text style={[styles.modalDetailValue, { color: PRIMARY_COLOR, textDecorationLine: 'underline' }]}>
                    {selectedOrder.userPhone}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Total Amount:</Text>
                <Text style={styles.modalDetailValue}>₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Status:</Text>
                <Text style={[styles.modalDetailValue, getStatusTextColor(selectedOrder.status)]}>
                  {selectedOrder.status?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Placed On:</Text>
                <Text style={styles.modalDetailValue}>
                  {selectedOrder.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                </Text>
              </View>
              {selectedOrder.estimatedReadyTime && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Estimated Ready:</Text>
                  <Text style={styles.modalDetailValue}>{selectedOrder.estimatedReadyTime} mins</Text>
                </View>
              )}
              {selectedOrder.selectedTimeSlot && (
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Pickup Slot:</Text>
                  <Text style={styles.modalDetailValue}>{selectedOrder.selectedTimeSlot}</Text>
                </View>
              )}

              <Text style={styles.modalSectionTitle}>Products ({selectedOrder.items?.length || 0})</Text>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((product, index) => (
                  <View key={index} style={styles.modalProductItem}>
                    <Image
                      source={{ uri: product.imageUrl || 'https://via.placeholder.com/50?text=No+Image' }}
                      style={styles.modalProductImage}
                    />
                    <View style={styles.modalProductInfo}>
                      <Text style={styles.modalProductName}>{product.name || 'Unknown Product'}</Text>
                      <Text style={styles.modalProductDetails}>
                        Quantity: {product.quantity || 1} {product.unit || 'pc'}
                      </Text>
                      <Text style={styles.modalProductPrice}>₹{(product.price * product.quantity)?.toFixed(2) || '0.00'}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.modalDetailLabel}>No products found for this order.</Text>
              )}
            </ScrollView>

            {/* Complete Order Button */}
            {!isOrderCompletedOrCancelled && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={markOrderAsCompleted}
              >
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <View style={styles.content}>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Orders</Text>
          <Text style={styles.contentSubtitle}>Track and manage customer orders</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer} >
          {renderStatCard('Total Orders', stats.totalOrders, 'bag-outline', ['#3B82F6', '#1D4ED8'])}
          {renderStatCard('Pending', stats.pendingOrders, 'time-outline', ['#F59E0B', '#D97706'])}
          {renderStatCard('Processing', stats.processingOrders, 'construct-outline', ['#EF4444', '#DC2626'])}
          {renderStatCard('Completed', stats.completedOrders, 'checkmark-circle-outline', ['#10B981', '#059669'])}
          {renderStatCard('Cancelled', stats.cancelledOrders, 'close-circle-outline', ['#E74C3C', '#C0392B'])}
        </ScrollView>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => applyFilter('all')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'all' && styles.activeFilterButtonText]}>
              All Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilterButton]}
            onPress={() => applyFilter('pending')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'pending' && styles.activeFilterButtonText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilterButton]}
            onPress={() => applyFilter('completed')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'completed' && styles.activeFilterButtonText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={{ marginTop: hp('1%'), color: LIGHT_TEXT_COLOR }}>Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders} // Use filteredOrders here
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderCardPress(item)}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>Booking ID: {item.bookingId?.substring(0, 8) || item.id?.substring(0, 8)}...</Text>
                  <View style={[styles.statusBadge, getStatusColor(item.status)]}>
                    <Text style={[styles.statusText, getStatusTextColor(item.status)]}>{(item.status || 'unknown').toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.orderCustomer}>User: {item.userName}</Text>
                {/* Display user email here */}
                <Text style={styles.orderEmail}>Email: {item.userEmail}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderItems}>{item.items?.length || 0} items</Text>
                  <Text style={styles.orderAmount}>₹{item.totalAmount?.toFixed(2) || '0.00'}</Text>
                  <Text style={styles.orderDate}>
                    {item.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.orderList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: hp('5%') }}>
                <Icon name="receipt-outline" size={wp('15%')} color={LIGHT_TEXT_COLOR} style={{ opacity: 0.5 }} />
                <Text style={{ fontSize: wp('4.5%'), fontWeight: '600', color: TEXT_COLOR, marginTop: hp('2%') }}>
                  No {activeFilter !== 'all' ? activeFilter : ''} orders found.
                </Text>
                <Text style={{ fontSize: wp('3.5%'), color: LIGHT_TEXT_COLOR, textAlign: 'center', marginTop: hp('1%') }}>
                  {activeFilter === 'pending' ? 'No active orders awaiting processing.' :
                   activeFilter === 'completed' ? 'No completed orders yet.' :
                   'New customer orders will appear here.'}
                </Text>
              </View>
            )}
          />
        )}
      </View>
      {renderOrderDetailsModal()}
    </SafeAreaView>
  );
};

export default AdminOrders;