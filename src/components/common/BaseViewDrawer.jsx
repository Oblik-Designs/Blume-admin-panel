import React from "react";
import {
    Drawer,
    Descriptions,
    Space,
    Button,
    Tag,
    Avatar,
    Typography,
    Divider,
    Row,
    Col,
    Image,
    Empty,
} from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import BlumePointsDisplay from "./BlumePointsDisplay";
import UserLevelBadge from "./UserLevelBadge";
import StatusBadge from "./StatusBadge";
import PlanTypeBadge from "./PlanTypeBadge";

const { Text, Title } = Typography;

const BaseViewDrawer = ({
    visible,
    onClose,
    title,
    data,
    config,
    onEdit,
    onDelete,
    width = 720,
}) => {
    // ✅ Add null check for data
    if (!data) {
        return (
            <Drawer
                title={title}
                width={width}
                onClose={onClose}
                open={visible}
            >
                <Empty description="No data available" />
            </Drawer>
        );
    }

    const formatValue = (value, field) => {
        // ✅ Add comprehensive null checks
        if (value === null || value === undefined) return "-";

        switch (field.type) {
            case "blumepoints":
                return <BlumePointsDisplay amount={value} />;
            case "user-level":
                return (
                    <UserLevelBadge
                        level={data?.profile_level || 1}
                        subscription={data?.current_subscription || "Plan_1"}
                    />
                );
            case "status":
                return (
                    <StatusBadge
                        status={value}
                        type={field.statusType || "user"}
                    />
                );
            case "plan-type":
                return <PlanTypeBadge type={value} />;
            case "date":
                return value ? new Date(value).toLocaleDateString() : "-";
            case "datetime":
                return value ? new Date(value).toLocaleString() : "-";
            case "time":
                return value
                    ? new Date(value).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-";
            case "array":
                if (Array.isArray(value)) {
                    return value.map((item, index) => (
                        <Tag key={index}>{item}</Tag>
                    ));
                }
                return "-";
            case "avatar":
                return <Avatar size={64} src={value} icon={<UserOutlined />} />;
            case "image":
                return value ? <Image src={value} width={100} /> : "-";
            case "images":
                if (Array.isArray(value) && value.length > 0) {
                    return (
                        <Space wrap>
                            {value.map((img, index) => (
                                <Image key={index} src={img} width={60} />
                            ))}
                        </Space>
                    );
                }
                return "-";
            case "address":
                if (typeof value === "object" && value) {
                    return (
                        <div>
                            <div>{value.street || ""}</div>
                            <div>
                                {value.city || ""}, {value.state || ""}{" "}
                                {value.zip || ""}
                            </div>
                            <div>{value.country || ""}</div>
                        </div>
                    );
                }
                return value || "-";
            case "boolean":
                return value ? (
                    <Tag color="green">Yes</Tag>
                ) : (
                    <Tag color="red">No</Tag>
                );
            case "percentage":
                return `${value}%`;
            case "currency":
                return `$${Number(value).toFixed(2)}`;
            default:
                return String(value);
        }
    };

    const getNestedValue = (obj, path) => {
        // ✅ Safe nested property access
        if (!obj || !path) return null;

        return path.split(".").reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    };

    const renderSection = (section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
            {section.title && (
                <Title level={5} style={{ marginBottom: 16 }}>
                    {section.title}
                </Title>
            )}
            <Descriptions bordered size="small" column={section.columns || 1}>
                {section.fields?.map((field) => {
                    // ✅ Safe field value extraction
                    const fieldValue = getNestedValue(data, field.key);

                    return (
                        <Descriptions.Item
                            key={field.key}
                            label={field.label}
                            span={field.span || 1}
                        >
                            {formatValue(fieldValue, field)}
                        </Descriptions.Item>
                    );
                })}
            </Descriptions>
        </div>
    );

    return (
        <Drawer
            title={title}
            width={width}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Space>
                        {onEdit && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => onEdit(data)}
                            >
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(data)}
                            >
                                Delete
                            </Button>
                        )}
                        <Button onClick={onClose}>Close</Button>
                    </Space>
                </div>
            }
        >
            {config?.sections ? (
                config.sections.map(renderSection)
            ) : (
                <Descriptions bordered size="small">
                    {config?.fields?.map((field) => {
                        const fieldValue = getNestedValue(data, field.key);
                        return (
                            <Descriptions.Item
                                key={field.key}
                                label={field.label}
                            >
                                {formatValue(fieldValue, field)}
                            </Descriptions.Item>
                        );
                    })}
                </Descriptions>
            )}
        </Drawer>
    );
};

export default BaseViewDrawer;
