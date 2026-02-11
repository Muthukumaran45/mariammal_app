import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useUserStore from '../stores/user_store';
import { styles } from '../styles/admin_style/Admin_style';

// Import admin components
import AdminAnalytics from '../components/admin_component/Admin_Analyst';
import AdminDashboard from '../components/admin_component/Admin_Dashboard';
import AdminOrders from '../components/admin_component/Admin_Orders';
import AdminSettings from '../components/admin_component/Admin_Setting';
import AdminProducts from '../components/admin_component/Admin_Product';
import AdminCustomers from '../components/admin_component/Admin_Customers';

const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-wp('65%')));
  const navigation = useNavigation();
  const { user, isLoggedIn, logoutUser, loadUserFromStorage } = useUserStore();

  const toggleSidebar = () => {
    const toValue = sidebarVisible ? -wp('65%') : 0;

    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -wp('65%'),
      duration: 300,
      useNativeDriver: false,
    }).start();

    setSidebarVisible(false);
  };

  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback navigation even if logout fails
      navigation.navigate("LoginScreen");
    }
  }

  const renderSidebar = () => (
    <Animated.View style={[styles.sidebar, { left: sidebarAnimation }]}>
      <View style={styles.sidebarHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="storefront" size={wp('5%')} color="#FFFFFF" />
          </View>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoSubtext}>Admin</Text>
          </View>
        </View>
        <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
          <Icon name="close" size={wp('6%')} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sidebarMenu}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
          { id: 'products', label: 'Products', icon: 'cube-outline' },
          { id: 'orders', label: 'Orders', icon: 'bag-outline' },
          { id: 'customers', label: 'Customers', icon: 'people-outline' },
          { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline' },
          { id: 'settings', label: 'Settings', icon: 'settings-outline' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeTab === item.id && styles.activeMenuItem,
            ]}
            onPress={() => {
              setActiveTab(item.id);
              closeSidebar();
            }}
          >
            <Icon
              name={item.icon}
              size={wp('5%')}
              color={activeTab === item.id ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              style={[
                styles.menuItemText,
                activeTab === item.id && styles.activeMenuItemText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={wp('5%')} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="menu" size={wp('6%')} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Admin</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={wp('6%')} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>
      
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'customers': return <AdminCustomers />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />

      {/* Header */}
      {renderHeader()}

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {renderContent()}
      </View>

      {/* Sidebar */}
      {renderSidebar()}

      {/* Overlay */}
      {sidebarVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeSidebar}
        />
      )}
    </SafeAreaView>
  );
};

export default AdminScreen;