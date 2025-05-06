import { Button, StyleSheet, View, Modal as RNModal } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onRequestClose: () => void;
    type?: "gems" | "level" | "achievement";
}

export default function Modal({ children, isOpen, onRequestClose, type, ...rest }) {
    const animation = useRef<LottieView>(null);

    let content = null;
    const animationSource = type === "gems" ? require("../../assets/lottie/gems.json") : require("../../assets/lottie/level-up.json");

    if (type === "gems" || type === "level") {
        content = (
            <View style={styles.modalContainer}>
                <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{ width: 100, height: 100 }}
                        source={animationSource}
                    />
                    {children}
                    <Button title="Close" onPress={onRequestClose} />
                </View>
            </View>
        )
    }

    return (
        <RNModal
            transparent={true}
            animationType="fade"
            visible={isOpen}
            statusBarTranslucent={true}
            onRequestClose={onRequestClose}
            {...rest}
        >
            {content}
        </RNModal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
})