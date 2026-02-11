import React, { useCallback, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const screenWidth = Dimensions.get("window").width;
const scale = 0.7;
const PAGE_WIDTH = screenWidth * scale;
const PAGE_HEIGHT = 240 * scale;

// Dummy Item component
const SBItem = ({ index }) => {
  return (
    <View
      style={{
        backgroundColor: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"][index % 6],
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 24, color: "#333" }}>Item {index + 1}</Text>
    </View>
  );
};

// Main Banner Component
const RotateBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = [...new Array(6).keys()];

  const animationStyle = useCallback((value) => {
    "worklet";
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-45, 0, 45])}deg`;
    const translateX = interpolate(value, [-1, 0, 1], [-screenWidth, 0, screenWidth]);

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    };
  }, []);

  return (
    <View style={{ alignItems: "center",  }}>
      <Carousel
        loop={false}
        scrollAnimationDuration={800}
        style={{
          width: screenWidth,
          height: 240,
          justifyContent: "center",
          alignItems: "center",
        }}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={data}
        renderItem={({ index }) => <SBItem key={index} index={index} />}
        onSnapToItem={(index) => setCurrentIndex(index)}
        customAnimation={animationStyle}
      />

      {/* Pagination Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {data.map((_, i) => (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              marginHorizontal: 4,
              backgroundColor: currentIndex === i ? "#333" : "#ccc",
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default RotateBanner;
