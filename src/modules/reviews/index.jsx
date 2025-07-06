import React, { useState } from "react";
import { Space, Typography, Button, Modal, message, Rate, Avatar } from "antd";
import {
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    FlagOutlined,
    UserOutlined,
    StarOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import StatusBadge from "../../components/common/StatusBadge";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";
const { Text } = Typography;
const Reviews = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [viewVisible, setViewVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const { executeRequest } = useAPI();
    const handleView = (record) => {
        setSelectedReview(record);
        setViewVisible(true);
    };
    const handleApprove = async (record) => {
        try {
            await executeRequest(
                () => api.moderateReview(record.id, "approved"),
                {
                    showSuccessMessage: true,
                    successMessage: "Review approved successfully",
                }
            );
            setRefreshTrigger(Date.now());
        } catch (error) {
            console.error("Approve error:", error);
        }
    };
    const handleFlag = async (record) => {
        Modal.confirm({
            title: "Flag Review",
            content:
                "Are you sure you want to flag this review as inappropriate?",
            okText: "Flag",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => api.moderateReview(record.id, "flagged"),
                        {
                            showSuccessMessage: true,
                            successMessage: "Review flagged successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Flag error:", error);
                }
            },
        });
    };
    const handleDelete = async (record) => {
        Modal.confirm({
            title: "Delete Review",
            content: "Are you sure you want to permanently delete this review?",
            okText: "Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => Promise.resolve({ success: true }),
                        {
                            showSuccessMessage: true,
                            successMessage: "Review deleted successfully",
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Delete error:", error);
                }
            },
        });
    };
    const reviewsConfig = {
        name: "reviews",
        table: {
            columns: [
                {
                    title: "Review Details",
                    key: "details",
                    render: (_, record) => (
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <div>
                                <div style={{ marginBottom: 4 }}>
                                    <Rate
                                        disabled
                                        value={record.rating}
                                        style={{ fontSize: "14px" }}
                                    />
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Plan #{record.plan_id?.slice(-6)}
                                </Text>
                            </div>
                        </Space>
                    ),
                    width: 200,
                },
                {
                    title: "Review Text",
                    key: "review_text",
                    render: (_, record) => (
                        <div style={{ maxWidth: 300 }}>
                            <Text ellipsis>{record.review_text}</Text>
                        </div>
                    ),
                    width: 320,
                },
                {
                    title: "Trait Ratings",
                    key: "traits",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontSize: "11px", marginBottom: 2 }}>
                                <span style={{ color: "#666" }}>Polite:</span>{" "}
                                {record.traits?.polite || 0}/5
                            </div>
                            <div style={{ fontSize: "11px", marginBottom: 2 }}>
                                <span style={{ color: "#666" }}>Funny:</span>{" "}
                                {record.traits?.funny || 0}/5
                            </div>
                            <div style={{ fontSize: "11px", marginBottom: 2 }}>
                                <span style={{ color: "#666" }}>Reliable:</span>{" "}
                                {record.traits?.reliable || 0}/5
                            </div>
                            <div style={{ fontSize: "11px" }}>
                                <span style={{ color: "#666" }}>
                                    Charismatic:
                                </span>{" "}
                                {record.traits?.charismatic || 0}/5
                            </div>
                        </div>
                    ),
                    width: 120,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="review" />
                    ),
                    width: 120,
                    filters: [
                        { text: "Pending", value: "pending" },
                        { text: "Approved", value: "approved" },
                        { text: "Flagged", value: "flagged" },
                    ],
                },
                {
                    title: "Date",
                    dataIndex: "created_at",
                    key: "created_at",
                    render: (date) => new Date(date).toLocaleDateString(),
                    width: 100,
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
                            {record.status === "pending" && (
                                <Button
                                    icon={<CheckOutlined />}
                                    size="small"
                                    type="primary"
                                    ghost
                                    onClick={() => handleApprove(record)}
                                />
                            )}
                            {record.status !== "flagged" && (
                                <Button
                                    icon={<FlagOutlined />}
                                    size="small"
                                    danger
                                    onClick={() => handleFlag(record)}
                                />
                            )}
                            <Button
                                icon={<CloseOutlined />}
                                size="small"
                                danger
                                onClick={() => handleDelete(record)}
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
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "flagged", label: "Flagged" },
                ],
            },
            rating: {
                type: "multi-select",
                label: "Rating",
                options: [
                    { value: 5, label: "5 Stars" },
                    { value: 4, label: "4 Stars" },
                    { value: 3, label: "3 Stars" },
                    { value: 2, label: "2 Stars" },
                    { value: 1, label: "1 Star" },
                ],
            },
        },
    };
    const reviewViewConfig = {
        sections: [
            {
                title: "Review Information",
                columns: 2,
                fields: [
                    { key: "id", label: "Review ID" },
                    { key: "rating", label: "Overall Rating" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "review",
                    },
                    { key: "created_at", label: "Created", type: "datetime" },
                ],
            },
            {
                title: "Review Content",
                columns: 1,
                fields: [{ key: "review_text", label: "Review Text" }],
            },
            {
                title: "Trait Ratings",
                columns: 2,
                fields: [
                    { key: "traits.polite", label: "Polite" },
                    { key: "traits.funny", label: "Funny" },
                    { key: "traits.reliable", label: "Reliable" },
                    { key: "traits.charismatic", label: "Charismatic" },
                ],
            },
        ],
    };
    return (
        <>
            <BaseTable
                config={reviewsConfig}
                title="Review Management"
                endpoint="reviews"
                onRowClick={handleView}
                refreshTrigger={refreshTrigger}
                showBulkActions={true}
                extraActions={[
                    {
                        key: "analytics",
                        label: "Review Analytics",
                        onClick: () =>
                            message.info("Review analytics coming in Phase 4"),
                    },
                ]}
            />
            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title="Review Details"
                data={selectedReview}
                config={reviewViewConfig}
            />
        </>
    );
};
export default Reviews;
