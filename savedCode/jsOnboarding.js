"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, Animated, StatusBar } from "react-native"

// packages
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { useNavigation } from "@react-navigation/native"
import { ShoppingBag, Bell, MapPin, Check, ChevronRight } from "lucide-react-native"

// Colors matching the profile screen
const COLORS = {
  primary: "#2ECC71",
  secondary: "#27AE60",
  text: "#333333",
  textLight: "#777777",
  white: "#FFFFFF",
  border: "#E8E8E8",
  warning: "#F39C12",
  accent: "#3498DB",
  background: "#F8F9FA",
}

// Onboarding data for grocery app flow
const onboardingData = [
  {
    id: 1,
    title: "Browse & Order",
    subtitle: "Explore fresh groceries and place your order easily",
    description:
      "Browse through our wide selection of fresh produce, dairy, meat, and pantry essentials. Add items to your cart and place your order in just a few taps.",
    icon: ShoppingBag,
    color: COLORS.primary,
    features: ["Fresh produce daily", "Wide product selection", "Easy cart management", "Quick checkout"],
  },
  {
    id: 2,
    title: "Get Notified",
    subtitle: "Receive alerts when your order is ready for pickup",
    description:
      "Our team will prepare your order with care. You'll receive a notification as soon as everything is ready for collection.",
    icon: Bell,
    color: COLORS.warning,
    features: ["Real-time updates", "Order preparation tracking", "Ready notifications", "Estimated pickup time"],
  },
  {
    id: 3,
    title: "Visit & Collect",
    subtitle: "Come to our store, pay and collect your fresh groceries",
    description:
      "Visit our store at your convenience, make the payment, and collect your freshly prepared order. It's that simple!",
    icon: MapPin,
    color: COLORS.accent,
    features: ["Convenient pickup", "Pay at store", "Fresh guarantee", "Quick collection"],
  },
]

// data's
const { width } = Dimensions.get("window")

// parent
const Onboarding_Screen = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const timerRef = useRef(null)
  const navigation = useNavigation()

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (activeIndex < onboardingData.length - 1) {
        flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true })
        setActiveIndex((prev) => prev + 1)
      }
    }, 4000) // Increased time to read content

    return () => clearTimeout(timerRef.current)
  }, [activeIndex])

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  })

  const handleMomentumScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }, [])

  const handleNext = () => {
    if (activeIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true })
      setActiveIndex((prev) => prev + 1)
    } else {
      navigation.navigate("RegisterScreen")
    }
  }

  const handleSkip = () => {
    navigation.navigate("RegisterScreen")
  }

  const renderOnboardingItem = ({ item, index }) => {
    const IconComponent = item.icon

    return (
      <View style={styles.slideContainer}>
        {/* Header with step indicator */}
        <View style={styles.header}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepTotal}>/ 3</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.contentContainer}>
          {/* Icon section */}
          <View style={styles.iconSection}>
            <View style={[styles.iconBackground, { backgroundColor: COLORS.primary + "15" }]}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
                <IconComponent size={40} color={COLORS.white} />
              </View>
            </View>
          </View>

          {/* Text content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Features list */}
          <View style={styles.featuresContainer}>
            {item.features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <View style={[styles.checkContainer, { backgroundColor: COLORS.primary }]}>
                  <Check size={12} color={COLORS.white} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={[styles.illustration, { backgroundColor: COLORS.primary + "10" }]}>
              {/* Placeholder for illustration */}
              <IconComponent size={80} color={COLORS.primary} style={{ opacity: 0.5 }} />
            </View>
          </View>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomContainer}>
          {/* Pagination */}
          <View style={styles.paginationContainer}>
            {onboardingData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: i === activeIndex ? 24 : 8,
                    backgroundColor: i === activeIndex ? COLORS.primary : COLORS.border,
                  },
                ]}
              />
            ))}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              {activeIndex === onboardingData.length - 1 ? (
                <Text style={styles.nextText}>Get Started</Text>
              ) : (
                <View style={styles.nextIconContainer}>
                  <ChevronRight size={24} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={renderOnboardingItem}
      />
    </View>
  )
}

export default Onboarding_Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slideContainer: {
    width,
    height: "100%",
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: hp("4%"),
    paddingHorizontal: wp("6%"),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  stepNumber: {
    fontSize: wp("6%"),
    fontWeight: "700",
    color: COLORS.primary,
  },
  stepTotal: {
    fontSize: wp("4%"),
    fontWeight: "400",
    color: COLORS.textLight,
    marginLeft: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp("6%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("2%"),
    justifyContent: "flex-start",
  },
  iconSection: {
    alignItems: "center",
    marginBottom: hp("4%"),
  },
  iconBackground: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("9%"),
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: wp("7%"),
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: hp("1%"),
  },
  subtitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: hp("1.5%"),
  },
  description: {
    fontSize: wp("3.8%"),
    fontWeight: "400",
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: wp("5.5%"),
    paddingHorizontal: wp("2%"),
  },
  featuresContainer: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: hp("3%"),
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  checkContainer: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: wp("3.8%"),
    color: COLORS.text,
    marginLeft: wp("3%"),
    fontWeight: "500",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  illustration: {
    width: wp("70%"),
    height: wp("50%"),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    paddingBottom: hp("4%"),
    paddingHorizontal: wp("6%"),
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: hp("3%"),
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("6%"),
  },
  skipText: {
    fontSize: wp("4%"),
    color: COLORS.textLight,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextText: {
    fontSize: wp("4%"),
    color: COLORS.white,
    fontWeight: "600",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("8%"),
  },
  nextIconContainer: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },
})
