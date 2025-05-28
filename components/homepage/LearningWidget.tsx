import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import WideButton from "../UI/WideButton";

interface LearningWidgetProps {
    wordsLearned?: number;
    userSkillLevel?: string;
    userLatestModule?: number;
    userLatestModuleName?: string;
    isDictionary: boolean;
    onPress: () => void;
}

export default function LearningWidget({
    wordsLearned,
    userSkillLevel,
    userLatestModule,
    userLatestModuleName,
    isDictionary,
    onPress,
}: LearningWidgetProps) {
    return (
        <View
            style={[
                styles.container,
                isDictionary
                    ? { backgroundColor: GlobalStyles.colors.primary }
                    : { backgroundColor: GlobalStyles.colors.primary },
            ]}
        >
            <View style={styles.textAndImageContainer}>
                <View style={styles.imageRow}>
                    <View style={[styles.imageContainer, isDictionary ? { backgroundColor: GlobalStyles.colors.lighterPrimary } : { backgroundColor: GlobalStyles.colors.lighterPrimary }]}>
                        <Image
                            source={
                                isDictionary
                                    ? require("../../assets/icons/dictionary.png")
                                    : require("../../assets/icons/studying-person.png")
                            }
                            style={styles.image}
                        />
                    </View>
                </View>
                <View style={styles.textContainer}>
                    {isDictionary ? (
                        <>
                            <Text style={styles.text}>
                                Kamus
                            </Text>
                            <Text style={styles.subtext}>
                                Kosa Kata
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.text}>
                                {`${userSkillLevel} `}
                            </Text>
                            <Text style={styles.subtext}>
                                {userLatestModuleName === 'Selesai' ? 'Kamu sudah menyelesaikan level ini' : `Modul ${userLatestModule} - ${userLatestModuleName}`}
                            </Text>
                        </>
                    )}
                </View>
            </View>
            {isDictionary ? (
                <View style={styles.outerProgressBar}>
                    <View style={[styles.innerProgressBar, { width: '20%' }]} >
                        <Text style={styles.progressText}>
                            20%
                        </Text>
                    </View>
                </View>
            ) : (
                <View>
                    <WideButton
                        text="Lanjut Belajar"
                        color={GlobalStyles.colors.whiteFont}
                        size={18}
                        onPress={onPress}
                        style={{
                            backgroundColor: GlobalStyles.colors.lighterPrimary,
                            paddingVertical: 12,
                            borderRadius: 50,
                            marginTop: 8,
                        }}
                    />
                </View>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 32,
        marginBottom: 16,
    },
    textAndImageContainer: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    imageRow: {
        flexDirection: "row",
        justifyContent: "flex-end", // align image to the right
        marginBottom: 12,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 45,
        height: 45,
    },
    textContainer: {
        // you can style this if needed
    },
    text: {
        fontSize: 20,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.whiteFont,
    },
    subtext: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: GlobalStyles.colors.whiteFont,
        marginTop: 4,
    },
    outerProgressBar: {
        width: "100%",
        height: 56,
        borderRadius: 50,
        backgroundColor: GlobalStyles.colors.lighterPrimary,
        marginTop: 8
    },
    innerProgressBar: {
        justifyContent: "center",
        borderRadius: 50,
        height: 56,
        backgroundColor: GlobalStyles.colors.lighterAccent2,
    },
    progressText: {
        fontSize: 20,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.accent,
        textAlign: "center",
    }
});
