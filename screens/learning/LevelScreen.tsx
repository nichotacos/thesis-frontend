import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import LevelStamp from "../../components/learning/LevelStamp";
import Svg, { Path } from "react-native-svg";

interface LevelScreenProps {
    userCurrentLevel: string;
    route: any;
}

export default function LevelScreen({
    userCurrentLevel,
    route
}: LevelScreenProps) {
    return (
        <View style={styles.container}>
            <Text>Level Screen</Text>
            <View style={styles.content}>
                <LevelStamp
                    imageSource={require('../../assets/gamification/bali-stamp.png')}
                    name="Bali"
                    style={{ top: 40, left: 20 }}
                />
                <Svg viewBox="0 0 630 1200" width="100%" height="100%" style={{ borderWidth: 1 }}>
                    <Path
                        d="M243.584228515625,102.09318542480469C297.1923522949219,105.64515686035156,469.38470458984375,75.47789255777995,515.2329711914062,103.40501403808594C561.0812377929688,131.33213551839194,526.4336853027344,245.2807642618815,528.673828125,320.6559143066406"
                        fill="none"
                        stroke={GlobalStyles.colors.primary}
                        strokeWidth={20}
                        strokeLinecap="round"
                    />
                </Svg>

                <LevelStamp
                    imageSource={require('../../assets/gamification/bali-stamp.png')}
                    name="Jakarta"
                    style={{ top: 260, right: 20 }}
                />

                <Svg viewBox="0 0 620 1200" width="100%" height="100%" style={{ borderWidth: 1, position: "absolute", top: 210, left: 20 }}>
                    <Path
                        d="M243.584228515625,102.09318542480469C297.1923522949219,105.64515686035156,469.38470458984375,75.47789255777995,515.2329711914062,103.40501403808594C561.0812377929688,131.33213551839194,526.4336853027344,245.2807642618815,528.673828125,320.6559143066406"
                        fill="none"
                        stroke={GlobalStyles.colors.primary}
                        strokeWidth={20}
                        strokeLinecap="round"
                        transform={[
                            { scaleX: -1 },
                            { translateX: 620 } // adjust based on viewBox width
                        ]}
                    />
                </Svg>

                <LevelStamp
                    imageSource={require('../../assets/gamification/bali-stamp.png')}
                    name="Bali"
                    style={{ top: 465, left: 20 }}
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
        padding: 16
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        position: "relative",
    }
})
