import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

interface UserState {
    isAuthenticated: boolean;
    userInfo: Partial<User> | null;
    token: string | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    userInfo: null,
    token: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ userInfo: Partial<User>, token: string }>) {
            state.isAuthenticated = true;
            state.userInfo = action.payload.userInfo;
            state.token = action.payload.token;
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
        completeModule(state, action: PayloadAction<{ moduleId: string, exp: number, correctCount: number, score: number, totalAnswer: number }>) {
            if (state.userInfo) {
                const newCompletedModule = {
                    module: action.payload.moduleId,
                    correctCount: action.payload.correctCount,
                    totalAnswers: action.payload.totalAnswer,
                    score: action.payload.score,
                    completedAt: new Date().toISOString(),
                }
                state.userInfo.completedModules?.push(newCompletedModule);

                state.userInfo.totalExp = (state.userInfo.totalExp || 0) + action.payload.exp;
                state.userInfo.weeklyExp = (state.userInfo.weeklyExp || 0) + action.payload.exp;
                state.userInfo.dailyExp = (state.userInfo.dailyExp || 0) + action.payload.exp;

                if (!state.userInfo.isAbleToClaimDailyReward) {
                    state.userInfo.isAbleToClaimDailyReward = true;
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
        }
    }
});

export const { login, logout, decrementHp, addExp, completeModule, claimDailyReward } = userSlice.actions;
export const userReducer = userSlice.reducer;