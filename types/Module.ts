import { Question } from "./Question";

export type Module = {
    _id: string;
    index: number;
    name: string;
    description: string;
    level: {
        _id: string;
        name: string;
        actualBipaLevel: string;
    };
    isUnitReview: boolean;
    // questions: Question[];
    // createdAt?: Date;
    // updatedAt?: Date;
}