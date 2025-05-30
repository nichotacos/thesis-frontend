import { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Button,
    StyleSheet,
    Pressable,
    Image
} from 'react-native';
import HeartSVG from '../../assets/gamification/heart-svg';
import { AntDesign } from '@expo/vector-icons';

interface BuyHeartModalProps {
    isVisible: boolean;
    onClose: () => void;
    onBuy: (quantity: number) => void;
    availableHearts: number;
    earliestLostHeartTime: string;
}

export default function BuyHeartModal({
    isVisible,
    onClose,
    onBuy,
    availableHearts,
    earliestLostHeartTime
}: BuyHeartModalProps) {
    const earliestLostDate = earliestLostHeartTime ? new Date(earliestLostHeartTime) : null;
    const now = new Date();

    console.log('Earliest Lost Heart Time:', earliestLostHeartTime);

    const diffMs = earliestLostDate ? now.getTime() - earliestLostDate.getTime() : 0;
    const diffInMinutes = earliestLostDate ? 30 - Math.max(Math.floor(diffMs / 60000), 0) : 0;

    const handleBuy = () => {
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.title}>Beli Hati</Text>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            onPress={onClose}
                            style={{ alignSelf: 'flex-start' }}
                        />
                    </View>
                    <HeartSVG width={100} height={100} />
                    {availableHearts < 5 ? (
                        <View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.description}>
                                    Hati berikutnya akan tersedia dalam
                                </Text>
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                                    {diffInMinutes} menit
                                </Text>
                            </View>
                            <Pressable
                                onPress={handleBuy}
                                style={{
                                    borderWidth: 2,
                                    borderColor: 'red',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    padding: 10,
                                    borderRadius: 12,
                                    marginTop: 20,
                                    width: '75%',
                                    alignSelf: 'center',
                                }}
                            >
                                <Text style={{ color: 'black', fontFamily: 'Inter-Bold' }}>Beli Hati</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/gamification/gems.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                    <Text style={{ color: 'black', fontFamily: 'Inter-Bold', marginLeft: 4 }}>50</Text>
                                </View>
                            </Pressable>
                        </View>
                    ) : (
                        <Text style={[styles.description, { marginHorizontal: 24, lineHeight: 24, marginTop: 12 }]}>
                            Kamu sudah memiliki cukup hati untuk melanjutkan belajar.
                        </Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'Inter-Bold',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Inter-Regular',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
})