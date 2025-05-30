import { apiClient } from "../apiClient";

interface RegisterPayload {
    userFullName: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    captchaToken: string;
}

interface UpdateUserProfilePayload {
    userFullName: string;
    username: string;
    email: string;
    profilePicture?: string;
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

export async function updateUserProfile(userId: string, payload: UpdateUserProfilePayload) {
    try {
        const response = await apiClient.put(`/user/update`, {
            userId,
            ...payload,
        });
        console.log('User profile updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
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

export async function equipItemToUser(userId: string, itemId: string) {
    try {
        const response = await apiClient.post('/user/equip-item', {
            userId,
            itemId,
        });

        console.log('Item equipped successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error equipping item to user:', error);
        throw error;
    }
}