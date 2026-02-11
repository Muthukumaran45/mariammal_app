import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../styles/Color';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#4CAD73';
const SECONDARY_COLOR = '#2E8B57';

const Categories_Screen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showAllCategories, setShowAllCategories] = useState(false);
    const navigation = useNavigation(); // Hook for navigation


  // Sample categories data with images
  const categories = [
    {
      id: 1,
      name: 'Fruits & Vegetables',
      icon: '🥕',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 156,
      trending: true,
      discount: '20% OFF',
    },
    {
      id: 2,
      name: 'Dairy & Eggs',
      icon: '🥛',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 89,
      trending: false,
      discount: '',
    },
    {
      id: 3,
      name: 'Meat & Seafood',
      icon: '🥩',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 67,
      trending: true,
      discount: '15% OFF',
    },
    {
      id: 4,
      name: 'Bakery',
      icon: '🍞',
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 45,
      trending: false,
      discount: '',
    },
    {
      id: 5,
      name: 'Beverages',
      icon: '🥤',
      image: 'https://images.unsplash.com/photo-1596803244535-925769f389fc?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 123,
      trending: true,
      discount: '10% OFF',
    },
    {
      id: 6,
      name: 'Snacks',
      icon: '🍿',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 234,
      trending: false,
      discount: '',
    },
    {
      id: 7,
      name: 'Frozen Foods',
      icon: '🧊',
      image: 'https://images.unsplash.com/photo-1621857426350-ddab819cf0ce?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 78,
      trending: false,
      discount: '5% OFF',
    },
    {
      id: 8,
      name: 'Personal Care',
      icon: '🧴',
      image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=300&auto=format',
      gradient: [PRIMARY_COLOR, '#66D68F'],
      itemCount: 156,
      trending: true,
      discount: '',
    },
  ];

  // Featured categories (subset for featured section)
  const featuredCategories = [
    {
      id: 1,
      name: 'Fresh Produce',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format',
      itemCount: 156,
      discount: '20% OFF',
    },
    {
      id: 2,
      name: 'Meat & Seafood',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=300&auto=format',
      itemCount: 67,
      discount: '15% OFF',
    },
  ];

  const filters = ['All', 'Trending', 'Discounts', 'New'];

  // Filter categories based on search text and selected filter
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchText.toLowerCase());
    let matchesFilter = true;
    
    if (selectedFilter === 'Trending') {
      matchesFilter = category.trending;
    } else if (selectedFilter === 'Discounts') {
      matchesFilter = category.discount !== '';
    }
    
    return matchesSearch && matchesFilter;
  });

  const trendingCategories = categories.filter(cat => cat.trending);
  const displayedCategories = showAllCategories ? filteredCategories : filteredCategories.slice(0, 4);

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [hp('25%'), hp('15%')],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const searchBarTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -hp('3%')],
    extrapolate: 'clamp',
  });

  const renderFilterChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item && styles.activeFilterChip
      ]}
      onPress={() => setSelectedFilter(item)}
      activeOpacity={0.7}
    >
      {item === 'Trending' && <Ionicons name="trending-up" size={wp('3.5%')} color={selectedFilter === item ? '#fff' : PRIMARY_COLOR} style={styles.filterIcon} />}
      {item === 'Discounts' && <Ionicons name="pricetag" size={wp('3.5%')} color={selectedFilter === item ? '#fff' : PRIMARY_COLOR} style={styles.filterIcon} />}
      {item === 'New' && <Ionicons name="star" size={wp('3.5%')} color={selectedFilter === item ? '#fff' : PRIMARY_COLOR} style={styles.filterIcon} />}
      <Text style={[
        styles.filterText,
        selectedFilter === item && styles.activeFilterText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderFeaturedCategory = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.8}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <Text style={styles.featuredName}>{item.name}</Text>
          <Text style={styles.featuredCount}>{item.itemCount} items</Text>
          
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTrendingCategory = ({ item }) => (
    <TouchableOpacity style={styles.trendingCard} activeOpacity={0.8}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.trendingImage}
      />
      <LinearGradient
        colors={[PRIMARY_COLOR, SECONDARY_COLOR]}
        style={styles.trendingGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.trendingContent}>
          <Text style={styles.trendingIcon}>{item.icon}</Text>
          <Text style={styles.trendingName}>{item.name}</Text>
          <View style={styles.trendingBadge}>
            <Ionicons name="trending-up" size={wp('3%')} color="#fff" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoryItem = (category) => (
    <TouchableOpacity key={category.id} style={styles.categoryItem} activeOpacity={0.7}>
      <View style={styles.categoryImageContainer}>
        <Image 
          source={{ uri: category.image }} 
          style={styles.categoryImage}
        />
        {category.discount !== '' && (
          <View style={styles.categoryDiscountBadge}>
            <Text style={styles.categoryDiscountText}>{category.discount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.categoryInfo}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryItemName}>{category.name}</Text>
          {category.trending && (
            <View style={styles.trendingIndicator}>
              <Ionicons name="trending-up" size={wp('3.5%')} color={PRIMARY_COLOR} />
            </View>
          )}
        </View>
        <Text style={styles.categoryItemCount}>{category.itemCount} products</Text>
        
        <View style={styles.categoryFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={wp('3.5%')} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore</Text>
            <Ionicons name="arrow-forward" size={wp('3.5%')} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerGradient}>
          {/* Fixed Navigation Bar - Always Visible */}
          <View style={styles.fixedHeaderTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("BottomNavigation")}>
              <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("CartScreen")}>
              <Ionicons name="cart-outline" size={wp('6%')} color="#fff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Animated Content */}
          <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
            <Text style={styles.headerTitle}>Categories</Text>
            <Text style={styles.headerSubtitle}>Find everything you need</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchSection, 
          { transform: [{ translateY: searchBarTranslate }] }
        ]}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={wp('5%')} color={PRIMARY_COLOR} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={wp('5%')} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Filter Chips */}
        <View style={styles.filtersSection}>
          <FlatList
            data={filters}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          />
        </View>

        {/* All Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionTitleDecoration} />
              <Text style={styles.sectionTitle}>
                {selectedFilter === 'All' ? 'All Categories' : `${selectedFilter} Categories`}
              </Text>
            </View>
            <Text style={styles.categoryCount}>
              {filteredCategories.length} categories
            </Text>
          </View>
          
          <View style={styles.categoriesList}>
            {displayedCategories.map(renderCategoryItem)}
          </View>
          
          {filteredCategories.length > 4 && (
            <TouchableOpacity 
              style={styles.showMoreButton}
              onPress={() => setShowAllCategories(!showAllCategories)}
            >
              <Text style={styles.showMoreText}>
                {showAllCategories ? 'Show Less' : 'Show More'}
              </Text>
              <Ionicons 
                name={showAllCategories ? 'chevron-up' : 'chevron-down'} 
                size={wp('4%')} 
                color={PRIMARY_COLOR} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <View style={styles.noResults}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486754.png' }} 
              style={styles.noResultsImage}
            />
            <Text style={styles.noResultsTitle}>No categories found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search or filters
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchText('');
                setSelectedFilter('All');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Categories_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: hp('25%'),
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp('5%'),
  },
  fixedHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1%'),
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: hp('4%'),
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF5252',
    borderRadius: wp('2.5%'),
    width: wp('4.5%'),
    height: wp('4.5%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  headerSubtitle: {
    fontSize: wp('4%'),
    color: '#fff',
    opacity: 0.9,
  },
  searchSection: {
    paddingHorizontal: wp('5%'),
    marginTop: -hp('3%'),
    marginBottom: hp('2.5%'),
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    height: hp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: wp('2.5%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#333',
  },
  content: {
    flex: 1,
  },
  filtersSection: {
    marginBottom: hp('2.5%'),
  },
  filtersContainer: {
    paddingHorizontal: wp('5%'),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('6%'),
    backgroundColor: '#fff',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilterChip: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  filterIcon: {
    marginRight: wp('1.5%'),
  },
  filterText: {
    fontSize: wp('3.5%'),
    color: '#555',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleDecoration: {
    width: wp('1%'),
    height: hp('2.5%'),
    backgroundColor: PRIMARY_COLOR,
    borderRadius: wp('0.5%'),
    marginRight: wp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: wp('3.5%'),
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: wp('3.5%'),
    color: '#999',
  },
  featuredContainer: {
    paddingHorizontal: wp('5%'),
  },
  featuredCard: {
    width: wp('70%'),
    height: hp('20%'),
    marginRight: wp('4%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: wp('4%'),
  },
  featuredContent: {
    justifyContent: 'flex-end',
  },
  featuredName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  featuredCount: {
    fontSize: wp('3.5%'),
    color: '#fff',
    opacity: 0.8,
  },
  discountBadge: {
    position: 'absolute',
    top: wp('4%'),
    right: 0,
    backgroundColor: '#FF3D00',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.6%'),
    borderTopLeftRadius: wp('3%'),
    borderBottomLeftRadius: wp('3%'),
  },
  discountText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  trendingContainer: {
    paddingHorizontal: wp('5%'),
  },
  trendingCard: {
    width: wp('35%'),
    height: hp('15%'),
    marginRight: wp('4%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    opacity: 0.85,
    padding: wp('3%'),
  },
  trendingContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  trendingIcon: {
    fontSize: wp('6%'),
    alignSelf: 'flex-start',
  },
  trendingName: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2.5%'),
  },
  trendingText: {
    fontSize: wp('2.5%'),
    color: '#fff',
    marginLeft: wp('1%'),
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: wp('5%'),
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: wp('3%'),
    marginBottom: hp('2%'),
    borderRadius: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
    marginRight: wp('4%'),
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryDiscountBadge: {
    position: 'absolute',
    top: wp('1%'),
    right: wp('1%'),
    backgroundColor: '#FF3D00',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2%'),
  },
  categoryDiscountText: {
    color: '#fff',
    fontSize: wp('2.5%'),
    fontWeight: 'bold',
  },
  categoryInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  categoryItemName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  trendingIndicator: {
    marginLeft: wp('2%'),
  },
  categoryItemCount: {
    fontSize: wp('3.2%'),
    color: '#999',
    marginBottom: hp('1%'),
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: wp('3%'),
    color: '#666',
    marginLeft: wp('1%'),
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F4',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
  },
  exploreText: {
    fontSize: wp('3%'),
    color: PRIMARY_COLOR,
    fontWeight: '600',
    marginRight: wp('1%'),
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    marginHorizontal: wp('5%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
  },
  showMoreText: {
    fontSize: wp('3.5%'),
    color: PRIMARY_COLOR,
    fontWeight: '600',
    marginRight: wp('1.2%'),
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: hp('5%'),
    paddingHorizontal: wp('10%'),
  },
  noResultsImage: {
    width: wp('30%'),
    height: wp('30%'),
    marginBottom: hp('2.5%'),
    opacity: 0.7,
  },
  noResultsTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#666',
    marginBottom: hp('1%'),
  },
  noResultsText: {
    fontSize: wp('3.5%'),
    color: '#999',
    textAlign: 'center',
    lineHeight: hp('2.5%'),
    marginBottom: hp('2.5%'),
  },
  resetButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
    borderRadius: wp('6%'),
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('3.5%'),
  },
  bottomSpacing: {
    height: hp('4%'),
  },
});