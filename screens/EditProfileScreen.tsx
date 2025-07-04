"use client"

import { useEffect, useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import ScreenLoading from "../components/UI/ScreenLoading"
import { useNavigation } from "@react-navigation/native"
import { User } from "../types/User"
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile, updateUserProfilePicture } from "../api/user"
import { updateUserProfile as updateUserProfileReducer } from "../store/userSlice"
import { updateUserProfilePicture as updateUserProfilePictureReducer } from "../store/userSlice"
import { GlobalStyles } from "../constants/styles"

interface ProfileData {
    userFullName: string
    email: string
    username: string
}

export default function EditProfileScreen() {
    const userData = useSelector((state: { user: { userInfo: User } }) => state.user.userInfo)
    const [profile, setProfile] = useState<ProfileData>({
        userFullName: userData.userFullName || "",
        email: userData.email || "",
        username: userData.username || "",
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [image, setImage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [imageFile, setImageFile] = useState<{
        uri: string;
        name: string;
        type: string;
    } | null>(null);

    useEffect(() => {
        if (userData) {
            setIsLoading(true);
            setProfile({
                userFullName: userData.userFullName || "",
                email: userData.email || "",
                username: userData.username || "",
            });
            setIsLoading(false);
        }

        console.log("EditProfileScreen mounted with userData:", userData);
        console.log("EditProfileScreen mounted with userData:", profile);
    }, [userData]);

    const handleSave = async () => {
        try {
            setIsLoading(true)
            console.log("Saving profile with data:", profile);
            if (!profile.userFullName || !profile.username || !profile.email) {
                Alert.alert("Error", "Semua field harus diisi.")
                setIsLoading(false)
                return;
            }
            console.log("Saving profile with image file:", imageFile);
            const updatedProfile = {
                userFullName: profile.userFullName,
                email: profile.email,
                username: profile.username,
            };
            await updateUserProfile(userData._id, updatedProfile);
            if (imageFile) {
                const response = await updateUserProfilePicture(userData._id, imageFile);
                console.log("Profile picture updated successfully:", response.user.profilePicture);
                dispatch(updateUserProfilePictureReducer(response.user.profilePicture));
            }
            dispatch(updateUserProfileReducer(profile));
            setTimeout(() => {
                setIsLoading(false)
                Alert.alert("Berhasil", "Berhasil memperbarui profil!")
            }, 1000)
        } catch (error) {
            console.error("Error saving profile:", error)
            Alert.alert("Error", "Gagal memperbarui profil. Silakan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const file = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || `profile-${Date.now()}-${userData._id}.${result.assets[0].uri.split('.').pop()}`,
                type: result.assets[0].type || 'image/jpeg',
            }

            setImageFile(file);
            setImage(result.assets[0].uri);
        }
    };

    const handleImagePicker = () => {
        Alert.alert("Ubah Foto Profil", "Pilih opsi di bawah", [
            { text: "Galeri", onPress: pickImage },
            { text: "Batal", style: "cancel" },
        ])
    }

    if (isLoading || !userData) {
        return (
            <SafeAreaView style={styles.container}>
                <ScreenLoading />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profil</Text>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                        ]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveText}>{isLoading ? "Menyimpan..." : "Simpan"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Picture */}
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image
                            source={image ? { uri: image } : { uri: userData.profilePicture || "https://via.placeholder.com/120" }}
                            style={styles.profileImage}
                        />
                        <View style={styles.editImageOverlay}>
                            <Text style={styles.editImageText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.userFullName}
                            onChangeText={(text) => setProfile({ ...profile, userFullName: text })}
                            placeholder="Enter your name"
                            placeholderTextColor="#999"
                        />
                        {profile.userFullName.length < 3 && (
                            <Text style={{ color: "red", marginTop: 4 }}>
                                Nama lengkap harus terdiri dari minimal 3 karakter.
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.username}
                            onChangeText={(text) => setProfile({ ...profile, username: text })}
                            placeholder="Enter your username"
                            placeholderTextColor="#999"
                        />
                        {profile.username.length < 3 && (
                            <Text style={{ color: "red", marginTop: 4 }}>
                                Username harus terdiri dari minimal 3 karakter.
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.email}
                            onChangeText={(text) => setProfile({ ...profile, email: text })}
                            placeholder="Enter your email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {profile.email && !/\S+@\S+\.\S+/.test(profile.email) && (
                            <Text style={{ color: "red", marginTop: 4 }}>
                                Masukkan alamat email yang valid.
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.lightBackground,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    cancelButton: {
        paddingVertical: 8,
    },
    cancelText: {
        fontSize: 16,
        color: "#666",
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        color: "#000",
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "600",
    },
    profileImageContainer: {
        alignItems: "center",
        paddingVertical: 32,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f5f5f5",
    },
    editImageOverlay: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#007AFF",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 2,
        borderColor: "#fff",
    },
    editImageText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#fafafa",
    },
    bioInput: {
        height: 100,
        paddingTop: 14,
    },
})
