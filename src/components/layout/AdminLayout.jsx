import React, { useState } from "react";
import { Layout, theme } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
const { Content } = Layout;
const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar collapsed={collapsed} />
            <Layout>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    style={{ background: colorBgContainer }}
                />
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;
