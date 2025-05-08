import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import getDayDifference from '../utils/getDayDifference';
import { Level } from '../types/Level';
import { Achievement } from '../types/Achievement';
import { Module } from '../types/Module';

interface UserState {
    isAuthenticated: boolean;
    userInfo: Partial<User> | null;
    token: string | null;
    allAchievements: Achievement[];
}

const initialState: UserState = {
    isAuthenticated: false,
    userInfo: null,
    token: null,
    allAchievements: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ userInfo: Partial<User>, token: string, achivements: Achievement[] }>) {
            state.isAuthenticated = true;
            state.userInfo = action.payload.userInfo;
            state.token = action.payload.token;
            state.allAchievements = action.payload.achivements;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userInfo = null;
            state.token = null;
        },
        decrementHp(state, action: PayloadAction<number>) {
            if (state.userInfo) {
                state.userInfo.hearts.current = Math.max(0, state.userInfo.hearts.current - action.payload);
            }
        },
        addExp(state, action: PayloadAction<number>) {
            if (state.userInfo) {
                state.userInfo.totalExp = (state.userInfo.totalExp || 0) + action.payload;
                state.userInfo.weeklyExp = (state.userInfo.weeklyExp || 0) + action.payload;
                state.userInfo.dailyExp = (state.userInfo.dailyExp || 0) + action.payload;
            }
        },
        completeModule(state, action: PayloadAction<{
            moduleId: string,
            exp: number,
            correctCount: number,
            score: number,
            totalAnswers: number,
            isLastModule: boolean,
            nextLevel?: Level,
            nextLevelFirstModule?: Module,
        }>) {
            if (state.userInfo) {
                const alreadyCompleted = state.userInfo.completedModules?.find((m) => m.module === action.payload.moduleId);

                if (alreadyCompleted) {
                    if (action.payload.score > alreadyCompleted.score) {
                        alreadyCompleted.correctCount = action.payload.correctCount;
                        alreadyCompleted.score = action.payload.score;
                    }

                    alreadyCompleted.completedAt = new Date().toISOString();
                    alreadyCompleted.totalAnswers = action.payload.totalAnswers;
                } else {
                    const newCompletedModule = {
                        module: action.payload.moduleId,
                        correctCount: action.payload.correctCount,
                        totalAnswers: action.payload.totalAnswers,
                        score: action.payload.score,
                        completedAt: new Date().toISOString(),
                    }

                    state.userInfo.completedModules?.push(newCompletedModule);
                }

                state.userInfo.totalExp = (state.userInfo.totalExp || 0) + action.payload.exp;
                state.userInfo.weeklyExp = (state.userInfo.weeklyExp || 0) + action.payload.exp;
                state.userInfo.dailyExp = (state.userInfo.dailyExp || 0) + action.payload.exp;

                if (!state.userInfo.streak.lastActivity) {
                    state.userInfo.streak.streakCount = 1;
                    state.userInfo.streak.lastActivity = new Date().toISOString();
                    state.userInfo.streak.highestStreak = 1;
                } else {
                    const compareDate = getDayDifference(new Date(), new Date(state.userInfo.streak.lastActivity));
                    if (compareDate === 1) {
                        state.userInfo.streak.streakCount += 1;
                        state.userInfo.streak.lastActivity = new Date().toISOString();
                    } else if (compareDate > 1) {
                        state.userInfo.streak.streakCount = 1;
                        state.userInfo.streak.lastActivity = new Date().toISOString();
                    }
                }

                if (state.userInfo.streak.streakCount > state.userInfo.streak.highestStreak) {
                    state.userInfo.streak.highestStreak = state.userInfo.streak.streakCount;
                }

                if (!state.userInfo.isAbleToClaimDailyReward) {
                    state.userInfo.isAbleToClaimDailyReward = true;
                }

                console.log('action.payload.isLastModule', action.payload.isLastModule);
                console.log('action.payload.nextLevel', action.payload.nextLevel);

                state.userInfo.currentModule = action.payload.nextLevelFirstModule;

                if (action.payload.isLastModule && action.payload.nextLevel) {
                    state.userInfo.currentLearnLevel = action.payload.nextLevel;
                }
            }
        },
        claimDailyReward(state, action: PayloadAction<{ gems: number }>) {
            if (state.userInfo) {
                state.userInfo.totalGems = (state.userInfo.totalGems || 0) + action.payload.gems;
                state.userInfo.isAbleToClaimDailyReward = false;
                state.userInfo.lastDailyRewardClaim = new Date().toISOString();
                state.userInfo.hasClaimedDailyReward = true;
            }
        },
        grantAchievement(state, action: PayloadAction<{ achievementCode: string }>) {
            if (state.userInfo) {
                const alreadyUnlocked = state.userInfo.achievements?.find((a) => a.achievement.code === action.payload.achievementCode);

                if (!alreadyUnlocked) {
                    const findAchievement = state.allAchievements.find(
                        (a) => a.code === action.payload.achievementCode
                    )

                    const newAchievement = {
                        achievement: findAchievement,
                        unlockedAt: new Date().toISOString(),
                    }

                    state.userInfo.achievements?.push(newAchievement);
                }
            }
        }
    }
});

export const { login, logout, decrementHp, addExp, completeModule, claimDailyReward, grantAchievement } = userSlice.actions;
export const userReducer = userSlice.reducer;