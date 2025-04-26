import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getFirstName from '../../utils/getFirstName';

interface ProfileAvatarProps {
    uri?: string | null;
    size: number;
    userFullName?: string;
    onPress?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ uri, size, onPress, userFullName }) => {
    console.log('ProfileAvatar', uri, size, onPress, userFullName);
    const defaultImage = `https://ui-avatars.com/api/?name=${getFirstName(userFullName)}&background=A60000&color=fff`;

    return (
        <Pressable
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2
                }
            ]}
            onPress={onPress}
            disabled={!onPress}
        >
            <Image
                source={{ uri: uri || defaultImage }}
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2
                    }
                ]}
            />
            {onPress && (
                <View style={styles.editIconContainer}>
                    <Ionicons name="camera" size={size / 5} color="white" />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#F9A825',
    },
    avatar: {
        resizeMode: 'cover',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileAvatar;