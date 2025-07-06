import React from "react";
import { Tag, Badge } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

const StatusBadge = ({
    status,
    type = "user", // user, plan, application, verification, dispute
    showIcon = true,
    size = "default",
}) => {
    const getStatusConfig = (status, type) => {
        const configs = {
            user: {
                active: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Active",
                },
                inactive: {
                    color: "warning",
                    icon: <ClockCircleOutlined />,
                    label: "Inactive",
                },
                banned: {
                    color: "error",
                    icon: <CloseCircleOutlined />,
                    label: "Banned",
                },
                pending_verification: {
                    color: "processing",
                    icon: <ClockCircleOutlined />,
                    label: "Pending Verification",
                },
            },
            plan: {
                draft: {
                    color: "default",
                    icon: <ClockCircleOutlined />,
                    label: "Draft",
                },
                published: {
                    color: "processing",
                    icon: <ExclamationCircleOutlined />,
                    label: "Published",
                },
                applications_open: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Applications Open",
                },
                applications_closed: {
                    color: "warning",
                    icon: <ClockCircleOutlined />,
                    label: "Applications Closed",
                },
                active: {
                    color: "processing",
                    icon: <ExclamationCircleOutlined />,
                    label: "Active",
                },
                completed: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Completed",
                },
                cancelled: {
                    color: "error",
                    icon: <CloseCircleOutlined />,
                    label: "Cancelled",
                },
            },
            application: {
                pending: {
                    color: "processing",
                    icon: <ClockCircleOutlined />,
                    label: "Pending",
                },
                accepted: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Accepted",
                },
                rejected: {
                    color: "error",
                    icon: <CloseCircleOutlined />,
                    label: "Rejected",
                },
            },
            verification: {
                pending: {
                    color: "processing",
                    icon: <ClockCircleOutlined />,
                    label: "Pending Review",
                },
                approved: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Approved",
                },
                rejected: {
                    color: "error",
                    icon: <CloseCircleOutlined />,
                    label: "Rejected",
                },
                requires_attention: {
                    color: "warning",
                    icon: <ExclamationCircleOutlined />,
                    label: "Requires Attention",
                },
            },
            dispute: {
                open: {
                    color: "error",
                    icon: <ExclamationCircleOutlined />,
                    label: "Open",
                },
                investigating: {
                    color: "processing",
                    icon: <ClockCircleOutlined />,
                    label: "Investigating",
                },
                resolved: {
                    color: "success",
                    icon: <CheckCircleOutlined />,
                    label: "Resolved",
                },
                closed: {
                    color: "default",
                    icon: <CloseCircleOutlined />,
                    label: "Closed",
                },
            },
        };

        return (
            configs[type]?.[status] || {
                color: "default",
                icon: <ClockCircleOutlined />,
                label: status || "Unknown",
            }
        );
    };
    const config = getStatusConfig(status, type);
    return (
        <Badge
            status={config.color}
            text={
                showIcon ? (
                    <span>
                        {config.icon} {config.label}
                    </span>
                ) : (
                    config.label
                )
            }
        />
    );
};
export default StatusBadge;
