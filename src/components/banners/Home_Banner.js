// components/banners/Home_Banner.js
import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8;
const SPACING = 14;

const DOT_SIZE = 8;
const DOT_SPACING = 6;
const ACTIVE_DOT_WIDTH = 24; // Pill shape width
const ACTIVE_DOT_HEIGHT = 8;

const COLORS = {
  primary: '#4CAF50',
};

const HomeBanner = ({ data }) => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
        snapToInterval={ITEM_WIDTH + SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: String(item) }} style={styles.image} />
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.paginationContainer}>
        {data.map((_, index) => {
          return (
            <AnimatedDot 
              key={index} 
              index={index} 
              scrollX={scrollX} 
              length={data.length} 
            />
          );
        })}
      </View>
    </View>
  );
};

const AnimatedDot = ({ index, scrollX, length }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + SPACING),
      index * (ITEM_WIDTH + SPACING),
      (index + 1) * (ITEM_WIDTH + SPACING),
    ];

    const width = interpolate(
      scrollX.value,
      inputRange,
      [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE],
      Extrapolate.CLAMP
    );

    const backgroundColor = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      width,
      backgroundColor: backgroundColor > 0.5 ? "#fff" : '#d3d3d3',
    };
  });

  return (
    <Animated.View style={[styles.dot, animatedStyle]} />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    width: ITEM_WIDTH,
    marginRight: SPACING,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: hp(20),
    borderRadius: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  dot: {
    height: ACTIVE_DOT_HEIGHT,
    borderRadius: ACTIVE_DOT_HEIGHT / 2,
    marginHorizontal: DOT_SPACING / 2,
  },
});

export default HomeBanner;