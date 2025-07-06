import React, { useState } from "react";
import { Space, Typography, Button, Modal, message, Tag, Avatar } from "antd";
import {
    EyeOutlined,
    MessageOutlined,
    GiftOutlined,
    FlagOutlined,
    UserOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text } = Typography;
const Chats = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const { executeRequest } = useAPI();
    const handleView = (record) => {
        setSelectedChat(record);
        setViewVisible(true);
    };
    const handleFlag = async (record) => {
        Modal.confirm({
            title: "Flag Chat",
            content: "Are you sure you want to flag this chat for review?",
            okText: "Flag",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => Promise.resolve({ success: true }),
                        {
                            showSuccessMessage: true,
                            successMessage: "Chat flagged successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Flag error:", error);
                }
            },
        });
    };
    const handleArchive = async (record) => {
        try {
            await executeRequest(() => Promise.resolve({ success: true }), {
                showSuccessMessage: true,
                successMessage: "Chat archived successfully",
            });
            setRefreshTrigger(Date.now());
        } catch (error) {
            console.error("Archive error:", error);
        }
    };
    const getChatStatusColor = (status) => {
        const colors = {
            active: "green",
            archived: "default",
            flagged: "red",
        };
        return colors[status] || "default";
    };
    const chatsConfig = {
        name: "chats",
        table: {
            columns: [
                {
                    title: "Chat Details",
                    key: "details",
                    render: (_, record) => (
                        <Space>
                            <Avatar.Group>
                                <Avatar icon={<UserOutlined />} />
                                <Avatar icon={<UserOutlined />} />
                            </Avatar.Group>
                            <div>
                                <div style={{ fontWeight: 500 }}>
                                    Chat #{record.id.slice(-6)}
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    {record.message_count} messages
                                </Text>
                            </div>
                        </Space>
                    ),
                    width: 200,
                },
                {
                    title: "Plan",
                    key: "plan",
                    render: (_, record) => (
                        <div>
                            <Text>Plan #{record.plan_id?.slice(-6)}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Click to view plan
                            </Text>
                        </div>
                    ),
                    width: 150,
                },
                {
                    title: "Gift Activity",
                    key: "gifts",
                    render: (_, record) => (
                        <Space direction="vertical" size="small">
                            <div>
                                <GiftOutlined
                                    style={{ color: "#eb2f96", marginRight: 4 }}
                                />
                                {record.gift_transactions} gifts
                            </div>
                            {record.total_gifts_bp > 0 && (
                                <BlumePointsDisplay
                                    amount={record.total_gifts_bp}
                                    size="small"
                                    showUSD={false}
                                />
                            )}
                        </Space>
                    ),
                    width: 120,
                },
                {
                    title: "Last Activity",
                    dataIndex: "last_message_at",
                    key: "last_activity",
                    render: (date) => new Date(date).toLocaleDateString(),
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <Tag color={getChatStatusColor(status)}>
                            {status.toUpperCase()}
                        </Tag>
                    ),
                    width: 100,
                    filters: [
                        { text: "Active", value: "active" },
                        { text: "Archived", value: "archived" },
                        { text: "Flagged", value: "flagged" },
                    ],
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
                            <Button
                                icon={<MessageOutlined />}
                                size="small"
                                onClick={() =>
                                    message.info("View messages coming soon")
                                }
                            />
                            {record.status !== "flagged" && (
                                <Button
                                    icon={<FlagOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => handleFlag(record)}
                                />
                            )}
                            <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => handleArchive(record)}
                            />
                        </Space>
                    ),
                    width: 160,
                    fixed: "right",
                },
            ],
        },
        filters: {
            status: {
                type: "multi-select",
                label: "Status",
                options: [
                    { value: "active", label: "Active" },
                    { value: "archived", label: "Archived" },
                    { value: "flagged", label: "Flagged" },
                ],
            },
        },
    };
    const chatViewConfig = {
        sections: [
            {
                title: "Chat Information",
                columns: 2,
                fields: [
                    { key: "id", label: "Chat ID" },
                    { key: "status", label: "Status" },
                    { key: "message_count", label: "Total Messages" },
                    { key: "gift_transactions", label: "Gift Transactions" },
                    {
                        key: "total_gifts_bp",
                        label: "Total Gifts Value",
                        type: "blumepoints",
                    },
                    { key: "created_at", label: "Created", type: "datetime" },
                    {
                        key: "last_message_at",
                        label: "Last Activity",
                        type: "datetime",
                    },
                ],
            },
        ],
    };
    return (
        <>
            <BaseTable
                config={chatsConfig}
                title="Chat Management"
                endpoint="chats"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={false}
                extraActions={[
                    {
                        key: "gifting",
                        label: "Gifting Overview",
                        onClick: () =>
                            message.info("Gifting overview coming soon"),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Chat Details"
                data={selectedChat}
                config={chatViewConfig}
            />
        </>
    );
};
export default Chats;
