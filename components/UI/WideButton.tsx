import { StyleSheet, View, Pressable, Text } from "react-native";

interface WideButtonProps {
    onPress: () => void;
    text: string;
    color: string;
    size: number;
    style?: object;
}

export default function WideButton({ onPress, text, color, size, style, ...props }: WideButtonProps) {
    return (
        <View style={style}>
            <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed} {...props}>
                <Text style={[styles.text, { color: color, fontSize: size }]}>
                    {text}
                </Text>
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
