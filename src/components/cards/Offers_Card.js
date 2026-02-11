import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { offers_data } from '../../utils/dummy_data';

const OfferCard = () => {
    return (
        <FlatList
            horizontal
            data={offers_data}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: wp('2%') }}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.overlay}
                    >
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>{item.price}</Text>
                    </LinearGradient>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    card: {
        width: wp('35%'),
        height: hp('20%'),
        marginRight: wp('3%'),
        borderRadius: wp('2%'),
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('2%'),
        justifyContent: 'flex-end',
    },
    name: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: wp('3.5%'),
    },
    price: {
        color: '#fff',
        fontSize: wp('3%'),
    },
});

export default OfferCard;
