import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { useSelector } from "react-redux";
import { User } from "../../../types/User";
import { useEffect, useState } from "react";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import ModuleStamp from "../../../components/learning/ModuleStamp";
import { Module } from "../../../types/Module";
import { apiClient } from "../../../api/apiClient";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle, Defs, G, Line, Marker, Path, Polygon } from "react-native-svg";


interface ModuleScreenProps {
    route: any;
}

export default function ModuleScreen({
    route
}: ModuleScreenProps) {
    const { level } = route.params;
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modules, setModules] = useState<Module[]>([]);
    const navigation = useNavigation();

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
                console.log('modules:', response.data.data);
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
                <View style={styles.moduleTitleAndDescriptionContainer}>
                    <Text style={styles.moduleTitle}>{level.name}</Text>
                    <Text style={styles.moduleDescription}>{level.description}</Text>
                </View>
            </View>
            <FlatList
                data={modules}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => {
                    return (
                        <View>
                            <ModuleStamp
                                index={index + 1}
                                name={item.name}
                                style={{
                                    left: index % 2 === 0 ? 20 : undefined,
                                    right: index % 2 !== 0 ? 20 : undefined,
                                    top: 20 + 150 * index,
                                    opacity: userData.currentModule.index < item.index ? 0.5 : 1,
                                    zIndex: 1,
                                }}
                                onPress={() => {
                                    navigation.navigate("QuestionScreen", {
                                        module: item,
                                    })
                                }}
                                disabled={userData.currentModule.index < item.index}
                            />
                            {((userData.currentModule.index < item.index)) && (
                                <Fontisto
                                    name="locked"
                                    size={52}
                                    color="grey"
                                    style={{
                                        position: "absolute",
                                        top: 20 + 150 * index + 20,
                                        left: index % 2 === 0 ? 49 : undefined,
                                        right: index % 2 !== 0 ? 48 : undefined,
                                        zIndex: 2,
                                        opacity: 0.8,
                                    }}
                                />
                            )}
                            {index === modules.length - 1 ? (
                                <Svg
                                    width={100}
                                    height={100}
                                    viewBox="0 0 100 100"
                                    style={{
                                        position: "absolute",
                                        top: 18 + 150 * index,
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
                                        height={300}
                                        style={{
                                            position: "absolute",
                                            top: 60 + 150 * index,
                                            left: index % 2 === 0 && 32,
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
                                            top: 18 + 150 * index,
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
                                        height={300}
                                        style={{
                                            position: "absolute",
                                            top: 60 + 150 * index,
                                            right: index % 2 !== 0 && -65,
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
                                            top: 18 + 150 * index,
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
                        </View>
                    )
                }}
                contentContainerStyle={[styles.pathContainer, { height: modules.length * 150 + 50 }]}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 16,
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
        justifyContent: "center",
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
    pathContainer: {
        position: "relative",
        marginHorizontal: 16,
    }
})
