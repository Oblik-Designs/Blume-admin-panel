import axios from "axios";
import { APP_CONFIG } from "../config/app";
const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: APP_CONFIG.BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });
    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add auth token if available
            const user = JSON.parse(
                localStorage.getItem("blume_admin_user") || "{}"
            );
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
            // Add timestamp for debugging
            config.metadata = { requestStartedAt: Date.now() };
            return config;
        },
        (error) => {
            console.error("Request interceptor error:", error);
            return Promise.reject(error);
        }
    );
    // Response interceptor
    instance.interceptors.response.use(
        (response) => {
            // Calculate request duration
            const duration =
                Date.now() - response.config.metadata.requestStartedAt;
            console.log(`API Request took ${duration}ms`);
            return response;
        },
        (error) => {
            if (error.response?.status === 401) {
                // Unauthorized - clear session and redirect
                localStorage.removeItem("blume_admin_user");
                window.location.href = "/login";
            }
            console.error("API Error:", error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
    return instance;
};
export const apiClient = createAxiosInstance();
