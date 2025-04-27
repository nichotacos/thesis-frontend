import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import WideButton from "../UI/WideButton";

interface StreakContainerProps {
    totalStreak: number;
}

export default function StreakContainer({ totalStreak }: StreakContainerProps) {
    const streakText = totalStreak > 0 ? `${totalStreak} hari beruntun!` : `Ayo mulai!`;
    let minimumBoundary = 1;
    let maximumBoundary = 5;

    if (totalStreak < 4) {
        minimumBoundary = 1;
        maximumBoundary = 5;
    } else {
        minimumBoundary = totalStreak - 2;
        maximumBoundary = totalStreak + 4;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.streakText}>{streakText}</Text>
            <View style={styles.dateList}>
                {Array.from({ length: (maximumBoundary == 5 ? maximumBoundary : maximumBoundary - minimumBoundary - 1) }, (_, i) => (
                    <View key={i} style={[
                        styles.gemsContainer,
                        i + minimumBoundary < totalStreak && { backgroundColor: GlobalStyles.colors.accent },
                        i + minimumBoundary === totalStreak && { backgroundColor: GlobalStyles.colors.lighterPrimary, borderColor: 'white', borderWidth: 2 },
                        i + minimumBoundary > totalStreak && { backgroundColor: GlobalStyles.colors.lighterPrimary, opacity: 0.4 }
                    ]}>
                        <Image
                            source={require("../../assets/gamification/gems.png")}
                            style={styles.gemsImage}
                        />
                        <Text style={styles.streakText}>{i + minimumBoundary}</Text>
                    </View>
                ))}
            </View>
            <WideButton
                onPress={() => { }}
                text="Ambil Hadiahmu!"
                color={GlobalStyles.colors.whiteFont}
                size={18}
                style={{
                    backgroundColor: GlobalStyles.colors.accent,
                    marginTop: 8,
                    paddingVertical: 12,
                    borderRadius: 16,
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: GlobalStyles.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8
    },
    streakText: {
        fontFamily: "Inter-Bold",
        fontSize: 22,
        color: GlobalStyles.colors.whiteFont,
    },
    dateList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        paddingVertical: 4,
    },
    gemsContainer: {
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    gemsImage: {
        width: 24,
        height: 24,
        marginTop: 4,
        marginLeft: 4,
    }
})