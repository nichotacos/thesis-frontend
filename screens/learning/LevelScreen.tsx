import { FlatList, ScrollView, StyleSheet, Text, View, Image, Pressable } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import LevelStamp from "../../components/learning/LevelStamp";
import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { apiClient } from "../../api/apiClient";
import { Level } from "../../types/Level";
import { useSelector } from "react-redux";
import { User } from "../../types/User";
import { GlobalContents } from "../../constants/contents";
import { useNavigation } from "@react-navigation/native";
import { Fontisto } from "@expo/vector-icons";
import StreakFireSvg from "../../assets/gamification/streak-fire-svg";
import HeartSVG from "../../assets/gamification/heart-svg";
import LevelModuleHeader from "../../components/learning/LevelModuleHeader";
import ScreenLoading from "../../components/UI/ScreenLoading";

interface LevelScreenProps {
    route: any;
}

export default function LevelScreen({
    route
}: LevelScreenProps) {
    const [levels, setLevels] = useState<Level[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const navigation = useNavigation();

    const stampPosition = {
        top: 40,
        left: 20,
        right: 20,
    }

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get('/level');
                setLevels(response.data.levels);
            } catch (error) {
                console.error('Error fetching levels:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLevels();
    }, []);

    if (isLoading || !userData) {
        return (
            <View style={styles.container}>
                <ScreenLoading />
            </View>
        )
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[styles.content, { height: levels.length * 195 + 160 }]}
        >
            <LevelModuleHeader
                heartCount={userData.hearts.current}
                streakCount={userData.streak.streakCount}
                totalGems={userData.totalGems}
            />
            {levels.map((level, index) => {
                return (
                    <View
                        key={index}
                    >
                        <LevelStamp
                            imageSource={{ uri: level.level_image }}
                            name={level.name}
                            style={[
                                index % 2 === 0 ? { left: 20 } : { right: 20 },
                                { top: stampPosition.top + 195 * index },
                                { opacity: userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel ? 0.5 : 1 },
                            ]}
                            borderStyle={{
                                borderWidth: 6,
                                borderColor: userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel ? "grey" : GlobalStyles.colors.primary,
                                borderRadius: 100,
                            }}
                            onPress={() => {
                                navigation.navigate("ModuleScreen", {
                                    level: level,
                                    nextLevel: levels[index + 1],
                                })
                            }}
                            disabled={userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel}
                            completedModules={userData.completedModules.filter((module) => module.module.level._id === level._id).length}
                            totalModules={level.modules.length}
                        />
                        {userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel && (
                            <Fontisto
                                name="locked"
                                size={74}
                                color="grey"
                                style={{
                                    position: "absolute",
                                    top: stampPosition.top + 195 * index + 35,
                                    left: index % 2 === 0 ? 53 : undefined,
                                    right: index % 2 !== 0 ? 50 : undefined,
                                    zIndex: 2,
                                    opacity: 0.8,
                                }}
                            />
                        )}
                        {/* TODO: Atur path yang sesuai */}
                        {index !== levels.length - 1 && (
                            <Svg viewBox="0 0 1230 1500" width={680} height={700} style={{
                                position: "absolute",
                                top: 80 + 195 * index,
                                left: index % 2 === 0 && -20,
                                right: index % 2 !== 0 && -170,
                            }}
                            >
                                <Path
                                    d="M243.584228515625,102.09318542480469C297.1923522949219,105.64515686035156,469.38470458984375,75.47789255777995,515.2329711914062,103.40501403808594C561.0812377929688,131.33213551839194,526.4336853027344,245.2807642618815,528.673828125,320.6559143066406"
                                    fill="none"
                                    stroke={userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel ? "grey" : GlobalStyles.colors.primary}
                                    strokeWidth={24}
                                    strokeLinecap="round"
                                    transform={[
                                        { scaleX: index % 2 !== 0 && -1 },
                                        { translateX: index % 2 !== 0 ? 900 : 0 },
                                    ]}
                                    opacity={userData.currentLearnLevel.actualBipaLevel < level.actualBipaLevel ? 0.5 : 1}
                                />
                            </Svg>
                        )}
                    </View>
                )
            })}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
        padding: 16
    },
    content: {
        paddingHorizontal: 16,
        position: "relative",
        backgroundColor: GlobalStyles.colors.lightBackground,
    },
})