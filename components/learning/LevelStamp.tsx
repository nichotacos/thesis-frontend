import { useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

interface LevelStampProps {
    name: string;
    imageSource: ImageSourcePropType;
    style: object;
    disabled?: boolean;
    onPress: () => void;
    borderStyle?: object;
    completedModules?: number;
    totalModules?: number;
}

export default function LevelStamp({
    name,
    imageSource,
    style,
    disabled,
    onPress,
    borderStyle,
    completedModules,
    totalModules,
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
                android_ripple={{
                    color: "rgba(255, 255, 255, 0.5)",
                    borderless: true,
                    radius: 100,
                }}
            >
                <Image
                    source={imageSource}
                    style={[styles.stamp, borderStyle, !disabled && styles.glowEffect]}
                />
            </Pressable>
            <Text style={styles.text}>{name}</Text>
            {!disabled && (
                <Text style={styles.completedModuleText}>{`${completedModules}/${totalModules}`}</Text>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
    },
    stamp: {
        width: 128,
        height: 160,
        // width: 128,
        // height: 128,
        overflow: "hidden",
    },
    text: {
        fontFamily: "Inter-Bold",
        textAlign: "center",
        fontSize: 20,
        marginTop: 6,
        color: GlobalStyles.colors.whiteFont,
    },
    glowEffect: {
        elevation: 30,
        shadowColor: 'yellow',
        shadowOpacity: 0.9
    },
    completedModuleText: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
        textAlign: "center",
        marginTop: 4,
        color: GlobalStyles.colors.whiteFont,
    }
})
