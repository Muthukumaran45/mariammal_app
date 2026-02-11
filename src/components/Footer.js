import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  Animated,
  TextInput,
  ActivityIndicator
} from 'react-native';

// packages
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { styles } from '../styles/Home_Screen_Style';

// icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Firebase
import { 
  getFirestore, 
  doc, 
  onSnapshot 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const Footer = () => {
  const PRIMARY_COLOR = '#4CAD73';

  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Mariammal Store', 
    description: 'Your neighborhood grocery store', 
  });
  
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore(getApp());

  useEffect(() => {
    setupRealtimeListener();
    
    // Cleanup function to unsubscribe from listener
    return () => {
      if (storeInfoUnsubscribe) {
        storeInfoUnsubscribe();
      }
    };
  }, []);

  let storeInfoUnsubscribe = null;

  const setupRealtimeListener = () => {
    try {
      // Real-time listener for store information
      storeInfoUnsubscribe = onSnapshot(
        doc(firestore, 'storeSettings', 'storeInfo'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setStoreInfo({
              storeName: data.storeName || 'Mariammal Store',
              description: data.description || 'Your neighborhood grocery store',
            });
          } else {
            // Keep default values if document doesn't exist
            setStoreInfo({
              storeName: 'Mariammal Store',
              description: 'Your neighborhood grocery store',
            });
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to store info in footer:', error);
          // Keep default values on error
          setStoreInfo({
            storeName: 'Mariammal Store',
            description: 'Your neighborhood grocery store',
          });
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up real-time listener in footer:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerLogo}>
          <View style={styles.logoContainer}>
            <Ionicons name="storefront" size={wp('8%')} color={PRIMARY_COLOR} />
          </View>
          
          {loading ? (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              <Text style={[styles.footerAppName, { fontSize: wp('3%') }]}>Loading...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.footerAppName}>{storeInfo.storeName}</Text>
            </>
          )}
        </View>

      

      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.copyrightText}>© 2025 {storeInfo.storeName}. All rights reserved.</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

export default Footer;