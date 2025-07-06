import React, { useState } from "react";
import { Space, Typography, Button, Modal, message, Tag, Avatar } from "antd";
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    GiftOutlined,
    TrophyOutlined,
    MessageOutlined,
    UserOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text } = Typography;
const Applications = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const { executeRequest } = useAPI();
    const handleView = (record) => {
        setSelectedApplication(record);
        setViewVisible(true);
    };
    const handleApprove = async (record) => {
        Modal.confirm({
            title: "Approve Application",
            content: `Are you sure you want to approve this application?`,
            okText: "Approve",
            onOk: async () => {
                try {
                    await executeRequest(
                        () =>
                            api.updateApplication(record.id, {
                                status: "accepted",
                            }),
                        {
                            showSuccessMessage: true,
                            successMessage: "Application approved successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Approve error:", error);
                }
            },
        });
    };
    const handleReject = async (record) => {
        Modal.confirm({
            title: "Reject Application",
            content: "Are you sure you want to reject this application?",
            okText: "Reject",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () =>
                            api.updateApplication(record.id, {
                                status: "rejected",
                                rejection_reason: "Rejected by admin",
                            }),
                        {
                            showSuccessMessage: true,
                            successMessage: "Application rejected successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Reject error:", error);
                }
            },
        });
    };
    const getApplicationTypeConfig = (type) => {
        const configs = {
            bidding: {
                icon: <TrophyOutlined />,
                color: "gold",
                label: "Bidding",
            },
            gift: {
                icon: <GiftOutlined />,
                color: "purple",
                label: "Gift",
            },
            invite: {
                icon: <MessageOutlined />,
                color: "blue",
                label: "Invite",
            },
        };
        return configs[type] || configs.bidding;
    };
    const applicationsConfig = {
        name: "applications",
        table: {
            columns: [
                {
                    title: "Application Details",
                    key: "details",
                    render: (_, record) => {
                        const typeConfig = getApplicationTypeConfig(
                            record.application_type
                        );
                        return (
                            <Space>
                                <Avatar icon={<UserOutlined />} />
                                <div>
                                    <div style={{ fontWeight: 500 }}>
                                        User Application
                                    </div>
                                    <Space>
                                        <Tag
                                            icon={typeConfig.icon}
                                            color={typeConfig.color}
                                        >
                                            {typeConfig.label}
                                        </Tag>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {new Date(
                                                record.created_at
                                            ).toLocaleDateString()}
                                        </Text>
                                    </Space>
                                </div>
                            </Space>
                        );
                    },
                    width: 250,
                },
                {
                    title: "Plan",
                    key: "plan",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontWeight: 500 }}>Plan Title</div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Click to view plan details
                            </Text>
                        </div>
                    ),
                    width: 200,
                },
                {
                    title: "Bid Amount",
                    key: "bid_amount",
                    render: (_, record) => {
                        if (
                            record.application_type === "bidding" &&
                            record.bid_amount
                        ) {
                            return (
                                <BlumePointsDisplay
                                    amount={record.bid_amount}
                                    size="small"
                                />
                            );
                        }
                        return <Text type="secondary">N/A</Text>;
                    },
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="application" />
                    ),
                    width: 120,
                    filters: [
                        { text: "Pending", value: "pending" },
                        { text: "Accepted", value: "accepted" },
                        { text: "Rejected", value: "rejected" },
                    ],
                },
                {
                    title: "Applied",
                    dataIndex: "created_at",
                    key: "created_at",
                    render: (date) => new Date(date).toLocaleDateString(),
                    width: 100,
                    sorter: true,
                },
                {
                    title: "Response Date",
                    key: "response_date",
                    render: (_, record) => {
                        if (record.accepted_at) {
                            return new Date(
                                record.accepted_at
                            ).toLocaleDateString();
                        }
                        if (record.rejected_at) {
                            return new Date(
                                record.rejected_at
                            ).toLocaleDateString();
                        }
                        return <Text type="secondary">Pending</Text>;
                    },
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
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        size="small"
                                        danger
                                        onClick={() => handleReject(record)}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                        </Space>
                    ),
                    width: 180,
                    fixed: "right",
                },
            ],
        },
        filters: {
            application_type: {
                type: "multi-select",
                label: "Type",
                options: [
                    { value: "bidding", label: "Bidding" },
                    { value: "gift", label: "Gift" },
                    { value: "invite", label: "Invite" },
                ],
            },
            status: {
                type: "multi-select",
                label: "Status",
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "accepted", label: "Accepted" },
                    { value: "rejected", label: "Rejected" },
                ],
            },
        },
    };
    const applicationViewConfig = {
        sections: [
            {
                title: "Application Information",
                columns: 2,
                fields: [
                    { key: "application_type", label: "Type" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "application",
                    },
                    {
                        key: "bid_amount",
                        label: "Bid Amount",
                        type: "blumepoints",
                    },
                    {
                        key: "created_at",
                        label: "Applied Date",
                        type: "datetime",
                    },
                ],
            },
            {
                title: "Message",
                columns: 1,
                fields: [{ key: "message", label: "Application Message" }],
            },
            {
                title: "Response Information",
                columns: 2,
                fields: [
                    {
                        key: "accepted_at",
                        label: "Accepted Date",
                        type: "datetime",
                    },
                    {
                        key: "rejected_at",
                        label: "Rejected Date",
                        type: "datetime",
                    },
                    { key: "rejection_reason", label: "Rejection Reason" },
                ],
            },
        ],
    };
    return (
        <>
            <BaseTable
                config={applicationsConfig}
                title="Application Management"
                endpoint="applications"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={false}
                extraActions={[
                    {
                        key: "bidding",
                        label: "Bidding Management",
                        onClick: () =>
                            message.info(
                                "Bidding management coming in next update"
                            ),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Application Details"
                data={selectedApplication}
                config={applicationViewConfig}
            />
        </>
    );
};
export default Applications;
