import React, { createContext, useContext } from "react";
import { APP_CONFIG } from "../config/app";
const ApiContext = createContext();
export const useApiConfig = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApiConfig must be used within an ApiProvider");
    }
    return context;
};
export const ApiProvider = ({ children }) => {
    const value = {
        apiMode: APP_CONFIG.API_MODE,
        baseUrl: APP_CONFIG.BASE_URL,
        mockDelay: APP_CONFIG.MOCK_DELAY,
        features: APP_CONFIG.FEATURES,
        beensPoints: APP_CONFIG.BEENS_POINTS,
    };
    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
