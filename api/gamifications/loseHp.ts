import { apiClient } from "../apiClient";

export default async function loseHp(userId: string) {
    try {
        const response = await apiClient.post('/user/lose-heart', {
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Error losing HP:', error);
        throw error;
    }
}