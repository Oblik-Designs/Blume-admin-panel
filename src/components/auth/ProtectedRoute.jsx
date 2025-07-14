// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <Spin size="large" />
                <div style={{ color: "#722ed1", fontWeight: 500 }}>
                    Loading Admin Panel...
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if required
    if (requiredRole && user?.role !== requiredRole) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    gap: "16px",
                    textAlign: "center",
                    padding: "20px",
                }}
            >
                <div style={{ fontSize: "48px" }}>🚫</div>
                <div
                    style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#ff4d4f",
                    }}
                >
                    Access Denied
                </div>
                <div style={{ color: "#666", maxWidth: "400px" }}>
                    You don't have permission to access this area. Your current
                    role is <strong>{user?.role}</strong>, but this page
                    requires <strong>{requiredRole}</strong> access.
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
