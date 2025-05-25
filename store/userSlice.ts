import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';
import getDayDifference from '../utils/getDayDifference';
import { Level } from '../types/Level';
import { Achievement } from '../types/Achievement';
import { Module } from '../types/Module';
import { ShopItem } from '../types/ShopItem';

interface UserState {
    isAuthenticated: boolean;
    userInfo: Partial<User> | null;
    token: string | null;
    allAchievements: Achievement[];
    shopItem: ShopItem[];
    level: Level[];
}

const initialState: UserState = {
    isAuthenticated: false,
    userInfo: null,
    token: null,
    allAchievements: [],
    shopItem: [],
    level: [],
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{
            userInfo: Partial<User>,
            token: string,
            achivements: Achievement[],
            shopItems: ShopItem[],
            levels: Level[],
        }>) {
            state.isAuthenticated = true;
            state.userInfo = action.payload.userInfo;
            state.token = action.payload.token;
            state.allAchievements = action.payload.achivements;
            state.shopItem = action.payload.shopItems;
            state.level = action.payload.levels;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userInfo = null;
            state.token = null;
            state.allAchievements = [];
            state.shopItem = [];
            state.level = [];
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
            module: Module,
            exp: number,
            correctCount: number,
            score: number,
            totalAnswers: number,
            isLastModule: boolean,
            nextLevel?: Level,
            nextLevelFirstModule?: Module,
        }>) {
            if (state.userInfo) {
                const alreadyCompleted = state.userInfo.completedModules?.find((m) => m.module._id === action.payload.module._id);

                if (alreadyCompleted) {
                    if (action.payload.score > alreadyCompleted.score) {
                        alreadyCompleted.correctCount = action.payload.correctCount;
                        alreadyCompleted.score = action.payload.score;
                    }

                    alreadyCompleted.completedAt = new Date().toISOString();
                    alreadyCompleted.totalAnswers = action.payload.totalAnswers;
                } else {
                    const newCompletedModule = {
                        module: action.payload.module,
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
        },
        buyItem(state, action: PayloadAction<{ itemId: string }>) {
            if (state.userInfo && state.shopItem) {
                const item = state.shopItem.find(item => item._id === action.payload.itemId);
                if (item && state.userInfo.totalGems >= item.price) {
                    state.userInfo.totalGems -= item.price;
                    state.userInfo.purchases.push({
                        _id: item._id,
                        item: item._id.toString(),
                        purchasedAt: new Date().toISOString(),
                    })
                }
            }
        }
    }
});

export const { login, logout, decrementHp, addExp, completeModule, claimDailyReward, grantAchievement, buyItem } = userSlice.actions;
export const userReducer = userSlice.reducer;