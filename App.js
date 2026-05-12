import React, { useEffect } from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import Navigation from './src/navigation/Navigation';
import { CustomToast } from './src/components/ToastServices';

import messaging from '@react-native-firebase/messaging';
// Notifee
import notifee, { AndroidImportance } from '@notifee/react-native';


// Zustand store
import useFcmStore from './src/stores/useFcmStore';


const requestUserPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
};


const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};


const displayNotification = async (title, body) => {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
};


const getFcmToken = async () => {
  const token = await messaging().getToken();
  useFcmStore.getState().setFcmToken(token);
  console.log('FCM Token:', token);
};


const App = () => {

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel();
    getFcmToken();

    // FOREGROUND
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);

      displayNotification(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || '',
      );
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
