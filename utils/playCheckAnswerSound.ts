import { AudioSource, createAudioPlayer, AudioPlayer } from 'expo-audio';

const correctSound = require('../assets/audio/correct.mp3') as AudioSource;
const incorrectSound = require('../assets/audio/incorrect.mp3') as AudioSource;

let correctPlayer: AudioPlayer | null = null;
let incorrectPlayer: AudioPlayer | null = null;

const initializePlayers = async () => {
    if (!correctPlayer) {
        correctPlayer = createAudioPlayer(correctSound);
    }
    if (!incorrectPlayer) {
        incorrectPlayer = createAudioPlayer(incorrectSound);
    }
};

export async function playCheckAnswerSound(isCorrect: boolean) {
    try {
        await initializePlayers();

        const player = isCorrect ? correctPlayer : incorrectPlayer;

        if (player) {
            await player.seekTo(0);
            player.play();
        }
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

export const cleanupAudioPlayers = () => {
    correctPlayer?.remove();
    incorrectPlayer?.remove();
    correctPlayer = null;
    incorrectPlayer = null;
};
