import { View, Image, Pressable, Text, StyleSheet } from "react-native"
import StreakFireSvg from "../../assets/gamification/streak-fire-svg"
import HeartSVG from "../../assets/gamification/heart-svg"

interface LevelModuleHeaderProps {
    totalGems: number;
    streakCount: number;
    heartCount: number;
}

export default function LevelModuleHeader({
    totalGems,
    streakCount,
    heartCount,
}: LevelModuleHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.gemsOrStreakContainer}>
                <Image
                    source={require('../../assets/gamification/gems.png')}
                    style={{
                        width: 40,
                        height: 40,
                        overflow: "hidden",
                    }}
                />
                <Text style={styles.gemsOrStreakText}>{totalGems}</Text>
            </View>
            <View style={styles.gemsOrStreakContainer}>
                <StreakFireSvg width={40} height={40} />
                <Text style={styles.gemsOrStreakText}>{streakCount}</Text>
            </View>
            <Pressable onPress={() => { console.log('hearts pressed') }} style={styles.gemsOrStreakContainer}>
                <HeartSVG width={40} height={40} />
                <Text style={styles.gemsOrStreakText}>{heartCount}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        gap: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    gemsOrStreakContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    gemsOrStreakText: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        marginLeft: 8,
    },
}) 