import { Pressable, Text, View } from "react-native";
import WideButton from "../components/UI/WideButton";
import { GlobalStyles } from "../constants/styles";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileSettingScreen(params) {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    async function handleLogout() {
        try {
            dispatch(logout());
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: GlobalStyles.colors.lightBackground }}>
            <View>
                <Pressable
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: 'lightgrey',
                        padding: 14
                    }}
                    onPress={() => navigation.navigate('EditProfileScreen')}
                    android_disableSound={true}
                >
                    <FontAwesome name="pencil-square-o" size={24} />
                    <Text style={{ fontSize: 18, fontFamily: 'Inter-Regular' }}>Edit Profil</Text>
                </Pressable>
            </View>

            <View style={{ marginTop: 20, marginBottom: 100 }}>
                {/* <WideButton
                    text="Keluar"
                    color={GlobalStyles.colors.whiteFont}
                    size={18}
                    onPress={handleLogout}
                    style={{
                        backgroundColor: GlobalStyles.colors.primary,
                        paddingVertical: 12,
                        borderRadius: 50,
                        marginTop: 8,
                    }}
                    disabled={false}
                /> */}
                <Pressable
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: 'lightgrey',
                        padding: 14
                    }}
                    onPress={handleLogout}
                    android_disableSound={true}
                >
                    <FontAwesome name="sign-out" size={24} color='crimson' />
                    <Text style={{ fontSize: 18, fontFamily: 'Inter-Regular', color: 'crimson' }}>Keluar</Text>
                </Pressable>
            </View>
        </View>
    )
};
