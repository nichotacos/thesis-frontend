export type User = {
    id: string;
    username: string;
    userFullName: string;
    email: string;
    totalExp: number;
    weeklyExp: number;
    dailyExp: number;
    totalStreak: number;
    highestStreak: number;
    totalGems: number;
    lastLogin?: Date;
    profilePicture?: string;
    currentLevel?: number;
    currentLearnLevel?: string;
    currentModule?: string;
    createdAt?: Date;
    updatedAt?: Date;
}