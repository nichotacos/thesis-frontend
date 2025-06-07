import { Alert, FlatList, Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { useSelector } from "react-redux";
import { User } from "../../../types/User";
import { useEffect, useState } from "react";
import { AntDesign, Fontisto, Ionicons } from "@expo/vector-icons";
import ModuleStamp from "../../../components/learning/ModuleStamp";
import { Module } from "../../../types/Module";
import { apiClient } from "../../../api/apiClient";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle, Defs, G, Line, Marker, Path, Polygon } from "react-native-svg";
import StreakFireSvg from "../../../assets/gamification/streak-fire-svg";
import HeartSVG from "../../../assets/gamification/heart-svg";
import TrophySVG from "../../../assets/gamification/trophy-svg";
import LevelModuleHeader from "../../../components/learning/LevelModuleHeader";
import ScreenLoading from "../../../components/UI/ScreenLoading";

interface ModuleScreenProps {
    route: any;
}

const getLevelBackground = (levelName: string): ImageSourcePropType => {
    switch (levelName) {
        case "Bali":
            return require("../../../assets/background/bali-background.png");
        case "Jakarta":
            return require("../../../assets/background/jakarta-background.png");
        case "Surabaya":
            return require("../../../assets/background/surabaya-background.png");
        case "Aceh":
            return require("../../../assets/background/aceh-background.png");
        case "Yogyakarta":
            return require("../../../assets/background/yogyakarta-background.png");
        case "Padang":
            return require("../../../assets/background/padang-background.png");
        default:
            return require("../../../assets/background/bali-background.png");

    }
}

export default function ModuleScreen({
    route
}: ModuleScreenProps) {
    const { level, nextLevel } = route.params;
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modules, setModules] = useState<Module[]>([]);
    const navigation = useNavigation();
    const completedModules = userData.completedModules || [];

    useEffect(() => {
        async function fetchModules() {
            try {
                setIsLoading(true);
                const response = await apiClient.post(
                    `/module`,
                    {
                        levelIds: [level._id]
                    }
                );
                setModules(response.data.data);
                console.log('Fetched modules:', response.data.data);
            } catch (error) {
                console.error('Error fetching modules:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchModules();
    }, []);

    if (!userData || isLoading) {
        return (
            <View style={styles.container}>
                <ScreenLoading />
            </View>
        )
    }

    const showCompletedReviewAlert = () => {
        Alert.alert(
            'Kamu telah menyelesaikan Review ini',
            'Silakan lanjut ke modul berikutnya.',
            [
                { text: 'Tutup', style: 'cancel' }
            ],
            { cancelable: true },
        )
    }
    console.log('level dari params gan', level)


    return (
        <ImageBackground
            source={getLevelBackground(level.name)}
            style={{
                flex: 1,
            }}
        >
            <View style={styles.container}>
                <LevelModuleHeader
                    heartCount={userData.hearts.current}
                    streakCount={userData.streak.streakCount}
                    totalGems={userData.totalGems}
                    earliestLostHeartTime={userData.hearts.lostAt[0] || null}
                />
                <View style={styles.moduleHeader}>
                    {/* <View style={styles.moduleTitleAndDescriptionContainer}>
                        <Text style={styles.moduleTitle}>{level.name}</Text>
                        <Text style={styles.moduleDescription}>{level.description}</Text>
                    </View> */}
                </View>
                <FlatList
                    data={modules}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        const completedModules = userData.completedModules.map((m) => m.module._id);
                        const isCompleted = completedModules.includes(item._id);

                        const moduleIndex = modules.findIndex((m) => m._id === item._id);
                        const lastCompletedIndex = Math.max(
                            ...userData.completedModules.map((m) =>
                                modules.findIndex((mod) => mod._id === m.module._id)
                            ),
                            -1 // fallback if no modules completed
                        );

                        const isUnlocked = moduleIndex <= lastCompletedIndex + 1;
                        const isDisabled = !isUnlocked;
                        const opacity = isUnlocked ? 1 : 0.8;

                        return (
                            <View>
                                {item.isUnitReview === false && (
                                    <>
                                        <ModuleStamp
                                            index={index + 1}
                                            name={item.name}
                                            style={{
                                                left: index % 2 === 0 ? 20 : undefined,
                                                right: index % 2 !== 0 ? 20 : undefined,
                                                top: isDisabled ? 55 + 120 * index : 20 + 120 * index,
                                                opacity,
                                                zIndex: 1,
                                            }}
                                            onPress={() =>
                                                navigation.navigate("QuestionScreen", {
                                                    module: item,
                                                    isLastModule: index === (modules.length - 1),
                                                    nextLevel: nextLevel,
                                                })
                                            }
                                            disabled={isDisabled}
                                            score={
                                                userData.completedModules.find((m) => m.module._id === item._id)
                                                    ?.score || 0
                                            }
                                        />

                                        {isDisabled && (
                                            <Fontisto
                                                name="locked"
                                                size={52}
                                                color="grey"
                                                style={{
                                                    position: "absolute",
                                                    top: isDisabled ? 55 + 120 * index + 22 : 20 + 120 * index + 22,
                                                    left: index % 2 === 0 ? 49 : undefined,
                                                    right: index % 2 !== 0 ? 48 : undefined,
                                                    zIndex: 2,
                                                    opacity: 0.8,
                                                }}
                                            />
                                        )}

                                        {index === modules.length - 2 ? (
                                            <Svg
                                                width={100}
                                                height={100}
                                                viewBox="0 0 100 100"
                                                style={{
                                                    position: "absolute",
                                                    top: 58 + 120 * index,
                                                    left: index % 2 === 0 && 129,
                                                    right: index % 2 !== 0 && 119
                                                }}
                                            >
                                                <Circle
                                                    r={10}
                                                    cx={50}
                                                    cy={50}
                                                    fill={GlobalStyles.colors.primary}
                                                />
                                            </Svg>
                                        ) : index % 2 === 0 ? (
                                            <>
                                                <Svg
                                                    viewBox="0 0 1230 1500"
                                                    width={380}
                                                    height={255}
                                                    style={{
                                                        position: "absolute",
                                                        top: 95 + 120 * index,
                                                        left: index % 2 === 0 && 25,
                                                    }}
                                                >
                                                    <G
                                                        strokeWidth="40"
                                                        stroke={GlobalStyles.colors.primary}
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeDasharray="23.5 0"
                                                        transform="rotate(45, 400, 400)"
                                                    >
                                                        <Line
                                                            x1="145.5"
                                                            y1="145.5"
                                                            x2="654.5"
                                                            y2="654.5"
                                                            markerEnd="url(#marker)"
                                                        />
                                                    </G>
                                                    <Defs>
                                                        <Marker
                                                            markerWidth="1"
                                                            markerHeight="1"
                                                            refX="0.5"
                                                            refY="0.5"
                                                            viewBox="0 0 1 1"
                                                            orient="auto"
                                                            id="marker"
                                                        >
                                                            <Polygon
                                                                points="0,1 0,0 1,0.5"
                                                            />
                                                        </Marker>
                                                    </Defs>
                                                </Svg>
                                                <Svg
                                                    width={100}
                                                    height={100}
                                                    viewBox="0 0 100 100"
                                                    style={{
                                                        position: "absolute",
                                                        top: 53 + 120 * index,
                                                        left: index % 2 === 0 && 129,
                                                    }}
                                                >
                                                    <Circle
                                                        r={10}
                                                        cx={50}
                                                        cy={50}
                                                        fill={GlobalStyles.colors.primary}
                                                    />
                                                </Svg>
                                            </>
                                        ) : (
                                            <>
                                                <Svg
                                                    viewBox="0 0 1230 1500"
                                                    width={380}
                                                    height={255}
                                                    style={{
                                                        position: "absolute",
                                                        top: 95 + 120 * index,
                                                        right: index % 2 !== 0 && -58,
                                                    }}
                                                >
                                                    <G
                                                        strokeWidth="40"
                                                        stroke={GlobalStyles.colors.primary}
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeDasharray="23.5 0"
                                                        transform="rotate(45, 400, 400)"
                                                    >
                                                        <Line
                                                            x1="145.5"
                                                            y1="145.5"
                                                            x2="654.5"
                                                            y2="654.5"
                                                            markerEnd="url(#marker)"
                                                        />
                                                    </G>
                                                    <Defs>
                                                        <Marker
                                                            markerWidth="1"
                                                            markerHeight="1"
                                                            refX="0.5"
                                                            refY="0.5"
                                                            viewBox="0 0 1 1"
                                                            orient="auto"
                                                            id="marker"
                                                        >
                                                            <Polygon
                                                                points="0,1 0,0 1,0.5"
                                                            />
                                                        </Marker>
                                                    </Defs>
                                                </Svg>
                                                <Svg
                                                    width={100}
                                                    height={100}
                                                    viewBox="0 0 100 100"
                                                    style={{
                                                        position: "absolute",
                                                        top: 58 + 120 * index,
                                                        right: index % 2 !== 0 && 119,
                                                    }}
                                                >
                                                    <Circle
                                                        r={10}
                                                        cx={50}
                                                        cy={50}
                                                        fill={GlobalStyles.colors.primary}
                                                    />
                                                </Svg>
                                            </>
                                        )}
                                    </>
                                )}

                                {item.isUnitReview && (
                                    <TrophySVG
                                        width={120}
                                        height={120}
                                        style={{
                                            position: "absolute",
                                            top: 70 + 120 * index,
                                            left: '35%',
                                            opacity,
                                            zIndex: 1,
                                        }}
                                        onPress={() =>
                                            userData.completedModules.find((m) => m.module._id === item._id) ?
                                                showCompletedReviewAlert() :
                                                navigation.navigate("QuestionScreen", {
                                                    module: item,
                                                    isLastModule: index === (modules.length - 1),
                                                    nextLevel: nextLevel,
                                                })
                                        }
                                        disabled={isDisabled}
                                        score={
                                            userData.completedModules.find((m) => m.module._id === item._id)
                                                ?.score || 0
                                        }
                                        isUnitReview={true}
                                    />
                                )}
                            </View>
                        )
                    }}
                    contentContainerStyle={[styles.pathContainer, { height: modules.length * 120 + 50 }]}
                />
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 16,
        // backgroundColor: GlobalStyles.colors.lightBackground
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    moduleHeader: {
        flexDirection: "row",
        marginVertical: 16,
        // backgroundColor: GlobalStyles.colors.lightBlue,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        marginBottom: 24
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
    pathContainer: {
        position: "relative",
        marginHorizontal: 16,
    }
})
