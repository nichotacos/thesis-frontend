import { View, Image, Pressable, Text, StyleSheet } from "react-native"
import StreakFireSvg from "../../assets/gamification/streak-fire-svg"
import HeartSVG from "../../assets/gamification/heart-svg"
import { useState } from "react";
import BuyHeartModal from "./BuyHeartModal";
import { GlobalStyles } from "../../constants/styles";

interface LevelModuleHeaderProps {
    totalGems: number;
    streakCount: number;
    heartCount: number;
    earliestLostHeartTime: string | null;
}

export default function LevelModuleHeader({
    totalGems,
    streakCount,
    heartCount,
    earliestLostHeartTime
}: LevelModuleHeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <View style={styles.header}>
            <BuyHeartModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onBuy={(quantity) => {
                    console.log(`Bought ${quantity} hearts`);
                    setIsModalOpen(false);
                }}
                availableHearts={heartCount}
                earliestLostHeartTime={earliestLostHeartTime || null}
            />

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
            <Pressable
                onPress={() => setIsModalOpen(true)}
                style={[
                    styles.gemsOrStreakContainer,
                    // { borderColor: heartCount > 0 ? "#FFB6C1" : "#D3D3D3", borderWidth: 6, padding: 4, borderRadius: 12 }
                ]}
            >
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
        color: GlobalStyles.colors.whiteFont
    },
}) 