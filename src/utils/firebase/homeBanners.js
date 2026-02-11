import { getFirestore, collection, getDocs, query, where, orderBy, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

export const subscribeToBanners = (callback) => {
  try {
    const app = getApp();
    const firestore = getFirestore(app);
    
    const bannersQuery = query(
      collection(firestore, 'shopSmartBanners'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const banners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: doc.data().imageUrl
      }));
      callback(banners);
    }, (error) => {
      console.error('Error in banner subscription:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up banner subscription:', error);
    return () => {}; 
  }
};