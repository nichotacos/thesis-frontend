import { Level } from "./Level";
import { Module } from "./Module";

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
    currentLearnLevel?: Level;
    currentModule?: Module;
    createdAt?: Date;
    updatedAt?: Date;
}