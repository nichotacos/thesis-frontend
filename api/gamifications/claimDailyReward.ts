import { apiClient } from "../apiClient";

export default async function claimDailyReward(userId: string, gems: number) {
    try {
        const response = await apiClient.post('/user/claim-daily-reward', {
            userId,
            gems,
        });
        return response.data;
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        throw error;
    }
}