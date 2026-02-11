import { create } from 'zustand';

const useStoreStatusStore = create((set, get) => ({
  // Store status states
  currentlyOpen: false,
  businessHours: {},
  storeInfo: {
    storeName: '',
    storeLocation: '',
    phone: '',
    email: '',
  },
  currentDayHours: '',
  loading: false,
  lastUpdated: null,

  // Actions
  setCurrentlyOpen: (isOpen) => set({ 
    currentlyOpen: isOpen,
    lastUpdated: new Date()
  }),

  setBusinessHours: (hours) => set((state) => {
    const currentlyOpen = get().calculateStoreStatus(hours);
    return {
      businessHours: hours,
      currentlyOpen,
      lastUpdated: new Date()
    };
  }),

  setStoreInfo: (info) => set({ 
    storeInfo: info,
    lastUpdated: new Date()
  }),

  setCurrentDayHours: (hours) => set({ 
    currentDayHours: hours,
    lastUpdated: new Date()
  }),

  setLoading: (loading) => set({ loading }),

  // Calculate if store is currently open based on business hours
  calculateStoreStatus: (businessHours = null) => {
    const hours = businessHours || get().businessHours;
    
    if (!hours || Object.keys(hours).length === 0) {
      return false;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    if (hours[today] && !hours[today].isLeave) {
      const todayData = hours[today];
      
      if (todayData.morningOpenTime && todayData.eveningOpenTime) {
        // New format - check both shifts
        const morningOpen = get().timeStringToMinutes(todayData.morningOpenTime);
        const morningClose = get().timeStringToMinutes(todayData.morningCloseTime);
        const eveningOpen = get().timeStringToMinutes(todayData.eveningOpenTime);
        const eveningClose = get().timeStringToMinutes(todayData.eveningCloseTime);

        return (currentTime >= morningOpen && currentTime <= morningClose) ||
               (currentTime >= eveningOpen && currentTime <= eveningClose);
      } else if (todayData.openTime && todayData.closeTime) {
        // Old format - single shift
        const openTime = get().timeStringToMinutes(todayData.openTime);
        const closeTime = get().timeStringToMinutes(todayData.closeTime);
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
    return false;
  },

  // Helper function to convert time string to minutes
  timeStringToMinutes: (timeString) => {
    if (!timeString) return 0;
    
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return hour * 60 + parseInt(minutes);
  },

  // Get current day hours formatted string
  getCurrentDayHours: () => {
    const { businessHours } = get();
    
    if (!businessHours || Object.keys(businessHours).length === 0) {
      return 'Hours not available';
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    if (businessHours[today]) {
      const todayData = businessHours[today];
      if (todayData.isLeave) {
        return 'Closed Today';
      } else {
        // Check if it's new format (morning/evening shifts) or old format
        if (todayData.morningOpenTime && todayData.eveningOpenTime) {
          // New format with morning and evening shifts
          return `Morning: ${todayData.morningOpenTime} - ${todayData.morningCloseTime} | Evening: ${todayData.eveningOpenTime} - ${todayData.eveningCloseTime}`;
        } else if (todayData.openTime && todayData.closeTime) {
          // Old format - single shift
          return `Open: ${todayData.openTime} - ${todayData.closeTime}`;
        } else {
          return 'Hours not available';
        }
      }
    } else {
      return 'Hours not available';
    }
  },

  // Update store status (recalculate based on current time)
  updateStoreStatus: () => {
    const isOpen = get().calculateStoreStatus();
    const currentDayHours = get().getCurrentDayHours();
    
    set({ 
      currentlyOpen: isOpen,
      currentDayHours,
      lastUpdated: new Date()
    });
  },

  // Reset all store data
  resetStore: () => set({
    currentlyOpen: false,
    businessHours: {},
    storeInfo: {
      storeName: '',
      storeLocation: '',
      phone: '',
      email: '',
    },
    currentDayHours: '',
    loading: false,
    lastUpdated: null,
  }),

  // Bulk update store data
  updateStoreData: (data) => set((state) => {
    const newState = { ...state };
    
    if (data.storeInfo) {
      newState.storeInfo = data.storeInfo;
    }
    
    if (data.businessHours) {
      newState.businessHours = data.businessHours;
      newState.currentlyOpen = get().calculateStoreStatus(data.businessHours);
      newState.currentDayHours = get().getCurrentDayHours();
    }
    
    newState.lastUpdated = new Date();
    return newState;
  }),

  // Get store status summary
  getStoreStatusSummary: () => {
    const state = get();
    return {
      isOpen: state.currentlyOpen,
      todayHours: state.currentDayHours,
      storeName: state.storeInfo.storeName,
      lastChecked: state.lastUpdated,
    };
  },

  // Check if store data is stale (older than 5 minutes)
  isDataStale: () => {
    const { lastUpdated } = get();
    if (!lastUpdated) return true;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastUpdated < fiveMinutesAgo;
  },
}));

export default useStoreStatusStore;