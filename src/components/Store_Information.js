import { Text, View, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect } from 'react'
// icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// package
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// Firebase
import { 
  getFirestore, 
  doc, 
  onSnapshot,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
// style
import { styles } from '../styles/Home_Screen_Style';
// Zustand store
import useStoreStatusStore from '../stores/useStoreStatusStore';

const Store_Information = () => {
    const PRIMARY_COLOR = '#4CAD73';
    
    // Zustand store
    const {
        currentlyOpen,
        businessHours,
        storeInfo,
        currentDayHours,
        loading,
        setLoading,
        setStoreInfo,
        setBusinessHours,
        updateStoreStatus,
        resetStore,
    } = useStoreStatusStore();

    const firestore = getFirestore(getApp());

    useEffect(() => {
        setupRealtimeListeners();
        
        // Set up interval to update store status every minute
        const statusInterval = setInterval(() => {
            updateStoreStatus();
        }, 60000); // Update every minute
        
        // Cleanup function to unsubscribe from listeners
        return () => {
            if (storeInfoUnsubscribe) {
                storeInfoUnsubscribe();
            }
            if (businessHoursUnsubscribe) {
                businessHoursUnsubscribe();
            }
            clearInterval(statusInterval);
        };
    }, []);

    let storeInfoUnsubscribe = null;
    let businessHoursUnsubscribe = null;

    const setupRealtimeListeners = () => {
        try {
            setLoading(true);
            
            // Real-time listener for store information
            storeInfoUnsubscribe = onSnapshot(
                doc(firestore, 'storeSettings', 'storeInfo'),
                (doc) => {
                    if (doc.exists()) {
                        setStoreInfo(doc.data());
                    } else {
                        // Set default values if document doesn't exist
                        setStoreInfo({
                            storeName: '',
                            storeLocation: '',
                            phone: '',
                            email: '',
                        });
                    }
                    setLoading(false);
                },
                (error) => {
                    console.error('Error listening to store info:', error);
                    setLoading(false);
                }
            );

            // Real-time listener for business hours
            businessHoursUnsubscribe = onSnapshot(
                doc(firestore, 'storeSettings', 'businessHours'),
                (doc) => {
                    if (doc.exists()) {
                        setBusinessHours(doc.data());
                    } else {
                        // Set default business hours if document doesn't exist
                        setBusinessHours({});
                    }
                    updateStoreStatus(); // Update status after setting business hours
                },
                (error) => {
                    console.error('Error listening to business hours:', error);
                }
            );
        } catch (error) {
            console.error('Error setting up real-time listeners:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.storeInfoSection}>
                <View style={[styles.storeInfoCard, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading store information...</Text>
                </View>
            </View>
        );
    }

    const openMap = () => {
        const latitude = 12.98201308198525;
        const longitude = 80.23512332706731;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.storeInfoSection}>
            <View style={styles.storeInfoCard}>
                <View style={styles.storeInfoHeader}>
                    <Ionicons name="storefront" size={wp('6%')} color={PRIMARY_COLOR} />
                    <Text style={styles.storeInfoTitle}>
                        {storeInfo.storeName || 'Store Information'}
                    </Text>
                    {/* Open/Closed Status Badge */}
                    <View style={{
                        backgroundColor: currentlyOpen ? '#10B981' : '#EF4444',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 8,
                    }}>
                        <Ionicons 
                            name={currentlyOpen ? "checkmark-circle" : "close-circle"} 
                            size={wp('3%')} 
                            color="white" 
                        />
                        <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: '600',
                            marginLeft: 2,
                        }}>
                            {currentlyOpen ? 'OPEN' : 'CLOSED'}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.storeInfoItem}>
                    <Ionicons name="time-outline" size={wp('4%')} color="#666" />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={[styles.storeInfoText, { fontSize: 12, lineHeight: 16 }]}>
                            {currentDayHours || 'Hours not available'}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.storeInfoItem}>
                    <Ionicons name="location-outline" size={wp('4%')} color="#666" />
                    <Text style={styles.storeInfoText}>
                        {storeInfo.storeLocation || 'Location not available'}
                    </Text>
                </View>
                
                <View style={styles.storeInfoItem}>
                    <Ionicons name="call-outline" size={wp('4%')} color="#666" />
                    <Text style={styles.storeInfoText}>
                        {storeInfo.phone || 'Phone not available'}
                    </Text>
                </View>

                <View style={styles.storeInfoItem}>
                    <Ionicons name="mail-outline" size={wp('4%')} color="#666" />
                    <Text style={styles.storeInfoText}>
                        {storeInfo.email || 'Email not available'}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.directionsButton}
                    onPress={openMap}
                    disabled={!storeInfo.storeLocation}
                >
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                    <Ionicons name="navigate-outline" size={wp('4%')} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Store_Information