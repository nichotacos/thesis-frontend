import { apiClient } from "../apiClient";

interface BuyBoostRequest {
    userId: string;
    itemId: string;
}

export default async function buyBoost({
    userId,
    itemId
}: BuyBoostRequest) {
    try {
        const response = await apiClient.post(`/user/buy-boost`, {
            userId,
            itemId
        });
        return response.data;
    } catch (error) {
        console.error('Error buying boost:', error);
        throw error;
    }
}