import { Image, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import getFirstName from "../../utils/getFirstName";

interface UserIdentityProps {
    profilePicture?: string;
    userFullName: string;
    userLevel: number;
    totalGems: number;
}

export default function UserIdentity({
    profilePicture,
    userFullName,
    userLevel,
    totalGems,
}: UserIdentityProps) {
    const name = getFirstName(userFullName);

    return (
        <View style={styles.innerContainer}>
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
                <Text style={styles.gemsCountText}>{totalGems}</Text>
                <Image
                    source={require("../../assets/gamification/gems.png")}
                    style={styles.gemsImage}
                />
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
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        marginLeft: 16,
    },
    haloText: {
        fontSize: 20,
        fontFamily: "Inter-Bold",
    },
    nameText: {
        fontSize: 20,
        fontFamily: "Inter-Bold",
        color: GlobalStyles.colors.primary,
    },
    levelText: {
        fontSize: 14,
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
        fontSize: 20,
        fontFamily: "Inter-Bold",
        color: "white",
    },
    gemsImage: {
        width: 30,
        height: 30,
    }
})