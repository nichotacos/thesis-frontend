import { apiClient } from "../apiClient";

interface RegisterPayload {
    full_name: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    captchaToken: string;
}

export async function registerUser(user: RegisterPayload) {
    try {
        const response = await apiClient.post(`/user`, user);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Rethrow the error for further handling if needed
    }
}

export async function getWeeklyLeaderboard(userId: string) {
    try {
        console.log('Fetching weekly leaderboard for userId:', userId);
        const response = await apiClient.get('/weekly-leaderboard', {
            params: { userId },
        });
        console.log('Weekly leaderboard data:', response);
        return response;
    } catch (error) {
        console.error('Error fetching weekly leaderboard:', error);
        throw error; // Rethrow the error for further handling if needed
    }
}