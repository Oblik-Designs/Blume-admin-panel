import React from "react";
import { Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const ActionsDropdown = ({
    actions = [],
    record,
    size = "small",
    trigger = ["click"],
    placement = "bottomRight",
}) => {
    // Filter out actions that shouldn't be shown based on conditions
    const visibleActions = actions.filter((action) => {
        if (typeof action.visible === "function") {
            return action.visible(record);
        }
        return action.visible !== false;
    });

    // Convert actions to menu items
    const menuItems = visibleActions.map((action, index) => {
        // Handle dividers
        if (action.type === "divider") {
            return {
                type: "divider",
                key: `divider-${index}`,
            };
        }

        return {
            key: action.key || `action-${index}`,
            label: (
                <span
                    style={{
                        color: action.danger ? "#ff4d4f" : undefined,
                        fontWeight: action.primary ? 500 : "normal",
                    }}
                >
                    {action.icon && (
                        <span style={{ marginRight: 8 }}>{action.icon}</span>
                    )}
                    {action.label}
                </span>
            ),
            disabled: action.disabled,
            onClick: ({ domEvent }) => {
                domEvent.stopPropagation();
                if (action.onClick) {
                    action.onClick(record);
                }
            },
        };
    });

    // Don't render if no actions
    if (menuItems.length === 0) {
        return null;
    }

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={trigger}
            placement={placement}
        >
            <Button
                size={size}
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
            >
                Actions
            </Button>
        </Dropdown>
    );
};

export default ActionsDropdown;
