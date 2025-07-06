import { APP_CONFIG } from "../config/app";
import { apiClient } from "./axios";
import { MockApiClient } from "./mockClient";
class ApiService {
    constructor() {
        this.mockClient = new MockApiClient();
    }
    get client() {
        return APP_CONFIG.API_MODE === "mock" ? this.mockClient : apiClient;
    }
    // Generic CRUD methods
    async getRecords(endpoint, params = {}) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                const methodName = `get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}`;
                if (typeof this.mockClient[methodName] === "function") {
                    return await this.mockClient[methodName](params);
                } else {
                    throw new Error(
                        `Mock method ${methodName} not implemented`
                    );
                }
            }
            const response = await apiClient.get(`/${endpoint}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }
    async getRecord(endpoint, id) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                const methodName = `get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1, -1)}`; // Remove
                if (typeof this.mockClient[methodName] === "function") {
                    return await this.mockClient[methodName](id);
                }
            }
            const response = await apiClient.get(`/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}/${id}:`, error);
            throw error;
        }
    }
    async createRecord(endpoint, data) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                const methodName = `create${endpoint.charAt(0).toUpperCase() + endpoint.slice(1, -1)}`;
                if (typeof this.mockClient[methodName] === "function") {
                    return await this.mockClient[methodName](data);
                }
            }
            const response = await apiClient.post(`/${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error);
            throw error;
        }
    }
    async updateRecord(endpoint, id, data) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                const methodName = `update${endpoint.charAt(0).toUpperCase() + endpoint.slice(1, -1)}`;
                if (typeof this.mockClient[methodName] === "function") {
                    return await this.mockClient[methodName](id, data);
                }
            }
            const response = await apiClient.put(`/${endpoint}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error);
            throw error;
        }
    }
    async deleteRecord(endpoint, id) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                const methodName = `delete${endpoint.charAt(0).toUpperCase() + endpoint.slice(1, -1)}`;
                if (typeof this.mockClient[methodName] === "function") {
                    return await this.mockClient[methodName](id);
                }
            }
            const response = await apiClient.delete(`/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
            throw error;
        }
    }
    // Bulk operations
    async bulkUpdate(endpoint, ids, data) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                return await this.mockClient.bulkUpdateUsers(ids, data);
            }
            const response = await apiClient.post(`/${endpoint}/bulk-update`, {
                ids,
                data,
            });
            return response.data;
        } catch (error) {
            console.error(`Error bulk updating ${endpoint}:`, error);
            throw error;
        }
    }
    async bulkDelete(endpoint, ids) {
        try {
            if (APP_CONFIG.API_MODE === "mock") {
                return await this.mockClient.bulkDeleteUsers(ids);
            }
            const response = await apiClient.post(`/${endpoint}/bulk-delete`, {
                ids,
            });
            return response.data;
        } catch (error) {
            console.error(`Error bulk deleting ${endpoint}:`, error);
            throw error;
        }
    }
    // Specific API methods
    getUsers = (params) => this.getRecords("users", params);
    getUser = (id) => this.getRecord("users", id);
    createUser = (data) => this.createRecord("users", data);
    updateUser = (id, data) => this.updateRecord("users", id, data);
    deleteUser = (id) => this.deleteRecord("users", id);

    getPlans = (params) => this.getRecords("plans", params);
    getPlan = (id) => this.getRecord("plans", id);
    createPlan = (data) => this.createRecord("plans", data);
    updatePlan = (id, data) => this.updateRecord("plans", id, data);
    deletePlan = (id) => this.deleteRecord("plans", id);

    getApplications = (params) => this.getRecords("applications", params);
    getApplication = (id) => this.getRecord("applications", id);
    updateApplication = (id, data) =>
        this.updateRecord("applications", id, data);
    deleteApplication = (id) => this.deleteRecord("applications", id);

    getDashboardStats = () =>
        this.client.getDashboardStats?.() ||
        this.mockClient.getDashboardStats();

    // Financial operations
    adjustUserWallet = (userId, amount, reason) =>
        this.mockClient.adjustUserWallet(userId, amount, reason);
    getTransactions = (params) => this.getRecords("transactions", params);

    // Verification operations
    getVerifications = (params) => this.getRecords("verifications", params);
    approveVerification = (id) => this.mockClient.approveVerification(id);
    rejectVerification = (id, reason) =>
        this.mockClient.rejectVerification(id, reason);
}
export const api = new ApiService();
