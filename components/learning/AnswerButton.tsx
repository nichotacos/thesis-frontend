import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { useRef } from "react";

interface AnswerButtonProps {
    answer: string;
    isCorrect: boolean;
    onPress: () => void;
    style: object;
    selected: boolean;
    disabled?: boolean;
}

export default function AnswerButton({
    answer,
    isCorrect,
    onPress,
    style,
    selected,
    disabled
}: AnswerButtonProps) {

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            android_disableSound={true}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    styles.button,
                    selected && styles.selected,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                <Text style={styles.text}>
                    {answer}
                </Text>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 12,
        marginVertical: 8,
        width: "100%",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "gray",
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    selected: {
        backgroundColor: GlobalStyles.colors.lighterAccent2,
        borderColor: GlobalStyles.colors.accent,
        borderWidth: 1,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    pressed: {
        opacity: 0.75,
    },
    text: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
    },
    correct: {
        backgroundColor: "#4CAF50",
    },
    incorrect: {
        backgroundColor: "#F44336",
    },
});

