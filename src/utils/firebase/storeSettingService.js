// utils/storeSettingsService.js
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  query,
  where
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

class StoreSettingsService {
  constructor() {
    this.firestore = getFirestore(getApp());
  }

  // Subscribe to store information changes
  subscribeToStoreInfo = (callback) => {
    try {
      const storeInfoRef = doc(this.firestore, 'storeSettings', 'storeInfo');
      
      const unsubscribe = onSnapshot(storeInfoRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data());
        } else {
          // Return default store info if document doesn't exist
          const defaultStoreInfo = {
            storeName: 'FreshMart Grocery',
            storeLocation: '',
            description: 'Your neighborhood grocery store with fresh, quality products.',
            phone: '+1 (555) 123-4567',
            email: 'info@freshmart.com',
          };
          callback(defaultStoreInfo);
        }
      }, (error) => {
        console.error('Error in store info subscription:', error);
        callback(null);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up store info subscription:', error);
      return () => {};
    }
  };

  // Subscribe to business hours changes
  subscribeToBusinessHours = (callback) => {
    try {
      const businessHoursRef = doc(this.firestore, 'storeSettings', 'businessHours');
      
      const unsubscribe = onSnapshot(businessHoursRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data());
        } else {
          // Return default business hours if document doesn't exist
          const defaultBusinessHours = {
            Monday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Tuesday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Wednesday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Thursday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Friday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Saturday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
            Sunday: { openTime: '9:00 AM', closeTime: '6:00 PM', isLeave: false },
          };
          callback(defaultBusinessHours);
        }
      }, (error) => {
        console.error('Error in business hours subscription:', error);
        callback(null);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up business hours subscription:', error);
      return () => {};
    }
  };

  // Get store information
  getStoreInfo = async () => {
    try {
      const storeInfoDoc = await getDoc(doc(this.firestore, 'storeSettings', 'storeInfo'));
      if (storeInfoDoc.exists()) {
        return storeInfoDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching store info:', error);
      throw error;
    }
  };

  // Save store information
  saveStoreInfo = async (storeInfo) => {
    try {
      await setDoc(doc(this.firestore, 'storeSettings', 'storeInfo'), {
        ...storeInfo,
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error saving store info:', error);
      throw error;
    }
  };

  // Get business hours
  getBusinessHours = async () => {
    try {
      const businessHoursDoc = await getDoc(doc(this.firestore, 'storeSettings', 'businessHours'));
      if (businessHoursDoc.exists()) {
        return businessHoursDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching business hours:', error);
      throw error;
    }
  };

  // Save business hours
  saveBusinessHours = async (businessHours) => {
    try {
      await setDoc(doc(this.firestore, 'storeSettings', 'businessHours'), {
        ...businessHours,
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error saving business hours:', error);
      throw error;
    }
  };

  // Toggle leave day
  toggleLeaveDay = async (day) => {
    try {
      const businessHours = await this.getBusinessHours();
      if (!businessHours) {
        throw new Error('Business hours not found');
      }

      const updatedBusinessHours = {
        ...businessHours,
        [day]: {
          ...businessHours[day],
          isLeave: !businessHours[day].isLeave,
        },
      };

      await this.saveBusinessHours(updatedBusinessHours);
      return updatedBusinessHours[day].isLeave;
    } catch (error) {
      console.error('Error toggling leave day:', error);
      throw error;
    }
  };

  // Check if store is open today
  isStoreOpenToday = async () => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const businessHours = await this.getBusinessHours();
      
      if (!businessHours || !businessHours[today]) {
        return false;
      }

      return !businessHours[today].isLeave;
    } catch (error) {
      console.error('Error checking if store is open:', error);
      return false;
    }
  };

  // Get today's business hours
  getTodaysHours = async () => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const businessHours = await this.getBusinessHours();
      
      if (!businessHours || !businessHours[today]) {
        return null;
      }

      return businessHours[today];
    } catch (error) {
      console.error('Error getting today\'s hours:', error);
      return null;
    }
  };

  // Get all leave days for current week
  getLeaveDays = async () => {
    try {
      const businessHours = await this.getBusinessHours();
      if (!businessHours) {
        return [];
      }

      const leaveDays = [];
      Object.keys(businessHours).forEach(day => {
        if (businessHours[day].isLeave) {
          leaveDays.push(day);
        }
      });

      return leaveDays;
    } catch (error) {
      console.error('Error getting leave days:', error);
      return [];
    }
  };
}

// Export singleton instance
export const storeSettingsService = new StoreSettingsService();
export default storeSettingsService;