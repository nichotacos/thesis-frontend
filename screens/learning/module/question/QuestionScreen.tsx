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
    const { playAudio, togglePlayback, isPlaying, duration } = useAudio();
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<{
        optionText: string;
        isCorrect: boolean;
    } | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                setIsLoading(true);
                const response = await apiClient.post(`/question`, {
                    moduleIds: [module._id],
                    levelIds: []
                });
                setQuestions(response.data.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestions();
    }, [])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    function AudioPlayer() {
        return (
            <View style={styles.audioPlayerContainer}>
                <Text style={styles.audioPlayerText}>
                    Simak audio di bawah ini dan jawab pertanyaan yang diberikan.
                </Text>
                {!isPlaying ? (
                    <WideButton
                        text="Play Audio"
                        onPress={() => {
                            playAudio(questions[0].media.audioUrl)
                        }}
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
                        <View style={styles.innerProgressBar} />
                    </View>
                </View>
                <Ionicons
                    name="heart"
                    size={42}
                    color='red'
                />
            </View>
            {questions.map((question, index) => (
                <View key={index}>
                    <AudioPlayer />
                    <Text style={styles.questionText}>{question.questionText}</Text>
                    {question.options.map((option, index) => (
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
                        />
                    ))}
                </View>
            ))}
            {selectedAnswer !== null && (
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    marginBottom: 8
                }}>
                    <WideButton
                        text="Periksa Jawaban"
                        onPress={() => { }}
                        color={GlobalStyles.colors.whiteFont}
                        size={14}
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            backgroundColor: GlobalStyles.colors.primary,
                            borderRadius: 16,
                            width: "100%",
                            alignSelf: "flex-end",
                        }}
                    />
                </View>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
        width: '30%',
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
        fontSize: 16,
        marginVertical: 16,
    }
})
