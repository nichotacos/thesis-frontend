import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { apiClient } from './apiClient';

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
    authToken = token;
    AsyncStorage.setItem('authToken', token).catch((error) => {
        console.error('Error saving auth token to AsyncStorage:', error);
    });
}

export const getAuthToken = () => {
    return authToken;
}

export const clearAuthToken = () => {
    authToken = null;
}

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await apiClient.post(`/auth/login`, {
            username,
            password
        });

        console.log('Login response:', response.data);

        if (response.status === 404) {
            console.error('User not found:', response.data.message);
        }

        if (response.status === 400) {
            console.error('Invalid credentials:', response.data.message);
        }

        setAuthToken(response.data.accessToken);

        return response.data;
    } catch (error) {
        // return { data: null, error: error.message };
        throw error;
    }
}

export const registerUser = async (username: string, userFullName: string, email: string, password: string, passwordConfirmation: string, role: string) => {
    try {
        const response = await apiClient.post('/auth/register', {
            username,
            userFullName,
            email,
            password,
            passwordConfirmation,
            role
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const sendOtp = async (email: string) => {
    try {
        const response = await apiClient.post('/auth/send-otp', { email });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

export const verifyOtp = async (email: string, code: string) => {
    try {
        const response = await apiClient.post('/auth/verify-otp', { email, code });
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}   