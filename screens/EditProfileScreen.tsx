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
import { updateUserProfile } from "../api/user"
import { updateUserProfile as updateUserProfileReducer } from "../store/userSlice"

interface ProfileData {
    userFullName: string
    email: string
    username: string
    profileImage: string
}

export default function EditProfileScreen() {
    const userData = useSelector((state: { user: { userInfo: User } }) => state.user.userInfo)
    const [profile, setProfile] = useState<ProfileData>({
        userFullName: userData.userFullName || "",
        email: userData.email || "",
        username: userData.username || "",
        profileImage: userData.profilePicture || "https://via.placeholder.com/150",
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [image, setImage] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            setIsLoading(true);
            setProfile({
                userFullName: userData.userFullName || "",
                email: userData.email || "",
                username: userData.username || "",
                profileImage: userData.profilePicture || "https://via.placeholder.com/150",
            });
            setIsLoading(false);
        }

        console.log("EditProfileScreen mounted with userData:", userData);
        console.log("EditProfileScreen mounted with userData:", profile);
    }, [userData]);

    const handleSave = async () => {
        try {
            setIsLoading(true)
            await updateUserProfile(userData._id, profile);
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
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleImagePicker = () => {
        Alert.alert("Change Profile Picture", "Choose an option", [
            { text: "Camera", onPress: () => console.log("Camera selected") },
            { text: "Gallery", onPress: pickImage },
            { text: "Cancel", style: "cancel" },
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
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveText}>{isLoading ? "Saving..." : "Save"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Picture */}
                <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={handleImagePicker}>
                        <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
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
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        fontWeight: "600",
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
