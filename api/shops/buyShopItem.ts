import { apiClient } from "../apiClient";

interface BuyShopItemRequest {
    userId: string;
    itemId: string;
}

export default async function buyShopItem({
    userId,
    itemId
}: BuyShopItemRequest) {
    try {
        const response = await apiClient.post('/user/buy-shop-item', {
            userId,
            itemId,
        });

        return response.data;
    } catch (error) {
        console.error('error on purchasing item', error);
        throw error;
    }
}