import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface ModuleStampProps {
    index: number;
    style: object;
    name: string;
    onPress: () => void;
    disabled: boolean;
    score?: number;
    isUnitReview?: boolean;
}

export default function ModuleStamp({
    index,
    style,
    name,
    onPress,
    disabled,
    score,
    isUnitReview
}: ModuleStampProps) {

    return (
        <Pressable style={[styles.mainContainer, style]} onPress={onPress} disabled={disabled}>
            <View style={[styles.starsContainer, { display: disabled ? "none" : "flex" }]}>
                <Ionicons name="star" size={32} color={score > 0 ? '#FFD700' : 'gray'} style={{ transform: [{ rotate: "-15deg" }], position: 'absolute', left: -34, top: 12 }} />
                <Ionicons name="star" size={32} color={score > 60 ? '#FFD700' : 'gray'} />
                <Ionicons name="star" size={32} color={score > 80 ? '#FFD700' : 'gray'} style={{ transform: [{ rotate: "15deg" }], position: 'absolute', right: -34, top: 12 }} />
            </View>
            <View style={[styles.outerContainer]}>
                <View style={styles.innerContainer}>
                    {isUnitReview ? (
                        <Ionicons name="checkmark" size={50} color={GlobalStyles.colors.whiteFont} />
                    ) : (
                        <Text style={styles.text}>
                            {index}
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    outerContainer: {
        backgroundColor: GlobalStyles.colors.lighterAccent,
        borderRadius: 50,
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    innerContainer: {
        backgroundColor: GlobalStyles.colors.accent,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: 80,
    },
    text: {
        fontFamily: "Inter-Bold",
        textAlign: "center",
        fontSize: 30,
        color: GlobalStyles.colors.whiteFont,
    },
    moduleNameContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: 100,
    },
    moduleName: {
        fontFamily: "Inter-Regular",
        textAlign: "center",
        fontSize: 14,
        marginTop: 8,
        lineHeight: 22,
    },
    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    }
})
