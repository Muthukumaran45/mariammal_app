import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const data = [0, 1, 2, 3, 4]; // Replace with real banners

// Dummy banner item component
const SBItem = ({ index }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>Banner {index + 1}</Text>
    </View>
  );
};

const FadeScaleCarouselScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const animationStyle = useCallback((value) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const scale = interpolate(value, [-1, 0, 1], [1.15, 1, 0.85]);
    const opacity = interpolate(value, [-1, 0, 1], [0, 1, 0]);

    return {
      transform: [{ scale }],
      zIndex,
      opacity,
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Featured Banners</Text>
      <Carousel
        loop
        width={SCREEN_WIDTH * 0.8}
        height={200}
        data={data}
        scrollAnimationDuration={1000}
        customAnimation={animationStyle}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ index }) => <SBItem index={index} />}
        style={styles.carousel}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default FadeScaleCarouselScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  carousel: {
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#FF7F50",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  itemText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF7F50",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});
