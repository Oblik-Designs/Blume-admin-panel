import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
    DashboardOutlined,
    UserOutlined,
    CalendarOutlined,
    FileTextOutlined,
    MessageOutlined,
    StarOutlined,
    DollarOutlined,
    ExclamationCircleOutlined,
    CrownOutlined,
    SettingOutlined,
    BarChartOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
        {
            key: "/",
            icon: <DashboardOutlined />,
            label: "Dashboard",
        },
        {
            key: "/users",
            icon: <UserOutlined />,
            label: "Users",
        },
        {
            key: "/plans",
            icon: <CalendarOutlined />,
            label: "Plans",
        },
        {
            key: "/applications",
            icon: <FileTextOutlined />,
            label: "Applications",
        },
        {
            key: "/chats",
            icon: <MessageOutlined />,
            label: "Chats",
        },
        {
            key: "/reviews",
            icon: <StarOutlined />,
            label: "Reviews",
        },
        {
            key: "/financial",
            icon: <DollarOutlined />,
            label: "Financial",
        },
        {
            key: "/disputes",
            icon: <ExclamationCircleOutlined />,
            label: "Disputes",
        },
        {
            key: "/subscriptions",
            icon: <CrownOutlined />,
            label: "Subscriptions",
        },
        {
            key: "/reports",
            icon: <BarChartOutlined />,
            label: "Reports",
        },
        {
            key: "/system",
            icon: <SettingOutlined />,
            label: "System",
        },
    ];
    const handleMenuClick = ({ key }) => {
        navigate(key);
    };
    return (
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
            <div
                style={{
                    height: 64,
                    margin: 16,
                    background: "linear-gradient(45deg, #722ed1, #eb2f96)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: collapsed ? "18px" : "16px",
                }}
            >
                {collapsed ? "B" : "Blume Admin"}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{ borderRight: 0 }}
            />
        </Sider>
    );
};
export default Sidebar;
