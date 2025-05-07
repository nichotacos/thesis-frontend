import { apiClient } from "../apiClient";

export async function grantAchievement(userId: string, achievementCode: string) {
    try {
        const response = await apiClient.post('/achievement/grant-achievement', {
            userId,
            achievementCode,
        });
        return response.data;
    } catch (error) {
        console.error('Error granting achievement:', error);
        throw error;
    }
}