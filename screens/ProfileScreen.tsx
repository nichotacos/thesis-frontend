import { useDispatch, useSelector } from "react-redux";
import { User } from "../types/User";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import { Ionicons, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import ProfileAvatar from "../components/UI/ProfileAvatar";
import { Achievement } from "../types/Achievement";
import fetchAchievements from "../api/achievements/fetchAchievements";
import { apiClient } from "../api/apiClient";
import WideButton from "../components/UI/WideButton";
import { logout } from "../store/userSlice";
import StreakFireSvg from "../assets/gamification/streak-fire-svg";

interface ProfileScreenProps {
    route: any;
}

export default function ProfileScreen({
    route
}: ProfileScreenProps) {
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const allAchievements = useSelector((state: { user: { allAchievements: Achievement[] } }) => state.user.allAchievements);
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    function handleAvatarUpload() {

    }

    if (isLoading || !userData || !allAchievements) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={{ paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'Inter-Bold', textAlign: 'center' }}>
                    Profil
                </Text>
            </View>
            <View style={styles.header}>
                <Pressable
                    style={styles.editButton}
                    onPress={() => navigation.navigate('ProfileSettingScreen')}
                >
                    <Ionicons name="settings" size={24} color="#A60000" />
                </Pressable>

                <View style={styles.profileContainer}>
                    <ProfileAvatar
                        uri={userData.profilePicture || null}
                        size={120}
                        userFullName={userData.userFullName || "Dummy User"}
                    />
                    <Text style={styles.username}>{userData.userFullName || "Language Learner"}</Text>
                    <Text style={styles.email}>{userData.username || "learner@example.com"}</Text>

                    {/* <View style={styles.levelContainer}> */}
                    {/* <Text style={styles.levelText}>Level {userData.currentLevel}</Text> */}
                    {/* <ProgressBar
                            progress={(user.xp % 100) / 100 || 0.75}
                            color="#A60000"
                            width={200}
                        /> */}
                    {/* </View> */}
                </View>
                <View style={styles.statisticsContainer}>
                    <Text style={styles.statisticsHeader}>Statistik</Text>
                    <View style={styles.statisticsContent}>
                        <View style={styles.statisticsItem}>
                            {/* <FontAwesome5 name="fire" size={24} color="#A60000" style={styles.statisticsIcon} /> */}
                            <StreakFireSvg width={32} height={32} style={styles.statisticsIcon} />
                            <View>
                                <Text style={styles.statisticsItemValue}>{userData.streak.highestStreak}</Text>
                                <Text style={styles.statisticsItemDescription}>Hari beruntun</Text>
                            </View>
                        </View>
                        <View style={styles.statisticsItem}>
                            <FontAwesome6 name="bolt" size={24} color="#ffd900" style={styles.statisticsIcon} />
                            <View>
                                <Text style={styles.statisticsItemValue}>{userData.totalExp}</Text>
                                <Text style={styles.statisticsItemDescription}>XP</Text>
                            </View>
                        </View>
                        <View style={styles.statisticsItem}>
                            <FontAwesome5 name="book-open" size={24} color="#A60000" style={styles.statisticsIcon} />
                            <View>
                                <Text style={styles.statisticsItemValue}>{userData.currentLearnLevel.name || "Bali"}</Text>
                                <Text style={styles.statisticsItemDescription}>Level saat ini</Text>
                            </View>
                        </View>
                        <View style={styles.statisticsItem}>
                            <Ionicons name="medal" size={24} color="#ffd900" style={styles.statisticsIcon} />
                            <View>
                                <Text style={styles.statisticsItemValue}>{userData.top3Count}</Text>
                                <Text style={styles.statisticsItemDescription}>3 besar</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.achievementContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={styles.statisticsHeader}>Pencapaian</Text>
                        <Pressable
                            onPress={() => navigation.navigate('AchievementScreen')}
                            android_disableSound={true}
                        >
                            <Text style={{ fontFamily: "Inter-Regular", borderBottomWidth: 1, borderBottomColor: 'black' }}>Lihat semua</Text>
                        </Pressable>
                    </View>
                    {[...allAchievements]
                        .sort((a, b) => {
                            const isAUnlocked = userData.achievements.some((ach) => ach.achievement._id === a._id);
                            const isBUnlocked = userData.achievements.some((ach) => ach.achievement._id === b._id);
                            return (isBUnlocked ? 1 : 0) - (isAUnlocked ? 1 : 0);
                        })
                        .map((achievement) => (
                            <View
                                key={achievement._id}
                                style={[
                                    styles.statisticsItem,
                                    {
                                        opacity: userData.achievements.some((a) => a.achievement._id === achievement._id) ? 1 : 0.5,
                                        marginBottom: 8,
                                    },
                                ]}
                            >
                                {achievement.code.includes("MODULE") ? (
                                    <FontAwesome5 name="book" size={24} color="#A60000" style={styles.statisticsIcon} />
                                ) : (
                                    <FontAwesome5 name="trophy" size={24} color="#A60000" style={styles.statisticsIcon} />
                                )}
                                <View>
                                    <Text style={styles.statisticsItemValue}>{achievement.title}</Text>
                                    <Text style={styles.statisticsItemDescription}>{achievement.description}</Text>
                                </View>
                            </View>
                        ))}

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
        padding: 20,
        paddingBottom: 50,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: '#F2F7FB',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    profileContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: 'Inter-Bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontFamily: 'Inter-Regular',
        marginTop: 4,
    },
    levelContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    levelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A60000',
        marginBottom: 5,
    },
    xpText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    statisticsContainer: {
        marginTop: 20,
    },
    statisticsHeader: {
        textAlign: 'left',
        fontSize: 20,
        fontFamily: 'Inter-Bold',
    },
    statisticsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        flexWrap: 'wrap',
        gap: 8,
    },
    statisticsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        padding: 10,
        flexBasis: '45%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
    },
    statisticsItemValue: {
        fontSize: 18,
        marginTop: 5,
        fontFamily: 'Inter-Bold',
    },
    statisticsItemDescription: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    statisticsIcon: {
        marginRight: 12,
    },
    achievementContainer: {
        marginTop: 12
    }
})

// register tambahin komitmen untuk reminder mingguan
// tambah unit review di akhir unit
// per kaliamt fill the blank
// pattern icon, warna, text
// ganti audio salah
// tambahan info modul selesai di level screen
// tambahin unlocked achievement
// buy avatar
// improve question screen