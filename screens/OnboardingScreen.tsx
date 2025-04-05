import { Text, TouchableOpacity, Image, StyleSheet, View, Dimensions, ImageSourcePropType } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import Svg, { Path } from "react-native-svg";
import { GlobalStyles } from "../constants/styles";
import { GlobalContents } from "../constants/contents";
import CircularButton from "../components/UI/CircularButton";
import TextButton from "../components/UI/TextButton";
import WideButton from "../components/UI/WideButton";
import { useState } from "react";

type OnboardingScreenProps = {
    onDone: () => void;
};

const ImageComponent = ({ source }: { source: ImageSourcePropType }) => {
    return (
        <View style={styles.imageContainer}>
            <Image source={source} style={styles.image} />
            <Svg
                height={100}
                width={Dimensions.get("screen").width}
                viewBox="0 0 1440 320"
                style={styles.wave}
            >
                <Path
                    fill={GlobalStyles.colors.primary}
                    fillOpacity={1}
                    d="M0,224L34.3,192C68.6,160,137,96,206,106.7C274.3,117,343,203,411,208C480,213,549,139,617,112C685.7,85,754,107,823,128C891.4,149,960,171,1029,154.7C1097.1,139,1166,85,1234,69.3C1302.9,53,1371,75,1406,85.3L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
                />
            </Svg>
        </View >
    )
}

const TitleComponent = ({ title }: { title: string }) => {
    return (
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
                {title}
            </Text>
            <View style={styles.divider} />
        </View>
    )
}

const SubtitleComponent = ({ subtitle }: { subtitle: string }) => {
    return (
        <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
                {subtitle}
            </Text>
        </View>
    )
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <Onboarding
            skipToPage={2}
            onDone={onDone}
            bottomBarHeight={150}
            bottomBarColor={GlobalStyles.colors.primary}
            pageIndexCallback={(page) => {
                setCurrentPage(page);
            }}
            pages={[
                {
                    backgroundColor: GlobalStyles.colors.primary,
                    title: <TitleComponent title={GlobalContents.onboardingContents[0].title} />,
                    subtitle: <SubtitleComponent subtitle={GlobalContents.onboardingContents[0].subtitle} />,
                    image: <ImageComponent source={GlobalContents.onboardingContents[0].image} />,
                },
                {
                    backgroundColor: GlobalStyles.colors.primary,
                    title: <TitleComponent title={GlobalContents.onboardingContents[1].title} />,
                    subtitle: <SubtitleComponent subtitle={GlobalContents.onboardingContents[1].subtitle} />,
                    image: <ImageComponent source={GlobalContents.onboardingContents[1].image} />,
                },
                {
                    backgroundColor: GlobalStyles.colors.primary,
                    title: <TitleComponent title={GlobalContents.onboardingContents[2].title} />,
                    subtitle: <SubtitleComponent subtitle={GlobalContents.onboardingContents[2].subtitle} />,
                    image: <ImageComponent source={GlobalContents.onboardingContents[2].image} />,
                }
            ]}
            showSkip={true}
            containerStyles={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
            }}
            NextButtonComponent={({ ...props }) => (
                <CircularButton
                    {...props}
                    icon="arrow-forward"
                    size={44}
                    color={GlobalStyles.colors.whiteFont}
                />
            )}
            SkipButtonComponent={({ ...props }) => (
                <TextButton
                    {...props}
                    text="Lewati"
                    color="gray"
                    size={14}
                    style={{
                        marginLeft: 24
                    }}
                />
            )}
            DoneButtonComponent={({ ...props }) => (
                <WideButton
                    {...props}
                    text="Mulai"
                    color={GlobalStyles.colors.whiteFont}
                    size={24}
                    style={{
                        marginRight: 24,
                        backgroundColor: GlobalStyles.colors.accent,
                        borderRadius: 50,
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        width: Dimensions.get("screen").width - 48,
                    }}
                />
            )}
            imageContainerStyles={{
                flexShrink: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                zIndex: -1,
            }}
            DotComponent={({ selected }) => (
                currentPage !== 2 ? (
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: selected ? GlobalStyles.colors.accent : GlobalStyles.colors.whiteFont,
                            marginHorizontal: 5,
                        }}
                    />
                ) : undefined
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: 461,
        overflow: "hidden",
    },
    image: {
        width: 411,
        height: 450,
    },
    wave: {
        position: "absolute",
        bottom: 0,
    },
    titleContainer: {
        width: "80%",
        marginTop: -70,
    },
    titleText: {
        fontFamily: "Inter-Bold",
        fontSize: 36,
        textAlign: "left",
        color: GlobalStyles.colors.whiteFont,
    },
    divider: {
        width: "40%",
        height: 5,
        backgroundColor: GlobalStyles.colors.accent,
        marginVertical: 20,
        borderRadius: 100,
    },
    subtitleContainer: {
        width: "80%",
    },
    subtitleText: {
        fontFamily: "Inter-Medium",
        fontSize: 16,
        textAlign: "left",
        color: GlobalStyles.colors.whiteFont,
        lineHeight: 30,
    }
})