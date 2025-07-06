import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";

// Import modules (we'll create these next)
import Dashboard from "./modules/dashboard";
import Users from "./modules/users";
import Plans from "./modules/plans";
import Applications from "./modules/applications";
import Chats from "./modules/chats";
import Reviews from "./modules/reviews";
import Financial from "./modules/financial";
import Verification from "./modules/verification";

// Placeholder components for modules we haven't built yet
const PlaceholderComponent = ({ title }) => (
    <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>{title}</h2>
        <p>Coming in Phase 4...</p>
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AdminLayout>
                <Dashboard />
            </AdminLayout>
        ),
    },
    {
        path: "/users",
        element: (
            <AdminLayout>
                <Users />
            </AdminLayout>
        ),
    },
    {
        path: "/plans",
        element: (
            <AdminLayout>
                <Plans />
            </AdminLayout>
        ),
    },
    {
        path: "/applications",
        element: (
            <AdminLayout>
                <Applications />
            </AdminLayout>
        ),
    },
    {
        path: "/chats",
        element: (
            <AdminLayout>
                <Chats />
            </AdminLayout>
        ),
    },
    {
        path: "/reviews",
        element: (
            <AdminLayout>
                <Reviews />
            </AdminLayout>
        ),
    },
    {
        path: "/financial",
        element: (
            <AdminLayout>
                <Financial />
            </AdminLayout>
        ),
    },
    {
        path: "/verification",
        element: (
            <AdminLayout>
                <Verification />
            </AdminLayout>
        ),
    },
    {
        path: "/disputes",
        element: (
            <AdminLayout>
                <PlaceholderComponent title="Dispute Resolution" />
            </AdminLayout>
        ),
    },
    {
        path: "/subscriptions",
        element: (
            <AdminLayout>
                <PlaceholderComponent title="Subscription Management" />
            </AdminLayout>
        ),
    },
    {
        path: "/reports",
        element: (
            <AdminLayout>
                <PlaceholderComponent title="Reports & Analytics" />
            </AdminLayout>
        ),
    },
    {
        path: "/system",
        element: (
            <AdminLayout>
                <PlaceholderComponent title="System Administration" />
            </AdminLayout>
        ),
    },
]);
