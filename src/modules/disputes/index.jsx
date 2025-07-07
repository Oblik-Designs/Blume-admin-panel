import React, { useState } from "react";
import {
    Space,
    Typography,
    Button,
    Modal,
    message,
    Tag,
    Form,
    Input,
    Select,
    InputNumber,
    Steps,
    Card,
    Divider,
    Alert,
} from "antd";
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    DollarOutlined,
    UserOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import {
    DISPUTE_TYPES,
    DISPUTE_STATUS_OPTIONS,
    DISPUTE_RESOLUTION_ACTIONS,
} from "../../constants/disputeTypes";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const Disputes = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [resolveVisible, setResolveVisible] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [resolveForm] = Form.useForm();
    const { executeRequest } = useAPI();
    const handleView = (record) => {
        setSelectedDispute(record);
        setViewVisible(true);
    };
    const handleResolve = (record) => {
        setSelectedDispute(record);
        setResolveVisible(true);
    };
    const handleResolveSubmit = async (values) => {
        try {
            await executeRequest(
                () => api.resolveDispute(selectedDispute.id, values),
                {
                    showSuccessMessage: true,
                    successMessage: "Dispute resolved successfully",
                }
            );
            setRefreshTrigger(Date.now());
            setResolveVisible(false);
            resolveForm.resetFields();
        } catch (error) {
            console.error("Resolve error:", error);
        }
    };
    const getDisputeTypeConfig = (type) => {
        return (
            Object.values(DISPUTE_TYPES).find((d) => d.key === type) ||
            DISPUTE_TYPES.HOST_ISSUES
        );
    };
    const getPriorityLevel = (record) => {
        const typeConfig = getDisputeTypeConfig(record.dispute_type);
        const daysSinceCreated =
            (new Date() - new Date(record.created_at)) / (1000 * 60 * 60 * 24);
        if (typeConfig.severity === "critical") return "critical";
        if (typeConfig.severity === "high" || daysSinceCreated > 3)
            return "high";
        if (daysSinceCreated > 1) return "medium";
        return "low";
    };
    const getPriorityColor = (priority) => {
        const colors = {
            critical: "purple",
            high: "red",
            medium: "orange",
            low: "green",
        };
        return colors[priority] || "default";
    };
    const disputesConfig = {
        name: "disputes",
        table: {
            columns: [
                {
                    title: "Dispute Details",
                    key: "details",
                    render: (_, record) => {
                        const typeConfig = getDisputeTypeConfig(
                            record.dispute_type
                        );
                        return (
                            <Space direction="vertical" size="small">
                                <div style={{ fontWeight: 500 }}>
                                    Dispute #{record.id?.slice(-6)}
                                </div>
                                <Tag color={typeConfig.color}>
                                    {typeConfig.label}
                                </Tag>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Plan #{record.plan_id?.slice(-6)}
                                </Text>
                            </Space>
                        );
                    },
                    width: 200,
                },
                {
                    title: "Parties Involved",
                    key: "parties",
                    render: (_, record) => (
                        <Space direction="vertical" size="small">
                            <div>
                                <UserOutlined style={{ marginRight: 4 }} />
                                <Text style={{ fontSize: "12px" }}>
                                    Complainant: User #
                                    {record.complainant_id?.slice(-6)}
                                </Text>
                            </div>
                            <div>
                                <UserOutlined style={{ marginRight: 4 }} />
                                <Text style={{ fontSize: "12px" }}>
                                    Respondent: User #
                                    {record.respondent_id?.slice(-6)}
                                </Text>
                            </div>
                        </Space>
                    ),
                    width: 180,
                },
                {
                    title: "Priority",
                    key: "priority",
                    render: (_, record) => {
                        const priority = getPriorityLevel(record);
                        return (
                            <Tag color={getPriorityColor(priority)}>
                                {priority.toUpperCase()}
                            </Tag>
                        );
                    },
                    width: 100,
                    sorter: (a, b) => {
                        const priorityOrder = {
                            critical: 4,
                            high: 3,
                            medium: 2,
                            low: 1,
                        };
                        return (
                            priorityOrder[getPriorityLevel(b)] -
                            priorityOrder[getPriorityLevel(a)]
                        );
                    },
                },
                {
                    title: "Amount Disputed",
                    key: "amount",
                    render: (_, record) =>
                        record.disputed_amount ? (
                            <BlumePointsDisplay
                                amount={record.disputed_amount}
                                size="small"
                            />
                        ) : (
                            <Text type="secondary">N/A</Text>
                        ),
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="dispute" />
                    ),
                    width: 150,
                    filters: DISPUTE_STATUS_OPTIONS.map((opt) => ({
                        text: opt.label,
                        value: opt.value,
                    })),
                },
                {
                    title: "Created",
                    dataIndex: "created_at",
                    key: "created_at",
                    render: (date) => {
                        const daysSince = Math.floor(
                            (new Date() - new Date(date)) /
                                (1000 * 60 * 60 * 24)
                        );
                        return (
                            <div>
                                <div>{new Date(date).toLocaleDateString()}</div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "11px" }}
                                >
                                    {daysSince} days ago
                                </Text>
                            </div>
                        );
                    },
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => handleView(record)}
                            />
                            {record.status === "open" && (
                                <Button
                                    icon={<CheckOutlined />}
                                    size="small"
                                    type="primary"
                                    ghost
                                    onClick={() => handleResolve(record)}
                                >
                                    Resolve
                                </Button>
                            )}
                        </Space>
                    ),
                    width: 140,
                    fixed: "right",
                },
            ],
        },
        filters: {
            status: {
                type: "multi-select",
                label: "Status",
                options: DISPUTE_STATUS_OPTIONS,
            },
            dispute_type: {
                type: "multi-select",
                label: "Dispute Type",
                options: Object.values(DISPUTE_TYPES).map((type) => ({
                    value: type.key,
                    label: type.label,
                })),
            },
        },
    };
    const disputeViewConfig = {
        sections: [
            {
                title: "Dispute Information",
                columns: 2,
                fields: [
                    { key: "id", label: "Dispute ID" },
                    { key: "dispute_type", label: "Type" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "dispute",
                    },
                    {
                        key: "disputed_amount",
                        label: "Disputed Amount",
                        type: "blumepoints",
                    },
                    { key: "created_at", label: "Created", type: "datetime" },
                    { key: "resolved_at", label: "Resolved", type: "datetime" },
                ],
            },
            {
                title: "Dispute Description",
                columns: 1,
                fields: [{ key: "description", label: "Description" }],
            },
            {
                title: "Resolution",
                columns: 1,
                fields: [
                    { key: "resolution_notes", label: "Resolution Notes" },
                    { key: "resolution_action", label: "Action Taken" },
                ],
            },
        ],
    };
    return (
        <>
            <BaseTable
                config={disputesConfig}
                title="Dispute Resolution"
                endpoint="disputes"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={false}
                extraActions={[
                    {
                        key: "escalated",
                        label: "View Escalated",
                        onClick: () =>
                            message.info("Escalated disputes view coming soon"),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Dispute Details"
                data={selectedDispute}
                config={disputeViewConfig}
                width={900}
            />
            <Modal
                title="Resolve Dispute"
                open={resolveVisible}
                onCancel={() => setResolveVisible(false)}
                footer={null}
                width={800}
            >
                <Form
                    form={resolveForm}
                    onFinish={handleResolveSubmit}
                    layout="vertical"
                >
                    <Alert
                        message="Dispute Resolution"
                        description={`Resolving dispute for Plan #${selectedDispute?.plan_id?.slice(-6)}`}
                        type="info"
                        style={{ marginBottom: 16 }}
                    />
                    <Form.Item
                        name="resolution_action"
                        label="Resolution Action"
                        rules={[
                            {
                                required: true,
                                message: "Please select a resolution action",
                            },
                        ]}
                    >
                        <Select placeholder="Select resolution action">
                            {Object.values(DISPUTE_RESOLUTION_ACTIONS).map(
                                (action) => (
                                    <Option key={action.key} value={action.key}>
                                        <div>
                                            <div>{action.label}</div>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                {action.description}
                                            </Text>
                                        </div>
                                    </Option>
                                )
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="refund_amount"
                        label="Refund Amount (if applicable)"
                        help="Enter amount in BlumePoints"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            max={selectedDispute?.disputed_amount || 10000}
                            formatter={(value) => `${value} BP`}
                            parser={(value) => value.replace(" BP", "")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="resolution_notes"
                        label="Resolution Notes"
                        rules={[
                            {
                                required: true,
                                message: "Please provide resolution notes",
                            },
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Explain the resolution decision and any actions taken..."
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={() => setResolveVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Resolve Dispute
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default Disputes;
