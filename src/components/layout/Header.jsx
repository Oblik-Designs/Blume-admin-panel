// src/components/layout/Header.jsx (Enhanced Version)
import React, { useState, useEffect } from "react";
import {
    Layout,
    Button,
    Space,
    Avatar,
    Dropdown,
    Typography,
    Badge,
    Modal,
    Divider,
    message,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    SettingOutlined,
    ClockCircleOutlined,
    CrownOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, setCollapsed, style }) => {
    const { user, logout, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [sessionTime, setSessionTime] = useState("");
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    // Update session time display
    useEffect(() => {
        const updateSessionTime = () => {
            if (user?.lastLogin) {
                const loginTime = new Date(user.lastLogin);
                const now = new Date();
                const diffMs = now - loginTime;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMinutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                );

                if (diffHours > 0) {
                    setSessionTime(`${diffHours}h ${diffMinutes}m`);
                } else {
                    setSessionTime(`${diffMinutes}m`);
                }
            }
        };

        updateSessionTime();
        const interval = setInterval(updateSessionTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        setLogoutLoading(true);
        try {
            const result = await logout();
            if (result.success) {
                setLogoutModalVisible(false);
                navigate("/login");
            }
        } catch (error) {
            message.error("Failed to logout properly");
        } finally {
            setLogoutLoading(false);
        }
    };

    const handleRefreshSession = async () => {
        const success = await refreshSession();
        if (success) {
            message.success("Session refreshed successfully");
        } else {
            message.error("Failed to refresh session");
        }
    };

    const getRoleDisplay = (role) => {
        const roleLabels = {
            super_admin: "Super Admin",
            support_admin: "Support Admin",
            kyc_admin: "KYC Admin",
        };
        return roleLabels[role] || role;
    };

    const getRoleColor = (role) => {
        const roleColors = {
            super_admin: "#722ed1",
            support_admin: "#1890ff",
            kyc_admin: "#52c41a",
        };
        return roleColors[role] || "#666";
    };

    const getRoleIcon = (role) => {
        const roleIcons = {
            super_admin: <CrownOutlined />,
            support_admin: <UserOutlined />,
            kyc_admin: <SettingOutlined />,
        };
        return roleIcons[role] || <UserOutlined />;
    };

    const userMenuItems = [
        {
            key: "user-info",
            label: (
                <div style={{ padding: "8px 0" }}>
                    <div style={{ fontWeight: 600, color: "#262626" }}>
                        {user?.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                        {user?.email}
                    </div>
                    <div
                        style={{
                            fontSize: "11px",
                            color: getRoleColor(user?.role),
                            marginTop: "4px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        {getRoleIcon(user?.role)}
                        {getRoleDisplay(user?.role)}
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            key: "session-info",
            label: (
                <div style={{ fontSize: "11px", color: "#666" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginBottom: "2px",
                        }}
                    >
                        <ClockCircleOutlined />
                        Session: {sessionTime}
                    </div>
                    <div>ID: {user?.sessionId?.slice(-8)}</div>
                </div>
            ),
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            key: "refresh-session",
            icon: <ClockCircleOutlined />,
            label: "Refresh Session",
            onClick: handleRefreshSession,
        },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile Settings",
            onClick: () => message.info("Profile settings coming soon"),
        },
        {
            key: "preferences",
            icon: <SettingOutlined />,
            label: "Preferences",
            onClick: () => message.info("Preferences coming soon"),
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
            danger: true,
        },
    ];

    const notificationItems = [
        {
            key: "notification-1",
            label: (
                <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: 500, fontSize: "13px" }}>
                        New user verification
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                        2 minutes ago
                    </div>
                </div>
            ),
        },
        {
            key: "notification-2",
            label: (
                <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: 500, fontSize: "13px" }}>
                        Plan dispute opened
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                        15 minutes ago
                    </div>
                </div>
            ),
        },
        {
            key: "notification-3",
            label: (
                <div style={{ padding: "4px 0" }}>
                    <div style={{ fontWeight: 500, fontSize: "13px" }}>
                        High-value transaction
                    </div>
                    <div style={{ fontSize: "11px", color: "#666" }}>
                        1 hour ago
                    </div>
                </div>
            ),
        },
        {
            type: "divider",
        },
        {
            key: "view-all",
            label: (
                <div
                    style={{
                        textAlign: "center",
                        color: "#722ed1",
                        fontWeight: 500,
                    }}
                >
                    View All Notifications
                </div>
            ),
        },
    ];

    return (
        <AntHeader
            style={{
                ...style,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,21,41,.08)",
                borderBottom: "1px solid #f0f0f0",
            }}
        >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                }}
            />

            <Space size="large">
                {/* Notifications */}
                {/* <Dropdown
                    menu={{ items: notificationItems }}
                    placement="bottomRight"
                    trigger={["click"]}
                    overlayStyle={{ width: 280 }}
                >
                    <Badge count={3} size="small" offset={[-2, 2]}>
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            style={{
                                fontSize: "16px",
                                color: "#666",
                            }}
                        />
                    </Badge>
                </Dropdown> */}

                {/* User Info and Menu */}
                <Space size="medium">
                    <div style={{ textAlign: "right", paddingRight: 12 }}>
                        <div style={{ lineHeight: "20px" }}>
                            <Text strong style={{ fontSize: "14px" }}>
                                {user?.name || "Admin User"}
                            </Text>
                        </div>
                        <div style={{ lineHeight: "16px", marginTop: -4 }}>
                            <Text
                                style={{
                                    fontSize: "12px",
                                    color: getRoleColor(user?.role),
                                }}
                            >
                                {getRoleDisplay(user?.role)}
                            </Text>
                        </div>
                    </div>

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={["click"]}
                        overlayStyle={{ width: 240 }}
                    >
                        <Avatar
                            icon={<UserOutlined />}
                            style={{
                                cursor: "pointer",
                                backgroundColor: getRoleColor(user?.role),
                                border: `2px solid ${getRoleColor(user?.role)}20`,
                            }}
                            src={user?.avatar}
                            size="default"
                        />
                    </Dropdown>
                </Space>
            </Space>

            <Modal
                title={
                    <Space>
                        <ExclamationCircleOutlined
                            style={{ color: "#faad14" }}
                        />
                        Confirm Logout
                    </Space>
                }
                open={logoutModalVisible}
                onCancel={() => setLogoutModalVisible(false)}
                centered
                width={400}
                zIndex={2000}
                maskClosable={false}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setLogoutModalVisible(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="logout"
                        type="primary"
                        danger
                        loading={logoutLoading}
                        onClick={confirmLogout}
                        icon={<LogoutOutlined />}
                    >
                        Yes, Logout
                    </Button>,
                ]}
            >
                <p style={{ margin: "16px 0", color: "#666" }}>
                    Are you sure you want to log out of the admin panel?
                </p>
            </Modal>
        </AntHeader>
    );
};

export default Header;
