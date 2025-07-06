import React from "react";
import {
    Layout,
    Button,
    Space,
    Avatar,
    Dropdown,
    Typography,
    Badge,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    BellOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
const { Header: AntHeader } = Layout;
const { Text } = Typography;
const Header = ({ collapsed, setCollapsed, style }) => {
    const { user, logout } = useAuth();
    const userMenuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile Settings",
        },
        {
            key: "preferences",
            icon: <SettingOutlined />,
            label: "Preferences",
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: logout,
        },
    ];
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
    return (
        <AntHeader
            style={{
                ...style,
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,21,41,.08)",
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
                <Badge count={3} size="small">
                    <Button
                        type="text"
                        icon={<BellOutlined />}
                        style={{ fontSize: "16px" }}
                    />
                </Badge>
                {/* User Info */}
                <Space>
                    <div style={{ textAlign: "right" }}>
                        <div>
                            <Text strong>{user?.name || "Admin User"}</Text>
                        </div>
                        <div>
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
                    >
                        <Avatar
                            icon={<UserOutlined />}
                            style={{
                                cursor: "pointer",
                                backgroundColor: "#722ed1",
                            }}
                            src={user?.avatar}
                        />
                    </Dropdown>
                </Space>
            </Space>
        </AntHeader>
    );
};

export default Header;
