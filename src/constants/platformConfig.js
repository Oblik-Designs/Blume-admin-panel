export const PLATFORM_CONFIG = {
    // Financial Settings
    BEENS_POINTS: {
        USD_CONVERSION_RATE: 1000,
        SERVICE_FEE_PERCENT: 10,
        MIN_PURCHASE_AMOUNT: 100,
        MAX_PURCHASE_AMOUNT: 100000,
    },
    // Business Rules
    PLAN_RULES: {
        CANCELLATION_HOURS: 24,
        APPLICATION_CLOSE_BEFORE_HOURS: 1,
        MAX_PARTICIPANTS_LIMIT: 50,
    },
    // Dispute Management
    DISPUTE_SETTINGS: {
        WINDOW_DAYS: 2,
        AUTO_RESOLVE_DAYS: 7,
        TYPES: [
            { key: "plan_not_happened", label: "Plan Did Not Happen" },
            { key: "host_issues", label: "Host Issues" },
            { key: "joiner_issues", label: "Joiner Issues" },
            { key: "payment_problems", label: "Payment Problems" },
        ],
    },
    // User Level Milestones
    LEVEL_MILESTONES: {
        LEVEL_2: {
            bp_spent: 5000,
            plans_joined: 10,
        },
        LEVEL_3: {
            bp_spent: 20000,
            plans_joined: 50,
        },
    }, // Gift Emojis
    GIFT_EMOJIS: [
        { emoji: "🌹", name: "Rose", price: 500 },
        { emoji: "⭐", name: "Star", price: 1000 },
        { emoji: "💎", name: "Diamond", price: 2000 },
        { emoji: "🏆", name: "Trophy", price: 1500 },
        { emoji: "❤️", name: "Heart", price: 800 },
        { emoji: "🔥", name: "Fire", price: 1200 },
    ],
    // Subscription Plans
    SUBSCRIPTION_PLANS: {
        PLAN_1: {
            name: "Basic",
            price: 0,
            level_access: 1,
            features: ["Basic plan access", "Level 1 interactions"],
        },
        PLAN_2: {
            name: "Silver",
            price: 999, // in BP
            level_access: 2,
            features: [
                "Premium plans",
                "Level 1-2 interactions",
                "Priority support",
            ],
        },
        PLAN_3: {
            name: "Black",
            price: 2999, // in BPlevel_access: 3,
            features: [
                "Exclusive access",
                "All level interactions",
                "VIP support",
            ],
        },
    },
};
