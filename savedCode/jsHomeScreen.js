// screens/Home_Screen.js
import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Components
import { COLORS } from '../../styles/Color';
import Home_Banner from '../../components/banners/Home_Banner';
import Categories from '../../components/Categories';

// Data
import { bannerImg, products } from '../../utils/dummy_data';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/cards/ProductCard';
import Footer from '../../components/Footer';
import AnimatedPlaceholderText from '../../utils/AnimatedPlaceholderText';
import { useNavigation } from '@react-navigation/native';
import FadeScaleCarouselScreen from '../../components/banners/Fade_In_Out';
import RotateBanner from '../../components/banners/Rotate_Banner';
import OfferCard from '../../components/cards/Offers_Card';

const Home_Screen = () => {

  const navigate = useNavigation();

  const handleSearchPress = () => {
    navigate.navigate("SearchScreen");
  };

  const handleNotificationPress = () => {
    navigate.navigate("NotificationScreen");

  };

  const handleWishlistPress = () => {
    navigate.navigate("WishlistScreen");
  };




  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle={"light-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>





        {/* Top layer */}
        <View style={styles.topContainer}>

          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: hp(2) }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: hp(3), letterSpacing: 1 }}>MARIAMMAL STORES</Text>
          </View>

          {/* Search bar and icons */}
          <View style={styles.headerContainer}>
            {/* Search Bar */}
            <TouchableOpacity
              onPress={handleSearchPress}
              activeOpacity={.5}
              style={{ width: hp(35) }}
            >
              <SearchBar>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: "#999", fontSize: 14, }}>
                    Search for{" "}
                  </Text>
                  <AnimatedPlaceholderText />
                </View>
              </SearchBar>
            </TouchableOpacity>


            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleWishlistPress}
                activeOpacity={0.7}
              >
                <Ionicons name="heart-outline" size={hp(4)} color={"#fff"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.notificationButton]}
                onPress={handleNotificationPress}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={hp(4)} color={"#fff"} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner */}
          <View>
            <Home_Banner data={bannerImg} />
          </View>
        </View>





        {/* Categories */}
        <View>
          <Categories />
        </View>



        {/* Best Selling */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Selling</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        </View>


        {/* Deals of the Day / Limited Time Offers */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deals of the Day</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
          <OfferCard />

        </View>




        <View style={{ marginVertical: hp(4) }}>
          <Footer />
        </View>

      </ScrollView>
    </View>
  );
};

export default Home_Screen;

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: hp(2),
    borderBottomEndRadius: hp(18),
    paddingTop: hp(2),
    flex: 1

  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  appName: {
    fontSize: hp(2.8),
    fontWeight: 'bold',
    color: '#fff',
    marginRight: hp(1),
  },
  hammerIcon: {
    transform: [{ rotate: '45deg' }],
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: hp(2),
  },
  searchContainer: {
    flex: 1,
    height: hp(6),
    backgroundColor: "#fff",
    borderRadius: hp(2),
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp(2),
    marginRight: hp(2),
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: hp(1),
    color: '#999',
    fontSize: hp(1.8),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    marginLeft: hp(.5),
  },
  notificationButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp(2),
    marginBottom: hp(1),
    paddingVertical: hp(0.5),
  },
  locationText: {
    flex: 1,
    color: '#fff',
    fontSize: hp(1.8),
    marginLeft: hp(1),
    marginRight: hp(1),
    opacity: 0.9,
  },
  sectionContainer: {
    marginTop: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingHorizontal: hp(2)
  },
  sectionTitle: {
    fontSize: hp(2.8),
    fontWeight: 'bold',
    color: '#333',
  },
  seeMoreText: {
    fontSize: hp(1.8),
    color: COLORS.primary,
    fontWeight: '600',
  },
});