import React, { useState } from "react";
import {
    Space,
    Typography,
    Button,
    Modal,
    message,
    Tag,
    Card,
    Row,
    Col,
    Statistic,
    Progress,
    Timeline,
    Form,
    Select,
    InputNumber,
} from "antd";
import {
    CrownOutlined,
    StarOutlined,
    UserOutlined,
    RiseOutlined,
    TrophyOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import BeensPointsDisplay from "../../components/common/BeensPointsDisplay";
import { SUBSCRIPTION_OPTIONS } from "../../constants/userStatuses";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text, Title } = Typography;
const { Option } = Select;
const Subscriptions = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [upgradeVisible, setUpgradeVisible] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [upgradeForm] = Form.useForm();
    const { executeRequest } = useAPI();
    // Mock subscription stats
    const subscriptionStats = {
        total_subscribers: 1248,
        plan_1_count: 892,
        plan_2_count: 284,
        plan_3_count: 72,
        monthly_revenue: 1567.5,
        conversion_rate: 23.4,
    };
    const handleView = (record) => {
        setSelectedSubscription(record);
        setViewVisible(true);
    };
    const handleUpgrade = (record) => {
        setSelectedSubscription(record);
        setUpgradeVisible(true);
    };
    const handleUpgradeSubmit = async (values) => {
        try {
            await executeRequest(
                () =>
                    api.upgradeSubscription(
                        selectedSubscription.user_id,
                        values.new_plan
                    ),
                {
                    showSuccessMessage: true,
                    successMessage: "Subscription upgraded successfully",
                }
            );
            setRefreshTrigger(Date.now());
            setUpgradeVisible(false);
            upgradeForm.resetFields();
        } catch (error) {
            console.error("Upgrade error:", error);
        }
    };
    const getSubscriptionColor = (plan) => {
        const colors = {
            Plan_1: "default",
            Plan_2: "blue",
            Plan_3: "gold",
        };
        return colors[plan] || "default";
    };
    const getSubscriptionIcon = (plan) => {
        const icons = {
            Plan_1: <UserOutlined />,
            Plan_2: <StarOutlined />,
            Plan_3: <CrownOutlined />,
        };
        return icons[plan] || <UserOutlined />;
    };
    const subscriptionsConfig = {
        name: "subscriptions",
        table: {
            columns: [
                {
                    title: "User Details",
                    key: "user",
                    render: (_, record) => (
                        <Space>
                            {getSubscriptionIcon(record.current_plan)}
                            <div>
                                <div style={{ fontWeight: 500 }}>
                                    User #{record.user_id?.slice(-6)}
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Level {record.user_level}
                                </Text>
                            </div>
                        </Space>
                    ),
                    width: 150,
                },
                {
                    title: "Current Plan",
                    key: "current_plan",
                    render: (_, record) => (
                        <Space direction="vertical" size="small">
                            <Tag
                                color={getSubscriptionColor(
                                    record.current_plan
                                )}
                            >
                                {record.current_plan.replace("_", " ")}
                            </Tag>
                            <Text style={{ fontSize: "11px" }}>
                                Since:{" "}
                                {new Date(
                                    record.subscription_start
                                ).toLocaleDateString()}
                            </Text>
                        </Space>
                    ),
                    width: 120,
                },
                {
                    title: "Billing",
                    key: "billing",
                    render: (_, record) => (
                        <Space direction="vertical" size="small">
                            <BeensPointsDisplay
                                amount={record.monthly_cost}
                                size="small"
                                showUSD={true}
                            />
                            <Text style={{ fontSize: "11px", color: "#666" }}>
                                Next:{" "}
                                {new Date(
                                    record.next_billing
                                ).toLocaleDateString()}
                            </Text>
                        </Space>
                    ),
                    width: 130,
                },
                {
                    title: "Usage Stats",
                    key: "usage",
                    render: (_, record) => (
                        <Space direction="vertical" size="small">
                            <div style={{ fontSize: "12px" }}>
                                Plans: {record.plans_this_month}/∞
                            </div>
                            <div style={{ fontSize: "12px" }}>
                                BP Spent:{" "}
                                {record.bp_spent_this_month.toLocaleString()}
                            </div>
                        </Space>
                    ),
                    width: 120,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="subscription" />
                    ),
                    width: 100,
                },
                {
                    title: "Auto-Renew",
                    dataIndex: "auto_renew",
                    key: "auto_renew",
                    render: (autoRenew) => (
                        <Tag color={autoRenew ? "green" : "red"}>
                            {autoRenew ? "ON" : "OFF"}
                        </Tag>
                    ),
                    width: 100,
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button
                                size="small"
                                onClick={() => handleView(record)}
                            >
                                View
                            </Button>
                            {record.current_plan !== "Plan_3" && (
                                <Button
                                    size="small"
                                    type="primary"
                                    ghost
                                    onClick={() => handleUpgrade(record)}
                                >
                                    Upgrade
                                </Button>
                            )}
                        </Space>
                    ),
                    width: 120,
                    fixed: "right",
                },
            ],
        },
        filters: {
            current_plan: {
                type: "multi-select",
                label: "Plan",
                options: SUBSCRIPTION_OPTIONS,
            },
            status: {
                type: "multi-select",
                label: "Status",
                options: [
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                    { value: "cancelled", label: "Cancelled" },
                ],
            },
        },
    };
    const subscriptionViewConfig = {
        sections: [
            {
                title: "Subscription Information",
                columns: 2,
                fields: [
                    { key: "user_id", label: "User ID" },
                    { key: "current_plan", label: "Current Plan" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "subscription",
                    },
                    {
                        key: "subscription_start",
                        label: "Started",
                        type: "date",
                    },
                    {
                        key: "next_billing",
                        label: "Next Billing",
                        type: "date",
                    },
                    {
                        key: "monthly_cost",
                        label: "Monthly Cost",
                        type: "beenspoints",
                    },
                ],
            },
        ],
    };
    return (
        <div>
            {/* Subscription Overview */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>Subscription Management</Title>
                <Text type="secondary">
                    Monitor user subscriptions, billing, and plan usage
                </Text>
            </div>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Subscribers"
                            value={subscriptionStats.total_subscribers}
                            prefix={
                                <UserOutlined style={{ color: "#52c41a" }} />
                            }
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Monthly Revenue"
                            value={subscriptionStats.monthly_revenue}
                            prefix={
                                <DollarOutlined style={{ color: "#722ed1" }} />
                            }
                            precision={2}
                            valueStyle={{ color: "#722ed1" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Conversion Rate"
                            value={subscriptionStats.conversion_rate}
                            prefix={
                                <RiseOutlined style={{ color: "#1890ff" }} />
                            }
                            suffix="%"
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Premium Users"
                            value={subscriptionStats.plan_3_count}
                            prefix={
                                <CrownOutlined style={{ color: "#fa8c16" }} />
                            }
                            valueStyle={{ color: "#fa8c16" }}
                        />
                    </Card>
                </Col>
            </Row>
            {/* Plan Distribution */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Card title="Plan Distribution" size="small">
                        <div style={{ marginBottom: 16 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text>Basic (Free)</Text>
                                <Text strong>
                                    {subscriptionStats.plan_1_count}
                                </Text>
                            </div>
                            <Progress
                                percent={
                                    (subscriptionStats.plan_1_count /
                                        subscriptionStats.total_subscribers) *
                                    100
                                }
                                showInfo={false}
                                strokeColor="#f0f0f0"
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text>Silver</Text>
                                <Text strong>
                                    {subscriptionStats.plan_2_count}
                                </Text>
                            </div>
                            <Progress
                                percent={
                                    (subscriptionStats.plan_2_count /
                                        subscriptionStats.total_subscribers) *
                                    100
                                }
                                showInfo={false}
                                strokeColor="#1890ff"
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <Text>Black (Premium)</Text>
                                <Text strong>
                                    {subscriptionStats.plan_3_count}
                                </Text>
                            </div>
                            <Progress
                                percent={
                                    (subscriptionStats.plan_3_count /
                                        subscriptionStats.total_subscribers) *
                                    100
                                }
                                showInfo={false}
                                strokeColor="#fa8c16"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            {/* Subscriptions Table */}
            <BaseTable
                config={subscriptionsConfig}
                title="User Subscriptions"
                endpoint="subscriptions"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={false}
                extraActions={[
                    {
                        key: "billing",
                        label: "Billing Reports",
                        onClick: () =>
                            message.info("Billing reports coming soon"),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Subscription Details"
                data={selectedSubscription}
                config={subscriptionViewConfig}
                width={700}
            />
            <Modal
                title="Upgrade Subscription"
                open={upgradeVisible}
                onCancel={() => setUpgradeVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={upgradeForm}
                    onFinish={handleUpgradeSubmit}
                    layout="vertical"
                >
                    <Text
                        type="secondary"
                        style={{ display: "block", marginBottom: 16 }}
                    >
                        Current Plan:{" "}
                        <Tag
                            color={getSubscriptionColor(
                                selectedSubscription?.current_plan
                            )}
                        >
                            {selectedSubscription?.current_plan?.replace(
                                "_",
                                " "
                            )}
                        </Tag>
                    </Text>
                    <Form.Item
                        name="new_plan"
                        label="New Plan"
                        rules={[
                            {
                                required: true,
                                message: "Please select a new plan",
                            },
                        ]}
                    >
                        <Select placeholder="Select new subscription plan">
                            {SUBSCRIPTION_OPTIONS.filter(
                                (plan) =>
                                    plan.value !==
                                    selectedSubscription?.current_plan
                            ).map((plan) => (
                                <Option key={plan.value} value={plan.value}>
                                    {plan.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={() => setUpgradeVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Upgrade Plan
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default Subscriptions;
