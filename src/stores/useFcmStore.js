import { create } from 'zustand';

const useFcmStore = create(set => ({
  fcmToken: null,
  setFcmToken: (token) => set({ fcmToken: token }),
}));

export default useFcmStore;