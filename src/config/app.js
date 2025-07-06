export const APP_CONFIG = {
    // API Configuration
    API_MODE: "mock", // 'mock' | 'live'

    // Mock API Settings
    MOCK_DELAY: 300, // Reduced for faster development
    MOCK_ERROR_RATE: 0, // Disabled errors for development (was 0.05)

    // Live API Settings
    BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api",
    API_VERSION: "v1",

    // Blume Platform Configuration
    BLUME_POINTS: {
        USD_CONVERSION: 1000, // 1000 BP = $1
        SERVICE_FEE_PERCENT: 10,
    },

    // Business Rules
    PLAN_CANCELLATION_HOURS: 24,
    DISPUTE_WINDOW_DAYS: 2,

    // Feature Flags
    FEATURES: {
        MOCK_REAL_TIME_UPDATES: true,
        ENABLE_BULK_OPERATIONS: true,
        ENABLE_DISPUTE_RESOLUTION: true,
        ENABLE_KYC_VERIFICATION: true,
        // Add flag to enable/disable mock errors
        MOCK_ERRORS_ENABLED: false,
    },
};
