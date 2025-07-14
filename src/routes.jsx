import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";

import Dashboard from "./modules/dashboard";
import Users from "./modules/users";
import Plans from "./modules/plans";
import Applications from "./modules/applications";
import Chats from "./modules/chats";
import Reviews from "./modules/reviews";
import Financial from "./modules/financial";
import Verification from "./modules/verification";
import Disputes from "./modules/disputes";
import Subscriptions from "./modules/subscriptions";
import Reports from "./modules/reports";
import System from "./modules/system";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
    return children;
};

// Protected Admin Routes Component
const ProtectedAdminRoute = ({ children, requiredRole = null }) => (
    <ProtectedRoute requiredRole={requiredRole}>
        <AdminLayout>
            <ErrorBoundary>{children}</ErrorBoundary>
        </AdminLayout>
    </ProtectedRoute>
);

export const router = createBrowserRouter([
    // Public routes
    {
        path: "/login",
        element: <LoginPage />,
    },

    {
        path: "/",
        element: (
            <ProtectedAdminRoute>
                <Dashboard />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/dashboard",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/users",
        element: (
            <ProtectedAdminRoute>
                <Users />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/plans",
        element: (
            <ProtectedAdminRoute>
                <Plans />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/applications",
        element: (
            <ProtectedAdminRoute>
                <Applications />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/chats",
        element: (
            <ProtectedAdminRoute>
                <Chats />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/reviews",
        element: (
            <ProtectedAdminRoute>
                <Reviews />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/financial",
        element: (
            <ProtectedAdminRoute>
                <Financial />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/verification",
        element: (
            <ProtectedAdminRoute>
                <Verification />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/disputes",
        element: (
            <ProtectedAdminRoute>
                <Disputes />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/subscriptions",
        element: (
            <ProtectedAdminRoute>
                <Subscriptions />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/reports",
        element: (
            <ProtectedAdminRoute>
                <Reports />
            </ProtectedAdminRoute>
        ),
    },
    {
        path: "/system",
        element: (
            <ProtectedAdminRoute>
                <System />
            </ProtectedAdminRoute>
        ),
    },

    // Catch-all redirect
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);
