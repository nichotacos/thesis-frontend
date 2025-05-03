import { apiClient } from "../apiClient";
import { Achievement } from "../../types/Achievement";

export default async function fetchAchievements() {
    try {
        const response = await apiClient.get('/achievement');
        return response.data;
    } catch (error) {
        console.error('Error fetching achievements:', error);
        throw error;
    }
}