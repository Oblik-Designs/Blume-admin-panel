// src/components/auth/LoginPage.jsx
import React, { useState } from "react";
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Space,
    Alert,
    Select,
    Divider,
    Spin,
} from "antd";
import {
    UserOutlined,
    LockOutlined,
    LoginOutlined,
    CrownOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const { Title, Text } = Typography;
const { Option } = Select;

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setError("");

            const result = await login(values);

            if (result.success) {
                navigate("/");
            } else {
                setError(result.error || "Login failed");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const quickLoginOptions = [
        {
            role: "super_admin",
            email: "admin@beens.com",
            password: "admin123",
            label: "Super Admin",
            description: "Full platform access",
            color: "#722ed1",
        },
        {
            role: "kyc_admin",
            email: "kyc@beens.com",
            password: "kyc123",
            label: "KYC Admin",
            description: "Verification management",
            color: "#52c41a",
        },
        {
            role: "support_admin",
            email: "support@beens.com",
            password: "support123",
            label: "Support Admin",
            description: "User support & disputes",
            color: "#1890ff",
        },
    ];

    const handleQuickLogin = (option) => {
        form.setFieldsValue({
            email: option.email,
            password: option.password,
            role: option.role,
        });
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-overlay"></div>
            </div>

            <div className="login-content">
                <Card className="login-card" bordered={false}>
                    <div className="login-header">
                        <div className="blume-logo-large">
                            <CrownOutlined style={{ fontSize: "64px" }} />
                        </div>
                        <Title level={1} className="login-title">
                            Beens Admin Portal
                        </Title>
                        {/* <Text type="secondary" className="login-subtitle">
                            Manage your time-socio-marketplace platform with
                            comprehensive admin tools
                        </Text> */}
                    </div>

                    {error && (
                        <Alert
                            message="Login Failed"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            style={{ marginBottom: 24 }}
                            onClose={() => setError("")}
                        />
                    )}

                    <Form
                        form={form}
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        requiredMark={false}
                        size="large"
                        initialValues={{ role: "super_admin" }}
                    >
                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter your admin email"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                                {
                                    min: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Admin Role"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select your role",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select your admin role"
                                disabled={loading}
                            >
                                <Option value="super_admin">Super Admin</Option>
                                <Option value="support_admin">
                                    Support Admin
                                </Option>
                                <Option value="kyc_admin">KYC Admin</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 24 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<LoginOutlined />}
                                block
                                size="large"
                                className="login-button"
                            >
                                {loading
                                    ? "Signing In..."
                                    : "Sign In to Admin Panel"}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider>
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                            Quick Login for Demo
                        </Text>
                    </Divider>

                    <div className="quick-login-section">
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "13px",
                                display: "block",
                                marginBottom: 16,
                            }}
                        >
                            Click any role below to auto-fill credentials:
                        </Text>
                        <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size="medium"
                        >
                            {quickLoginOptions.map((option, index) => (
                                <Button
                                    key={index}
                                    type="ghost"
                                    size="large"
                                    onClick={() => handleQuickLogin(option)}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        padding: "16px 20px",
                                        marginBottom: "10px",
                                        textAlign: "left",
                                        borderColor: option.color,
                                        color: option.color,
                                        borderWidth: "2px",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: "15px",
                                                }}
                                            >
                                                {option.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    opacity: 0.8,
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {option.description}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "11px",
                                                opacity: 0.6,
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {option.email}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </Space>
                    </div>

                    <div className="login-footer">
                        <Text
                            type="secondary"
                            style={{
                                fontSize: "12px",
                                textAlign: "center",
                                display: "block",
                            }}
                        >
                            Beens Admin Panel v1.0 • Secure Access Portal
                        </Text>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "24px",
                                marginTop: "12px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "10px",
                                    color: "#999",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                🎯 Platform Control
                            </div>
                            <div
                                style={{
                                    fontSize: "10px",
                                    color: "#999",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                💎 BeensPoints Management
                            </div>
                            <div
                                style={{
                                    fontSize: "10px",
                                    color: "#999",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                📊 Real-time Analytics
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
