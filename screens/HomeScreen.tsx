import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../constants/styles";
import UserIdentity from "../components/homepage/UserIdentity";
import StreakContainer from "../components/homepage/StreakContainer";
import LearningWidget from "../components/homepage/LearningWidget";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { User } from '../types/User'
import { useState } from "react";
import Modal from "../components/UI/Modal";
import TextButton from "../components/UI/TextButton";

export default function HomeScreen() {
    const navigation = useNavigation();
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('userData:', userData);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer}>
            <UserIdentity
                profilePicture={userData.profilePicture}
                userFullName={userData.userFullName}
                userLevel={userData.currentLevel}
                totalGems={userData.totalGems}
            />
            <StreakContainer
                totalStreak={userData.streak.streakCount}
                userData={userData}
            />
            <Text style={styles.headerText}>Ayo Belajar!</Text>
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
                {/* <LearningWidget
                    userSkillLevel={userData.currentLearnLevel.name}
                    userLatestModule={userData.currentModule ? userData.currentModule.index : 1}
                    // userLatestModuleName={userData.currentModule.name}
                    userLatestModuleName={userData.currentModule ? userData.currentModule.name : "Modul Tidak Ditemukan"}
                    isDictionary={false}
                    onPress={() => setIsModalOpen(true)}
                /> */}
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
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: GlobalStyles.colors.lightBackground,
    },
    scrollViewContainer: {
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
