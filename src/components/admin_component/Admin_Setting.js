import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { styles } from '../../styles/admin_style/Admin_style';
import ConfirmationModal from '../Toast/ConfirmationModal';

const AdminSettings = () => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    storeLocation: '',
    description: 'Your neighborhood grocery store with fresh, quality products.',
    phone: '',
    email: '',
  });

  const [businessHours, setBusinessHours] = useState({
    Monday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Tuesday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Wednesday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Thursday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Friday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Saturday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
    Sunday: { 
      morningOpenTime: '9:00 AM', 
      morningCloseTime: '1:00 PM',
      eveningOpenTime: '6:00 PM',
      eveningCloseTime: '10:00 PM',
      isLeave: false 
    },
  });

  const [loading, setLoading] = useState(false);
  const [savingStoreInfo, setSavingStoreInfo] = useState(false);

  // Confirmation modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingDayChange, setPendingDayChange] = useState(null);

  // Time picker modal states
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeType, setSelectedTimeType] = useState(''); // 'morningOpenTime', 'morningCloseTime', 'eveningOpenTime', 'eveningCloseTime'
  const [pickerDate, setPickerDate] = useState(new Date());

  const firestore = getFirestore(getApp());

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);

      // Fetch store information
      const storeInfoDoc = await getDoc(doc(firestore, 'storeSettings', 'storeInfo'));
      if (storeInfoDoc.exists()) {
        setStoreInfo(storeInfoDoc.data());
      }

      // Fetch business hours
      const businessHoursDoc = await getDoc(doc(firestore, 'storeSettings', 'businessHours'));
      if (businessHoursDoc.exists()) {
        const data = businessHoursDoc.data();
        // Migrate old format to new format if needed
        const migratedData = {};
        Object.keys(data).forEach(day => {
          if (data[day].openTime && data[day].closeTime) {
            // Old format - migrate to new format
            migratedData[day] = {
              morningOpenTime: '9:00 AM',
              morningCloseTime: '1:00 PM',
              eveningOpenTime: '6:00 PM',
              eveningCloseTime: '10:00 PM',
              isLeave: data[day].isLeave || false
            };
          } else {
            // New format
            migratedData[day] = data[day];
          }
        });
        setBusinessHours(migratedData);
      }
    } catch (error) {
      console.error('Error fetching settings data:', error);
      Alert.alert('Error', 'Failed to fetch settings data');
    } finally {
      setLoading(false);
    }
  };

  const saveStoreInfo = async () => {
    try {
      setSavingStoreInfo(true);
      await setDoc(doc(firestore, 'storeSettings', 'storeInfo'), storeInfo);
      Alert.alert('Success', 'Store information saved successfully!');
    } catch (error) {
      console.error('Error saving store info:', error);
      Alert.alert('Error', 'Failed to save store information');
    } finally {
      setSavingStoreInfo(false);
    }
  };

  // Handle initial toggle click - show confirmation
  const handleToggleLeaveDay = (day) => {
    setPendingDayChange(day);
    setShowConfirmation(true);
  };

  // Handle confirmation - actually toggle the day
  const confirmToggleLeaveDay = async () => {
    if (!pendingDayChange) return;

    try {
      const day = pendingDayChange;
      const updatedBusinessHours = {
        ...businessHours,
        [day]: {
          ...businessHours[day],
          isLeave: !businessHours[day].isLeave,
        },
      };

      setBusinessHours(updatedBusinessHours);

      // Save to Firebase immediately
      await setDoc(doc(firestore, 'storeSettings', 'businessHours'), updatedBusinessHours);

      const status = updatedBusinessHours[day].isLeave ? 'Leave' : 'Working';
      Alert.alert('Success', `${day} marked as ${status} day!`);
    } catch (error) {
      console.error('Error updating business hours:', error);
      Alert.alert('Error', 'Failed to update business hours');

      // Revert the change on error
      setBusinessHours(prevHours => ({
        ...prevHours,
        [pendingDayChange]: {
          ...prevHours[pendingDayChange],
          isLeave: !prevHours[pendingDayChange].isLeave,
        },
      }));
    } finally {
      // Reset confirmation states
      setShowConfirmation(false);
      setPendingDayChange(null);
    }
  };

  // Handle confirmation cancel
  const cancelToggleLeaveDay = () => {
    setShowConfirmation(false);
    setPendingDayChange(null);
  };

  // Convert time string to Date object for picker
  const timeStringToDate = (timeString) => {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const date = new Date();
    date.setHours(hour, parseInt(minutes), 0, 0);
    return date;
  };

  // Convert Date object to time string
  const dateToTimeString = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMinutes} ${period}`;
  };

  // Handle time selection button press
  const handleTimeSelect = (day, timeType) => {
    const currentTime = businessHours[day][timeType];
    const dateFromTime = timeStringToDate(currentTime);

    setSelectedDay(day);
    setSelectedTimeType(timeType);
    setPickerDate(dateFromTime);
    setShowTimePicker(true);
  };

  // Handle time picker confirmation
  const handleTimePickerConfirm = async () => {
    try {
      const formattedTime = dateToTimeString(pickerDate);

      const updatedBusinessHours = {
        ...businessHours,
        [selectedDay]: {
          ...businessHours[selectedDay],
          [selectedTimeType]: formattedTime,
        },
      };

      setBusinessHours(updatedBusinessHours);

      // Save to Firebase immediately
      await setDoc(doc(firestore, 'storeSettings', 'businessHours'), updatedBusinessHours);

    } catch (error) {
      console.error('Error updating business hour:', error);
      Alert.alert('Error', 'Failed to update business hours');
    } finally {
      setShowTimePicker(false);
      setSelectedDay('');
      setSelectedTimeType('');
    }
  };

  // Handle time picker cancel
  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
    setSelectedDay('');
    setSelectedTimeType('');
  };

  const handleStoreInfoChange = (field, value) => {
    setStoreInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get confirmation modal message
  const getConfirmationMessage = () => {
    if (!pendingDayChange) return '';

    const currentStatus = businessHours[pendingDayChange]?.isLeave;
    const newStatus = currentStatus ? 'Working' : 'Leave';

    return `Are you sure you want to mark ${pendingDayChange} as a ${newStatus} day?`;
  };

  // Get time type display name
  const getTimeTypeDisplayName = (timeType) => {
    switch (timeType) {
      case 'morningOpenTime':
        return 'Morning Opening';
      case 'morningCloseTime':
        return 'Morning Closing';
      case 'eveningOpenTime':
        return 'Evening Opening';
      case 'eveningCloseTime':
        return 'Evening Closing';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.content}>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Settings</Text>
          <Text style={styles.contentSubtitle}>Manage your store settings and preferences</Text>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsCardTitle}>Store Information</Text>
          <Text style={styles.settingsCardSubtitle}>Update your store's basic information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Name</Text>
            <TextInput
              style={styles.textInput}
              value={storeInfo.storeName}
              onChangeText={(value) => handleStoreInfoChange('storeName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Location</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter store address or location"
              value={storeInfo.storeLocation}
              onChangeText={(value) => handleStoreInfoChange('storeLocation', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={storeInfo.description}
              onChangeText={(value) => handleStoreInfoChange('description', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={storeInfo.phone}
                onChangeText={(value) => handleStoreInfoChange('phone', value)}
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={storeInfo.email}
                onChangeText={(value) => handleStoreInfoChange('email', value)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, savingStoreInfo && { opacity: 0.7 }]}
            onPress={saveStoreInfo}
            disabled={savingStoreInfo}
          >
            {savingStoreInfo ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="save-outline" size={wp('5%')} color="#FFFFFF" />
            )}
            <Text style={styles.saveButtonText}>
              {savingStoreInfo ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsCardTitle}>Business Hours</Text>
          <Text style={styles.settingsCardSubtitle}>Set your store's operating hours and leave days</Text>

          {Object.keys(businessHours).map((day) => {
            const dayData = businessHours[day];

            return (
              <View key={day} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                elevation: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              }}>
                {/* Day Header */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#111827',
                  }}>{day}</Text>
                  
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: dayData.isLeave ? '#EF4444' : '#10B981',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                    }}
                    onPress={() => handleToggleLeaveDay(day)}
                  >
                    <Icon
                      name={dayData.isLeave ? "close-circle" : "checkmark-circle"}
                      size={wp('4%')}
                      color="#FFFFFF"
                    />
                    <Text style={{
                      marginLeft: 4,
                      fontSize: 12,
                      fontWeight: '500',
                      color: '#FFFFFF',
                    }}>
                      {dayData.isLeave ? 'Leave' : 'Working'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!dayData.isLeave ? (
                  <View>
                    {/* Morning Shift */}
                    <View style={{
                      backgroundColor: '#FEF3C7',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Icon name="sunny-outline" size={wp('4%')} color="#F59E0B" />
                        <Text style={{
                          marginLeft: 6,
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#92400E',
                        }}>Morning Shift</Text>
                      </View>
                      
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1,
                            borderColor: '#F59E0B',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                            justifyContent: 'center',
                          }}
                          onPress={() => handleTimeSelect(day, 'morningOpenTime')}
                        >
                          <Icon name="time-outline" size={wp('3.5%')} color="#F59E0B" />
                          <Text style={{
                            marginLeft: 4,
                            fontSize: 13,
                            color: '#92400E',
                            fontWeight: '500',
                          }}>{dayData.morningOpenTime}</Text>
                        </TouchableOpacity>

                        <Text style={{
                          fontSize: 12,
                          color: '#92400E',
                          fontWeight: '500',
                          marginHorizontal: 8,
                        }}>to</Text>

                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1,
                            borderColor: '#F59E0B',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                            justifyContent: 'center',
                          }}
                          onPress={() => handleTimeSelect(day, 'morningCloseTime')}
                        >
                          <Icon name="time-outline" size={wp('3.5%')} color="#F59E0B" />
                          <Text style={{
                            marginLeft: 4,
                            fontSize: 13,
                            color: '#92400E',
                            fontWeight: '500',
                          }}>{dayData.morningCloseTime}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Evening Shift */}
                    <View style={{
                      backgroundColor: '#E0E7FF',
                      borderRadius: 8,
                      padding: 12,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <Icon name="moon-outline" size={wp('4%')} color="#3730A3" />
                        <Text style={{
                          marginLeft: 6,
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#3730A3',
                        }}>Evening Shift</Text>
                      </View>
                      
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1,
                            borderColor: '#6366F1',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                            justifyContent: 'center',
                          }}
                          onPress={() => handleTimeSelect(day, 'eveningOpenTime')}
                        >
                          <Icon name="time-outline" size={wp('3.5%')} color="#6366F1" />
                          <Text style={{
                            marginLeft: 4,
                            fontSize: 13,
                            color: '#3730A3',
                            fontWeight: '500',
                          }}>{dayData.eveningOpenTime}</Text>
                        </TouchableOpacity>

                        <Text style={{
                          fontSize: 12,
                          color: '#3730A3',
                          fontWeight: '500',
                          marginHorizontal: 8,
                        }}>to</Text>

                        <TouchableOpacity
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1,
                            borderColor: '#6366F1',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            minWidth: 90,
                            justifyContent: 'center',
                          }}
                          onPress={() => handleTimeSelect(day, 'eveningCloseTime')}
                        >
                          <Icon name="time-outline" size={wp('3.5%')} color="#6366F1" />
                          <Text style={{
                            marginLeft: 4,
                            fontSize: 13,
                            color: '#3730A3',
                            fontWeight: '500',
                          }}>{dayData.eveningCloseTime}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{
                    backgroundColor: '#FEF2F2',
                    borderRadius: 8,
                    padding: 16,
                    alignItems: 'center',
                  }}>
                    <Icon name="close-circle-outline" size={wp('6%')} color="#EF4444" />
                    <Text style={{
                      marginTop: 8,
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#DC2626',
                    }}>Store Closed</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleTimePickerCancel}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            paddingVertical: 24,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            minWidth: 320,
            elevation: 10,
          }}>
            <View style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 4,
              }}>
                Select {getTimeTypeDisplayName(selectedTimeType)} Time
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                fontWeight: '500',
              }}>{selectedDay}</Text>
            </View>

            <DatePicker
              date={pickerDate}
              onDateChange={setPickerDate}
              mode="time"
              is24hourSource="locale"
              textColor="#374151"
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 24,
              gap: 12,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F3F4F6',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={handleTimePickerCancel}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#6B7280',
                }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#3B82F6',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={handleTimePickerConfirm}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#FFFFFF',
                }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmation}
        title="Confirm Day Status Change"
        message={getConfirmationMessage()}
        cancelText="Cancel"
        confirmText="Yes, Change"
        onCancel={cancelToggleLeaveDay}
        onConfirm={confirmToggleLeaveDay}
      />
    </>
  );
};

export default AdminSettings;