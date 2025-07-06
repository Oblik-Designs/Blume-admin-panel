import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Spin,
    Alert,
    Progress,
    Typography,
    Space,
    Button,
} from "antd";
import {
    UserOutlined,
    CalendarOutlined,
    DollarOutlined,
    TrophyOutlined,
    RiseOutlined,
    TeamOutlined,
    ShoppingOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import { api } from "../../api";
const { Title, Text } = Typography;
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    useEffect(() => {
        loadDashboardStats();
    }, []);
    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await api.getDashboardStats();
            setStats(data);
            setError(null);
            setLastUpdated(new Date());
        } catch (err) {
            setError("Failed to load dashboard statistics");
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Text type="secondary">Loading dashboard...</Text>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <Alert
                message="Dashboard Error"
                description={error}
                type="error"
                showIcon
                style={{ margin: "20px 0" }}
                action={<Button onClick={loadDashboardStats}>Retry</Button>}
            />
        );
    }
    const formatBlumePoints = (points) => {
        return (points / 1000).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };
    return (
        <div>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        Dashboard Overview
                    </Title>
                    {lastUpdated && (
                        <Text type="secondary">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </Text>
                    )}
                </div>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={loadDashboardStats}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>
            {/* Key Metrics Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats?.users?.total || 0}
                            prefix={
                                <UserOutlined style={{ color: "#52c41a" }} />
                            }
                            valueStyle={{ color: "#52c41a" }}
                            suffix={
                                <div
                                    style={{ fontSize: "12px", color: "#999" }}
                                >
                                    <RiseOutlined /> +
                                    {stats?.users?.new_today || 0} today
                                </div>
                            }
                        />
                        <Progress
                            percent={Math.round(
                                (stats?.users?.active / stats?.users?.total) *
                                    100
                            )}
                            showInfo={false}
                            strokeColor="#52c41a"
                            style={{ marginTop: 8 }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {stats?.users?.active || 0} active users
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Plans"
                            value={stats?.plans?.active || 0}
                            prefix={
                                <CalendarOutlined
                                    style={{ color: "#722ed1" }}
                                />
                            }
                            valueStyle={{ color: "#722ed1" }}
                            suffix={
                                <div
                                    style={{ fontSize: "12px", color: "#999" }}
                                >
                                    of {stats?.plans?.total || 0} total
                                </div>
                            }
                        />
                        <Progress
                            percent={Math.round(
                                (stats?.plans?.completed /
                                    stats?.plans?.total) *
                                    100
                            )}
                            showInfo={false}
                            strokeColor="#722ed1"
                            style={{ marginTop: 8 }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {stats?.plans?.success_rate?.toFixed(1) || 0}%
                            success rate
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Platform Revenue"
                            value={stats?.financial?.revenue_usd || 0}
                            prefix={
                                <DollarOutlined style={{ color: "#fa541c" }} />
                            }
                            precision={2}
                            valueStyle={{ color: "#fa541c" }}
                        />
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                display: "block",
                                marginTop: 8,
                            }}
                        >
                            From BlumePoints service fees
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="BP Circulating"
                            value={formatBlumePoints(
                                stats?.financial?.total_bp_circulating || 0
                            )}
                            prefix={
                                <TrophyOutlined style={{ color: "#722ed1" }} />
                            }
                            suffix="K"
                            valueStyle={{ color: "#722ed1" }}
                        />
                        <BlumePointsDisplay
                            amount={stats?.financial?.total_bp_circulating || 0}
                            showIcon={false}
                            size="small"
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
            </Row>
            {/* Detailed Metrics Row */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="User Engagement" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Active Users</Text>
                                <Text strong>{stats?.users?.active || 0}</Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Growth Rate</Text>
                                <Text strong style={{ color: "#52c41a" }}>
                                    <RiseOutlined />{" "}
                                    {stats?.users?.growth_rate?.toFixed(1) || 0}
                                    %
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>New Today</Text>
                                <Text strong>
                                    {stats?.users?.new_today || 0}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Plan Performance" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Success Rate</Text>
                                <Text strong style={{ color: "#52c41a" }}>
                                    {stats?.plans?.success_rate?.toFixed(1) ||
                                        0}
                                    %
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Completed</Text>
                                <Text strong>
                                    {stats?.plans?.completed || 0}
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Active Now</Text>
                                <Text strong style={{ color: "#722ed1" }}>
                                    {stats?.plans?.active || 0}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Financial Activity" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Today's Transactions</Text>
                                <Text strong>
                                    {stats?.financial?.transactions_today || 0}
                                </Text>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Avg Transaction</Text>
                                <BlumePointsDisplay
                                    amount={
                                        stats?.financial?.avg_transaction || 0
                                    }
                                    size="small"
                                    showUSD={false}
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text>Platform Revenue</Text>
                                <Text strong style={{ color: "#fa541c" }}>
                                    $
                                    {stats?.financial?.revenue_usd?.toFixed(
                                        2
                                    ) || "0.00"}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default Dashboard;
