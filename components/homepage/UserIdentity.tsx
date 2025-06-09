import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import getFirstName from "../../utils/getFirstName";

interface UserIdentityProps {
    profilePicture?: string;
    userFullName: string;
    userLevel: number;
    totalGems: number;
    copilot?: any
}

export default function UserIdentity({
    profilePicture,
    userFullName,
    userLevel,
    totalGems,
    copilot
}: UserIdentityProps) {
    const name = getFirstName(userFullName);

    return (
        <View style={styles.innerContainer} {...copilot}>
            <View style={styles.innerContainer}>
                <Image
                    source={{ uri: profilePicture }}
                    style={styles.avatarImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.haloText}>Halo, <Text style={styles.nameText}>{name}</Text></Text>
                    <Text style={styles.levelText}>{`Level ${userLevel}`}</Text>
                </View>
            </View>
            <View style={styles.gemsContainer}>
                <Image
                    source={require("../../assets/gamification/gems.png")}
                    style={styles.gemsImage}
                />
                <Text style={styles.gemsCountText}>{totalGems}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        marginLeft: 16,
    },
    haloText: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
    },
    nameText: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.primary,
    },
    levelText: {
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },
    gemsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: GlobalStyles.colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 8,
    },
    gemsCountText: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: "white",
    },
    gemsImage: {
        width: 25,
        height: 25,
    }
})