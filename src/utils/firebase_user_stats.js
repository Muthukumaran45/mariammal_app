import { getFirestore, collection, query, where, onSnapshot, getDocs } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const app = getApp();
const db = getFirestore(app);

/**
 * Fetches user statistics (completed orders, pending orders, favorite items) once.
 * This function is primarily for initial load or specific one-time fetches.
 * @param {string} userId The ID of the user.
 * @returns {Promise<{completedOrders: number, pendingOrders: number, favoriteItems: number}>}
 */
export const fetchUserStats = async (userId) => {
  if (!userId) {
    return { completedOrders: 0, pendingOrders: 0, favoriteItems: 0 };
  }

  try {
    // Fetch bookings count from 'bookings' collection
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    let completedOrders = 0;
    let pendingOrders = 0;
    bookingsSnapshot.forEach(doc => {
      const status = doc.data().status;
      if (status === 'completed') {
        completedOrders++;
      } else if (['pending', 'preparing', 'ready'].includes(status)) {
        pendingOrders++;
      }
    });

    // Fetch favorite items count from 'users/{userId}/wishlist' subcollection
    const wishlistCollectionRef = collection(db, 'users', userId, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistCollectionRef);
    const favoriteItems = wishlistSnapshot.size;

    return { completedOrders, pendingOrders, favoriteItems };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { completedOrders: 0, pendingOrders: 0, favoriteItems: 0 };
  }
};

/**
 * Subscribes to real-time updates for user statistics.
 * It listens to both 'bookings' and 'wishlist' collections and combines the results.
 * @param {string} userId The ID of the user.
 * @param {(stats: {completedOrders: number, pendingOrders: number, favoriteItems: number}) => void} callback Callback function to receive updated stats.
 * @returns {() => void} An unsubscribe function to clean up listeners.
 */
export const subscribeToUserStats = (userId, callback) => {
  if (!userId) {
    // If no userId, immediately return 0s and a no-op unsubscribe
    callback({ completedOrders: 0, pendingOrders: 0, favoriteItems: 0 });
    return () => {};
  }

  // Internal state to hold the latest counts from each listener
  let currentStats = { completedOrders: 0, pendingOrders: 0, favoriteItems: 0 };
  let initialBookingsLoaded = false;
  let initialWishlistLoaded = false;

  // Function to call the external callback only when both initial loads are complete
  const notifyCallback = () => {
    if (initialBookingsLoaded && initialWishlistLoaded) {
      callback({ ...currentStats }); // Pass a copy to prevent direct modification
    }
  };

  // Listener for bookings (orders)
  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('userId', '==', userId)
  );

  const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
    let completedOrders = 0;
    let pendingOrders = 0;
    snapshot.docs.forEach(doc => {
      const status = doc.data().status;
      if (status === 'completed') {
        completedOrders++;
      } else if (['pending', 'preparing', 'ready'].includes(status)) {
        pendingOrders++;
      }
    });
    currentStats.completedOrders = completedOrders;
    currentStats.pendingOrders = pendingOrders;
    initialBookingsLoaded = true; // Mark bookings as initially loaded
    notifyCallback(); // Attempt to notify if both are loaded
  }, (error) => {
    console.error('Error listening to bookings:', error);
    currentStats.completedOrders = 0; // Reset on error
    currentStats.pendingOrders = 0; // Reset on error
    initialBookingsLoaded = true; // Still mark as loaded to allow other stats to propagate
    notifyCallback();
  });

  // Listener for wishlist (favorites)
  const wishlistCollectionRef = collection(db, 'users', userId, 'wishlist');

  const unsubscribeWishlist = onSnapshot(wishlistCollectionRef, (snapshot) => {
    currentStats.favoriteItems = snapshot.size;
    initialWishlistLoaded = true; // Mark wishlist as initially loaded
    notifyCallback(); // Attempt to notify if both are loaded
  }, (error) => {
    console.error('Error listening to wishlist:', error);
    currentStats.favoriteItems = 0; // Reset on error
    initialWishlistLoaded = true; // Still mark as loaded
    notifyCallback();
  });

  // Return a cleanup function that unsubscribes from both listeners
  return () => {
    unsubscribeBookings();
    unsubscribeWishlist();
  };
};