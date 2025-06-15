import { useState, useRef, useEffect } from "react"
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Pressable,
} from "react-native"
import { GlobalStyles } from "../../constants/styles"
import { registerUser, sendOtp, verifyOtp } from "../../api/auth.api"
import Toast from "react-native-toast-message"
import { useNavigation } from "@react-navigation/native"

interface OTPVerificationProps {
    route?: any
}

export default function OTPVerificationScreen({
    route
}: OTPVerificationProps) {
    const [otp, setOtp] = useState(["", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false);
    const { data, onResendOTP } = route?.params || {}
    const [error, setError] = useState<string>("")
    const navigation = useNavigation();

    const inputRefs = useRef<(TextInput | null)[]>([])

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
            return () => clearInterval(interval)
        } else {
            setCanResend(true)
        }
    }, [timer]);

    useEffect(() => {
        async function sendOtpFirstTime() {
            console.log("Sending OTP for the first time...");
            if (data) {
                console.log("Sending OTP for the first time to:", data.email);
                try {
                    await sendOtp(data.email);
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                }
            }
        }

        sendOtpFirstTime();
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpCode = otp.join("")

        if (otpCode.length !== 4) {
            Alert.alert("Error", "Please enter the complete 4-digit code")
            return
        }

        setIsLoading(true)

        try {
            console.log('Verifying OTP:', otpCode, 'for email:', data.email);

            const response = await verifyOtp(data.email, otpCode)
            console.log('response', response)
            if (response.message !== "OTP verified successfully") {
                setError("Verification failed. Please check your code and try again.");
            } else {
                await registerUser(
                    data.username,
                    data.full_name,
                    data.email,
                    data.password,
                    data.passwordConfirmation,
                    "Student",
                    true
                );

                Toast.show({
                    type: "success",
                    text1: "Verifikasi Berhasil",
                    text2: "Akun anda berhasil dibuat.",
                })

                navigation.navigate("LoginScreen");
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Verifikasi Gagal",
                text2: error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.",
            })
            setOtp(["", "", "", ""])
            inputRefs.current[0]?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (!canResend) return

        setIsResending(true)

        try {
            await onResendOTP()
            setTimer(60)
            setCanResend(false)
            setOtp(["", "", "", ""])
            Alert.alert("Success", "A new verification code has been sent")
        } catch (error) {
            Alert.alert("Error", "Failed to resend code. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
                <Text style={styles.title}>Verifikasi Akun Anda</Text>
                <Text style={styles.subtitle}>
                    Kami telah mengirimkan kode 4-digit ke email anda{"\n"}
                    <Text style={styles.contact}>{data.email}</Text>
                </Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            selectTextOnFocus
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <Pressable
                    style={[styles.verifyButton, otp.join("").length !== 4 && styles.verifyButtonDisabled]}
                    onPress={handleVerify}
                    disabled={otp.join("").length !== 4 || isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.verifyButtonText}>Verifikasi</Text>}
                </Pressable>

                <View style={styles.resendContainer}>
                    {canResend ? (
                        <Pressable onPress={handleResend} disabled={isResending}>
                            <Text style={styles.resendText}>{isResending ? "Mengirim..." : "Kirim Ulang"}</Text>
                        </Pressable>
                    ) : (
                        <Text style={styles.timerText}>Kirim ulang kode dalam {formatTime(timer)}</Text>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontFamily: "Inter-Bold",
        color: "#1F2937",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
    },
    contact: {
        fontFamily: "Inter-Medium",
        color: "#1F2937",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 40,
        paddingHorizontal: 20,
        gap: 10,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        textAlign: "center",
        fontSize: 24,
        fontFamily: "Inter-Medium",
        color: "#1F2937",
        backgroundColor: "#F9FAFB",
    },
    otpInputFilled: {
        borderColor: "#3B82F6",
        backgroundColor: "#EFF6FF",
    },
    verifyButton: {
        width: "100%",
        height: 56,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    verifyButtonDisabled: {
        backgroundColor: "#9CA3AF",
    },
    verifyButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Inter-Medium",
    },
    resendContainer: {
        marginBottom: 20,
    },
    resendText: {
        color: "#3B82F6",
        fontSize: 16,
        fontWeight: "600",
    },
    timerText: {
        color: "#6B7280",
        fontSize: 16,
    },
    changeMethodButton: {
        marginTop: 20,
    },
    changeMethodText: {
        color: "#6B7280",
        fontSize: 14,
        textDecorationLine: "underline",
    },
})
