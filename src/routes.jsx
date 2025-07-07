import React from "react";
import { createBrowserRouter } from "react-router-dom";
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
                <Disputes />
            </AdminLayout>
        ),
    },
    {
        path: "/subscriptions",
        element: (
            <AdminLayout>
                <Subscriptions />
            </AdminLayout>
        ),
    },
    {
        path: "/reports",
        element: (
            <AdminLayout>
                <Reports />
            </AdminLayout>
        ),
    },
    {
        path: "/system",
        element: (
            <AdminLayout>
                <System />
            </AdminLayout>
        ),
    },
]);
