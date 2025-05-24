import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";


export default function ScreenLoading() {
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../../assets/lottie/screen-loading.json")}
                autoPlay
                loop
                style={{ width: "20%", height: "20%" }}
                resizeMode="cover"
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    }
})