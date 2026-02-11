import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ConfirmationModal = ({
    visible,
    onCancel,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    cancelText = 'Cancel',
    confirmText = 'OK',
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
                <View style={{
                    width: wp(80),
                    backgroundColor: 'white',
                    borderRadius: hp(2),
                    padding: hp(3),
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                }}>
                    {/* Title */}
                    <Text
                        size={3}
                        style={{ textAlign: 'center', marginBottom: hp(1) }}
                    >
                        {title}
                    </Text>

                    {/* Message */}
                    <Text
                        style={{
                            textAlign: 'center',
                            marginBottom: hp(3),
                            color: '#666',
                        }}
                    >
                        {message}
                    </Text>

                    {/* Buttons */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={{
                                flex: 1,
                                marginRight: wp(2),
                                backgroundColor: '#ccc',
                                paddingVertical: hp(1.5),
                                borderRadius: hp(1),
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ fontWeight: 'bold' }}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={{
                                flex: 1,
                                marginLeft: wp(2),
                                backgroundColor: '#4CAF50',
                                paddingVertical: hp(1.5),
                                borderRadius: hp(1),
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmationModal;
