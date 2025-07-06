import { generateUsers } from "./generators/userGenerator";
import { generatePlans } from "./generators/planGenerator";
import { generateApplications } from "./generators/applicationGenerator";
import { generateTransactions } from "./generators/transactionGenerator";
class MockDataManager {
    constructor() {
        this.data = {
            users: [],
            plans: [],
            applications: [],
            transactions: [],
        };
        this.initialized = false;
    }
    init() {
        if (this.initialized) return;
        console.log("🎭Initializing mock data...");
        // Generate users first
        const users = generateUsers(100);
        this.data.users = users;
        const userIds = users.map((u) => u.id);
        // Generate plans with real host IDs
        const plans = generatePlans(150, userIds);
        this.data.plans = plans;
        const planIds = plans.map((p) => p.id);
        // Generate applications with real plan and user IDs
        const applications = generateApplications(300, planIds, userIds);
        this.data.applications = applications;
        // Generate transactions with real user IDs
        const transactions = generateTransactions(800, userIds);
        this.data.transactions = transactions;
        this.initialized = true;
        console.log("✅Mock data initialized:", {
            users: this.data.users.length,
            plans: this.data.plans.length,
            applications: this.data.applications.length,
            transactions: this.data.transactions.length,
        });
    }
    getUsers(params = {}) {
        this.init();
        const {
            page = 1,
            limit = 10,
            sort = "-created_at",
            ...filters
        } = params;
        let filtered = [...this.data.users];
        // Apply filters
        if (filters.status) {
            filtered = filtered.filter((user) =>
                Array.isArray(filters.status)
                    ? filters.status.includes(user.status)
                    : user.status === filters.status
            );
        }
        if (filters.profile_level) {
            filtered = filtered.filter((user) =>
                Array.isArray(filters.profile_level)
                    ? filters.profile_level.includes(user.profile_level)
                    : user.profile_level === filters.profile_level
            );
        }
        if (filters.username) {
            filtered = filtered.filter((user) =>
                user.username
                    .toLowerCase()
                    .includes(filters.username.toLowerCase())
            );
        }
        // Apply sorting
        if (sort) {
            const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
            const sortOrder = sort.startsWith("-") ? -1 : 1;
            filtered.sort((a, b) => {
                const aVal = this.getNestedValue(a, sortField);
                const bVal = this.getNestedValue(b, sortField);
                if (aVal < bVal) return -1 * sortOrder;
                if (aVal > bVal) return 1 * sortOrder;
                return 0;
            });
        }
        // Apply pagination
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
    getPlans(params = {}) {
        this.init();
        const {
            page = 1,
            limit = 10,
            sort = "-created_at",
            ...filters
        } = params;
        let filtered = [...this.data.plans];
        // Apply filters
        if (filters.type) {
            filtered = filtered.filter((plan) =>
                Array.isArray(filters.type)
                    ? filters.type.includes(plan.type)
                    : plan.type === filters.type
            );
        }
        if (filters.status) {
            filtered = filtered.filter((plan) =>
                Array.isArray(filters.status)
                    ? filters.status.includes(plan.status)
                    : plan.status === filters.status
            );
        }
        if (filters.title) {
            filtered = filtered.filter((plan) =>
                plan.title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }
        // Apply sorting
        if (sort) {
            const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
            const sortOrder = sort.startsWith("-") ? -1 : 1;
            filtered.sort((a, b) => {
                const aVal = this.getNestedValue(a, sortField);
                const bVal = this.getNestedValue(b, sortField);
                if (aVal < bVal) return -1 * sortOrder;
                if (aVal > bVal) return 1 * sortOrder;
                return 0;
            });
        }
        // Apply pagination
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
    getDashboardStats() {
        this.init();
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        // User stats
        const totalUsers = this.data.users.length;
        const activeUsers = this.data.users.filter(
            (u) => u.status === "active"
        ).length;
        const newUsersToday = this.data.users.filter(
            (u) => new Date(u.created_at) >= today
        ).length;
        // Plan stats
        const totalPlans = this.data.plans.length;
        const activePlans = this.data.plans.filter(
            (p) => p.status === "active"
        ).length;
        const completedPlans = this.data.plans.filter(
            (p) => p.status === "completed"
        ).length;
        // Financial stats
        const completedTransactions = this.data.transactions.filter(
            (t) => t.status === "completed"
        );
        const todayTransactions = completedTransactions.filter(
            (t) => new Date(t.created_at) >= today
        ).length;
        const totalRevenue =
            completedTransactions
                .filter((t) => t.type === "bp_purchase")
                .reduce((sum, t) => sum + (t.service_fee || 0), 0) / 1000; // Convert BP to USD
        const totalBPCirculating = completedTransactions
            .filter((t) => t.type === "bp_purchase")
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                new_today: newUsersToday,
                growth_rate:
                    (newUsersToday / Math.max(totalUsers - newUsersToday, 1)) *
                    100,
            },
            plans: {
                total: totalPlans,
                active: activePlans,
                completed: completedPlans,
                success_rate:
                    totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0,
            },
            financial: {
                revenue_usd: totalRevenue,
                total_bp_circulating: totalBPCirculating,
                transactions_today: todayTransactions,
                avg_transaction:
                    completedTransactions.length > 0
                        ? Math.round(
                              completedTransactions.reduce(
                                  (sum, t) => sum + t.amount,
                                  0
                              ) / completedTransactions.length
                          )
                        : 0,
            },
        };
    }
    getNestedValue(obj, path) {
        return path.split(".").reduce((current, key) => current?.[key], obj);
    }
    // CRUD operations for testing
    createUser(userData) {
        this.init();
        const newUser = {
            ...userData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        this.data.users.push(newUser);
        return newUser;
    }
    updateUser(id, userData) {
        this.init();
        const index = this.data.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.data.users[index] = {
                ...this.data.users[index],
                ...userData,
                updated_at: new Date().toISOString(),
            };
            return this.data.users[index];
        }
        throw new Error("User not found");
    }
    deleteUser(id) {
        this.init();
        const index = this.data.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.data.users.splice(index, 1);
            return { success: true };
        }
        throw new Error("User not found");
    }
}
export const mockDataManager = new MockDataManager();
