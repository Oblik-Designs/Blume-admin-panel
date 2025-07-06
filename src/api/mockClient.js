import { APP_CONFIG } from "../config/app";
import { mockDataManager } from "../data/mockDataManager";
export class MockApiClient {
    constructor() {
        this.delay = APP_CONFIG.MOCK_DELAY;
        this.errorRate = APP_CONFIG.FEATURES?.MOCK_ERRORS_ENABLED
            ? APP_CONFIG.MOCK_ERROR_RATE
            : 0;
    }
    async simulateDelay() {
        await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
    async simulateError() {
        if (this.errorRate > 0 && Math.random() < this.errorRate) {
            throw new Error("Simulated API error - please try again");
        }
    }
    // Users API
    async getUsers(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.getUsers(params);
    }
    async createUser(userData) {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.createUser(userData);
    }
    async updateUser(id, userData) {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.updateUser(id, userData);
    }
    async deleteUser(id) {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.deleteUser(id);
    }
    // Plans API
    async getPlans(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.getPlans(params);
    }
    async createPlan(planData) {
        await this.simulateDelay();
        await this.simulateError();
        const newPlan = {
            ...planData,
            id: Date.now().toString(),
            host_id: "admin", // Admin created
            type: 2, // Admin can only create type 2 plans
            status: "published",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        return newPlan;
    }

    // Add this method to your MockApiClient class in src/api/mockClient.js

    async getApplications(params = {}) {
        await this.simulateDelay();
        await this.simulateError();

        // Generate mock applications on the fly
        const mockApplications = Array.from({ length: 50 }, (_, index) => ({
            id: `app_${index + 1}`,
            plan_id: `plan_${Math.floor(Math.random() * 20) + 1}`,
            user_id: `user_${Math.floor(Math.random() * 50) + 1}`,
            application_type: ["bidding", "gift", "invite"][
                Math.floor(Math.random() * 3)
            ],
            status: ["pending", "accepted", "rejected"][
                Math.floor(Math.random() * 3)
            ],
            bid_amount:
                Math.random() > 0.6
                    ? Math.floor(Math.random() * 5000) + 500
                    : null,
            message: "I would love to join this plan and meet new people!",
            created_at: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            accepted_at: Math.random() > 0.7 ? new Date().toISOString() : null,
            rejected_at: Math.random() > 0.8 ? new Date().toISOString() : null,
            rejection_reason: Math.random() > 0.8 ? "Plan is full" : null,
        }));

        let filtered = [...mockApplications];

        // Apply filters
        if (params.application_type) {
            filtered = filtered.filter((app) =>
                Array.isArray(params.application_type)
                    ? params.application_type.includes(app.application_type)
                    : app.application_type === params.application_type
            );
        }

        if (params.status) {
            filtered = filtered.filter((app) =>
                Array.isArray(params.status)
                    ? params.status.includes(app.status)
                    : app.status === params.status
            );
        }

        // Apply pagination
        const page = params.page || 1;
        const limit = params.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filtered.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            total: filtered.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(filtered.length / limit),
        };
    }

    async getApplication(id) {
        await this.simulateDelay();
        await this.simulateError();

        return {
            id: id,
            plan_id: "plan_1",
            user_id: "user_1",
            application_type: "bidding",
            status: "pending",
            bid_amount: 1500,
            message: "I would love to join this plan and meet new people!",
            created_at: new Date().toISOString(),
        };
    }

    async updateApplication(id, data) {
        await this.simulateDelay();
        await this.simulateError();

        return {
            id: id,
            ...data,
            updated_at: new Date().toISOString(),
        };
    }

    async updateApplication(id, data) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            id: id,
            ...data,
            updated_at: new Date().toISOString(),
        };
    }

    async getTransactions(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        const mockTransactions = Array.from({ length: 100 }, (_, index) => ({
            id: `txn_${index + 1}`,
            user_id: `user_${Math.floor(Math.random() * 50) + 1}`,
            type: [
                "bp_purchase",
                "plan_payment",
                "plan_earning",
                "gift_sent",
                "gift_received",
                "admin_adjustment",
            ][Math.floor(Math.random() * 6)],
            amount: Math.floor(Math.random() * 5000) + 100,
            service_fee: Math.floor(Math.random() * 100),
            net_amount: Math.floor(Math.random() * 4900) + 100,
            status: ["pending", "completed", "completed", "failed"][
                Math.floor(Math.random() * 4)
            ],
            description: "Transaction description",
            created_at: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            gateway_transaction_id:
                Math.random() > 0.5
                    ? `gw_${Math.random().toString(36).substring(7)}`
                    : null,
        }));

        // Apply basic filtering and pagination
        const page = params.page || 1;
        const limit = params.limit || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = mockTransactions.slice(startIndex, endIndex);
        return {
            data: paginatedData,
            total: mockTransactions.length,
            page: page,
            limit: limit,
        };
    }

    async getVerifications(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        const mockVerifications = Array.from({ length: 25 }, (_, index) => ({
            id: `verification_${index + 1}`,
            user_id: `user_${index + 1}`,
            status: ["pending", "approved", "rejected", "requires_attention"][
                Math.floor(Math.random() * 4)
            ],
            document_type: ["government_id", "passport", "driver_license"][
                Math.floor(Math.random() * 3)
            ],
            submitted_at: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            reviewed_at: Math.random() > 0.5 ? new Date().toISOString() : null,
            reviewer_id: Math.random() > 0.5 ? "admin_1" : null,
            notes: "Document verification notes",
        }));
        return {
            data: mockVerifications,
            total: mockVerifications.length,
            page: params.page || 1,
            limit: params.limit || 20,
        };
    }
    async approveVerification(id) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            message: "Verification approved successfully",
        };
    }

    async rejectVerification(id, reason) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            message: "Verification rejected successfully",
        };
    }
    // Chat Management API
    async getChats(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        const mockChats = Array.from({ length: 30 }, (_, index) => ({
            id: `chat_${index + 1}`,
            participants: [
                `user_${Math.floor(Math.random() * 50) + 1}`,
                `user_${Math.floor(Math.random() * 50) + 1}`,
            ],
            plan_id: `plan_${Math.floor(Math.random() * 20) + 1}`,
            message_count: Math.floor(Math.random() * 100) + 5,
            last_message_at: new Date(
                Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: ["active", "archived", "flagged"][
                Math.floor(Math.random() * 3)
            ],
            gift_transactions: Math.floor(Math.random() * 10),
            total_gifts_bp: Math.floor(Math.random() * 5000),
            created_at: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
        }));
        return {
            data: mockChats,
            total: mockChats.length,
            page: params.page || 1,
            limit: params.limit || 20,
        };
    }
    // Reviews API
    async getReviews(params = {}) {
        await this.simulateDelay();
        await this.simulateError();
        const mockReviews = Array.from({ length: 40 }, (_, index) => ({
            id: `review_${index + 1}`,
            plan_id: `plan_${Math.floor(Math.random() * 20) + 1}`,
            reviewer_id: `user_${Math.floor(Math.random() * 50) + 1}`,
            reviewee_id: `user_${Math.floor(Math.random() * 50) + 1}`,
            rating: Math.floor(Math.random() * 5) + 1,
            review_text: "Great experience! Highly recommend.",
            traits: {
                polite: Math.floor(Math.random() * 5) + 1,
                funny: Math.floor(Math.random() * 5) + 1,
                reliable: Math.floor(Math.random() * 5) + 1,
                charismatic: Math.floor(Math.random() * 5) + 1,
            },
            status: ["pending", "approved", "flagged"][
                Math.floor(Math.random() * 3)
            ],
            created_at: new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
        }));
        return {
            data: mockReviews,
            total: mockReviews.length,
            page: params.page || 1,
            limit: params.limit || 20,
        };
    }
    async moderateReview(id, action) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            message: `Review ${action} successfully`,
        };
    }

    // Dashboard Stats
    async getDashboardStats() {
        await this.simulateDelay();
        await this.simulateError();
        return mockDataManager.getDashboardStats();
    }
    // Bulk operations
    async bulkUpdateUsers(ids, updateData) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            updated_count: ids.length,
            message: `Successfully updated ${ids.length} users`,
        };
    }
    async bulkDeleteUsers(ids) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            deleted_count: ids.length,
            message: `Successfully deleted ${ids.length} users`,
        };
    }
    // User wallet operations
    async adjustUserWallet(userId, amount, reason) {
        await this.simulateDelay();
        await this.simulateError();
        return {
            success: true,
            new_balance: Math.max(0, amount), // Simplified for mock
            transaction_id: Date.now().toString(),
            message: `Wallet ${amount > 0 ? "credited" : "debited"} successfully`,
        };
    }
}
