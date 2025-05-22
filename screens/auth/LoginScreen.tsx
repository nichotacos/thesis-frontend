import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Input from "../../components/UI/Input";
import { useState } from "react";
import WideButton from "../../components/UI/WideButton";
import TextButton from "../../components/UI/TextButton";
import { useNavigation } from "@react-navigation/native";
import { LoginPayload } from "../../api/auth.types";
import { loginUser } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";
import { apiClient } from "../../api/apiClient";

export default function LoginScreen(params) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const [loginData, setLoginData] = useState<LoginPayload>({
        username: "",
        password: ""
    });

    function handleInputChange(name: string, value: string) {
        setLoginData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    async function handleSubmit(loginData: LoginPayload) {
        console.log("Login button pressed")
        console.log(loginData);

        try {
            setIsLoading(true);
            const data = await loginUser(loginData.username, loginData.password);
            const achivements = await apiClient.get('/achievement');
            const shopItems = await apiClient.get('/shop-item');
            const levels = await apiClient.get('/level');

            dispatch(login({
                userInfo: data.user,
                token: data.accessToken,
                achivements: achivements.data.achievements,
                shopItems: shopItems.data.shopItems,
                levels: levels.data.levels,
            }));

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // If error comes from axios with a structured response
                setError(error.response.data.message);
            } else if (error.message) {
                // If error is a standard Error object
                setError(error.message);
            } else {
                // Fallback error message
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Masuk untuk melanjutkan
                        </Text>
                    </View>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>
                            Dengarkan dan pahami Bahasa Indonesia dengan mudah.
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input
                            label="Username"
                            placeholder="Masukkan username"
                            value={loginData.username}
                            onChangeText={handleInputChange.bind(this, "username")}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }}
                        />
                        <Input
                            label="Password"
                            placeholder="Masukkan password"
                            value={loginData.password}
                            onChangeText={handleInputChange.bind(this, "password")}
                            secureTextEntry={true}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }}
                        />
                    </View>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    )}
                    <View style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>
                            Lupa kata sandi?
                        </Text>
                    </View>
                    <WideButton
                        onPress={handleSubmit.bind(this, loginData)}
                        text="Masuk"
                        color={GlobalStyles.colors.whiteFont}
                        size={24}
                        style={{
                            backgroundColor: GlobalStyles.colors.accent,
                            borderRadius: 50,
                            paddingVertical: 12,
                            paddingHorizontal: 32,
                        }}
                    />
                </View>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Belum punya akun?</Text>
                    <TextButton
                        onPress={() => {
                            navigation.navigate("RegisterScreen")
                        }}
                        text="Daftar"
                        color={GlobalStyles.colors.primary}
                        size={16}
                        fontWeight="bold"
                        style={{
                            marginLeft: 4,
                        }}
                    />
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
        alignItems: "center",
    },
    innerContainer: {
        width: "80%",
        flex: 1,
        flexDirection: "column",
        marginBottom: 48,
        justifyContent: "space-between",
    },
    titleContainer: {
        marginTop: 64
    },
    title: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
    },
    subtitleContainer: {
        marginTop: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "OpenSans-Regular",
        color: 'grey',
        lineHeight: 20,
    },
    inputContainer: {
        marginVertical: 8,
    },
    forgotPasswordContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 24,
        marginTop: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.primary,
        textAlign: "right",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
    },
    registerText: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
    },
    errorContainer: {
        padding: 12,
        backgroundColor: '#ffeeee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffcccc',
    },
    errorText: {
        color: '#cc0000',
        fontSize: 14,
        fontFamily: "OpenSans-Regular",
        textAlign: 'center',
    },
})
