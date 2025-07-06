import React, { createContext, useContext, useState } from "react";
const AppContext = createContext();
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const addNotification = (notification) => {
        const id = Date.now().toString();
        setNotifications((prev) => [...prev, { ...notification, id }]);
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
    const value = {
        loading,
        setLoading,
        notifications,
        addNotification,
        removeNotification,
    };
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
