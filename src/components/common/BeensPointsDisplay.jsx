import React from "react";
import { Space, Typography, Tooltip } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
const { Text } = Typography;
const BeensPointsDisplay = ({
    amount,
    showUSD = true,
    size = "default",
    showIcon = false,
    prefix = "",
    suffix = "",
    style = {},
}) => {
    const formatAmount = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value?.toLocaleString() || "0";
    };
    const usdValue = amount ? (amount / 1000).toFixed(2) : "0.00";
    const fontSize = {
        small: "12px",
        default: "14px",
        large: "16px",
    }[size];
    const iconSize = {
        small: 12,
        default: 14,
        large: 16,
    }[size];
    return (
        <Space size="small" style={style}>
            {showIcon && (
                <TrophyOutlined
                    style={{
                        color: "#722ed1",
                        fontSize: iconSize,
                    }}
                />
            )}
            <Text
                strong
                style={{
                    color: "#722ed1",
                    fontSize,
                }}
            >
                {prefix}
                {formatAmount(amount)} BP{suffix}
            </Text>
            {showUSD && amount > 0 && (
                <Tooltip title={`${amount?.toLocaleString()} BeensPoints`}>
                    <Text
                        type="secondary"
                        style={{
                            fontSize: size === "small" ? "11px" : "12px",
                        }}
                    >
                        (${usdValue})
                    </Text>
                </Tooltip>
            )}
        </Space>
    );
};
export default BeensPointsDisplay;
