import { Button, StyleSheet, View, Modal as RNModal, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import WideButton from "./WideButton";
import { GlobalStyles } from "../../constants/styles";

interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    type?: "gems" | "level" | "achievement";
    receivedAmount?: number;
    unlockedLevel?: string;
    unlockedAchievement?: string;
}

export default function Modal({
    isOpen,
    onRequestClose,
    type,
    receivedAmount,
    unlockedLevel,
    unlockedAchievement,
    ...rest
}: ModalProps) {
    const animation = useRef<LottieView>(null);
    const animationSource = type === "gems" ? require("../../assets/lottie/gems.json") : type === "level" ? require("../../assets/lottie/level-up.json") : require("../../assets/lottie/achievement.json");

    return (
        <RNModal
            transparent={true}
            animationType="fade"
            visible={isOpen}
            statusBarTranslucent={true}
            onRequestClose={onRequestClose}
            {...rest}
        >
            <View style={styles.modalContainer}>
                <View style={styles.insideModalContainer}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{ width: 220, height: 220 }}
                        source={animationSource}
                    />
                    <View>
                        <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: GlobalStyles.colors.primary }}>
                            {type === "gems" ? `Kamu mendapatkan gems!` : type === "level" ? "Unit baru telah dibuka!" : "Kamu mendapat pencapaian baru!"}
                        </Text>
                    </View>
                    <View style={styles.gemsContainer}>
                        {type === "gems" ? (
                            <>
                                <Text style={styles.gemsText}>{`+ ${receivedAmount}`}</Text>
                                <Image
                                    source={require("../../assets/gamification/gems.png")}
                                    style={{ width: 32, height: 32, marginLeft: 5 }}
                                />
                            </>
                        ) : type === "level" ? (
                            <Text style={styles.gemsText}>{unlockedLevel}</Text>
                        ) : (
                            <Text>{unlockedAchievement}</Text>
                        )}
                    </View>
                    <WideButton
                        buttonColor={GlobalStyles.colors.accent}
                        textColor="white"
                        onPress={onRequestClose}
                        style={styles.button}
                        text="Tutup"
                        size={18}
                        disabled={false}
                    />
                </View>
            </View>
        </RNModal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    insideModalContainer: {
        backgroundColor: GlobalStyles.colors.whiteFont,
        padding: 20,
        borderRadius: 20,
        width: "80%",
        alignItems: "center",
    },
    gemsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: 'rgba(101, 101, 101, 0.1)',
        alignItems: "center",
        padding: 10,
        borderRadius: 20,
        marginVertical: 20,
    },
    gemsText: {
        fontFamily: "Inter-Bold",
        fontSize: 20,
        color: GlobalStyles.colors.accent
    },
    button: {
        borderRadius: 20,
        width: "100%",
        paddingVertical: 10
    }
})