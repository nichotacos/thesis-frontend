import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { AntDesign } from "@expo/vector-icons";

interface ModuleStampProps {
    index: number;
    style: object;
    name: string;
    onPress: () => void;
    disabled: boolean;
    score?: number;
}

export default function ModuleStamp({
    index,
    style,
    name,
    onPress,
    disabled,
    score
}: ModuleStampProps) {

    return (
        <Pressable style={[styles.mainContainer, style]} onPress={onPress} disabled={disabled}>
            <View style={[styles.starsContainer, { display: disabled ? "none" : "flex" }]}>
                <AntDesign name="star" size={28} color={score > 0 ? '#FFD700' : 'gray'} style={{ transform: [{ rotate: "-15deg" }], position: 'absolute', left: -30, top: 8 }} />
                <AntDesign name="star" size={28} color={score > 60 ? '#FFD700' : 'gray'} />
                <AntDesign name="star" size={28} color={score > 80 ? '#FFD700' : 'gray'} style={{ transform: [{ rotate: "15deg" }], position: 'absolute', right: -30, top: 8 }} />
            </View>
            <View style={[styles.outerContainer]}>
                <View style={styles.innerContainer}>
                    <Text style={styles.text}>
                        {index}
                    </Text>
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
        marginBottom: 8,
    }
})
