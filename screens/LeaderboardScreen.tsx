import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { User } from "../types/User";

export default function LeaderboardScreen() {
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);

    return (
        <View>
            <Text>Leaderboard</Text>
            <Text>{userData.userFullName}</Text>
        </View>
    )
};
