import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';

// packages
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// styles
import { styles } from '../../styles/profile_style/shoplocation_hours_style';

// Firebase
import {
  getFirestore,
  doc,
  onSnapshot
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const ShopLocation_Hours = () => {
  const PRIMARY_COLOR = '#4CAD73';
  const SECONDARY_COLOR = '#F8F9FA';
  const TEXT_PRIMARY = '#1F2937';
  const TEXT_SECONDARY = '#6B7280';

  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeLocation: '',
    description: '',
    phone: '',
    email: '',
  });

  const [businessHours, setBusinessHours] = useState({});
  const [loading, setLoading] = useState(true);

  const firestore = getFirestore(getApp());

  useEffect(() => {
    setupRealtimeListeners();

    return () => {
      if (storeInfoUnsubscribe) storeInfoUnsubscribe();
      if (businessHoursUnsubscribe) businessHoursUnsubscribe();
    };
  }, []);

  let storeInfoUnsubscribe = null;
  let businessHoursUnsubscribe = null;

  const setupRealtimeListeners = () => {
    try {
      // Store information listener
      storeInfoUnsubscribe = onSnapshot(
        doc(firestore, 'storeSettings', 'storeInfo'),
        (doc) => {
          if (doc.exists()) {
            setStoreInfo(doc.data());
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to store info:', error);
          setLoading(false);
        }
      );

      // Business hours listener
      businessHoursUnsubscribe = onSnapshot(
        doc(firestore, 'storeSettings', 'businessHours'),
        (doc) => {
          if (doc.exists()) {
            setBusinessHours(doc.data());
          }
        },
        (error) => {
          console.error('Error listening to business hours:', error);
        }
      );
    } catch (error) {
      console.error('Error setting up listeners:', error);
      setLoading(false);
    }
  };

  const handlePhonePress = () => {
    if (storeInfo.phone) {
      Linking.openURL(`tel:${storeInfo.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (storeInfo.email) {
      Linking.openURL(`mailto:${storeInfo.email}`);
    }
  };

  const handleDirectionsPress = () => {
    if (storeInfo.storeLocation) {
      const latitude = 12.98201308198525;
      const longitude = 80.23512332706731;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  // Helper function to convert time string to minutes for comparison
  const timeStringToMinutes = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    return hour * 60 + parseInt(minutes);
  };

  // Helper function to check if store is currently open
  const isStoreCurrentlyOpen = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (businessHours[today] && !businessHours[today].isLeave) {
      const todayData = businessHours[today];

      if (todayData.morningOpenTime && todayData.eveningOpenTime) {
        // New format - check both shifts
        const morningOpen = timeStringToMinutes(todayData.morningOpenTime);
        const morningClose = timeStringToMinutes(todayData.morningCloseTime);
        const eveningOpen = timeStringToMinutes(todayData.eveningOpenTime);
        const eveningClose = timeStringToMinutes(todayData.eveningCloseTime);

        return (currentTime >= morningOpen && currentTime <= morningClose) ||
          (currentTime >= eveningOpen && currentTime <= eveningClose);
      } else if (todayData.openTime && todayData.closeTime) {
        // Old format - single shift
        const openTime = timeStringToMinutes(todayData.openTime);
        const closeTime = timeStringToMinutes(todayData.closeTime);
        return currentTime >= openTime && currentTime <= closeTime;
      }
    }
    return false;
  };

  const getCurrentDayStatus = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    if (businessHours[today]) {
      const todayData = businessHours[today];
      let hours = '';

      if (todayData.isLeave) {
        hours = 'Closed';
      } else if (todayData.morningOpenTime && todayData.eveningOpenTime) {
        // New format with morning and evening shifts
        hours = `Morning: ${todayData.morningOpenTime} - ${todayData.morningCloseTime}, Evening: ${todayData.eveningOpenTime} - ${todayData.eveningCloseTime}`;
      } else if (todayData.openTime && todayData.closeTime) {
        // Old format - single shift
        hours = `${todayData.openTime} - ${todayData.closeTime}`;
      } else {
        hours = 'Hours not available';
      }

      return {
        day: today,
        isOpen: !todayData.isLeave && isStoreCurrentlyOpen(),
        hours: hours
      };
    }
    return { day: today, isOpen: false, hours: 'Hours not available' };
  };

  const renderBusinessHours = () => {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDay = getCurrentDayStatus().day;

    return daysOrder.map((day) => {
      const dayData = businessHours[day];
      const isToday = day === currentDay;

      if (!dayData) return null;

      return (
        <View key={day} style={[styles.dayRow, isToday && styles.todayRow]}>
          <View style={styles.dayInfo}>
            <Text style={[styles.dayName, isToday && styles.todayText]}>{day}</Text>
            {isToday && <View style={styles.todayIndicator} />}
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {dayData.isLeave ? (
              <Text style={[styles.dayHours, isToday && styles.todayText, styles.closedText]}>
                Closed
              </Text>
            ) : dayData.morningOpenTime && dayData.eveningOpenTime ? (
              // New format - morning and evening shifts
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 2,
                }}>
                  <Ionicons name="sunny-outline" size={wp('3.5%')} color="#F59E0B" />
                  <Text style={[
                    styles.dayHours,
                    isToday && styles.todayText,
                    { fontSize: 12, marginLeft: 4 }
                  ]}>
                    {dayData.morningOpenTime} - {dayData.morningCloseTime}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Ionicons name="moon-outline" size={wp('3.5%')} color="#6366F1" />
                  <Text style={[
                    styles.dayHours,
                    isToday && styles.todayText,
                    { fontSize: 12, marginLeft: 4 }
                  ]}>
                    {dayData.eveningOpenTime} - {dayData.eveningCloseTime}
                  </Text>
                </View>
              </View>
            ) : dayData.openTime && dayData.closeTime ? (
              // Old format - single shift
              <Text style={[styles.dayHours, isToday && styles.todayText]}>
                {dayData.openTime} - {dayData.closeTime}
              </Text>
            ) : (
              <Text style={[styles.dayHours, isToday && styles.todayText, styles.closedText]}>
                Hours not set
              </Text>
            )}
          </View>
        </View>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading shop information...</Text>
      </View>
    );
  }

  const currentStatus = getCurrentDayStatus();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="storefront" size={wp('12%')} color={PRIMARY_COLOR} />
        </View>
        <Text style={styles.shopName}>{storeInfo.storeName || 'Shop Name'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: currentStatus.isOpen ? '#10B981' : '#EF4444' }]}>
          <Ionicons
            name={currentStatus.isOpen ? "checkmark-circle" : "close-circle"}
            size={wp('4%')}
            color="white"
          />
          <Text style={styles.statusText}>
            {currentStatus.isOpen ? 'Open Now' : 'Closed'}
          </Text>
        </View>
      </View>

      {/* Current Day Hours - Enhanced Display */}
      <View style={{
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: currentStatus.isOpen ? '#10B981' : '#EF4444',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Ionicons name="today-outline" size={wp('5%')} color={PRIMARY_COLOR} />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: TEXT_PRIMARY,
            marginLeft: 8,
          }}>Today ({currentStatus.day})</Text>
        </View>
        <Text style={{
          fontSize: 14,
          color: TEXT_SECONDARY,
          lineHeight: 20,
        }}>
          {currentStatus.hours}
        </Text>
      </View>

      {/* Description Section */}
      {storeInfo.description ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={wp('6%')} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <Text style={styles.description}>{storeInfo.description}</Text>
        </View>
      ) : null}

      {/* Contact Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call-outline" size={wp('6%')} color={PRIMARY_COLOR} />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>

        {storeInfo.phone ? (
          <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={wp('5%')} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{storeInfo.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        ) : null}

        {storeInfo.email ? (
          <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={wp('5%')} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{storeInfo.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        ) : null}

        {storeInfo.storeLocation ? (
          <TouchableOpacity style={styles.contactItem} onPress={handleDirectionsPress}>
            <View style={styles.contactIcon}>
              <Ionicons name="location" size={wp('5%')} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{storeInfo.storeLocation}</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={TEXT_SECONDARY} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Business Hours */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={wp('6%')} color={PRIMARY_COLOR} />
          <Text style={styles.sectionTitle}>Business Hours</Text>
        </View>

        <View style={styles.hoursContainer}>
          {Object.keys(businessHours).length > 0 ? renderBusinessHours() : (
            <Text style={styles.noHoursText}>Business hours not available</Text>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flash-outline" size={wp('6%')} color={PRIMARY_COLOR} />
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDirectionsPress}>
            <Ionicons name="navigate" size={wp('6%')} color="white" />
            <Text style={styles.actionButtonText}>Get Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handlePhonePress}>
            <Ionicons name="call" size={wp('6%')} color="white" />
            <Text style={styles.actionButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShopLocation_Hours;