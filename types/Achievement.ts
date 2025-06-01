export type Achievement = {
    _id: string;
    code: string;
    title: string;
    description: string;
    category: string;
    rarity: string;
    maxProgress: number,
    badge: string,
    reward: number,
    createdAt?: Date;
    updatedAt?: Date;
}