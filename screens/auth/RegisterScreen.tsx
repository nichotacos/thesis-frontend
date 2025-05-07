import { Button, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Input from "../../components/UI/Input";
import { useRef, useState } from "react";
import WideButton from "../../components/UI/WideButton";
import TextButton from "../../components/UI/TextButton";
import { useNavigation } from "@react-navigation/native";
import Recaptcha, { RecaptchaRef } from "react-native-recaptcha-that-works";
import { registerUser } from "../../api/auth.api";

interface RegisterPayload {
    full_name: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export default function RegisterScreen(params) {
    const navigation = useNavigation();
    const recaptcha = useRef<RecaptchaRef | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const [registerData, setRegisterData] = useState<RegisterPayload>({
        full_name: "",
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const onVerifyCaptcha = (token: string) => {
        console.log("Captcha token:", token);
        setCaptchaToken(token);
    }

    function handleInputChange(name: string, value: string) {
        setRegisterData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    async function handleSubmit(data: RegisterPayload) {
        try {
            setIsLoading(true);
            const data = await registerUser(
                registerData.username,
                registerData.full_name,
                registerData.email,
                registerData.password,
                registerData.passwordConfirmation,
            );

            navigation.navigate("LoginScreen");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // If error comes from axios with a structured response
                setError(error.response.data.message);
            } else if (error.message) {
                // If error is a standard Error object
                setError(error.message);
            } else {
                // Fallback error message
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const send = () => {
        console.log('send!');
        console.log('tung tung sahur', process.env.RECAPTCHA_SITE_KEY);
        recaptcha.current?.open();
    }

    const onExpire = () => {
        console.warn('expired!');
    }

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            Buat akun baru
                        </Text>
                    </View>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitle}>
                            Mulai latihan mendengar Bahasa Indonesia dengan mudah. Buat akun dan mulai sekarang!
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input
                            label="Nama Lengkap"
                            placeholder="Masukkan nama lengkap"
                            value={registerData.full_name}
                            onChangeText={handleInputChange.bind(this, "full_name")}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "words",
                                autoCorrect: false,
                            }}
                        />
                        <Input
                            label="Email"
                            placeholder="Masukkan email"
                            value={registerData.email}
                            onChangeText={handleInputChange.bind(this, "email")}
                            textInputConfig={{
                                keyboardType: "email-address",
                                autoCapitalize: "none",
                                autoCorrect: false,
                                inputMode: "email",
                            }}
                        />
                        <Input
                            label="Username"
                            placeholder="Masukkan username"
                            value={registerData.username}
                            onChangeText={handleInputChange.bind(this, "username")}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }}
                        />
                        <Input
                            label="Kata Sandi"
                            placeholder="Masukkan kata sandi"
                            value={registerData.password}
                            onChangeText={handleInputChange.bind(this, "password")}
                            secureTextEntry={true}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }}
                        />
                        <Input
                            label="Konfirmasi Kata Sandi"
                            placeholder="Masukkan konfirmasi kata sandi"
                            value={registerData.passwordConfirmation}
                            onChangeText={handleInputChange.bind(this, "passwordConfirmation")}
                            secureTextEntry={true}
                            textInputConfig={{
                                keyboardType: "default",
                                autoCapitalize: "none",
                                autoCorrect: false,
                            }}
                        />

                        {/* <Recaptcha
                            ref={recaptcha}
                            siteKey={process.env.RECAPTCHA_SITE_KEY}
                            baseUrl='https://bb58-125-160-96-140.ngrok-free.app'
                            onVerify={onVerifyCaptcha}
                            onExpire={onExpire}
                            onError={(err) => console.error('Recaptcha error:', err)}
                        />

                        <Button title="Open reCAPTCHA" onPress={send}/> */}

                        {captchaToken && <Text style={{ marginTop: 20 }}>captchaToken: {captchaToken}</Text>}
                    </View>
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    )}
                    <WideButton
                        onPress={handleSubmit.bind(this, registerData)}
                        text="Daftar"
                        color={GlobalStyles.colors.whiteFont}
                        size={24}
                        style={{
                            backgroundColor: GlobalStyles.colors.accent,
                            borderRadius: 50,
                            paddingVertical: 12,
                            paddingHorizontal: 32,
                            marginTop: 8,
                        }}
                    />
                </View>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Sudah punya akun?</Text>
                    <TextButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                        text="Masuk"
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
        marginBottom: 8
    },
    errorText: {
        color: '#cc0000',
        fontSize: 14,
        fontFamily: "OpenSans-Regular",
        textAlign: 'center',
    },
})
