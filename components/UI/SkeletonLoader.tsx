"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Animated, StyleSheet, type ViewStyle } from "react-native"
import { GlobalStyles } from "../../constants/styles"

interface SkeletonLoaderProps {
    style?: ViewStyle
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ style }) => {
    const opacity = useRef(new Animated.Value(0.3)).current

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        )

        animation.start()

        return () => {
            animation.stop()
        }
    }, [opacity])

    return <Animated.View style={[styles.skeleton, { opacity }, style]} />
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'lightgrey',
        borderRadius: 4,
    },
})

export default SkeletonLoader
