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
        }
    }
});

export const { login, logout, decrementHp } = userSlice.actions;
export const userReducer = userSlice.reducer;