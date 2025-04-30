import { apiClient } from "../apiClient";

interface CompleteModuleProps {
    moduleId: string;
    userId: string;
    correctCount: number;
    score: number;
    totalAnswer: number;
}

export default async function completeModule({
    moduleId,
    userId,
    correctCount,
    score,
    totalAnswer,
}: CompleteModuleProps) {
    try {
        console.log('request data:', {
            moduleId,
            userId,
            correctCount,
            score,
            totalAnswer,
        })
        const response = await apiClient.post('/module/complete', {
            moduleId,
            userId,
            correctCount,
            score,
            totalAnswer,
        });
        return response.data;
    } catch (error) {
        console.error('Error completing module:', error);
        throw error;
    }
};
