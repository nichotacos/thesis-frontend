import { apiClient } from "../apiClient";

interface CompleteModuleProps {
    moduleId: string;
    userId: string;
    correctCount: number;
    score: number;
    totalAnswers: number;
}

export default async function completeModule({
    moduleId,
    userId,
    correctCount,
    score,
    totalAnswers,
}: CompleteModuleProps) {
    try {
        const response = await apiClient.post('/module/complete', {
            moduleId,
            userId,
            correctCount,
            score,
            totalAnswers,
        });
        return response.data;
    } catch (error) {
        console.error('Error completing module:', error);
        throw error;
    }
};
