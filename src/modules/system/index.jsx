import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Tabs,
    Form,
    Input,
    Switch,
    Button,
    InputNumber,
    Select,
    message,
    Alert,
    Divider,
    Typography,
    Space,
    Modal,
    Table,
    Tag,
} from "antd";
import {
    SettingOutlined,
    UserOutlined,
    SecurityScanOutlined,
    DatabaseOutlined,
    SafetyOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { PLATFORM_CONFIG } from "../../constants/platformConfig";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const System = () => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(PLATFORM_CONFIG);
    const [resetVisible, setResetVisible] = useState(false);
    const { executeRequest } = useAPI();
    const handleConfigSave = async (section, values) => {
        try {
            await executeRequest(
                () => api.updatePlatformConfig(section, values),
                {
                    showSuccessMessage: true,
                    successMessage: "Configuration updated successfully",
                }
            );
            setConfig((prev) => ({
                ...prev,
                [section]: { ...prev[section], ...values },
            }));
        } catch (error) {
            console.error("Config update error:", error);
        }
    };
    const handleSystemReset = async () => {
        Modal.confirm({
            title: "Reset System Configuration",
            content:
                "This will reset all platform settings to default values. This action cannot be undone.",
            icon: <ExclamationCircleOutlined />,
            okText: "Reset",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(() => api.resetPlatformConfig(), {
                        showSuccessMessage: true,
                        successMessage:
                            "System configuration reset successfully",
                    });
                    setConfig(PLATFORM_CONFIG);
                } catch (error) {
                    console.error("Reset error:", error);
                }
            },
        });
    };
    // Mock admin users data
    const adminUsers = [
        {
            id: "1",
            name: "John Admin",
            email: "john@blume.com",
            role: "super_admin",
            status: "active",
            last_login: new Date().toISOString(),
        },
        {
            id: "2",
            name: "Jane Support",
            email: "jane@blume.com",
            role: "support_admin",
            status: "active",
            last_login: new Date(
                Date.now() - 24 * 60 * 60 * 1000
            ).toISOString(),
        },
    ];
    const adminColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag
                    color={
                        role === "super_admin"
                            ? "red"
                            : role === "support_admin"
                              ? "blue"
                              : "green"
                    }
                >
                    {role.replace("_", " ").toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Last Login",
            dataIndex: "last_login",
            key: "last_login",
            render: (date) => new Date(date).toLocaleString(),
        },
    ];
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>System Administration</Title>
                <Text type="secondary">
                    Manage platform configuration, admin users, and system
                    settings
                </Text>
            </div>
            <Tabs defaultActiveKey="platform">
                <TabPane
                    tab={
                        <span>
                            <SettingOutlined />
                            Platform Settings
                        </span>
                    }
                    key="platform"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Financial Settings" size="small">
                                <Form
                                    layout="vertical"
                                    initialValues={config.BLUME_POINTS}
                                    onFinish={(values) =>
                                        handleConfigSave("BLUME_POINTS", values)
                                    }
                                >
                                    <Form.Item
                                        name="USD_CONVERSION_RATE"
                                        label="BP to USD Rate"
                                        help="How many BlumePoints equal $1 USD"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={10000}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="SERVICE_FEE_PERCENT"
                                        label="Service Fee Percentage"
                                        help="Platform service fee on BP purchases"
                                    >
                                        <InputNumber
                                            min={0}
                                            max={50}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="MIN_PURCHASE_AMOUNT"
                                        label="Minimum Purchase Amount (BP)"
                                    >
                                        <InputNumber
                                            min={1}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="MAX_PURCHASE_AMOUNT"
                                        label="Maximum Purchase Amount (BP)"
                                    >
                                        <InputNumber
                                            min={1000}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Save Financial Settings
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="Business Rules" size="small">
                                <Form
                                    layout="vertical"
                                    initialValues={config.PLAN_RULES}
                                    onFinish={(values) =>
                                        handleConfigSave("PLAN_RULES", values)
                                    }
                                >
                                    <Form.Item
                                        name="CANCELLATION_HOURS"
                                        label="Plan Cancellation Hours"
                                        help="Hours before plan start when cancellation is allowed"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={168}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="APPLICATION_CLOSE_BEFORE_HOURS"
                                        label="Application Close Hours"
                                        help="Hours before plan when applications close"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={72}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="MAX_PARTICIPANTS_LIMIT"
                                        label="Maximum Participants per Plan"
                                    >
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Save Business Rules
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={24}>
                            <Card title="Dispute Settings" size="small">
                                <Form
                                    layout="vertical"
                                    initialValues={config.DISPUTE_SETTINGS}
                                    onFinish={(values) =>
                                        handleConfigSave(
                                            "DISPUTE_SETTINGS",
                                            values
                                        )
                                    }
                                >
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="WINDOW_DAYS"
                                                label="Dispute Window (Days)"
                                                help="Days after plan completion to file dispute"
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={30}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="AUTO_RESOLVE_DAYS"
                                                label="Auto-Resolve Days"
                                                help="Days before dispute auto-resolves"
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={30}
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={loading}
                                                    style={{ margin: "24px 0" }}
                                                >
                                                    Save Dispute Settings
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            Admin Users
                        </span>
                    }
                    key="admins"
                >
                    <Card title="Admin User Management">
                        <div style={{ marginBottom: 16 }}>
                            <Button type="primary">Add New Admin</Button>
                        </div>
                        <Table
                            columns={adminColumns}
                            dataSource={adminUsers}
                            rowKey="id"
                            pagination={false}
                        />
                    </Card>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <SecurityScanOutlined />
                            Security
                        </span>
                    }
                    key="security"
                >
                    <Alert
                        message="Security Settings"
                        description="Configure security policies and access controls"
                        type="info"
                        style={{ marginBottom: 16 }}
                    />
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Authentication Settings" size="small">
                                <Form layout="vertical">
                                    <Form.Item
                                        name="session_timeout"
                                        label="Session Timeout (minutes)"
                                    >
                                        <InputNumber
                                            min={5}
                                            max={480}
                                            defaultValue={60}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="max_login_attempts"
                                        label="Max Login Attempts"
                                    >
                                        <InputNumber
                                            min={3}
                                            max={10}
                                            defaultValue={5}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="require_2fa"
                                        label="Require 2FA"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary">
                                            Save Security Settings
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="API Security" size="small">
                                <Form layout="vertical">
                                    <Form.Item
                                        name="rate_limit"
                                        label="API Rate Limit (requests/minute)"
                                    >
                                        <InputNumber
                                            min={10}
                                            max={1000}
                                            defaultValue={100}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="cors_origins"
                                        label="CORS Origins"
                                    >
                                        <TextArea
                                            rows={3}
                                            placeholder="https://admin.blume.com"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary">
                                            Save API Settings
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <DatabaseOutlined />
                            System Info
                        </span>
                    }
                    key="system"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="System Status" size="small">
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Database Status</Text>
                                        <Tag color="green">HEALTHY</Tag>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>API Status</Text>
                                        <Tag color="green">OPERATIONAL</Tag>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Cache Status</Text>
                                        <Tag color="green">CONNECTED</Tag>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Queue Status</Text>
                                        <Tag color="orange">BUSY</Tag>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="System Actions" size="small">
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <Button block>Clear Cache</Button>
                                    <Button block>Restart Queue</Button>
                                    <Button block>Run Maintenance</Button>
                                    <Button
                                        block
                                        danger
                                        onClick={handleSystemReset}
                                    >
                                        Reset Configuration
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </div>
    );
};
export default System;
