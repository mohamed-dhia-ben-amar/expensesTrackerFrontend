import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;
const IS_DEV = config.NODE_ENV === 'development';

class ApiService {
    private client: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: unknown) => void;
        reject: (reason?: unknown) => void;
    }> = [];

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - Add auth token
        this.client.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                // Debug: log outgoing request details
                if (IS_DEV) {
                    console.log('[API REQUEST]', {
                        method: config.method,
                        url: `${API_BASE_URL}${config.url}`,
                        headers: config.headers,
                        params: (config as any).params,
                        data: config.data,
                    });
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Handle token refresh
        this.client.interceptors.response.use(
            (response) => {
                // Debug: log successful responses
                if (IS_DEV) {
                    console.log('[API RESPONSE]', {
                        url: response.config?.url,
                        status: response.status,
                        data: response.data,
                    });
                }
                return response;
            },
            async (error: AxiosError) => {
                // Debug: log error responses
                if (IS_DEV) {
                    console.log('[API ERROR]', {
                        url: error.config?.url,
                        method: error.config?.method,
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message,
                    });
                }
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // If 401 and we haven't retried yet, try to refresh token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then(() => this.client(originalRequest))
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = await AsyncStorage.getItem('refreshToken');
                        if (refreshToken) {
                            const { data } = await axios.post(
                                `${API_BASE_URL}/users/refresh-token`,
                                { refreshToken }
                            );

                            // Backend may return either { status, data: { accessToken, refreshToken } }
                            // or { status, accessToken, refreshToken }
                            const refreshStatus = (data as any)?.status;
                            const refreshedAccess = (data as any)?.data?.accessToken ?? (data as any)?.accessToken;
                            const refreshedRefresh = (data as any)?.data?.refreshToken ?? (data as any)?.refreshToken;

                            if (refreshStatus === 'success' && refreshedAccess) {
                                await AsyncStorage.setItem('accessToken', refreshedAccess);
                                if (refreshedRefresh) {
                                    await AsyncStorage.setItem('refreshToken', refreshedRefresh);
                                }

                                // Update the original request with the new token
                                originalRequest.headers = originalRequest.headers || {};
                                (originalRequest.headers as any).Authorization = `Bearer ${refreshedAccess}`;

                                // Retry all queued requests
                                this.failedQueue.forEach((req) => req.resolve());
                                this.failedQueue = [];

                                return this.client(originalRequest);
                            }
                        }
                    } catch (refreshError) {
                        this.failedQueue.forEach((req) => req.reject(refreshError));
                        this.failedQueue = [];
                        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Generic request methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiService = new ApiService();