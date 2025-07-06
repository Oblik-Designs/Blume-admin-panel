import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem("blume_admin_user");
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem("blume_admin_user");
            }
        }
        setLoading(false);
    }, []);
    const login = async (credentials) => {
        try {
            // Mock login for Phase 1
            const mockUser = {
                id: "1",
                name: "Admin User",
                email: credentials.email,
                role: "super_admin", // super_admin, support_admin, kyc_adminavatar: null,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem("blume_admin_user", JSON.stringify(mockUser));
            setUser(mockUser);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("blume_admin_user");
        setUser(null);
        setIsAuthenticated(false);
    };
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        userRole: user?.role,
    };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
