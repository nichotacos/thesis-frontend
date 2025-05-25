import LottieView from "lottie-react-native";
import { useRef } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";

interface WideButtonProps {
    onPress: () => void;
    text: string;
    color: string;
    size: number;
    style?: object;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function WideButton({ onPress, text, color, size, style, disabled, isLoading, ...props }: WideButtonProps) {
    const animation = useRef<LottieView>(null);

    return (
        <View style={style}>
            <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed} disabled={disabled} {...props}>
                {isLoading ? (
                    <View style={{ height: 24, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                        <LottieView
                            source={require("../../assets/lottie/ripple-loading.json")}
                            ref={animation}
                            autoPlay
                            loop
                            style={{ flex: 1, width: "15%", height: "15%" }}
                            resizeMode="cover"
                        />
                    </View>
                ) : (
                    <Text style={[styles.text, { color: color, fontSize: size }, isLoading && { opacity: 0.5 }]}>
                        {text}
                    </Text>
                )}
            </Pressable>
        </View>
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
})
