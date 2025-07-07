import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Checkbox,
    Tag,
    Space,
    message,
    Typography,
    Divider,
    Alert,
} from "antd";
import {
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    KeyOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import { PERMISSION_MODULES } from "../../constants/permissionModules";
import { DEFAULT_ADMIN_PERMISSIONS } from "../../constants/permissions";
const { Option } = Select;
const { Text, Title } = Typography;
const PermissionsManagement = () => {
    const [permissions, setPermissions] = useState(DEFAULT_ADMIN_PERMISSIONS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [form] = Form.useForm();
    const handleSaveRole = async (values) => {
        const rolePermissions = {};
        Object.keys(PERMISSION_MODULES).forEach((module) => {
            rolePermissions[module] = values[module] || [];
        });
        setPermissions((prev) => ({
            ...prev,
            [values.role_name]: rolePermissions,
        }));
        message.success("Role permissions updated successfully");
        setModalVisible(false);
        form.resetFields();
        setEditingRole(null);
    };
    const handleEditRole = (roleName) => {
        setEditingRole(roleName);
        const roleData = {
            role_name: roleName,
            ...permissions[roleName],
        };
        form.setFieldsValue(roleData);
        setModalVisible(true);
    };
    const handleDeleteRole = (roleName) => {
        if (["super_admin", "support_admin", "kyc_admin"].includes(roleName)) {
            message.error("Cannot delete default system roles");
            return;
        }
        Modal.confirm({
            title: "Delete Role",
            content: `Are you sure you want to delete the role "${roleName}"?`,
            onOk: () => {
                const newPermissions = { ...permissions };
                delete newPermissions[roleName];
                setPermissions(newPermissions);
                message.success("Role deleted successfully");
            },
        });
    };
    const roleColumns = [
        {
            title: "Role Name",
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <Space>
                    <KeyOutlined />
                    <Text strong>{name.replace("_", " ").toUpperCase()}</Text>
                </Space>
            ),
        },
        {
            title: "Permissions Count",
            key: "permissions",
            render: (_, record) => {
                const totalPermissions = Object.values(
                    permissions[record.key] || {}
                ).reduce((sum, perms) => sum + (perms?.length || 0), 0);
                return <Tag color="blue">{totalPermissions} permissions</Tag>;
            },
        },
        {
            title: "Modules Access",
            key: "modules",
            render: (_, record) => {
                const accessibleModules = Object.entries(
                    permissions[record.key] || {}
                )
                    .filter(([_, perms]) => perms?.length > 0)
                    .map(([module]) => module);
                return (
                    <div>
                        {accessibleModules.slice(0, 3).map((module) => (
                            <Tag key={module} size="small">
                                {PERMISSION_MODULES[module]?.name}
                            </Tag>
                        ))}
                        {accessibleModules.length > 3 && (
                            <Tag size="small">
                                +{accessibleModules.length - 3} more
                            </Tag>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditRole(record.key)}
                    >
                        Edit
                    </Button>
                    {!["super_admin", "support_admin", "kyc_admin"].includes(
                        record.key
                    ) && (
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => handleDeleteRole(record.key)}
                        >
                            Delete
                        </Button>
                    )}
                </Space>
            ),
        },
    ];
    const roleData = Object.keys(permissions).map((key) => ({
        key,
        name: key,
    }));
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>Permissions Management</Title>
                <Text type="secondary">
                    Manage admin roles and their permissions across different
                    modules
                </Text>
            </div>
            <Alert
                message="Permission Management"
                description="Configure role-based access control for admin users. Each role can have different permissions across various modules like content moderation, user management, and more."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />
            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => {
                            setEditingRole(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        Create New Role
                    </Button>
                </div>
                <Table
                    columns={roleColumns}
                    dataSource={roleData}
                    pagination={false}
                />
            </Card>
            <Modal
                title={
                    editingRole
                        ? `Edit Role: ${editingRole}`
                        : "Create New Role"
                }
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingRole(null);
                    form.resetFields();
                }}
                footer={null}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveRole}>
                    <Form.Item
                        name="role_name"
                        label="Role Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter role name",
                            },
                        ]}
                    >
                        <Input
                            placeholder="e.g., content_moderator"
                            disabled={!!editingRole}
                        />
                    </Form.Item>
                    <Divider>Module Permissions</Divider>
                    <Row gutter={[16, 16]}>
                        {Object.entries(PERMISSION_MODULES).map(
                            ([moduleKey, module]) => (
                                <Col span={12} key={moduleKey}>
                                    <Card size="small" title={module.name}>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: "12px",
                                                display: "block",
                                                marginBottom: 12,
                                            }}
                                        >
                                            {module.description}
                                        </Text>
                                        <Form.Item
                                            name={moduleKey}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Checkbox.Group
                                                style={{ width: "100%" }}
                                            >
                                                <Space
                                                    direction="vertical"
                                                    style={{ width: "100%" }}
                                                >
                                                    {module.actions.map(
                                                        (action) => (
                                                            <Checkbox
                                                                key={action.key}
                                                                value={
                                                                    action.key
                                                                }
                                                            >
                                                                <div>
                                                                    <Text
                                                                        style={{
                                                                            fontSize:
                                                                                "13px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            action.label
                                                                        }
                                                                    </Text>
                                                                    <br />
                                                                    <Text
                                                                        type="secondary"
                                                                        style={{
                                                                            fontSize:
                                                                                "11px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            action.description
                                                                        }
                                                                    </Text>
                                                                </div>
                                                            </Checkbox>
                                                        )
                                                    )}
                                                </Space>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </Card>
                                </Col>
                            )
                        )}
                    </Row>
                    <div style={{ marginTop: 24, textAlign: "right" }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingRole ? "Update Role" : "Create Role"}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
export default PermissionsManagement;
