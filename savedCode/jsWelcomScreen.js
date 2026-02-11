"use client"

import { StatusBar, StyleSheet, Text, View } from "react-native"
import { useEffect, useCallback } from "react"

// Packages
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  interpolate,
  Easing,
} from "react-native-reanimated"
import LinearGradient from "react-native-linear-gradient"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native"
import { ShoppingBag, Leaf, Clock } from "lucide-react-native"

// Colors matching your app theme
const COLORS = {
  primary: "#2ECC71",
  secondary: "#27AE60",
  dark: "#0F0D0D",
  darkGreen: "#16351D",
  white: "#FFFFFF",
  lightGreen: "#A8E6CF",
  accent: "#34D399",
}

const Welcome_Screen = () => {
  // Start with better initial values to prevent blink
  const mainAnimation = useSharedValue(0)
  const logoRotation = useSharedValue(0)
  const pulseAnimation = useSharedValue(1)

  const navigation = useNavigation()

  const navigateToNextScreen = useCallback(() => {
    navigation.navigate("OnboardingScreen")
  }, [navigation])

  useEffect(() => {
    // Single main animation controller to prevent blinks
    mainAnimation.value = withTiming(1, {
      duration: 2500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Using bezier instead of out(cubic)
    })

    // Subtle logo rotation
    logoRotation.value = withDelay(
      500,
      withTiming(360, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // Using bezier instead of out(quad)
      }),
    )

    // Gentle pulse effect
    pulseAnimation.value = withDelay(
      1000,
      withTiming(1.05, {
        duration: 1000,
        easing: Easing.inOut(Easing.sin), // Using sin instead of sine
      }),
    )

    // Navigate after animations
    const timer = setTimeout(() => {
      runOnJS(navigateToNextScreen)()
    }, 3200)

    return () => clearTimeout(timer)
  }, [navigateToNextScreen])

  // Smooth interpolated animations
  const logoAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(mainAnimation.value, [0, 0.3, 1], [0.3, 1, 1])
    const scale = interpolate(mainAnimation.value, [0, 0.4, 1], [0.8, 1.1, 1])
    const rotate = interpolate(logoRotation.value, [0, 360], [0, 360])

    return {
      opacity,
      transform: [{ scale }, { rotate: rotate + "deg" }],
    }
  })

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(mainAnimation.value, [0, 0.4, 0.7, 1], [0, 0, 1, 1])
    const translateY = interpolate(mainAnimation.value, [0, 0.4, 0.7, 1], [50, 50, 0, 0])

    return {
      opacity,
      transform: [{ translateY }],
    }
  })

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(mainAnimation.value, [0, 0.5, 0.8, 1], [0, 0, 1, 1])
    const translateY = interpolate(mainAnimation.value, [0, 0.5, 0.8, 1], [30, 30, 0, 0])

    return {
      opacity,
      transform: [{ translateY }],
    }
  })

  const iconsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(mainAnimation.value, [0, 0.6, 0.9, 1], [0, 0, 1, 1])
    const scale = interpolate(mainAnimation.value, [0, 0.6, 0.9, 1], [0.5, 0.5, 1, 1])

    return {
      opacity,
      transform: [{ scale }],
    }
  })

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(mainAnimation.value, [0, 1], [1.1, 1])
    return {
      transform: [{ scale }],
    }
  })

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    }
  })

  return (
    <>
      <StatusBar backgroundColor={COLORS.darkGreen} barStyle="light-content" />
      <View style={styles.container}>
        <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle]}>
          <View
          
            style={styles.gradientBackground}
          >
            {/* Floating elements */}
            <View style={[styles.floatingElement, styles.element1]} />
            <View style={[styles.floatingElement, styles.element2]} />
            <View style={[styles.floatingElement, styles.element3]} />
            <View style={[styles.floatingElement, styles.element4]} />
          </View>
        </Animated.View>

        {/* Main content */}
        <View style={styles.contentWrapper}>
          {/* Logo section */}
          <Animated.View style={[styles.logoSection, pulseAnimatedStyle]}>
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
              <Animated.Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
              <View style={styles.logoGlow} />
            </Animated.View>
          </Animated.View>

          {/* Text content */}
          <Animated.View style={[styles.textSection, titleAnimatedStyle]}>
            <Text style={styles.appTitle}>FreshMart</Text>
            <View style={styles.titleUnderline} />
            <Text style={styles.appTagline}>Premium Grocery Experience</Text>
          </Animated.View>

          <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
            Order fresh groceries ahead of time{"\n"}and pickup when convenient
          </Animated.Text>

          {/* Feature highlights */}
          <Animated.View style={[styles.featuresContainer, iconsAnimatedStyle]}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.primary + "20" }]}>
                <ShoppingBag size={20} color={COLORS.white} />
              </View>
              <Text style={styles.featureText}>Easy Ordering</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.accent + "20" }]}>
                <Leaf size={20} color={COLORS.white} />
              </View>
              <Text style={styles.featureText}>Fresh Products</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.secondary + "20" }]}>
                <Clock size={20} color={COLORS.white} />
              </View>
              <Text style={styles.featureText}>Quick Pickup</Text>
            </View>
          </Animated.View>

          {/* Loading dots */}
          <Animated.View style={[styles.loadingSection, iconsAnimatedStyle]}>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
            <Text style={styles.loadingText}>Loading your fresh experience...</Text>
          </Animated.View>
        </View>
      </View>
    </>
  )
}

export default Welcome_Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGreen, // Prevent any white flash
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
    position: "relative",
    backgroundColor: COLORS.primary
  },
  floatingElement: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 100,
  },
  element1: {
    width: wp("30%"),
    height: wp("30%"),
    top: hp("10%"),
    right: -wp("10%"),
  },
  element2: {
    width: wp("20%"),
    height: wp("20%"),
    bottom: hp("20%"),
    left: -wp("5%"),
  },
  element3: {
    width: wp("15%"),
    height: wp("15%"),
    top: hp("25%"),
    left: wp("15%"),
  },
  element4: {
    width: wp("25%"),
    height: wp("25%"),
    bottom: hp("5%"),
    right: wp("10%"),
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
    zIndex: 10,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: hp("4%"),
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: wp("45%"),
    height: hp("12%"),
    zIndex: 2,
  },
  logoGlow: {
    position: "absolute",
    width: wp("50%"),
    height: hp("13%"),
    backgroundColor: "#000",
    opacity: 0.1,
    borderRadius: wp("25%"),
    zIndex: 1,
  },
  textSection: {
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  appTitle: {
    fontSize: wp("9%"),
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleUnderline: {
    width: wp("20%"),
    height: 3,
    backgroundColor: COLORS.accent,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 2,
  },
  appTagline: {
    fontSize: wp("3.5%"),
    fontWeight: "500",
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: wp("3.8%"),
    fontWeight: "400",
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.85,
    marginBottom: hp("4%"),
    lineHeight: wp("5.5%"),
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: hp("5%"),
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureText: {
    fontSize: wp("3%"),
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
  },
  loadingSection: {
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
    opacity: 0.6,
  },
  dot1: {
    animationDelay: "0s",
  },
  dot2: {
    animationDelay: "0.2s",
  },
  dot3: {
    animationDelay: "0.4s",
  },
  loadingText: {
    fontSize: wp("3%"),
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: "400",
  },
})