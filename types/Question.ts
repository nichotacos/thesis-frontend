export type Question = {
    _id: string;
    level: string;
    module: string;
    type: string;
    questionText: string;
    media: {
        audioUrl?: string;
        imageUrl?: string;
    };
    options: {
        optionText: string;
        isCorrect: boolean;
    }[];
    answer: string;
    explanation?: string;
    createdAt?: Date;
    updatedAt?: Date;
}