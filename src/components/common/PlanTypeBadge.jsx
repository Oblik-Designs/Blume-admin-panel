import React from "react";
import { Tag, Tooltip } from "antd";
import {
    GiftOutlined,
    DollarOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
const PlanTypeBadge = ({ type, showIcon = true, size = "default" }) => {
    const getTypeConfig = (type) => {
        const configs = {
            1: {
                label: "Host Pays",
                color: "purple",
                icon: <GiftOutlined />,
                description: "Host compensates participants for attending",
            },
            2: {
                label: "Joiners Pay",
                color: "blue",
                icon: <DollarOutlined />,
                description: "Participants pay host for the experience",
            },
            3: {
                label: "Bidding",
                color: "gold",
                icon: <TrophyOutlined />,
                description: "Users bid BeensPoints for exclusive spots",
            },
        };
        return configs[type] || configs[2];
    };
    const config = getTypeConfig(type);
    return (
        <Tooltip title={config.description}>
            <Tag
                color={config.color}
                style={{
                    fontSize: size === "small" ? "11px" : "12px",
                    marginRight: 0,
                }}
            >
                {showIcon && config.icon} {config.label}
            </Tag>
        </Tooltip>
    );
};
export default PlanTypeBadge;
