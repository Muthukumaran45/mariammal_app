import React, { useState, useRef, useEffect } from 'react';
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
  Linking,
   PermissionsAndroid, Platform, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { styles } from '../../styles/Home_Screen_Style';
import { COLORS } from '../../styles/Color';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../../components/cards/ProductCard';
import { products, weeklyDeals, quickActions, featuredOffers, bestSellingProducts, categories } from '../../utils/dummy_data';


// firebase
import Footer from '../../components/Footer';
import Store_Information from '../../components/Store_Information';
import useCartStore from '../../stores/cart_store';
import useUserStore from '../../stores/user_store';
import { collection, getDocs, getFirestore, onSnapshot } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import WholesaleProducts from '../../components/cards/WholesaleProducts';
import { Filter } from 'lucide-react-native';

// zustand
import useStoreStatusStore from '../../stores/useStoreStatusStore';


const PRIMARY_COLOR = '#4CAD73';



const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        Alert.alert('Permission denied', 'Camera access is required to upload photos.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

const Home_Screen = () => {
  const [searchText, setSearchText] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // zustand
  const { currentlyOpen } = useStoreStatusStore();




  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const searchBarTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate(item?.screen, { category: item.category })}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.categoryGradient}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )



  const renderQuickAction = ({ item }) => {

    const handleNavigation = () => {
      switch (item.name) {
        case 'My Orders':
          navigation.navigate('MyOrders');
          break;
        case 'Favorites':
          navigation.navigate('WishlistScreen');
          break;
        case 'Support':
          navigation.navigate('SupportScreen');
          break;
        default:
          break;
      }
    };

    return (
      <TouchableOpacity
        style={styles.quickActionCard}
        activeOpacity={0.7}
        onPress={handleNavigation}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={wp('6%')} color={item.color} />
        </View>
        <Text style={styles.quickActionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };




  // cart count
  const { getUserId, getUserType } = useUserStore();
  const userId = getUserId();
  const userType = getUserType();
  const [cartCount, setCartCount] = useState(0);
  const app = getApp();
  const db = getFirestore(app);

  useEffect(() => {
    if (!userId) return;

    const cartCollectionRef = collection(db, 'users', userId, 'cart');

    // ✅ Real-time listener for cart count
    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      setCartCount(snapshot.size);
    }, (error) => {
      console.error('Error fetching real-time cart count:', error);
    });

    // ✅ Cleanup on unmount
    return () => unsubscribe();
  }, [userId]);

  const handleNavi = () => {
    const latitude = 12.98201308198525;
    const longitude = 80.23512332706731;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }

     useEffect(() => {
    requestCameraPermission();
  }, []);
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View

          style={styles.headerGradient}

        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={handleNavi} style={styles.locationContainer}>
                <Ionicons name="location" size={hp(2.5)} color="#fff" />
                <View style={styles.locationText}>
                  <Text style={styles.locationName}>Mariammal Store</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("NotificationScreen")}>
                  <Ionicons name="notifications-outline" size={hp(3.5)} color="#fff" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>2</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("CartScreen")}>
                  <Ionicons name="cart-outline" size={hp(3.5)} color="#fff" />
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchSection,
          { transform: [{ translateY: searchBarTranslate }] }
        ]}
      >
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation?.navigate("AllProducts")}>
          <Ionicons name="search" size={wp('5%')} color="#666" style={styles.searchIcon} />
          <Text>Search Product</Text>
        </TouchableOpacity>
      </Animated.View>

        {
          currentlyOpen ? (
            <></>
          ) : (
            <View style={{ backgroundColor: "black", paddingVertical: hp(3), marginHorizontal: hp(2), borderRadius: hp(2), marginBottom: hp(4), alignItems: "center" }}>
              <Text style={{ color: "#fff" ,  fontSize: hp(2.3)}}> Store is Closed</Text>
            </View>
          )
        }

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
       
        {/* Quick Actions */}
        <View style={styles.section}>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
          />
        </View>

        {/* Categories */}
        <View style={[styles.section, { marginTop: hp(2) }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🛒 Shop by Category</Text>

          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        {/* Products */}
        <View style={[styles.section, { marginTop: hp(2) }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: hp(2) }}>
            <Text style={{ fontWeight: "bold", fontSize: hp(2.3), color: "#000" }}>Products</Text>
            <TouchableOpacity style={{
              backgroundColor: COLORS?.primary,
              padding: hp(1),
              borderRadius: hp(1.5),

              elevation: 3,
            }} onPress={() => navigation?.navigate("AllProducts")}>
              <Filter size={hp(2.3)} color="#fff" />
            </TouchableOpacity>
          </View>

          <ProductCard />
        </View>

        {/* Box order Items */}
        <View style={styles.section}>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: hp(2) }}>
            <Text style={{ fontWeight: "bold", fontSize: hp(2.3), color: "#000" }}>Box Products</Text>
            <TouchableOpacity style={{
              backgroundColor: COLORS?.primary,
              padding: hp(1),
              borderRadius: hp(1.5),
              elevation: 3,
            }} onPress={() => navigation?.navigate("AllProducts")}>
              <Filter size={hp(2.3)} color="#fff" />
            </TouchableOpacity>
          </View>

          <WholesaleProducts userType={userType} />
        </View>

        {/* Store Information */}
        <View>
          <Store_Information />
        </View>


        {/* Footer */}
        <View>
          <Footer />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Home_Screen;

