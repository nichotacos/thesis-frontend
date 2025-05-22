import { StyleSheet, Text, View, Image, ScrollView, FlatList, Pressable } from "react-native";
import { GlobalStyles } from "../constants/styles";
import UserIdentity from "../components/homepage/UserIdentity";
import StreakContainer from "../components/homepage/StreakContainer";
import LearningWidget from "../components/homepage/LearningWidget";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { User } from '../types/User'
import { useEffect, useState } from "react";
import Modal from "../components/UI/Modal";
import TextButton from "../components/UI/TextButton";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot"
import { apiClient } from "../api/apiClient";
import { Level } from "../types/Level";

const CopilotText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);

export default function HomeScreen() {
    const navigation = useNavigation();
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const fetchedLevels = useSelector((state: { user: { level: Level[] } }) => state.user.level);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { start, copilotEvents } = useCopilot();

    console.log('userData:', userData);

    useEffect(() => {
        start();
    }, [])

    useEffect(() => {
        const onStop = () => {
            console.log("Copilot tutorial finished");
        };

        copilotEvents.on("stop", onStop);
        return () => {
            copilotEvents.off("stop", onStop);
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* <CopilotStep
                text="Selamat datang di aplikasi ini! Di sini kamu bisa belajar bahasa Indonesia dengan cara yang asik!"
                order={1}
                name="user-identity"
            > */}
            <WalkthroughableView style={{}}>
                <UserIdentity
                    profilePicture={userData.profilePicture}
                    userFullName={userData.userFullName}
                    userLevel={userData.currentLevel}
                    totalGems={userData.totalGems}
                />
            </WalkthroughableView>
            {/* </CopilotStep> */}
            {/* <CopilotStep
                text="Jangan lupa untuk mengklaim hadiah harianmu! Hadiah ini bisa kamu gunakan untuk membeli item di dalam aplikasi."
                order={2}
                name="streak-container"
            > */}
            <WalkthroughableView>
                <StreakContainer
                    totalStreak={userData.streak.streakCount}
                    userData={userData}
                />
            </WalkthroughableView>
            {/* </CopilotStep> */}
            <Text style={styles.headerText}>Ayo Belajar!</Text>
            <FlatList
                data={fetchedLevels}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            marginRight: 16,
                        }}
                    >
                        <Pressable onPress={() => { }}>
                            <Image
                                source={{ uri: item.level_image }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 50,
                                    borderColor: GlobalStyles.colors.primary,
                                    borderWidth: 3
                                }}
                            />
                        </Pressable>
                    </View>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                    flexGrow: 0,
                    marginBottom: 16,
                }}
            />
            <View style={styles.widgetsContainer}>
                <LearningWidget
                    userSkillLevel={userData.currentLearnLevel.name}
                    userLatestModule={userData.currentModule ? userData.currentModule.index : 1}
                    // userLatestModuleName={userData.currentModule.name}
                    userLatestModuleName={userData.currentModule ? userData.currentModule.name : "Modul Tidak Ditemukan"}
                    isDictionary={false}
                    onPress={() => {
                        navigation.jumpTo("LevelScreen")
                    }}
                />
                <LearningWidget
                    wordsLearned={100}
                    isDictionary={true}
                    onPress={() => { }}
                />
            </View>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                type="level"
                receivedAmount={20}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: GlobalStyles.colors.lightBackground,
        justifyContent: "center",
    },
    headerText: {
        fontSize: 22,
        fontFamily: "Inter-Bold",
        marginVertical: 16
    },
    widgetsContainer: {
        marginBottom: 0,
    }
})
