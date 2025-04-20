import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../../constants/styles";
import { useSelector } from "react-redux";
import { User } from "../../../types/User";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ModuleStamp from "../../../components/learning/ModuleStamp";
import { Module } from "../../../types/Module";
import { apiClient } from "../../../api/apiClient";
import { useNavigation } from "@react-navigation/native";

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
                {/* <View>
                    <Ionicons
                        name="chevron-back-outline"
                        size={40}
                        color={GlobalStyles.colors.whiteFont}
                        onPress={() => {
                            console.log('prev module');
                        }}
                    />
                </View> */}
                <View style={styles.moduleTitleAndDescriptionContainer}>
                    <Text style={styles.moduleTitle}>{level.name}</Text>
                    <Text style={styles.moduleDescription}>{level.description}</Text>
                </View>
                {/* <View>
                    <Ionicons
                        name="chevron-forward-outline"
                        size={40}
                        color={GlobalStyles.colors.whiteFont}
                        onPress={() => {
                            console.log('next module');
                        }}
                    />
                </View> */}
            </View>
            <FlatList
                data={modules}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => {
                    return (
                        <ModuleStamp
                            index={index + 1}
                            name={item.name}
                            style={{
                                left: index % 2 === 0 ? 20 : undefined,
                                right: index % 2 !== 0 ? 20 : undefined,
                                top: 20 + 150 * index,
                            }}
                            onPress={() => {
                                navigation.navigate("QuestionScreen", {
                                    module: item,
                                })
                            }}
                        />
                    )
                }}
                contentContainerStyle={styles.pathContainer}
            />
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
        height: 2800,
    }
})
