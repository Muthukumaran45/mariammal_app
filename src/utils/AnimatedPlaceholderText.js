import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { COLORS } from '../styles/Color';

const placeholders = ["Sports", "Turf", "Tournament", "Offers"];

const AnimatedPlaceholderText = () => {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const animatePlaceholder = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(translateY, {
        toValue: 10,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      animatePlaceholder();
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % placeholders.length);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.Text
      style={{
        color: COLORS.primary,
        fontSize: 14,
        transform: [{ translateY }],
        opacity,
      }}
    >
      {placeholders[index]}
    </Animated.Text>
  );
};

export default React.memo(AnimatedPlaceholderText);
