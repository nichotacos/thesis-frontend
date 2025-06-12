import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function RemainingBoostTime({ expiresAt }: { expiresAt: string }) {
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const userData = useSelector((state: { user: { userInfo: { expiresAt: string } } }) => state.user.userInfo);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                const now = new Date().getTime();
                const end = new Date(expiresAt).getTime();
                const diff = end - now;
                return diff > 0 ? diff : 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    });

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Waktu Boost Tersisa:</Text>
            <Text style={{ fontSize: 18, color: '#333' }}>{formatTime(remainingTime)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
});
