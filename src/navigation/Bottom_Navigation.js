import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableWithoutFeedback, StatusBar } from 'react-native';


// icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';  // For other icons
import Ionicons from 'react-native-vector-icons/Ionicons';  
import Octicons from 'react-native-vector-icons/Octicons';  
import Entypo from 'react-native-vector-icons/Entypo';  
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';  


// Screens
import Home_Screen from '../screens/home_screen/Home_Screen';
import Profile_Screen from '../screens/profile_screen/Profile_Screen';
import Cart_Screen from '../screens/cart_screen/Cart_Screen';
import Categories_Screen from '../screens/Categories_Screen/Categories_Screen';

// Packages
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../styles/Color';
import WishlistScreen from '../screens/home_screen/WishlistScreen';
import AllProduct from '../screens/home_screen/AllProduct';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected || false;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {focused && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: hp(0.3),
              backgroundColor: '#378E26',
              borderRadius: hp(50)
            }}
          />
        )}
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};


// Custom Icon Renderer
const TabBarIcon = ({ name, IconComponent, color, focused }) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <IconComponent
      name={name}
      size={hp(3)}
      color={focused ? color : "#000"}
    />
  </View>
);

export const CustomBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: hp(8.5),
        },
        tabBarShowLabel: false, // This hides all tab labels
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#495057",
        tabBarPressColor: "transparent",
        tabBarHideOnKeyboard: true,
      }}
    >

      {/* Home */}
      <Tab.Screen
        name="Home"
        component={Home_Screen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={focused ? Entypo : Octicons}
              name={focused ? "home" : "home"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Categories */}
      <Tab.Screen
        name="Categories"
        component={AllProduct}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={Octicons}
              name={focused ? "search" : "search"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Favorites */}
      <Tab.Screen
        name="WishlistScreen"
        component={WishlistScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={Ionicons}
              name={focused ? "heart" : "heart-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Cart */}
      <Tab.Screen
        name="Cart"
        component={Cart_Screen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={Ionicons}
              name={focused ? "cart" : "cart-outline"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={Profile_Screen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              IconComponent={FontAwesome}
              name={focused ? "user-circle" : "user-circle-o"}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};