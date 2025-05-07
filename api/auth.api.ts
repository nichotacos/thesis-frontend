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

        return response.data;
    } catch (error) {
        // return { data: null, error: error.message };
        throw error;
    }
}

export const registerUser = async (username: string, userFullName: string, email: string, password: string, passwordConfirmation: string) => {
    try {
        const response = await apiClient.post('/user', {
            username,
            userFullName,
            email,
            password,
            passwordConfirmation,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}