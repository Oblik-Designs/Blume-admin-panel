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
} from "antd";
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    FileImageOutlined,
    UserOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text } = Typography;
const { TextArea } = Input;
const Verification = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [rejectVisible, setRejectVisible] = useState(false);
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [rejectForm] = Form.useForm();
    const { executeRequest } = useAPI();
    const handleView = (record) => {
        setSelectedVerification(record);
        setViewVisible(true);
    };
    const handleApprove = async (record) => {
        Modal.confirm({
            title: "Approve Verification",
            content: `Are you sure you want to approve verification for ${record.document_type}?`,
            okText: "Approve",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => api.approveVerification(record.id),
                        {
                            showSuccessMessage: true,
                            successMessage:
                                "Verification approved successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Approve error:", error);
                }
            },
        });
    };
    const handleReject = (record) => {
        setSelectedVerification(record);
        setRejectVisible(true);
    };
    const handleRejectSubmit = async (values) => {
        try {
            await executeRequest(
                () =>
                    api.rejectVerification(
                        selectedVerification.id,
                        values.reason
                    ),
                {
                    showSuccessMessage: true,
                    successMessage: "Verification rejected successfully",
                }
            );
            setRefreshTrigger(Date.now());
            setRejectVisible(false);
            rejectForm.resetFields();
        } catch (error) {
            console.error("Reject error:", error);
        }
    };
    const getDocumentTypeIcon = (type) => {
        const icons = {
            government_id: <IdcardOutlined />,
            passport: <IdcardOutlined />,
            driver_license: <IdcardOutlined />,
        };
        return icons[type] || <FileImageOutlined />;
    };
    const getDocumentTypeLabel = (type) => {
        const labels = {
            government_id: "Government ID",
            passport: "Passport",
            driver_license: "Driver License",
        };
        return labels[type] || type;
    };
    const getPriorityLevel = (record) => {
        // Level 3 users get priority
        if (record.user_level === 3) return "high";
        // Documents submitted more than 7 days ago
        const daysSinceSubmission =
            (new Date() - new Date(record.submitted_at)) /
            (1000 * 60 * 60 * 24);
        if (daysSinceSubmission > 7) return "medium";
        return "low";
    };
    const getPriorityColor = (priority) => {
        const colors = {
            high: "red",
            medium: "orange",
            low: "green",
        };
        return colors[priority] || "default";
    };
    const verificationConfig = {
        name: "verification",
        table: {
            columns: [
                {
                    title: "User & Document",
                    key: "user_document",
                    render: (_, record) => (
                        <Space>
                            {getDocumentTypeIcon(record.document_type)}
                            <div>
                                <div style={{ fontWeight: 500 }}>
                                    User #{record.user_id?.slice(-6)}
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    {getDocumentTypeLabel(record.document_type)}
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
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return (
                            priorityOrder[getPriorityLevel(b)] -
                            priorityOrder[getPriorityLevel(a)]
                        );
                    },
                },
                {
                    title: "Submitted",
                    dataIndex: "submitted_at",
                    key: "submitted_at",
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
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="verification" />
                    ),
                    width: 150,
                    filters: [
                        { text: "Pending", value: "pending" },
                        { text: "Approved", value: "approved" },
                        { text: "Rejected", value: "rejected" },
                        {
                            text: "Requires Attention",
                            value: "requires_attention",
                        },
                    ],
                },
                {
                    title: "Reviewer",
                    key: "reviewer",
                    render: (_, record) =>
                        record.reviewer_id ? (
                            <Text style={{ fontSize: "12px" }}>
                                Admin #{record.reviewer_id?.slice(-6)}
                            </Text>
                        ) : (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Unassigned
                            </Text>
                        ),
                    width: 120,
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
                            {record.status === "pending" && (
                                <>
                                    <Button
                                        icon={<CheckOutlined />}
                                        size="small"
                                        type="primary"
                                        ghost
                                        onClick={() => handleApprove(record)}
                                    />
                                    <Button
                                        icon={<CloseOutlined />}
                                        size="small"
                                        danger
                                        onClick={() => handleReject(record)}
                                    />
                                </>
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
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                    {
                        value: "requires_attention",
                        label: "Requires Attention",
                    },
                ],
            },
            document_type: {
                type: "multi-select",
                label: "Document Type",
                options: [
                    { value: "government_id", label: "Government ID" },
                    { value: "passport", label: "Passport" },
                    { value: "driver_license", label: "Driver License" },
                ],
            },
        },
    };
    const verificationViewConfig = {
        sections: [
            {
                title: "Verification Information",
                columns: 2,
                fields: [
                    { key: "id", label: "Verification ID" },
                    { key: "user_id", label: "User ID" },
                    { key: "document_type", label: "Document Type" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "verification",
                    },
                    {
                        key: "submitted_at",
                        label: "Submitted",
                        type: "datetime",
                    },
                    { key: "reviewed_at", label: "Reviewed", type: "datetime" },
                    { key: "reviewer_id", label: "Reviewer ID" },
                ],
            },
            {
                title: "Review Notes",
                columns: 1,
                fields: [{ key: "notes", label: "Notes" }],
            },
        ],
    };
    return (
        <>
            <BaseTable
                config={verificationConfig}
                title="KYC Verification Queue"
                endpoint="verifications"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={false}
                extraActions={[
                    {
                        key: "stats",
                        label: "Verification Stats",
                        onClick: () =>
                            message.info(
                                "Verification statistics coming in Phase 4"
                            ),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Verification Details"
                data={selectedVerification}
                config={verificationViewConfig}
                width={900}
            />
            <Modal
                title="Reject Verification"
                open={rejectVisible}
                onCancel={() => setRejectVisible(false)}
                footer={null}
                width={500}
            >
                <Form
                    form={rejectForm}
                    onFinish={handleRejectSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="reason"
                        label="Rejection Reason"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please provide a reason for rejection",
                            },
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Explain why this verification is being rejected..."
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={() => setRejectVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" danger htmlType="submit">
                                Reject Verification
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default Verification;
