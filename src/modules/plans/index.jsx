import React, { useState } from "react";
import { Space, Typography, Button, Modal, message, Tag } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
    CalendarOutlined,
    StopOutlined,
    PlayCircleOutlined,
    CopyOutlined,
    UserOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseFormDrawer from "../../components/common/BaseFormDrawer";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import PlanTypeBadge from "../../components/common/PlanTypeBadge";
import StatusBadge from "../../components/common/StatusBadge";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import { PLAN_STATUS_OPTIONS } from "../../constants/planTypes";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";

const { Text } = Typography;

const Plans = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [formVisible, setFormVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { executeRequest } = useAPI();

    const handleView = (record) => {
        setSelectedPlan(record);
        setViewVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedPlan(record);
        setEditMode(true);
        setFormVisible(true);
    };

    const handleDelete = async (record) => {
        Modal.confirm({
            title: "Delete Plan",
            content: `Are you sure you want to delete plan "${record.title}"? This action cannot be undone.`,
            okText: "Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(() => api.deletePlan(record.id), {
                        showSuccessMessage: true,
                        successMessage: `Plan "${record.title}" deleted successfully`,
                    });
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Delete error:", error);
                }
            },
        });
    };

    const handleCreateSponsoredPlan = () => {
        setSelectedPlan(null);
        setEditMode(false);
        setFormVisible(true);
    };

    const handleCancelPlan = async (record) => {
        Modal.confirm({
            title: "Cancel Plan",
            content: `Are you sure you want to cancel plan "${record.title}"? Participants will be refunded.`,
            okText: "Cancel Plan",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () =>
                            api.updatePlan(record.id, { status: "cancelled" }),
                        {
                            showSuccessMessage: true,
                            successMessage: `Plan "${record.title}" cancelled successfully`,
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Cancel error:", error);
                }
            },
        });
    };

    const handleActivatePlan = async (record) => {
        try {
            await executeRequest(
                () => api.updatePlan(record.id, { status: "active" }),
                {
                    showSuccessMessage: true,
                    successMessage: `Plan "${record.title}" activated successfully`,
                }
            );
            setRefreshTrigger(Date.now());
        } catch (error) {
            console.error("Activate error:", error);
        }
    };

    const handlePublishPlan = async (record) => {
        try {
            await executeRequest(
                () => api.updatePlan(record.id, { status: "published" }),
                {
                    showSuccessMessage: true,
                    successMessage: `Plan "${record.title}" published successfully`,
                }
            );
            setRefreshTrigger(Date.now());
        } catch (error) {
            console.error("Publish error:", error);
        }
    };

    const handleDuplicatePlan = (record) => {
        message.info(
            `Duplicating plan "${record.title}" - Feature coming soon`
        );
    };

    const handleViewParticipants = (record) => {
        message.info(
            `View participants for "${record.title}" - Feature coming soon`
        );
    };

    const handleManageApplications = (record) => {
        message.info(
            `Manage applications for "${record.title}" - Feature coming soon`
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleString();
    };

    // Define actions for the dropdown
    const getPlanActions = (record) => [
        {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: handleView,
            primary: true,
        },
        {
            key: "edit",
            label: "Edit Plan",
            icon: <EditOutlined />,
            onClick: handleEdit,
        },
        {
            key: "duplicate",
            label: "Duplicate Plan",
            icon: <CopyOutlined />,
            onClick: handleDuplicatePlan,
        },
        {
            type: "divider",
        },
        {
            key: "participants",
            label: "View Participants",
            icon: <UserOutlined />,
            onClick: handleViewParticipants,
            visible: (record) => record.current_participants > 0,
        },
        {
            key: "applications",
            label: "Manage Applications",
            icon: <CalendarOutlined />,
            onClick: handleManageApplications,
            visible: (record) =>
                ["published", "applications_open"].includes(record.status),
        },
        {
            type: "divider",
        },
        {
            key: "publish",
            label: "Publish Plan",
            icon: <PlayCircleOutlined />,
            onClick: handlePublishPlan,
            visible: (record) => record.status === "draft",
        },
        {
            key: "activate",
            label: "Activate Plan",
            icon: <PlayCircleOutlined />,
            onClick: handleActivatePlan,
            visible: (record) => record.status === "published",
        },
        {
            key: "cancel",
            label: "Cancel Plan",
            icon: <StopOutlined />,
            onClick: handleCancelPlan,
            visible: (record) =>
                ["published", "active"].includes(record.status),
            danger: true,
        },
        {
            type: "divider",
        },
        {
            key: "delete",
            label: "Delete Plan",
            icon: <DeleteOutlined />,
            onClick: handleDelete,
            danger: true,
        },
    ];

    const plansConfig = {
        name: "plans",
        table: {
            columns: [
                {
                    title: "Plan Details",
                    key: "details",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                {record.title}
                            </div>
                            <Space>
                                <PlanTypeBadge type={record.type} />
                                {record.is_sponsored && (
                                    <Tag
                                        color="gold"
                                        style={{ fontSize: "10px" }}
                                    >
                                        SPONSORED
                                    </Tag>
                                )}
                            </Space>
                            {record.sponsor_info && (
                                <div
                                    style={{
                                        fontSize: "11px",
                                        color: "#666",
                                        marginTop: 2,
                                    }}
                                >
                                    Sponsor: {record.sponsor_info}
                                </div>
                            )}
                        </div>
                    ),
                    width: 300,
                },
                {
                    title: "Schedule",
                    key: "schedule",
                    render: (_, record) => (
                        <div>
                            <div>{formatDate(record.start_date)}</div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {formatTime(record.start_date)} -{" "}
                                {formatTime(record.end_time)}
                            </Text>
                        </div>
                    ),
                    width: 140,
                    sorter: true,
                },
                {
                    title: "Location",
                    key: "location",
                    render: (_, record) => (
                        <div style={{ fontSize: "12px" }}>
                            <div>{record.location?.city}</div>
                            <Text type="secondary">
                                {record.location?.state}
                            </Text>
                        </div>
                    ),
                    width: 100,
                },
                {
                    title: "Participants",
                    key: "participants",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontWeight: 500 }}>
                                {record.current_participants || 0}/
                                {record.max_participants}
                            </div>
                            {record.min_bp_per_participant && (
                                <BlumePointsDisplay
                                    amount={record.min_bp_per_participant}
                                    size="small"
                                    showUSD={false}
                                />
                            )}
                        </div>
                    ),
                    width: 120,
                },
                {
                    title: "Revenue",
                    key: "revenue",
                    render: (_, record) => (
                        <div>
                            {record.total_revenue_bp > 0 ? (
                                <BlumePointsDisplay
                                    amount={record.total_revenue_bp}
                                    size="small"
                                />
                            ) : (
                                <Text type="secondary">No revenue</Text>
                            )}
                        </div>
                    ),
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Applications",
                    key: "applications",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontSize: "12px" }}>
                                Total: {record.total_applications || 0}
                            </div>
                            {record.avg_rating && (
                                <div
                                    style={{ fontSize: "11px", color: "#666" }}
                                >
                                    Rating: {record.avg_rating.toFixed(1)}/5
                                </div>
                            )}
                        </div>
                    ),
                    width: 100,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="plan" />
                    ),
                    width: 150,
                    filters: PLAN_STATUS_OPTIONS.map((opt) => ({
                        text: opt.label,
                        value: opt.value,
                    })),
                },
                {
                    title: "Created",
                    dataIndex: "created_at",
                    key: "created_at",
                    render: (date) => formatDate(date),
                    width: 100,
                    sorter: true,
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <ActionsDropdown
                            actions={getPlanActions(record)}
                            record={record}
                        />
                    ),
                    width: 100,
                    fixed: "right",
                },
            ],
        },
        filters: {
            title: {
                type: "text",
                label: "Title",
                placeholder: "Search by plan title",
            },
            type: {
                type: "multi-select",
                label: "Type",
                options: [
                    { value: 1, label: "Host Pays Joiners" },
                    { value: 2, label: "Joiners Pay Host" },
                    { value: 3, label: "Bidding Plan" },
                ],
            },
            status: {
                type: "multi-select",
                label: "Status",
                options: PLAN_STATUS_OPTIONS,
            },
            "location.city": {
                type: "text",
                label: "City",
                placeholder: "Search by city",
            },
        },
    };

    const planFormConfig = {
        entityName: "Plan",
        onSubmit: async (values) => {
            const planData = {
                ...values,
                type: 2,
                is_sponsored: true,
                view_mode: "public",
                status: "published",
            };
            return api.createPlan(planData);
        },
        onUpdate: async (id, values) => api.updatePlan(id, values),
        sections: [
            {
                title: "Basic Information",
                fields: [
                    {
                        name: "title",
                        label: "Plan Title",
                        type: "text",
                        required: true,
                        span: 24,
                        placeholder: "e.g., Nike Running Workshop",
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        required: true,
                        span: 24,
                        rows: 4,
                        placeholder:
                            "Describe what participants will experience...",
                    },
                    {
                        name: "sponsor_info",
                        label: "Sponsor Information",
                        type: "text",
                        span: 24,
                        placeholder: "e.g., Nike, Adidas, etc.",
                    },
                ],
            },
            {
                title: "Schedule & Location",
                fields: [
                    {
                        name: "start_date",
                        label: "Start Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "start_time",
                        label: "Start Time",
                        type: "time",
                        required: true,
                    },
                    {
                        name: "end_time",
                        label: "End Time",
                        type: "time",
                        required: true,
                    },
                    {
                        name: "application_close_date",
                        label: "Application Deadline",
                        type: "datetime",
                    },
                    {
                        name: "location",
                        label: "Location",
                        type: "address",
                        required: true,
                        span: 24,
                    },
                ],
            },
            {
                title: "Participation Details",
                fields: [
                    {
                        name: "max_participants",
                        label: "Maximum Participants",
                        type: "number",
                        required: true,
                        min: 1,
                        max: 50,
                    },
                    {
                        name: "min_bp_per_participant",
                        label: "Cost per Participant",
                        type: "blumepoints",
                        required: true,
                        help: "Amount each participant will pay in BlumePoints",
                    },
                    {
                        name: "min_age",
                        label: "Minimum Age",
                        type: "number",
                        min: 18,
                        max: 100,
                    },
                    {
                        name: "max_age",
                        label: "Maximum Age",
                        type: "number",
                        min: 18,
                        max: 100,
                    },
                    {
                        name: "gender",
                        label: "Gender Preference",
                        type: "multi-select",
                        options: [
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                        ],
                        help: "Leave empty for no gender restriction",
                    },
                    {
                        name: "min_profile_level",
                        label: "Minimum Profile Level",
                        type: "select",
                        options: [
                            { value: 1, label: "Level 1 - Newcomer" },
                            { value: 2, label: "Level 2 - Active Member" },
                            { value: 3, label: "Level 3 - Elite Member" },
                        ],
                    },
                ],
            },
        ],
    };

    const planViewConfig = {
        sections: [
            {
                title: "Plan Information",
                columns: 2,
                fields: [
                    { key: "title", label: "Title" },
                    { key: "type", label: "Type", type: "plan-type" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "plan",
                    },
                    {
                        key: "is_sponsored",
                        label: "Sponsored",
                        type: "boolean",
                    },
                    { key: "sponsor_info", label: "Sponsor" },
                    { key: "view_mode", label: "Visibility" },
                ],
            },
            {
                title: "Description",
                columns: 1,
                fields: [{ key: "description", label: "Description" }],
            },
            {
                title: "Schedule",
                columns: 2,
                fields: [
                    { key: "start_date", label: "Start Date", type: "date" },
                    { key: "start_time", label: "Start Time", type: "time" },
                    { key: "end_time", label: "End Time", type: "time" },
                    {
                        key: "application_close_date",
                        label: "Application Deadline",
                        type: "datetime",
                    },
                ],
            },
            {
                title: "Location",
                columns: 1,
                fields: [
                    { key: "location", label: "Address", type: "address" },
                ],
            },
            {
                title: "Participation",
                columns: 2,
                fields: [
                    { key: "max_participants", label: "Max Participants" },
                    {
                        key: "current_participants",
                        label: "Current Participants",
                    },
                    {
                        key: "min_bp_per_participant",
                        label: "Cost per Participant",
                        type: "blumepoints",
                    },
                    { key: "total_applications", label: "Total Applications" },
                    { key: "min_age", label: "Min Age" },
                    { key: "max_age", label: "Max Age" },
                    {
                        key: "gender",
                        label: "Gender Preference",
                        type: "array",
                    },
                    { key: "min_profile_level", label: "Min Profile Level" },
                ],
            },
            {
                title: "Performance",
                columns: 2,
                fields: [
                    {
                        key: "total_revenue_bp",
                        label: "Total Revenue",
                        type: "blumepoints",
                    },
                    { key: "avg_rating", label: "Average Rating" },
                    { key: "created_at", label: "Created", type: "datetime" },
                    {
                        key: "updated_at",
                        label: "Last Updated",
                        type: "datetime",
                    },
                ],
            },
        ],
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(Date.now());
        setFormVisible(false);
    };

    return (
        <>
            <BaseTable
                config={plansConfig}
                title="Plan Management"
                endpoint="plans"
                onCreate={handleCreateSponsoredPlan}
                refreshTrigger={refreshTrigger}
                extraActions={[
                    {
                        key: "sponsored",
                        icon: <PlusOutlined />,
                        label: "Create Sponsored Plan",
                        type: "primary",
                        onClick: handleCreateSponsoredPlan,
                    },
                ]}
            />

            <BaseFormDrawer
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                title="Sponsored Plan"
                config={planFormConfig}
                mode={editMode ? "edit" : "create"}
                initialValues={editMode ? selectedPlan : {}}
                onSuccess={handleFormSuccess}
                width={800}
            />

            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title={`Plan: ${selectedPlan?.title}`}
                data={selectedPlan}
                config={planViewConfig}
                onEdit={handleEdit}
                onDelete={handleDelete}
                width={800}
            />
        </>
    );
};

export default Plans;
