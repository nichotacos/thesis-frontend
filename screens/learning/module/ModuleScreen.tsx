import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { useSelector } from "react-redux";
import { User } from "../../../types/User";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ModuleScreenProps {
    route: any;
}

export default function ModuleScreen({
    route
}: ModuleScreenProps) {
    const { level } = route.params;
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!userData || isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.gemsOrStreakContainer}>
                    <Image
                        source={require('../../../assets/gamification/gems.png')}
                        style={{
                            width: 40,
                            height: 40,
                            overflow: "hidden",
                        }}
                    />
                    <Text style={styles.gemsOrStreakText}>{userData.totalGems}</Text>
                </View>
                <View style={styles.gemsOrStreakContainer}>
                    <Image
                        source={require('../../../assets/gamification/streak.png')}
                        style={{
                            width: 40,
                            height: 40,
                            overflow: "hidden",
                        }}
                    />
                    <Text style={styles.gemsOrStreakText}>{userData.totalStreak}</Text>
                </View>
            </View>
            <View style={styles.moduleHeader}>
                <View>
                    <Ionicons
                        name="chevron-back-outline"
                        size={40}
                        color={GlobalStyles.colors.whiteFont}
                        onPress={() => {
                            console.log('prev module');
                        }}
                    />
                </View>
                <View style={styles.moduleTitleAndDescriptionContainer}>
                    <Text style={styles.moduleTitle}>{level.name}</Text>
                    <Text style={styles.moduleDescription}>{level.description}</Text>
                </View>
                <View>
                    <Ionicons
                        name="chevron-forward-outline"
                        size={40}
                        color={GlobalStyles.colors.whiteFont}
                        onPress={() => {
                            console.log('next module');
                        }}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: GlobalStyles.colors.lightBackground
    },
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
    moduleHeader: {
        flexDirection: "row",
        marginVertical: 16,
        backgroundColor: GlobalStyles.colors.lightBlue,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8
    },
    moduleTitleAndDescriptionContainer: {
        width: "75%",
    },
    moduleTitle: {
        fontFamily: "Inter-Bold",
        fontSize: 24,
        marginBottom: 4,
        textAlign: "center",
    },
    moduleDescription: {
        fontFamily: "Inter-Regular",
        fontSize: 16,
        textAlign: "center",
    },

})
