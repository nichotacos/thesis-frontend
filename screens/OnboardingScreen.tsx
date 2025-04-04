import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

type OnboardingScreenProps = {
    onNext: () => void;
    onSkip: () => void;
};

export default function OnboardingScreen({ onNext, onSkip }: OnboardingScreenProps) {
    return (
        <Onboarding
            onSkip={onSkip}
            onDone={onNext}
            bottomBarHeight={80} // Adjust bottom bar height
            bottomBarColor="transparent" // Match background if needed
            pages={[
                {
                    backgroundColor: "#fff",
                    title: "Welcome to the App",
                    subtitle: "This is a simple onboarding screen.",
                    image: <Image source={require("../assets/Onboarding/onboarding_1.png")} style={styles.image} />,
                },
                {
                    backgroundColor: "#fdeb93",
                    title: "Learn to Use",
                    subtitle: "Follow the steps to get started.",
                    image: <Image source={require("../assets/Onboarding/onboarding_1.png")} style={styles.image} />,
                },
                {
                    backgroundColor: "#e9bcbe",
                    title: "Enjoy the Features",
                    subtitle: "Explore everything this app has to offer.",
                    image: <Image source={require("../assets/Onboarding/onboarding_1.png")} style={styles.image} />,
                }
            ]}
            showSkip={true} // Ensure the Skip button is visible
            containerStyles={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
            }} // Push content up
            NextButtonComponent={({ ...props }) => (
                <TouchableOpacity {...props} style={{ padding: 10 }}>
                    <Text style={{ fontSize: 16, color: "blue" }}>Next</Text>
                </TouchableOpacity>
            )}
            SkipButtonComponent={({ ...props }) => (
                <TouchableOpacity {...props} style={{ padding: 10 }}>
                    <Text style={{ fontSize: 16, color: "gray" }}>Skip</Text>
                </TouchableOpacity>
            )}
            DoneButtonComponent={({ ...props }) => (
                <TouchableOpacity {...props} style={{ padding: 10 }}>
                    <Text style={{ fontSize: 16, color: "green" }}>Done</Text>
                </TouchableOpacity>
            )}
            imageContainerStyles={{
                flexShrink: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                zIndex: -1,
            }}
            titleStyles={{ fontSize: 24, fontWeight: "bold", color: "#000" }}

        />
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 411,
        height: 511,
    },
})