// components/Categories.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Categories = () => {
    const categories = [
        {
            id: 1,
            name: 'Vegetables',
            image: require('../../assets/logo.png'),
            backgroundColor: '#E8F5E8'
        },
        {
            id: 2,
            name: 'Fruits',
            image: require('../../assets/logo.png'),
            backgroundColor: '#FFE8E8'
        },
        {
            id: 3,
            name: 'Meat &\nEggs',
            image: require('../../assets/logo.png'),
            backgroundColor: '#FFF0E8'
        },
        {
            id: 4,
            name: 'Drinks',
            image: require('../../assets/logo.png'),
            backgroundColor: '#E8F0FF'
        },
        {
            id: 5,
            name: 'Baker',
            image: require('../../assets/logo.png'),
            backgroundColor: '#F0E8FF'
        },
    ];

    const handleCategoryPress = (category) => {
        console.log('Category pressed:', category.name);
        // Add navigation logic here
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => handleCategoryPress(category)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.imageContainer, { backgroundColor: category.backgroundColor }]}>
                            <Image source={category.image} style={styles.categoryImage} />
                        </View>
                        <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: hp(3),
    },
    title: {
        fontSize: hp(2.8),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: hp(2),
        paddingLeft: hp(2)
    },
    scrollContainer: {
        paddingHorizontal: hp(2),
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: hp(1),
        width: hp(10),
    },
    imageContainer: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1),
        elevation: 2,
  
    },
    categoryImage: {
        width: hp(10),
        height: hp(10),
        resizeMode: 'contain',
    },
    categoryName: {
        fontSize: hp(1.6),
        color: '#666',
        textAlign: 'center',
        lineHeight: hp(2),
        fontWeight: '500',
    },
});

export default Categories;