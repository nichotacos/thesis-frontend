import { Achievement } from "./Achievement";
import { Level } from "./Level";
import { Module } from "./Module";

export type User = {
    _id: string;
    username: string;
    userFullName: string;
    email: string;
    totalExp: number;
    weeklyExp: number;
    dailyExp: number;
    totalGems: number;
    lastLogin?: string;
    profilePicture?: string;
    currentLevel?: number;
    currentLearnLevel?: Level;
    currentModule?: Module;
    hearts?: {
        current: number;
        lostAt: string[];
    };
    streak: {
        streakCount: number,
        highestStreak: number,
        lastActivity: string,
    };
    completedModules: {
        module: Module;
        correctCount: number;
        totalAnswers: number;
        score: number;
        completedAt: string;
    }[];
    isAbleToClaimDailyReward: boolean;
    lastDailyRewardClaim?: string;
    hasClaimedDailyReward: boolean;
    achievements: {
        achievement: Achievement;
        progress: number;
        unlockedAt: string;
    }[],
    previousLeaderboardRank?: number;
    top3Count: number;
    purchases: {
        _id: string;
        item: string;
        purchasedAt: string
    }[];
    activeBoost: {
        boostType: string;
        startedAt: string;
        expiresAt: string;
    }
    createdAt?: string;
    updatedAt?: string;
}