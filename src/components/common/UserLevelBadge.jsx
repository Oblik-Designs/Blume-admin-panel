import React from "react";
import { Space, Badge, Tag, Tooltip } from "antd";
import { CrownOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
const UserLevelBadge = ({
    level,
    subscription,
    showSubscription = true,
    size = "default",
    showIcon = true,
}) => {
    const getLevelConfig = (level) => {
        const configs = {
            1: {
                color: "default",
                text: "Newcomer",
                icon: <UserOutlined />,
                description: "New to the platform",
            },
            2: {
                color: "processing",
                text: "Active Member",
                icon: <StarOutlined />,
                description: "Regular participant",
            },
            3: {
                color: "success",
                text: "Elite Member",
                icon: <CrownOutlined />,
                description: "Premium user with full access",
            },
        };
        return configs[level] || configs[1];
    };
    const getSubscriptionConfig = (subscription) => {
        const configs = {
            Plan_1: { color: "default", label: "Basic" },
            Plan_2: { color: "blue", label: "Silver" },
            Plan_3: { color: "gold", label: "Black" },
        };
        return configs[subscription] || configs["Plan_1"];
    };
    const levelConfig = getLevelConfig(level);
    const subConfig = getSubscriptionConfig(subscription);
    return (
        <Space direction="vertical" size="small">
            <Tooltip title={levelConfig.description}>
                <Badge
                    status={levelConfig.color}
                    text={
                        <Space size="small">
                            {showIcon && levelConfig.icon}
                            <span>
                                Level {level} - {levelConfig.text}
                            </span>
                        </Space>
                    }
                />
            </Tooltip>
            {showSubscription && (
                <Tag color={subConfig.color} style={{ margin: 0 }}>
                    {subConfig.label}
                </Tag>
            )}
        </Space>
    );
};
export default UserLevelBadge;
