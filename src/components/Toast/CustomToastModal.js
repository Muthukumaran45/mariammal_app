import React, { useEffect } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ToastModal = ({
    visible,
    onClose,
    title = '',
    message = '',
    lottieFile = null,
    isSuccess = true,
    showCloseButton = true,
    autoClose = false,
    autoCloseDelay = 2000,
    buttonText = 'OK',
}) => {
    useEffect(() => {
        if (visible && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [visible, autoClose, autoCloseDelay, onClose]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: hp(2),
                    padding: hp(3),
                    alignItems: 'center',
                    width: wp(80),
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    {/* Animation or Icon */}
                    {lottieFile ? (
                        <LottieView
                            source={lottieFile}
                            autoPlay
                            loop={false}
                            style={{
                                width: hp(12),
                                height: hp(12),
                            }}
                        />
                    ) : (
                        <View style={{
                            width: hp(12),
                            height: hp(12),
                            borderRadius: hp(6),
                            backgroundColor: isSuccess ? '#e8f5e9' : '#ffebee',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: hp(2)
                        }}>
                            <Ionicons
                                name={isSuccess ? 'checkmark-circle' : 'close-circle'}
                                size={hp(8)}
                                color={isSuccess ? '#4CAF50' : '#f44336'}
                            />
                        </View>
                    )}

                    {/* Title */}
                    {title !== '' && (
                        <Text
                            size={3}
                            style={{
                                textAlign: 'center',
                                marginTop: hp(2),
                                color: isSuccess ? '#4CAF50' : '#f44336'
                            }}
                        >
                            {title}
                        </Text>
                    )}

                    {/* Message */}
                    {message !== '' && (
                        <Text
                            style={{
                                textAlign: 'center',
                                marginTop: hp(1),
                                color: '#666'
                            }}
                        >
                            {message}
                        </Text>
                    )}

                    {/* Close Button */}
                    {showCloseButton && (!autoClose || !isSuccess) && (
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                marginTop: hp(3),
                                backgroundColor: isSuccess ? '#4CAF50' : '#f44336',
                                paddingHorizontal: hp(4),
                                paddingVertical: hp(1.5),
                                borderRadius: hp(1),
                                minWidth: wp(30),
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {buttonText}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ToastModal;
