// "use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Share, Pressable } from "react-native"
// import { LinearGradient } from "expo-linear-gradient"
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { GlobalStyles } from "../../../../constants/styles"
import { useSelector } from "react-redux"
import { User } from "../../../../types/User"
import Modal from "../../../../components/UI/Modal"

// Types for our props and state
interface ResultScreenProps {
    // score: number
    // totalQuestions: number
    // correctAnswers: number
    // timeSpent: number // in seconds
    // streak: number
    navigation: any
    route: any
}

const ResultScreen: React.FC<ResultScreenProps> = ({
    // score = 85,
    // totalQuestions = 10,
    // correctAnswers = 8,
    // timeSpent = 120,
    // streak = 3,
    navigation,
    route,
}) => {
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo)

    // Animation values
    // const scoreAnim = new Animated.Value(0)
    // const starScale = new Animated.Value(0)
    // const fadeAnim = new Animated.Value(0)

    const scoreAnim = useRef(new Animated.Value(0)).current
    const starScale = useRef(new Animated.Value(0)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    const { correct, totalQuestions, module, nextLevel, unCompleteFirstModule } = route.params
    const score = Math.round((correct / totalQuestions) * 100);

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        // Sequence of animations
        if (unCompleteFirstModule) {
            setTimeout(() => {
                setShowModal(true)
            }, 3000)
        }

        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scoreAnim, {
                toValue: score,
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.spring(starScale, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start()
    }, [unCompleteFirstModule]);

    console.log("show modal", showModal)

    // Calculate stars based on score
    const getStars = () => {
        if (score >= 80) return 3
        if (score >= 60) return 2
        return 1
    }

    const stars = getStars()

    // Function to share results
    const shareResults = async () => {
        try {
            await Share.share({
                message: `Saya baru saya mendapatkan skor ${score}% di modul "${module.name}" !`,
            })
        } catch (error) {
            console.log(error)
        }
    }

    // Render stars based on performance
    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3].map((i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.starContainer,
                            {
                                transform: [
                                    {
                                        scale: starScale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, i <= stars ? 1 : 0.5],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <AntDesign name="star" size={40} color={i <= stars ? "#FFD700" : "#D3D3D3"} />
                    </Animated.View>
                ))}
            </View>
        )
    }

    // Format time from seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    return (
        // <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
        <>
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                type="achievement"
                receivedAmount={20}
                unlockedAchievement="Menyelesaikan Modul Pertama"
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Selesai!</Text>
                        <Text style={styles.moduleTitle}>{module.name}</Text>
                    </View>

                    <View style={styles.scoreContainer}>
                        <View style={styles.scoreCircle}>
                            <Animated.Text style={styles.scoreText}>
                                {scoreAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ["0%", "100%"],
                                })}
                            </Animated.Text>
                        </View>
                        {renderStars()}
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={24} color={GlobalStyles.colors.success} />
                            <Text style={styles.statText}>{correct} jawaban benar</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={24} color={GlobalStyles.colors.classicBlue} />
                            <Text style={styles.statText}>{formatTime(78)} waktu yang diperlukan</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
                            <Text style={styles.statText}>{userData.streak.streakCount} hari beruntun</Text>
                        </View>
                    </View>

                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackTitle}>Hasil</Text>
                        <Text style={styles.feedbackText}>
                            {score >= 80
                                ? "Hebat! Kamu telah menguasai modul ini. Siap untuk tantangan berikutnya?"
                                : score >= 60
                                    ? "Kerja bagus! Kamu sudah menunjukkan kemajuan yang baik, tapi masih ada ruang untuk terus berkembang. Tetap semangat! 💼🌟"
                                    : "Teruslah berlatih! Tinjau kembali modul ini untuk meningkatkan nilaimu. 💪📘"}
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.nextButton]}
                            onPress={() => navigation?.popTo("ModuleScreen", {
                                level: module.level,
                            })}
                        >
                            <Text style={styles.buttonText}>Lanjut ke modul berikutnya</Text>
                            <AntDesign name="arrowright" size={20} color="#fff" />
                        </Pressable>

                        <Pressable style={[styles.button, styles.retryButton]} onPress={() => navigation?.replace("QuestionScreen", { module, nextLevel })}>
                            <Text style={styles.buttonText}>Ulangi</Text>
                            <Ionicons name="refresh" size={20} color="#fff" />
                        </Pressable>

                        <Pressable style={[styles.button, styles.shareButton]} onPress={shareResults}>
                            <Text style={styles.buttonText}>Bagikan</Text>
                            <Ionicons name="share-social" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    {/* {score >= 80 && (
                    <View style={styles.achievementContainer}>
                        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.badge} />
                        <Text style={styles.achievementText}>Achievement Unlocked!</Text>
                        <Text style={styles.achievementDesc}>Master of Greetings</Text>
                    </View>
                )} */}
                </Animated.View>
            </ScrollView>
        </>
        // </LinearGradient>
    )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: width - 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    moduleTitle: {
        fontSize: 18,
        color: "#666",
    },
    scoreContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 5,
        borderColor: GlobalStyles.colors.primary,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: "bold",
        color: GlobalStyles.colors.primary,
    },
    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
    },
    starContainer: {
        marginHorizontal: 5,
    },
    statsContainer: {
        width: "100%",
        marginBottom: 20,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 10,
    },
    statText: {
        fontFamily: "Inter-Regular",
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    feedbackContainer: {
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    feedbackText: {
        fontSize: 16,
        color: "#555",
        lineHeight: 24,
    },
    buttonContainer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 5,
    },
    nextButton: {
        backgroundColor: GlobalStyles.colors.success,
    },
    retryButton: {
        backgroundColor: GlobalStyles.colors.accent,
    },
    shareButton: {
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8,
    },
    achievementContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    badge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    achievementText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF5722",
    },
    achievementDesc: {
        fontSize: 14,
        color: "#666",
    },
})

export default ResultScreen
