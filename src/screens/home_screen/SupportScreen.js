import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Facebook, Instagram, Twitter } from 'lucide-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/support_style';

const SupportScreen = () => {
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState(null); // State to manage which FAQ is expanded

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210'); // Replace with your actual phone number
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@grocerystore.com?subject=Support Request'); // Replace with your actual email
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+919876543210&text=Hello, I need support with my grocery order.'); // Replace with your actual WhatsApp number
  };

  const handleSocialLink = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'You can browse products from the "All Products" screen, add them to your cart, and then proceed to reserve them for pickup from the cart screen.',
    },
    {
      question: 'Can I modify my order after placing it?',
      answer: 'Once an order is reserved, it cannot be modified directly through the app. Please contact our support team immediately if you need to make changes.',
    },
    {
      question: 'What are the payment options?',
      answer: 'Payment is collected at the store when you pick up your items. We accept Cash, Card, and various Mobile Payment options.',
    },
    {
      question: 'How long will my reserved items be held?',
      answer: 'Your reserved items will typically be held for 2 hours after you receive the "Ready for Pickup" notification. Please pick them up within this timeframe.',
    },
    {
      question: 'How do I track my order status?',
      answer: 'You can view the status of your pending and completed orders in the "My Orders" section of your profile.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.header.backgroundColor} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Contact Us Section */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Phone size={wp('6%')} color={styles.contactLink.color} style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={[styles.contactValue, styles.contactLink]}>+91 8838735751</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={styles.contactLabel.color} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Mail size={wp('6%')} color={styles.contactLink.color} style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email Us</Text>
              <Text style={[styles.contactValue, styles.contactLink]}>mariammalstoresoffice@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={styles.contactLabel.color} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.contactItem, styles.contactItemLast]} onPress={handleWhatsApp}>
            <MessageCircle size={wp('6%')} color={styles.contactLink.color} style={styles.contactIcon} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={[styles.contactValue, styles.contactLink]}>+91 8838735751</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp('5%')} color={styles.contactLabel.color} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity onPress={() => toggleFAQ(index)} style={styles.faqQuestionContainer}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFAQ === index ? (
                  <ChevronUp size={wp('5%')} color={styles.contactLabel.color} />
                ) : (
                  <ChevronDown size={wp('5%')} color={styles.contactLabel.color} />
                )}
              </TouchableOpacity>
              {expandedFAQ === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportScreen;