import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';


const SearchBar = ({ children }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={hp(2.5)} color={"gray"} style={styles.iconLeft} />
      <View style={styles.input}>
        {children}
      </View>
   
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: hp(5),
    paddingHorizontal: wp(4),
    height: hp(6),
     elevation: .5
  },
  iconLeft: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: "#000",
  },
  iconRight: {
    marginLeft: wp(2),
  },
});
