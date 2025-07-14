// src/contexts/AuthContext.jsx (Enhanced Version)
import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";

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
        // Check for existing session on app load
        const checkExistingSession = async () => {
            try {
                const savedUser = localStorage.getItem("blume_admin_user");
                const sessionExpiry = localStorage.getItem(
                    "blume_session_expiry"
                );

                if (savedUser && sessionExpiry) {
                    const expiryTime = parseInt(sessionExpiry);
                    const currentTime = Date.now();

                    // Check if session is still valid (24 hours)
                    if (currentTime < expiryTime) {
                        const userData = JSON.parse(savedUser);
                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        // Session expired, clear storage
                        localStorage.removeItem("blume_admin_user");
                        localStorage.removeItem("blume_session_expiry");
                    }
                }
            } catch (error) {
                console.error("Error checking session:", error);
                localStorage.removeItem("blume_admin_user");
                localStorage.removeItem("blume_session_expiry");
            } finally {
                setLoading(false);
            }
        };

        checkExistingSession();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock authentication logic
            const { email, password, role } = credentials;

            // Valid credentials for demo
            const validCredentials = [
                {
                    email: "admin@beens.com",
                    password: "admin123",
                    role: "super_admin",
                },
                {
                    email: "support@beens.com",
                    password: "support123",
                    role: "support_admin",
                },
                {
                    email: "kyc@beens.com",
                    password: "kyc123",
                    role: "kyc_admin",
                },
            ];

            const validUser = validCredentials.find(
                (cred) =>
                    cred.email === email &&
                    cred.password === password &&
                    cred.role === role
            );

            if (!validUser) {
                return {
                    success: false,
                    error: "Invalid email, password, or role combination",
                };
            }

            // Create user object
            const mockUser = {
                id: `admin_${Date.now()}`,
                name: getRoleDisplayName(role),
                email: email,
                role: role,
                avatar: null,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                sessionId: generateSessionId(),
            };

            // Set session expiry (24 hours from now)
            const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

            // Save to localStorage
            localStorage.setItem("blume_admin_user", JSON.stringify(mockUser));
            localStorage.setItem("blume_session_expiry", expiryTime.toString());

            // Update state
            setUser(mockUser);
            setIsAuthenticated(true);

            // Show success message
            message.success(`Welcome back, ${mockUser.name}!`);

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: "An unexpected error occurred during login",
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            // Simulate API call to invalidate session
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Clear localStorage
            localStorage.removeItem("blume_admin_user");
            localStorage.removeItem("blume_session_expiry");

            // Update state
            setUser(null);
            setIsAuthenticated(false);

            // Show success message
            message.success("You have been logged out successfully");

            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            message.error("Error during logout");
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const refreshSession = async () => {
        try {
            const savedUser = localStorage.getItem("blume_admin_user");
            if (savedUser && isAuthenticated) {
                // Extend session by 24 hours
                const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
                localStorage.setItem(
                    "blume_session_expiry",
                    expiryTime.toString()
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error("Session refresh error:", error);
            return false;
        }
    };

    const updateUserProfile = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem(
                "blume_admin_user",
                JSON.stringify(updatedUser)
            );
        }
    };

    const hasPermission = (module, action) => {
        if (!user || !user.role) return false;

        // Permission matrix based on role
        const permissions = {
            super_admin: {
                users: [
                    "view",
                    "create",
                    "edit",
                    "delete",
                    "ban",
                    "adjust_wallet",
                ],
                plans: ["view", "create", "edit", "delete", "cancel"],
                applications: ["view", "edit", "delete"],
                chats: ["view", "moderate"],
                reviews: ["view", "moderate", "delete"],
                financial: ["view", "adjust", "generate_reports"],
                disputes: ["view", "resolve"],
                verification: ["view", "approve", "reject"],
                system: ["view", "edit", "configure"],
                reports: ["view", "export"],
            },
            support_admin: {
                users: ["view", "edit", "ban"],
                plans: ["view", "cancel"],
                applications: ["view"],
                chats: ["view", "moderate"],
                reviews: ["view"],
                financial: ["view"],
                disputes: ["view", "resolve"],
                verification: ["view"],
                system: [],
                reports: ["view"],
            },
            kyc_admin: {
                users: ["view"],
                plans: [],
                applications: [],
                chats: [],
                reviews: [],
                financial: [],
                disputes: [],
                verification: ["view", "approve", "reject"],
                system: [],
                reports: [],
            },
        };

        return permissions[user.role]?.[module]?.includes(action) || false;
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshSession,
        updateUserProfile,
        hasPermission,
        userRole: user?.role,
        userName: user?.name,
        userEmail: user?.email,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// Helper functions
const getRoleDisplayName = (role) => {
    const roleNames = {
        super_admin: "Super Administrator",
        support_admin: "Support Administrator",
        kyc_admin: "KYC Administrator",
    };
    return roleNames[role] || "Administrator";
};

const generateSessionId = () => {
    return (
        "session_" +
        Math.random().toString(36).substr(2, 9) +
        Date.now().toString(36)
    );
};

export default AuthProvider;
