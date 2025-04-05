import { Pressable, StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";

interface CircularButtonProps {
    onPress: () => void;
    icon: string;
    size: number;
    color: string;
}

export default function CircularButton({ onPress, icon, size, color, ...props }: CircularButtonProps) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed} {...props}>
            <View style={styles.button}>
                <Ionicons
                    name={icon as keyof typeof Ionicons.glyphMap}
                    size={size}
                    color={color}
                    style={styles.button}
                />
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        backgroundColor: GlobalStyles.colors.accent,
        margin: 12,
    },
    pressed: {
        opacity: 0.75,
    }
})