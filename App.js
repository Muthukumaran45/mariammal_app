import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation from './src/navigation/Navigation';
import { CustomToast } from './src/components/ToastServices';

// Notifee
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

// 🆕 Firebase modular API
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  onMessage,
  setBackgroundMessageHandler,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

// Zustand store
import useFcmStore from './src/stores/useFcmStore';



// 🔹 Foreground notification handler
const onMessageReceived = async (remoteMessage) => {
  const channelId = await notifee.createChannel({
    id: 'important',
    name: 'Important Notifications',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // Ensure this icon exists in android/app/src/main/res
      largeIcon: remoteMessage.notification?.android?.imageUrl,
      priority: 'high',
      pressAction: { id: 'default' },
      fullScreenAction: { id: 'default' },
    },
  });
};


// 🔹 Request user notification permission
const requestUserPermission = async () => {
  const app = getApp();
  const messaging = getMessaging(app);

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};


// 🔹 Get FCM Token
const getFcmToken = async () => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const token = await getToken(messaging);

    // save to zustand store
    useFcmStore.getState().setFcmToken(token);
    console.log('FCM Token:', token);
  } catch (error) {
    console.error('Failed to get FCM token:', error);
  }
};


const App = () => {
  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    requestUserPermission();
    getFcmToken();

    // Foreground message handler
    const unsubscribe = onMessage(messaging, onMessageReceived);

    // Background/quit state handler
    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // App opened from background state
    onNotificationOpenedApp(messaging, (remoteMessage) => {
      console.log('Notification opened from background state:', remoteMessage);
    });

    // App opened from quit state
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage
        );
      }
    });

    return unsubscribe;
  }, []);

 
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <CustomToast />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
