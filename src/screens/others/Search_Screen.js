import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from '../../styles/Color';


let typingTimeout = null;

const SearchScreen = () => {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const showKeyboard = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(showKeyboard);
  }, []);


  const handleInputChange = (text) => {
    setSearchTerm(text);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (text.length === 0) {
      setSearchResults([]); // Clear results when text is cleared
    } else if (text.length > 3) {
      typingTimeout = setTimeout(() => {
        fetchData(text);
      }, 500);
    }
  };




  return (
    <>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: "#fff",
            paddingBottom: hp(4),
            borderBottomRightRadius: hp(4),
            borderBottomLeftRadius: hp(4),
            elevation: 4,
            paddingTop: hp(3)
          }}
        >
          {/* <View >
            <Header title="" />
          </View> */}

          <View>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder='Search '
              placeholderTextColor={COLORS.textHeader}
              returnKeyType="search"
              value={searchTerm}
              onChangeText={handleInputChange}
            />
          </View>
        </View>


      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#d8f3dc",
    marginHorizontal: hp(2),
    paddingLeft: hp(2),
    height: hp(7),
    borderWidth: 1.5,
    borderColor: "#95d5b2",
    borderRadius: hp(1),
    color: COLORS.textHeader,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: hp(1),
    elevation: 3,
    marginBottom: hp(2),
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  image: {
    width: wp(20),
    height: wp(20),
    marginRight: hp(2),
    borderBottomRightRadius: hp(3),

  },
  details: {
    flex: 1,
  },
  turfName: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: '#000',
  },
  address: {
    fontSize: hp(1.8),
    color: '#555',
    marginTop: hp(0.5),
  },
});

export default SearchScreen;
