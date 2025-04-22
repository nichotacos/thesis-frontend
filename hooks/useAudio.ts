import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function useAudio() {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [position, setPosition] = useState<number | null>(null);
    const [isAudioEnded, setIsAudioEnded] = useState(false);
    const [currentUri, setCurrentUri] = useState<string | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const playAudio = async (uri: string) => {
        const status = sound ? await sound.getStatusAsync() : null;

        if (sound && status?.isLoaded && status?.uri === uri && !status?.isPlaying) {
            await sound.playAsync();
            return;
        }

        if (sound) {
            await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
        );

        setSound(newSound);
        setIsPlaying(true);
        setIsAudioEnded(false);

        newSound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) return;

            if (status.didJustFinish) {
                setIsAudioEnded(true);
                setIsPlaying(false);
            }

            if ('durationMillis' in status && status.durationMillis) {
                setDuration(status.durationMillis ?? null);
            }

            setIsPlaying(status.isPlaying ?? false);
        });

        await newSound.playAsync();
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setDuration(status.durationMillis ?? null);
            setPosition(status.positionMillis ?? null);
        }
    };

    const togglePlayback = async () => {
        if (!sound) return;

        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
            if (status.isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    };

    return {
        playAudio,
        togglePlayback,
        isPlaying,
        duration,
        position,
        isAudioEnded,
    };
}
