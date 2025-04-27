import { Audio } from 'expo-av';

const correctSound = require('../assets/audio/correct.wav');
const incorrectSound = require('../assets/audio/incorrect.wav');

export default async function playCheckAnswerSound(isCorrect: boolean) {
    const soundObject = new Audio.Sound();

    try {
        const source = isCorrect ? correctSound : incorrectSound;
        await soundObject.loadAsync(source);
        await soundObject.playAsync();

        soundObject.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                soundObject.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}