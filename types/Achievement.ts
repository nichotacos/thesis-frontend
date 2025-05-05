export type Achievement = {
    _id: string;
    code: string;
    title: string;
    description: string;
    reward: {
        type: {
            gems: number;
        }
    },
    createdAt?: Date;
    updatedAt?: Date;
}