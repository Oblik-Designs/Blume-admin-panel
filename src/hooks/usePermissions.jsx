import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

// Default permissions for Phase 3 (simplified for testing)
const DEFAULT_PERMISSIONS = {
    super_admin: {
        users: ["view", "create", "edit", "delete", "ban", "adjust_wallet"],
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
        users: ["view", "edit", "ban", "adjust_wallet"],
        plans: ["view", "cancel"],
        applications: ["view"],
        chats: ["view", "moderate"],
        reviews: ["view"],
        financial: ["view", "adjust"],
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

export const usePermissions = () => {
    const { userRole } = useAuth();

    const permissions = useMemo(() => {
        // Default to super_admin if no role or invalid role
        const role = userRole || "super_admin";
        return DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.super_admin;
    }, [userRole]);

    const hasPermission = (module, action) => {
        // For testing, always return true if no permissions defined
        if (!permissions[module]) {
            console.warn(`No permissions defined for module: ${module}`);
            return true; // Allow all actions for undefined modules during development
        }
        return permissions[module]?.includes(action) || false;
    };

    const getModulePermissions = (module) => {
        return permissions[module] || [];
    };

    const canAccessModule = (module) => {
        return permissions[module]?.length > 0 || false;
    };

    const hasAnyPermission = (module, actions) => {
        return actions.some((action) => hasPermission(module, action));
    };

    return {
        permissions,
        hasPermission,
        getModulePermissions,
        canAccessModule,
        hasAnyPermission,
        userRole: userRole || "super_admin",
    };
};
