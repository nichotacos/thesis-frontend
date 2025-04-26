import { useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

interface LevelStampProps {
    name: string;
    imageSource: ImageSourcePropType;
    style: object;
    disabled?: boolean;
    onPress: () => void;
}

export default function LevelStamp({
    name,
    imageSource,
    style,
    disabled,
    onPress
}: LevelStampProps) {
    return (
        <View style={[styles.container, style]}>
            <Pressable
                android_disableSound={true}
                disabled={disabled}
                onPress={onPress}
                style={{
                    zIndex: 1,
                }}
            >
                <Image
                    source={imageSource}
                    style={styles.stamp}
                />
                <Text style={styles.text}>{name}</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        // borderWidth: 1,
    },
    stamp: {
        width: 128,
        height: 160,
        overflow: "hidden",
        marginBottom: 4
    },
    text: {
        fontFamily: "Inter-Bold",
        textAlign: "center",
        fontSize: 20,
    },
})
