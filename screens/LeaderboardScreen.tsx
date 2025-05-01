import { FlatList, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { User } from "../types/User";
import { GlobalStyles } from "../constants/styles";
import { useEffect, useState } from "react";
import { getWeeklyLeaderboard } from "../api/user";

export default function LeaderboardScreen() {
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [leaderboard, setLeaderboard] = useState<{
        users: Partial<User>[];
        currentUser: {
            currentUserData: Partial<User>;
            rank: number;
        },
        message: string;
    }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userData) return;

        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const response = await getWeeklyLeaderboard(userData._id);
                console.log('Leaderboard data:', response.data);
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLeaderboard();
    }, [userData]);

    if (isLoading || !userData || !leaderboard) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loading...</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/gamification/leaderboard-background.jpg')} style={styles.container} resizeMode="cover">
                <Text style={styles.title}>Peringkat Mingguan</Text>
                <View style={styles.podiumContainer}>
                    <View style={styles.podiumBarContainer}>
                        <View style={[styles.podiumProfile]}>
                            <Image
                                source={{ uri: leaderboard.users[1].profilePicture }}
                                style={styles.podiumProfileImage}
                            />
                            <Text style={styles.podiumName}>{leaderboard.users[1].userFullName}</Text>
                            <View style={{ backgroundColor: 'white', padding: 4, paddingHorizontal: 8, borderRadius: 12 }}>
                                <Text style={styles.podiumExp}>{leaderboard.users[1].weeklyExp} exp</Text>
                            </View>
                        </View>
                        <View style={[styles.podiumBar, { height: 150 }]}>
                            <Text style={styles.podiumText}>2</Text>
                        </View>
                    </View>
                    <View style={styles.podiumBarContainer}>
                        <View style={[styles.podiumProfile]}>
                            <Image
                                source={{ uri: leaderboard.users[0].profilePicture }}
                                style={styles.podiumProfileImage}
                            />
                            <Text style={styles.podiumName}>{leaderboard.users[0].userFullName}</Text>
                            <View style={{ backgroundColor: 'white', padding: 4, paddingHorizontal: 8, borderRadius: 12 }}>
                                <Text style={styles.podiumExp}>{leaderboard.users[0].weeklyExp} exp</Text>
                            </View>
                        </View>
                        <View style={[styles.podiumBar, { height: 220 }]}>
                            <Text style={styles.podiumText}>1</Text>
                        </View>
                    </View>
                    <View style={styles.podiumBarContainer}>
                        <View style={[styles.podiumProfile]}>
                            <Image
                                source={{ uri: leaderboard.users[2].profilePicture }}
                                style={styles.podiumProfileImage}
                            />
                            <Text style={styles.podiumName}>{leaderboard.users[2].userFullName}</Text>
                            <View style={{ backgroundColor: 'white', padding: 4, paddingHorizontal: 8, borderRadius: 12 }}>
                                <Text style={styles.podiumExp}>{leaderboard.users[2].weeklyExp} exp</Text>
                            </View>
                        </View>
                        <View style={[styles.podiumBar, { height: 100 }]}>
                            <Text style={styles.podiumText}>3</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data={leaderboard.users}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => {
                            if (index < 3) return null;
                            return (
                                <View style={[
                                    {
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingVertical: 12,
                                        borderBottomColor: GlobalStyles.colors.primary,
                                        borderBottomWidth: 1,
                                        paddingHorizontal: 4,
                                    },
                                ]}>
                                    <Text style={{ fontSize: 18, fontFamily: "Inter-Bold", color: 'black', marginRight: 16 }}>{index + 1}</Text>
                                    <Image
                                        source={{ uri: item.profilePicture }}
                                        style={styles.listProfileImage}
                                    />
                                    <Text style={[styles.listName, { marginLeft: 16 }]}>{item.userFullName}</Text>
                                    <View style={{ backgroundColor: 'white', padding: 4, paddingHorizontal: 8, borderRadius: 12, marginLeft: 'auto' }}>
                                        <Text style={styles.podiumExp}>{item.weeklyExp} exp</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        marginVertical: 8,
        textAlign: "center",
        color: GlobalStyles.colors.whiteFont,
    },
    podiumContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: 16,
        paddingHorizontal: 24,
        height: 400,
        // gap: 8,
    },
    podiumBarContainer: {
        alignItems: "center",
    },
    podiumBar: {
        width: 100,
        backgroundColor: GlobalStyles.colors.primary,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    podiumText: {
        fontSize: 32,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.accent,
    },
    podiumProfile: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1,
        marginVertical: 8,
        width: '90%',
    },
    podiumProfileImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: GlobalStyles.colors.primary,
        marginBottom: 8,
    },
    podiumName: {
        fontSize: 16,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.whiteFont,
        marginBottom: 6,
        textAlign: "center",
    },
    podiumExp: {
        fontSize: 14,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.primary,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: GlobalStyles.colors.lightBackground,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
    },
    listProfileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: GlobalStyles.colors.primary,
    },
    listName: {
        fontSize: 16,
        fontFamily: "Inter-Bold",
        color: 'black',
        marginLeft: 16,
    }
})
