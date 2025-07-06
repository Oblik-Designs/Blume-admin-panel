import React, { useState } from "react";
import {
    Space,
    Avatar,
    Typography,
    Button,
    Modal,
    message,
    InputNumber,
    Input,
    Form,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    StopOutlined,
    UserDeleteOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import BaseTable from "../../components/common/BaseTable";
import BaseFormDrawer from "../../components/common/BaseFormDrawer";
import BaseViewDrawer from "../../components/common/BaseViewDrawer";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import UserLevelBadge from "../../components/common/UserLevelBadge";
import StatusBadge from "../../components/common/StatusBadge";
import BlumePointsDisplay from "../../components/common/BlumePointsDisplay";
import {
    USER_STATUS_OPTIONS,
    LEVEL_OPTIONS,
    SUBSCRIPTION_OPTIONS,
} from "../../constants/userStatuses";
import { useAPI } from "../../hooks/useAPI";
import { api } from "../../api";

const { Text } = Typography;

const Users = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [formVisible, setFormVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [walletVisible, setWalletVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { executeRequest } = useAPI();

    const handleView = (record) => {
        console.log("View user:", record);
        setSelectedUser(record);
        setViewVisible(true);
    };

    const handleEdit = (record) => {
        console.log("Edit user:", record);
        setSelectedUser(record);
        setEditMode(true);
        setFormVisible(true);
    };

    const handleDelete = async (record) => {
        console.log("Delete user:", record);
        Modal.confirm({
            title: "Delete User",
            content: `Are you sure you want to delete user "${record.username}"? This action cannot be undone.`,
            okText: "Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(() => api.deleteUser(record.id), {
                        showSuccessMessage: true,
                        successMessage: `User "${record.username}" deleted successfully`,
                    });
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Delete error:", error);
                }
            },
        });
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setEditMode(false);
        setFormVisible(true);
    };

    const handleWalletAdjustment = (record) => {
        setSelectedUser(record);
        setWalletVisible(true);
    };

    const handleBanUser = async (record) => {
        Modal.confirm({
            title: "Ban User",
            content: `Are you sure you want to ban user "${record.username}"?`,
            okText: "Ban",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => api.updateUser(record.id, { status: "banned" }),
                        {
                            showSuccessMessage: true,
                            successMessage: `User "${record.username}" banned successfully`,
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Ban error:", error);
                }
            },
        });
    };

    const handleUnbanUser = async (record) => {
        try {
            await executeRequest(
                () => api.updateUser(record.id, { status: "active" }),
                {
                    showSuccessMessage: true,
                    successMessage: `User "${record.username}" unbanned successfully`,
                }
            );
            setRefreshTrigger(Date.now());
        } catch (error) {
            console.error("Unban error:", error);
        }
    };

    const handleSuspendUser = async (record) => {
        Modal.confirm({
            title: "Suspend User",
            content: `Are you sure you want to suspend user "${record.username}"?`,
            okText: "Suspend",
            okType: "danger",
            onOk: async () => {
                try {
                    await executeRequest(
                        () => api.updateUser(record.id, { status: "inactive" }),
                        {
                            showSuccessMessage: true,
                            successMessage: `User "${record.username}" suspended successfully`,
                        }
                    );
                    setRefreshTrigger(Date.now());
                } catch (error) {
                    console.error("Suspend error:", error);
                }
            },
        });
    };

    const handleResetPassword = (record) => {
        Modal.confirm({
            title: "Reset Password",
            content: `Are you sure you want to reset password for "${record.username}"? They will receive an email with reset instructions.`,
            okText: "Reset Password",
            onOk: () => {
                message.success(`Password reset email sent to ${record.email}`);
            },
        });
    };

    const handleBulkAction = async (action, selectedIds) => {
        if (action === "delete") {
            Modal.confirm({
                title: "Bulk Delete Users",
                content: `Are you sure you want to delete ${selectedIds.length} users? This action cannot be undone.`,
                okText: "Delete",
                okType: "danger",
                onOk: async () => {
                    await executeRequest(
                        () => api.bulkDelete("users", selectedIds),
                        {
                            showSuccessMessage: true,
                            successMessage: `Successfully deleted ${selectedIds.length} users`,
                        }
                    );
                    setRefreshTrigger(Date.now());
                },
            });
        }
    };

    const handleFormSuccess = () => {
        setRefreshTrigger(Date.now());
        setFormVisible(false);
    };

    const handleWalletSubmit = async (values) => {
        try {
            await executeRequest(
                () =>
                    api.adjustUserWallet(
                        selectedUser.id,
                        values.amount,
                        values.reason
                    ),
                {
                    showSuccessMessage: true,
                    successMessage: "Wallet adjustment completed successfully",
                }
            );
            setRefreshTrigger(Date.now());
            setWalletVisible(false);
        } catch (error) {
            console.error("Wallet adjustment error:", error);
        }
    };

    // Define actions for the dropdown
    const getUserActions = (record) => [
        {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: handleView,
            primary: true,
        },
        {
            key: "edit",
            label: "Edit User",
            icon: <EditOutlined />,
            onClick: handleEdit,
        },
        {
            type: "divider",
        },
        {
            key: "wallet",
            label: "Adjust Wallet",
            icon: <WalletOutlined />,
            onClick: handleWalletAdjustment,
        },
        {
            key: "reset-password",
            label: "Reset Password",
            icon: <DollarOutlined />,
            onClick: handleResetPassword,
        },
        {
            type: "divider",
        },
        {
            key: "unban",
            label: "Unban User",
            icon: <CheckCircleOutlined />,
            onClick: handleUnbanUser,
            visible: (record) => record.status === "banned",
        },
        {
            key: "ban",
            label: "Ban User",
            icon: <StopOutlined />,
            onClick: handleBanUser,
            visible: (record) => record.status !== "banned",
            danger: true,
        },
        {
            key: "suspend",
            label: "Suspend User",
            icon: <UserDeleteOutlined />,
            onClick: handleSuspendUser,
            visible: (record) => record.status === "active",
            danger: true,
        },
        {
            type: "divider",
        },
        {
            key: "delete",
            label: "Delete User",
            icon: <DeleteOutlined />,
            onClick: handleDelete,
            danger: true,
        },
    ];

    const usersConfig = {
        name: "users",
        table: {
            columns: [
                {
                    title: "User",
                    key: "user",
                    render: (_, record) => (
                        <Space>
                            <Avatar
                                icon={<UserOutlined />}
                                src={record.profile_image?.[0]}
                                size="large"
                            />
                            <div>
                                <div style={{ fontWeight: 500 }}>
                                    {record.username}
                                </div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    {record.email}
                                </Text>
                            </div>
                        </Space>
                    ),
                    width: 250,
                },
                {
                    title: "Level & Subscription",
                    key: "level",
                    render: (_, record) => (
                        <UserLevelBadge
                            level={record.profile_level}
                            subscription={record.current_subscription}
                        />
                    ),
                    width: 200,
                },
                {
                    title: "Wallet",
                    key: "wallet",
                    render: (_, record) => (
                        <div>
                            <BlumePointsDisplay
                                amount={record.wallet?.blume_points || 0}
                                size="small"
                                showUSD={true}
                            />
                            {record.wallet?.escrow_blume_points > 0 && (
                                <div style={{ marginTop: 4 }}>
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: "11px" }}
                                    >
                                        Escrow:{" "}
                                        {record.wallet.escrow_blume_points} BP
                                    </Text>
                                </div>
                            )}
                        </div>
                    ),
                    width: 150,
                    sorter: true,
                },
                {
                    title: "Activity",
                    key: "activity",
                    render: (_, record) => (
                        <div>
                            <div style={{ fontSize: "12px" }}>
                                Plans: {record.total_plans_joined || 0}
                            </div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                                Hosted: {record.total_plans_hosted || 0}
                            </div>
                        </div>
                    ),
                    width: 100,
                },
                {
                    title: "Verification",
                    key: "verification",
                    render: (_, record) => (
                        <StatusBadge
                            status={record.verification?.status || "pending"}
                            type="verification"
                            showIcon={true}
                        />
                    ),
                    width: 150,
                },
                {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status) => (
                        <StatusBadge status={status} type="user" />
                    ),
                    width: 120,
                    filters: USER_STATUS_OPTIONS.map((opt) => ({
                        text: opt.label,
                        value: opt.value,
                    })),
                },
                {
                    title: "Joined",
                    dataIndex: "created_at",
                    key: "created_at",
                    render: (date) => new Date(date).toLocaleDateString(),
                    width: 120,
                    sorter: true,
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <ActionsDropdown
                            actions={getUserActions(record)}
                            record={record}
                        />
                    ),
                    width: 100,
                    fixed: "right",
                },
            ],
        },
        filters: {
            username: {
                type: "text",
                label: "Username",
                placeholder: "Search by username",
            },
            email: {
                type: "text",
                label: "Email",
                placeholder: "Search by email",
            },
            status: {
                type: "multi-select",
                label: "Status",
                options: USER_STATUS_OPTIONS,
            },
            profile_level: {
                type: "multi-select",
                label: "Level",
                options: LEVEL_OPTIONS,
            },
            current_subscription: {
                type: "multi-select",
                label: "Subscription",
                options: SUBSCRIPTION_OPTIONS,
            },
        },
    };

    const userFormConfig = {
        entityName: "User",
        onSubmit: async (values) => api.createUser(values),
        onUpdate: async (id, values) => api.updateUser(id, values),
        sections: [
            {
                title: "Basic Information",
                fields: [
                    {
                        name: "username",
                        label: "Username",
                        type: "text",
                        required: true,
                        rules: [
                            {
                                min: 3,
                                message:
                                    "Username must be at least 3 characters",
                            },
                            {
                                max: 20,
                                message:
                                    "Username must be less than 20 characters",
                            },
                        ],
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                        required: true,
                        rules: [
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ],
                    },
                    {
                        name: "phone",
                        label: "Phone",
                        type: "text",
                        placeholder: "+1234567890",
                    },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        required: true,
                        options: USER_STATUS_OPTIONS,
                    },
                ],
            },
            {
                title: "Profile Information",
                fields: [
                    {
                        name: "bio",
                        label: "Bio",
                        type: "textarea",
                        rows: 3,
                        span: 24,
                    },
                    {
                        name: "gender",
                        label: "Gender",
                        type: "select",
                        options: [
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "other", label: "Other" },
                        ],
                    },
                    {
                        name: "profile_level",
                        label: "Profile Level",
                        type: "select",
                        required: true,
                        options: LEVEL_OPTIONS,
                    },
                    {
                        name: "current_subscription",
                        label: "Subscription",
                        type: "select",
                        required: true,
                        options: SUBSCRIPTION_OPTIONS,
                    },
                ],
            },
            {
                title: "Address",
                fields: [
                    {
                        name: "address",
                        label: "Address",
                        type: "address",
                        span: 24,
                    },
                ],
            },
        ],
    };

    const userViewConfig = {
        sections: [
            {
                title: "Basic Information",
                columns: 2,
                fields: [
                    { key: "username", label: "Username" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                    {
                        key: "status",
                        label: "Status",
                        type: "status",
                        statusType: "user",
                    },
                    { key: "created_at", label: "Joined", type: "date" },
                    {
                        key: "last_active",
                        label: "Last Active",
                        type: "datetime",
                    },
                ],
            },
            {
                title: "Profile & Level",
                columns: 2,
                fields: [
                    {
                        key: "profile_level",
                        label: "Level & Subscription",
                        type: "user-level",
                    },
                    { key: "profile_points", label: "Profile Points" },
                    { key: "total_plans_joined", label: "Plans Joined" },
                    { key: "total_plans_hosted", label: "Plans Hosted" },
                    { key: "total_reviews", label: "Total Reviews" },
                    {
                        key: "verification.status",
                        label: "Verification",
                        type: "status",
                        statusType: "verification",
                    },
                ],
            },
            {
                title: "Wallet Information",
                columns: 2,
                fields: [
                    {
                        key: "wallet.blume_points",
                        label: "Available BP",
                        type: "blumepoints",
                    },
                    {
                        key: "wallet.escrow_blume_points",
                        label: "Escrow BP",
                        type: "blumepoints",
                    },
                    {
                        key: "total_bp_spent",
                        label: "Total BP Spent",
                        type: "blumepoints",
                    },
                ],
            },
            {
                title: "Address",
                columns: 1,
                fields: [{ key: "address", label: "Address", type: "address" }],
            },
        ],
    };

    return (
        <>
            <BaseTable
                config={usersConfig}
                title="User Management"
                endpoint="users"
                onCreate={handleCreate}
                onBulkAction={handleBulkAction}
                refreshTrigger={refreshTrigger}
                extraActions={[
                    {
                        key: "verification",
                        label: "Verification Queue",
                        onClick: () =>
                            message.info("Verification queue coming in Step 6"),
                    },
                ]}
            />

            <BaseFormDrawer
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                title="User"
                config={userFormConfig}
                mode={editMode ? "edit" : "create"}
                initialValues={editMode ? selectedUser : {}}
                onSuccess={handleFormSuccess}
            />

            <BaseViewDrawer
                visible={viewVisible}
                onClose={() => setViewVisible(false)}
                title={`User: ${selectedUser?.username}`}
                data={selectedUser}
                config={userViewConfig}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                title="Adjust User Wallet"
                open={walletVisible}
                onCancel={() => setWalletVisible(false)}
                footer={null}
            >
                <Form onFinish={handleWalletSubmit} layout="vertical">
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Current Balance: </Text>
                        <BlumePointsDisplay
                            amount={selectedUser?.wallet?.blume_points || 0}
                        />
                    </div>
                    <Form.Item
                        name="amount"
                        label="Adjustment Amount"
                        rules={[
                            { required: true, message: "Please enter amount" },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Enter amount (positive to add, negative to subtract)"
                            formatter={(value) => `${value} BP`}
                            parser={(value) => value.replace(" BP", "")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="reason"
                        label="Reason"
                        rules={[
                            { required: true, message: "Please enter reason" },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter reason for adjustment"
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
        </>
    );
};

export default Users;
