import { useEffect, useState } from "react";
import { Question } from "../../../../types/Question";
import { StyleSheet, Text, View } from "react-native";
import { apiClient } from "../../../../api/apiClient";
import { GlobalStyles } from "../../../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import WideButton from "../../../../components/UI/WideButton";
import { useNavigation } from "@react-navigation/native";
import AnswerButton from "../../../../components/learning/AnswerButton";
import useAudio from "../../../../hooks/useAudio";
import { formatMillis } from "../../../../utils/formatMillisAudio";
import playCheckAnswerSound from "../../../../utils/playCheckAnswerSound";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../../../types/User";
import loseHp from "../../../../api/gamifications/loseHp";
import { decrementHp, completeModule as completeModuleReducer } from "../../../../store/userSlice";
import addUserExp from "../../../../api/gamifications/addUserExp";
import completeModule from "../../../../api/gamifications/completeModule";
import { Module } from "../../../../types/Module";
import { grantAchievement } from "../../../../api/achievements/grantAchievements";
import { grantAchievement as grantAchievementReducer } from "../../../../store/userSlice";

interface QuestionScreenProps {
    route: any;
}

export default function QuestionScreen({
    route
}: QuestionScreenProps) {
    const { module, isLastModule, nextLevel, unCompleteFirstModule } = route.params;
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const dispatch = useDispatch();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigation = useNavigation();
    const { playAudio, togglePlayback, isPlaying, duration, isAudioEnded } = useAudio();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<{
        optionText: string;
        isCorrect: boolean;
    } | null>(null);
    const [userAnswers, setUserAnswers] = useState<{
        questionId: string;
        optionText: string;
        isCorrect: boolean;
    }[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);

    console.log("params", {
        module,
        isLastModule,
        nextLevel,
        unCompleteFirstModule
    });


    function handleShuffleAnswers(question: Question) {
        const options = question.options.map((option) => {
            return {
                optionText: option.optionText,
                isCorrect: option.isCorrect,
            };
        });
        const shuffledOptions = options.sort(() => Math.random() - 0.5);
        return {
            ...question,
            options: shuffledOptions,
        };
    }

    useEffect(() => {
        async function fetchQuestions() {
            try {
                setIsLoading(true);
                const response = await apiClient.post(`/question`, {
                    moduleIds: [module._id],
                    levelIds: []
                });
                const fetchedQuestions = response.data.data;
                // setQuestions(response.data.data);
                const shuffledAnswers = fetchedQuestions.map((question: Question) => {
                    return handleShuffleAnswers(question);
                });
                setQuestions(shuffledAnswers);
                setCurrentQuestion(shuffledAnswers[0]);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setIsLoading(false);
            }
        }

        function startTimer() {
            setStartTime(Date.now());
        }

        fetchQuestions();
        startTimer();
    }, [])

    if (isLoading || !questions || !currentQuestion || !userData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    async function handleCheckAnswer() {
        setIsChecked(true);
        setUserAnswers((prev) => [
            ...prev,
            {
                questionId: currentQuestion._id,
                optionText: selectedAnswer?.optionText ?? "",
                isCorrect: selectedAnswer?.isCorrect ?? false,
            },
        ]);
        if (selectedAnswer.isCorrect === false) {
            try {
                await loseHp(userData._id);
                dispatch(decrementHp(1));
            } catch (error) {
                console.error("Failed to reduce HP:", error);
            }
        }
        await playCheckAnswerSound(selectedAnswer.isCorrect);
    }

    async function handleNextQuestionOrResult() {
        setIsChecked(false);
        setSelectedAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setCurrentQuestion(questions[currentQuestionIndex + 1]);
        } else {
            try {
                let nextLevelFirstModule: Module | null = null;
                // Check if the module has been completed then do not update the current module
                if (isLastModule) {
                    const getNextLevelModules = await apiClient.post('/module', {
                        levelIds: [nextLevel._id],
                    });
                    nextLevelFirstModule = getNextLevelModules.data.data[0];
                } else {
                    const getNextLevelModules = await apiClient.post('/module', {
                        levelIds: [module.level._id],
                    });
                    console.log("getNextLevelModules", getNextLevelModules.data.data[module.index]);
                    nextLevelFirstModule = getNextLevelModules.data.data[module.index];
                }
                console.log("dispatch value", {
                    moduleId: module._id,
                    exp: userAnswers.filter((answer) => answer.isCorrect).length * 5,
                    correctCount: userAnswers.filter((answer) => answer.isCorrect).length,
                    score: Math.floor((userAnswers.filter((answer) => answer.isCorrect).length / questions.length) * 100),
                    totalAnswers: questions.length,
                    isLastModule: isLastModule,
                    nextLevel: isLastModule ? nextLevel : undefined,
                    nextLevelFirstModule: nextLevelFirstModule,
                })
                dispatch(completeModuleReducer({
                    moduleId: module._id,
                    exp: userAnswers.filter((answer) => answer.isCorrect).length * 5,
                    correctCount: userAnswers.filter((answer) => answer.isCorrect).length,
                    score: Math.floor((userAnswers.filter((answer) => answer.isCorrect).length / questions.length) * 100),
                    totalAnswers: questions.length,
                    isLastModule: isLastModule,
                    nextLevel: isLastModule ? nextLevel : undefined,
                    nextLevelFirstModule: nextLevelFirstModule,
                }));

                await completeModule({
                    moduleId: module._id,
                    userId: userData._id,
                    correctCount: userAnswers.filter((answer) => answer.isCorrect).length,
                    score: Math.floor((userAnswers.filter((answer) => answer.isCorrect).length / questions.length) * 100),
                    totalAnswers: questions.length,
                });

                if (unCompleteFirstModule) {
                    await grantAchievement(userData._id, "FIRST_MODULE");
                    dispatch(grantAchievementReducer({
                        achievementCode: "FIRST_MODULE",
                    }));
                }

                const endTime = Date.now();
                const durationInSeconds = Math.floor((endTime - startTime!) / 1000);
                console.log("Duration in seconds:", durationInSeconds);

                navigation.replace("ResultScreen", {
                    correct: userAnswers.filter((answer) => answer.isCorrect).length,
                    totalQuestions: userAnswers.length,
                    expEarned: userAnswers.filter((answer) => answer.isCorrect).length * 5,
                    module: module,
                    nextLevel: nextLevel,
                    unCompleteFirstModule: unCompleteFirstModule,
                    isLastModule: isLastModule,
                    timeTaken: durationInSeconds,
                });
            } catch (error) {
                console.error("Error completing module:", error);
            }
        }
    }

    function AudioPlayer() {
        return (
            <View style={styles.audioPlayerContainer}>
                {!isPlaying || isAudioEnded ? (
                    <WideButton
                        text="Putar Audio"
                        onPress={() => {
                            playAudio(questions[0].media.audioUrl)
                        }}
                        color={GlobalStyles.colors.whiteFont}
                        size={16}
                        style={{
                            alignSelf: "center",
                            marginVertical: 12,
                            marginHorizontal: 12,
                            paddingVertical: 8,
                            paddingHorizontal: 24,
                            backgroundColor: GlobalStyles.colors.accent,
                            width: "90%",
                            borderRadius: 16,
                        }}
                    />
                ) : (
                    <WideButton
                        text="Jeda Audio"
                        onPress={togglePlayback}
                        color={GlobalStyles.colors.whiteFont}
                        size={16}
                        style={{
                            alignSelf: "center",
                            marginVertical: 12,
                            marginHorizontal: 12,
                            paddingVertical: 8,
                            paddingHorizontal: 24,
                            backgroundColor: GlobalStyles.colors.accent,
                            width: "90%",
                            borderRadius: 16,
                        }}
                    />
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons
                    name="close-outline"
                    size={42}
                    onPress={() =>
                        navigation.goBack()
                    }
                />
                <View style={styles.progressContainer}>
                    <View style={styles.outerProgressBar}>
                        <View style={[styles.innerProgressBar, { width: `${((currentQuestionIndex) / questions.length) * 100}%` }]} />
                    </View>
                </View>
                <View style={styles.heartContainer}>
                    <Ionicons
                        name="heart"
                        size={42}
                        color='red'
                    />
                    <Text style={{
                        fontFamily: "Inter-Bold",
                        fontSize: 20,
                        marginHorizontal: 2,
                    }}>
                        {userData.hearts.current}
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {/* {questions.map((question, index) => ( */}
                <View>
                    <AudioPlayer />
                    <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
                    {currentQuestion.options.map((option, index) => (
                        <AnswerButton
                            key={index}
                            onPress={() => {
                                setSelectedAnswer(option);
                            }}
                            style={{
                                marginVertical: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 24,
                                backgroundColor: GlobalStyles.colors.accent,
                                width: "90%",
                                borderRadius: 16,
                            }}
                            isCorrect={option.isCorrect}
                            answer={option.optionText}
                            selected={selectedAnswer?.optionText === option.optionText}
                            disabled={isChecked}
                        />
                    ))}
                </View>
                {/* ))} */}
            </View>
            {selectedAnswer !== null && (
                <View style={styles.bottomContainer}>
                    {isChecked ? (
                        <>
                            <Text
                                style={{
                                    fontFamily: "Inter-Bold",
                                    fontSize: 16,
                                    marginBottom: 16,
                                    color: selectedAnswer.isCorrect ? 'green' : 'red',
                                }}
                            >
                                {selectedAnswer.isCorrect ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={20}
                                            color="green"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: "Inter-Bold",
                                                fontSize: 20,
                                                // color: GlobalStyles.colors.whiteFont,
                                            }}
                                        >
                                            Jawaban Benar
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                                        <Ionicons
                                            name="close-circle-outline"
                                            size={20}
                                            color="red"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: "Inter-Bold",
                                                fontSize: 20,
                                                // color: GlobalStyles.colors.whiteFont,
                                            }}
                                        >
                                            Jawaban Salah
                                        </Text>
                                    </View>
                                )}
                            </Text>
                            <WideButton
                                text="Lanjut"
                                onPress={handleNextQuestionOrResult}
                                color={GlobalStyles.colors.whiteFont}
                                size={19}
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    backgroundColor: GlobalStyles.colors.primary,
                                    borderRadius: 16,
                                    width: "100%",
                                }}
                            />
                        </>
                    ) : (
                        <WideButton
                            text="Periksa Jawaban"
                            onPress={handleCheckAnswer}
                            color={GlobalStyles.colors.whiteFont}
                            size={19}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 24,
                                backgroundColor: GlobalStyles.colors.primary,
                                borderRadius: 16,
                                width: "100%",
                            }}
                        />
                    )}
                </View>
            )}
        </View >
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 0,
        backgroundColor: GlobalStyles.colors.lightBackground
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    progressContainer: {
        flex: 1,
        paddingHorizontal: 12
    },
    outerProgressBar: {
        backgroundColor: 'gray',
        width: 'auto',
        borderRadius: 50,
    },
    innerProgressBar: {
        backgroundColor: GlobalStyles.colors.accent,
        height: 6,
        borderRadius: 50,
    },
    audioPlayerContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: 12,
        backgroundColor: GlobalStyles.colors.primary,
        borderRadius: 16
    },
    audioPlayerText: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
        color: GlobalStyles.colors.whiteFont,
        marginLeft: 16,
    },
    questionText: {
        fontFamily: "Inter-Bold",
        fontSize: 18,
        marginVertical: 16,
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: GlobalStyles.colors.lighterAccent,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    heartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
    }
})


//notes
// fokus design gamifikasi
// informasikan telah unlock new level
// dokumentasi istilah gamifikasi
// penjelasan fitur gamifikasi di awal game (walktrough)
// up and downs on leaderboard
// tambahain info gems dan streak di level screen
// 