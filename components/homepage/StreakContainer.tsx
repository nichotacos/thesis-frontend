import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import WideButton from "../UI/WideButton";
import { User } from "../../types/User";
import claimDailyReward from "../../api/gamifications/claimDailyReward";
import { useDispatch } from "react-redux";
import { claimDailyReward as claimDailyRewardReducer } from "../../store/userSlice";
import { useState } from "react";
import { grantAchievement } from "../../api/achievements/grantAchievements";

interface StreakContainerProps {
    totalStreak: number;
    userData: Partial<User>;
}

const GEMS_AMOUNT = 20;

export default function StreakContainer({ totalStreak, userData }: StreakContainerProps) {
    const dispatch = useDispatch();
    const streakText = totalStreak > 0 ? `${totalStreak} hari beruntun!` : `Ayo mulai!`;
    let minimumBoundary = 1;
    let maximumBoundary = 5;
    const [isClaimed, setIsClaimed] = useState(userData.hasClaimedDailyReward);

    if (totalStreak < 4) {
        minimumBoundary = 1;
        maximumBoundary = 5;
    } else {
        minimumBoundary = totalStreak - 2;
        maximumBoundary = totalStreak + 4;
    }

    async function handleClaimReward() {
        try {
            setIsClaimed(true);
            dispatch(claimDailyRewardReducer({ gems: GEMS_AMOUNT }));
            await claimDailyReward(userData._id, GEMS_AMOUNT);
        } catch (error) {
            console.error("Error claiming daily reward:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.streakText}>{streakText}</Text>
            <View style={styles.dateList}>
                {Array.from({ length: (maximumBoundary == 5 ? maximumBoundary : maximumBoundary - minimumBoundary - 1) }, (_, i) => (
                    <View key={i} style={[
                        styles.gemsContainer,
                        i + minimumBoundary < totalStreak && { backgroundColor: GlobalStyles.colors.accent },
                        i + minimumBoundary === totalStreak && { backgroundColor: isClaimed ? undefined : GlobalStyles.colors.lighterPrimary, borderColor: 'white', borderWidth: 2 },
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
                onPress={handleClaimReward}
                text="Ambil Hadiahmu!"
                color={'black'}
                size={16}
                disabled={userData.isAbleToClaimDailyReward && !userData.hasClaimedDailyReward ? false : true}
                style={[
                    {
                        backgroundColor: 'white',
                        marginTop: 8,
                        paddingVertical: 12,
                        borderRadius: 16,
                    },
                    userData.isAbleToClaimDailyReward && !userData.hasClaimedDailyReward ? { opacity: 1 } : { opacity: 0.7 }
                ]}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d6110e',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 20,
        borderRadius: 18,
        marginTop: 8
    },
    streakText: {
        fontFamily: "Inter-Bold",
        fontSize: 18,
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