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

interface QuestionScreenProps {
    route: any;
}

export default function QuestionScreen({
    route
}: QuestionScreenProps) {
    const { module } = route.params;
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
                console.log('shuffledAnswers:', shuffledAnswers.map((question: Question) => question.options.map((option) => option.optionText)));
                setQuestions(shuffledAnswers);
                setCurrentQuestion(shuffledAnswers[0]);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestions();
    }, [])

    if (isLoading || !questions || !currentQuestion) {
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
        await playCheckAnswerSound(selectedAnswer.isCorrect);
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
                        text="Pause Audio"
                        onPress={togglePlayback}
                        color={GlobalStyles.colors.whiteFont}
                        size={12}
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
                <Ionicons
                    name="heart"
                    size={42}
                    color='red'
                />
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
                                onPress={() => {
                                    // TODO: logic for going to next question
                                    setIsChecked(false);
                                    setSelectedAnswer(null);
                                    if (currentQuestionIndex < questions.length - 1) {
                                        setCurrentQuestionIndex((prev) => prev + 1);
                                        setCurrentQuestion(questions[currentQuestionIndex + 1]);
                                    } else {
                                        navigation.replace("ResultScreen", {
                                            correct: userAnswers.filter((answer) => answer.isCorrect).length,
                                            totalQuestions: userAnswers.length,
                                            expEarned: userAnswers.filter((answer) => answer.isCorrect).length * 5,
                                            module: module,
                                        })
                                    }
                                }}
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
})
