import { Pressable, StyleSheet, Text, View } from "react-native";

interface TextButtonProps {
    onPress: () => void;
    text: string;
    color: string;
    size: number;
    fontWeight?: string;
    style?: object;
}

export default function TextButton({ onPress, text, color, size, fontWeight, style, ...props }: TextButtonProps) {
    return (
        <View style={style}>
            <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed} {...props}>
                <Text style={[styles.text, { color: color, fontSize: size }, fontWeight && { fontWeight: fontWeight as any }]}>
                    {text}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.75,
    },
    text: {
        fontFamily: "Inter-Regular",
    },
})
