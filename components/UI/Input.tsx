import { StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    textInputConfig: object;
    isVisible?: boolean;
    onVisiblePress?: () => void;
}

export default function Input({
    label,
    placeholder,
    value,
    onChangeText,
    textInputConfig,
    isVisible,
    onVisiblePress
}: InputProps) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isVisible === undefined ? false : !isVisible}
                    style={styles.input}
                    {...textInputConfig}
                />
                {isVisible !== undefined && (
                    <Ionicons
                        name={isVisible ? "eye-off" : "eye"}
                        size={24}
                        color='grey'
                        style={{ position: "absolute", right: 10, top: 10 }}
                        onPress={onVisiblePress}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        fontSize: 16,
        fontFamily: "OpenSans-Regular",
    },
})
