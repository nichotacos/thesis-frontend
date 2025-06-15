import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/styles";

interface PlayAudioButtonProps {
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    iconSize: number;
    iconColor: string;
    disabled?: boolean;
}

export default function PlayAudioButton({
    onPress,
    iconName,
    iconSize = 42,
    iconColor = GlobalStyles.colors.whiteFont,
    disabled
}: PlayAudioButtonProps) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                disabled={disabled ? true : false}
            >
                <Ionicons
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: GlobalStyles.colors.accent,
        borderRadius: 16
    }
})