import { Text, View } from "react-native";

interface LevelScreenProps {
    userCurrentLevel: string;
    route: any;
}

export default function LevelScreen({
    userCurrentLevel,
    route
}: LevelScreenProps) {
    return (
        <View>
            <Text>Level Screen</Text>
        </View>
    )
};
