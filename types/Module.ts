import { Question } from "./Question";

export type Module = {
    _id: string;
    name: string;
    description: string;
    level: {
        _id: string;
        name: string;
        actualBipaLevel: string;
    }
    // questions: Question[];
    // createdAt?: Date;
    // updatedAt?: Date;
}