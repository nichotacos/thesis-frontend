import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../constants/styles";
import UserIdentity from "../components/homepage/UserIdentity";
import StreakContainer from "../components/homepage/StreakContainer";
import LearningWidget from "../components/homepage/LearningWidget";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { User } from '../types/User'

export default function HomeScreen() {
    const navigation = useNavigation();
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer}>
            <UserIdentity
                profilePicture="https://example.com/profile.jpg"
                userFullName={userData.userFullName}
                userLevel={userData.currentLevel}
                totalGems={userData.totalGems}
            />
            <StreakContainer
                totalStreak={5}
            />
            <Text style={styles.headerText}>Ayo Belajar!</Text>
            <View style={styles.widgetsContainer}>
                <LearningWidget
                    userSkillLevel="Jakarta"
                    userLatestModule={2}
                    userLatestModuleName="Hati-Hati di Jalan"
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
        fontSize: 24,
        fontFamily: "Inter-Bold",
        marginVertical: 16
    },
    widgetsContainer: {
        marginBottom: 128,
    }
})
