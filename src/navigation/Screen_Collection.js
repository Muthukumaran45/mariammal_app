import { CustomBottomTabs } from "./Bottom_Navigation";

// Importing screens dynamically using object grouping
const Screens = {
    BottomTab: {
        ProfileScreen: require("../screens/profile_screen/Profile_Screen").default,
        CartScreen: require("../screens/cart_screen/Cart_Screen").default,
        Categories_Screen: require("../screens/Categories_Screen/Categories_Screen").default,
    },
    Initial: {
        LoginScreen: require("../screens/initial_screen/Login_Screen").default,
        WelcomeScreen: require("../screens/initial_screen/Welcome_Screen").default,
       
        RegisterScreen: require("../screens/initial_screen/Register_Screen").default,
        SignUpScreen: require("../screens/initial_screen/Signnup_Screen").default,
        ForgetPasswordScreen: require("../screens/initial_screen/Forget_Password_Screen").default,
    },
    HomeScreen: {
        WishlistScreen: require("../screens/home_screen/WishlistScreen").default,
        NotificationScreen: require("../screens/home_screen/Notification_Screen").default,
        SearchScreen: require("../screens/others/Search_Screen").default,
        AdminScreen: require("../admin/Admin_Screen")?.default,
        AllProducts: require("../screens/home_screen/AllProduct")?.default,
        MyOrders: require("../screens/home_screen/MyOrders")?.default,
        SupportScreen: require("../screens/home_screen/SupportScreen")?.default
    },
    ProductScreen: {
        ProductDetailsScreen: require("../screens/others/Product_Details_Screen").default,
    },
    ProfileScreen: {
        ShopLocationScreen: require("../screens/profile_screen/Shoplocation_Hours").default,

    }

};

export const AllScreen = [
    { name: "BottomNavigation", component: CustomBottomTabs },
    ...Object.entries(Screens).flatMap(([_, category]) =>
        Object.entries(category).map(([name, component]) => ({ name, component }))
    ),
];
