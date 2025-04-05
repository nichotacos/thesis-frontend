import { StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    textInputConfig: object;
}

export default function Input({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    textInputConfig
}: InputProps) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                {...textInputConfig}
            />
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
