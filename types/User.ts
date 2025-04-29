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
    lastLogin?: Date;
    profilePicture?: string;
    currentLevel?: number;
    currentLearnLevel?: Level;
    currentModule?: Module;
    hearts?: {
        current: number;
        lostAt: Date[];
    };
    streak: {
        streakCount: number,
        highestStreak: number,
        lastActivity: Date,
    };
    completedModules: {
        module: string;
        correctCount: number;
        totalAnswers: number;
        score: number;
        completedAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}