import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Space,
    Button,
    Modal,
    Form,
    InputNumber,
    Input,
    Select,
    Typography,
    Tag,
    DatePicker,
} from "antd";
import {
    DollarOutlined,
    TrophyOutlined,
    TransactionOutlined,
    EyeOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import BeensPointsDisplay from "../../components/common/BeensPointsDisplay";
import StatusBadge from "../../components/common/StatusBadge";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const Financial = () => {
    const [form] = Form.useForm();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [walletVisible, setWalletVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [stats, setStats] = useState({
        totalRevenue: 12580.5,
        totalBP: 12580500,
        transactionsToday: 47,
        escrowAmount: 245000,
    });
    const { executeRequest } = useAPI();
    React.useEffect(() => {
        loadTransactions();
    }, []);
    const loadTransactions = async () => {
        try {
            setLoading(true);
            // Mock transaction data for now
            const mockTransactions = Array.from({ length: 20 }, (_, index) => ({
                id: `txn_${index + 1}`,
                user_id: `user_${Math.floor(Math.random() * 50) + 1}`,
                type: [
                    "bp_purchase",
                    "plan_payment",
                    "plan_earning",
                    "gift_sent",
                    "admin_adjustment",
                ][Math.floor(Math.random() * 5)],
                amount: Math.floor(Math.random() * 5000) + 100,
                status: ["completed", "pending", "failed"][
                    Math.floor(Math.random() * 3)
                ],
                description: "Transaction description",
                created_at: new Date(
                    Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
                ).toISOString(),
                service_fee: Math.floor(Math.random() * 100),
                net_amount: Math.floor(Math.random() * 4900) + 100,
            }));
            setTransactions(mockTransactions);
        } catch (error) {
            console.error("Failed to load transactions:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleWalletAdjustment = () => {
        setWalletVisible(true);
    };
    const handleWalletSubmit = async (values) => {
        try {
            await executeRequest(
                () =>
                    api.adjustUserWallet(
                        values.user_id,
                        values.amount,
                        values.reason
                    ),
                {
                    showSuccessMessage: true,
                    successMessage: "Wallet adjustment completed successfully",
                }
            );
            setWalletVisible(false);
            loadTransactions();
        } catch (error) {
            console.error("Wallet adjustment error:", error);
        }
    };
    const getTransactionTypeColor = (type) => {
        const colors = {
            bp_purchase: "green",
            plan_payment: "blue",
            plan_earning: "purple",
            gift_sent: "pink",
            gift_received: "cyan",
            admin_adjustment: "orange",
            refund: "yellow",
            withdrawal: "red",
        };
        return colors[type] || "default";
    };
    const getTransactionTypeLabel = (type) => {
        const labels = {
            bp_purchase: "BP Purchase",
            plan_payment: "Plan Payment",
            plan_earning: "Plan Earning",
            gift_sent: "Gift Sent",
            gift_received: "Gift Received",
            admin_adjustment: "Admin Adjustment",
            refund: "Refund",
            withdrawal: "Withdrawal",
        };
        return labels[type] || type;
    };
    const transactionColumns = [
        {
            title: "Transaction ID",
            dataIndex: "id",
            key: "id",
            width: 120,
            render: (id) => <Text code>{id}</Text>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
            render: (type) => (
                <Tag color={getTransactionTypeColor(type)}>
                    {getTransactionTypeLabel(type)}
                </Tag>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 120,
            render: (amount) => (
                <BeensPointsDisplay amount={amount} size="small" />
            ),
            sorter: true,
        },
        {
            title: "Service Fee",
            dataIndex: "service_fee",
            key: "service_fee",
            width: 100,
            render: (fee) => (fee ? `${fee} BP` : "-"),
        },
        {
            title: "Net Amount",
            dataIndex: "net_amount",
            key: "net_amount",
            width: 120,
            render: (amount) => (
                <BeensPointsDisplay
                    amount={amount}
                    size="small"
                    showUSD={false}
                />
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status) => (
                <StatusBadge status={status} type="transaction" />
            ),
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 120,
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: true,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => console.log("View transaction:", record.id)}
                />
            ),
        },
    ];
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>Financial Management</Title>
                <Text type="secondary">
                    Monitor BeensPoints transactions, revenue, and wallet
                    adjustments
                </Text>
            </div>
            {/* Financial Overview */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Platform Revenue"
                            value={stats.totalRevenue}
                            prefix={
                                <DollarOutlined style={{ color: "#52c41a" }} />
                            }
                            precision={2}
                            valueStyle={{ color: "#52c41a" }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            From service fees (10%)
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total BP Circulating"
                            value={stats.totalBP / 1000}
                            prefix={
                                <TrophyOutlined style={{ color: "#722ed1" }} />
                            }
                            suffix="K"
                            valueStyle={{ color: "#722ed1" }}
                        />
                        <BeensPointsDisplay
                            amount={stats.totalBP}
                            showIcon={false}
                            size="small"
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Transactions Today"
                            value={stats.transactionsToday}
                            prefix={
                                <TransactionOutlined
                                    style={{ color: "#1890ff" }}
                                />
                            }
                            valueStyle={{ color: "#1890ff" }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Across all transaction types
                        </Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Escrow Amount"
                            value={stats.escrowAmount / 1000}
                            prefix={
                                <TrophyOutlined style={{ color: "#fa8c16" }} />
                            }
                            suffix="K BP"
                            valueStyle={{ color: "#fa8c16" }}
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Held for pending plans
                        </Text>
                    </Card>
                </Col>
            </Row>
            {/* Actions Row */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleWalletAdjustment}
                    >
                        Adjust User Wallet
                    </Button>
                </Col>
                <Col>
                    <Button>Generate Report</Button>
                </Col>
                <Col>
                    <RangePicker
                        placeholder={["Start Date", "End Date"]}
                        style={{ width: 240 }}
                    />
                </Col>
            </Row>
            {/* Transactions Table */}
            <Card title="Recent Transactions">
                <Table
                    columns={transactionColumns}
                    dataSource={transactions}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} transactions`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>
            {/* Wallet Adjustment Modal */}
            <Modal
                title="Adjust User Wallet"
                open={walletVisible}
                onCancel={() => setWalletVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleWalletSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="user_id"
                        label="User"
                        rules={[
                            { required: true, message: "Please select a user" },
                        ]}
                    >
                        <Select
                            placeholder="Search and select user"
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            <Select.Option value="user_1">
                                john_doe (john@example.com)
                            </Select.Option>
                            <Select.Option value="user_2">
                                jane_smith (jane@example.com)
                            </Select.Option>
                            <Select.Option value="user_3">
                                alice_jones (alice@example.com)
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Adjustment Amount"
                        rules={[
                            { required: true, message: "Please enter amount" },
                        ]}
                        help="Enter positive amount to add BP, negative to deduct BP"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Enter amount"
                            formatter={(value) => `${value} BP`}
                            parser={(value) => value.replace(" BP", "")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="reason"
                        label="Reason for Adjustment"
                        rules={[
                            { required: true, message: "Please enter reason" },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Describe the reason for this wallet adjustment..."
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={() => setWalletVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Apply Adjustment
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default Financial;
