import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

interface ModuleStampProps {
    index: number;
    style: object;
    name: string;
    onPress: () => void;
    disabled: boolean;
}

export default function ModuleStamp({
    index,
    style,
    name,
    onPress,
    disabled,
}: ModuleStampProps) {
    return (
        <Pressable style={[styles.mainContainer, style]} onPress={onPress} disabled={disabled}>
            <View style={[styles.outerContainer]}>
                <View style={styles.innerContainer}>
                    <Text style={styles.text}>
                        {index}
                    </Text>
                </View>
            </View>
            {/* <View style={styles.moduleNameContainer}>
                <Text style={styles.moduleName}>
                    {name}
                </Text>
            </View> */}
            {/* Hapus nama modul */}
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
    }
})
