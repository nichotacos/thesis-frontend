import LottieView from "lottie-react-native";
import { useRef } from "react";
import { StyleSheet, View, Pressable, Text, Animated } from "react-native";
import { GlobalStyles } from "../../constants/styles";

interface WideButtonProps {
    onPress: () => void;
    text: string;
    buttonColor: string;
    textColor: string;
    size: number;
    style?: object;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function WideButton({ onPress, text, buttonColor, textColor, size, style, disabled, isLoading, ...props }: WideButtonProps) {
    const animation = useRef<LottieView>(null);
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
            tension: 50,
            useNativeDriver: true,
        }).start();
    };

    const animatedStyle = {
        transform: [
            {
                scale: scaleAnim, // Keep your existing scale animation
            },
            {
                translateY: scaleAnim.interpolate({
                    inputRange: [0.97, 1],
                    outputRange: [8, 0], // Move down 2px when pressed, normal when unpressed
                }),
            },
        ],
    } as any;

    const shadowAnimatedStyle = {
        transform: [
            {
                translateY: scaleAnim.interpolate({
                    inputRange: [0.97, 1],
                    outputRange: [2, 4], // Reduce shadow offset when pressed
                }),
            },
        ],
    };

    const getDarkerColor = (color: string) => {
        const colorMap: { [key: string]: string } = {
            [GlobalStyles.colors.accent]: GlobalStyles.colors.darkerAccent,
            [GlobalStyles.colors.primary]: GlobalStyles.colors.darkerPrimary,
            'white': 'slategray',
            [GlobalStyles.colors.lighterPrimary]: GlobalStyles.colors.lighterPrimary2,
        };

        return colorMap[color] || '#333';
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            android_disableSound={true}
            style={({ pressed }) => [pressed && styles.pressed, style]}
            disabled={disabled}
            {...props}
        >
            <Animated.View
                style={[
                    styles.buttonShadow,
                    { backgroundColor: disabled ? "gray" : getDarkerColor(buttonColor) },
                    { shadowColor: "black", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 3.5 },
                    { elevation: 5 },
                    shadowAnimatedStyle
                ]}
            >
                <Animated.View
                    style={[
                        styles.buttonTop,
                        { backgroundColor: disabled ? "lightgray" : buttonColor },
                        animatedStyle
                    ]}
                >
                    {isLoading ? (
                        <View style={{ height: 24, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                            <LottieView
                                source={require("../../assets/lottie/ripple-loading.json")}
                                ref={animation}
                                autoPlay
                                loop
                                // style={{ flex: 1, width: "15%", height: "15%" }}
                                style={{ width: 50, height: 50 }}
                                resizeMode="cover"
                            />
                        </View>
                    ) : (
                        <Text style={[styles.text, { color: textColor, fontSize: size }, (isLoading || disabled) && { opacity: 0.5 }]}>
                            {text}
                        </Text>
                    )}
                </Animated.View>
            </Animated.View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.75,
    },
    text: {
        fontFamily: "Inter-Bold",
        textAlign: "center",
    },
    buttonShadow: {
        height: 50,
        borderRadius: 25,
    },
    buttonTop: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        position: 'absolute',
        top: -8,
        left: 0,
        right: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})
