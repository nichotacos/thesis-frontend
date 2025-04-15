import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

export const apiClient = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    // timeout: 10000,
});

apiClient.interceptors.request.use(
    async function (config) {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async function (error) {
        return Promise.reject(error);
    }
)

apiClient.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        return Promise.reject(error.response?.data || error.message);
    }
);