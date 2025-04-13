import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { GlobalStyles } from "../constants/styles";
import UserIdentity from "../components/homepage/UserIdentity";
import StreakContainer from "../components/homepage/StreakContainer";
import LearningWidget from "../components/homepage/LearningWidget";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer}>
            <UserIdentity
                profilePicture="https://example.com/profile.jpg"
                userFullName="Nicholas Yang"
                userLevel={4}
                totalGems={100}
            />
            <StreakContainer
                totalStreak={5}
            />
            <Text style={styles.headerText}>Latihan Harian</Text>
            <View>
                <LearningWidget
                    wordsLearned={100}
                    isDictionary={true}
                    onPress={() => { }}
                />
                <LearningWidget
                    userSkillLevel="Jakarta"
                    userLatestModule={2}
                    userLatestModuleName="Hati-Hati di Jalan"
                    isDictionary={false}
                    onPress={() => {
                        navigation.jumpTo("LevelScreen")
                    }}
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
        marginVertical: 12
    },
})
