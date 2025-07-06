import React from "react";
import {
    Table,
    Card,
    Space,
    Button,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Tooltip,
    Dropdown,
    message,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    DownloadOutlined,
    SettingOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { useTableData } from "../../hooks/useTableData";
import { usePermissions } from "../../hooks/usePermissions";

const { RangePicker } = DatePicker;

const BaseTable = ({
    config,
    title,
    endpoint,
    showHeader = true,
    showFilters = true,
    showBulkActions = true,
    extraActions = [],
    onRowClick,
    onEdit,
    onCreate,
    onDelete,
    onBulkAction,
    customToolbar,
    refreshTrigger = 0,
}) => {
    const { hasPermission } = usePermissions();
    const {
        data,
        loading,
        pagination,
        selectedRowKeys,
        handleTableChange,
        handleSelectionChange,
        refresh,
        resetFilters,
        setFilters,
    } = useTableData(endpoint, {
        initialPageSize: config.table?.pageSize || 10,
        defaultSort: config.table?.defaultSort || "-created_at",
    });

    // Refresh data when refreshTrigger changes
    React.useEffect(() => {
        if (refreshTrigger > 0) {
            refresh();
        }
    }, [refreshTrigger, refresh]);

    const handleSearch = (value, field) => {
        if (value) {
            setFilters((prev) => ({ ...prev, [field]: value }));
        } else {
            setFilters((prev) => {
                const newFilters = { ...prev };
                delete newFilters[field];
                return newFilters;
            });
        }
    };

    const handleFilterChange = (value, field) => {
        if (value && value.length > 0) {
            setFilters((prev) => ({ ...prev, [field]: value }));
        } else {
            setFilters((prev) => {
                const newFilters = { ...prev };
                delete newFilters[field];
                return newFilters;
            });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning("Please select items to delete");
            return;
        }
        try {
            if (onBulkAction) {
                await onBulkAction("delete", selectedRowKeys);
            }
            message.success(`Deleted ${selectedRowKeys.length} items`);
            refresh();
            handleSelectionChange([]);
        } catch (error) {
            message.error("Failed to delete items");
        }
    };

    const handleExport = () => {
        message.info("Export functionality will be implemented in Phase 4");
    };

    const renderFilters = () => {
        if (!showFilters || !config.filters) return null;

        return (
            <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    {Object.entries(config.filters).map(
                        ([key, filterConfig]) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={key}>
                                {filterConfig.type === "text" && (
                                    <Input
                                        placeholder={
                                            filterConfig.placeholder ||
                                            `Search ${filterConfig.label}`
                                        }
                                        prefix={<SearchOutlined />}
                                        allowClear
                                        onChange={(e) =>
                                            handleSearch(e.target.value, key)
                                        }
                                    />
                                )}
                                {filterConfig.type === "select" && (
                                    <Select
                                        placeholder={`Select ${filterConfig.label}`}
                                        allowClear
                                        style={{ width: "100%" }}
                                        onChange={(value) =>
                                            handleFilterChange(
                                                value ? [value] : [],
                                                key
                                            )
                                        }
                                        options={filterConfig.options?.map(
                                            (opt) => ({
                                                value: opt.value,
                                                label: opt.label,
                                            })
                                        )}
                                    />
                                )}
                                {filterConfig.type === "multi-select" && (
                                    <Select
                                        mode="multiple"
                                        placeholder={`Select ${filterConfig.label}`}
                                        allowClear
                                        style={{ width: "100%" }}
                                        onChange={(value) =>
                                            handleFilterChange(value, key)
                                        }
                                        options={filterConfig.options?.map(
                                            (opt) => ({
                                                value: opt.value,
                                                label: opt.label,
                                            })
                                        )}
                                    />
                                )}
                                {filterConfig.type === "date-range" && (
                                    <RangePicker
                                        style={{ width: "100%" }}
                                        onChange={(dates) => {
                                            if (dates && dates.length === 2) {
                                                handleFilterChange(
                                                    [
                                                        dates[0].toISOString(),
                                                        dates[1].toISOString(),
                                                    ],
                                                    key
                                                );
                                            } else {
                                                handleFilterChange([], key);
                                            }
                                        }}
                                    />
                                )}
                            </Col>
                        )
                    )}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space>
                            <Button
                                onClick={resetFilters}
                                icon={<FilterOutlined />}
                            >
                                Clear Filters
                            </Button>
                            <Button onClick={refresh} icon={<ReloadOutlined />}>
                                Refresh
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
        );
    };

    const renderToolbar = () => {
        if (customToolbar) return customToolbar;
        if (!showHeader) return null;

        const bulkActions = [
            {
                key: "delete",
                label: "Delete Selected",
                danger: true,
                disabled: selectedRowKeys.length === 0,
                onClick: handleBulkDelete,
            },
        ];

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>{title}</h2>
                    {selectedRowKeys.length > 0 && (
                        <span style={{ color: "#666", fontSize: "14px" }}>
                            {selectedRowKeys.length} items selected
                        </span>
                    )}
                </div>
                <Space>
                    {/* Bulk Actions */}
                    {showBulkActions &&
                        selectedRowKeys.length > 0 &&
                        hasPermission(config.name, "delete") && (
                            <Dropdown
                                menu={{
                                    items: bulkActions.map((action) => {
                                        const {
                                            key,
                                            onClick,
                                            ...menuItemProps
                                        } = action;
                                        return {
                                            key: key || action.label,
                                            onClick: ({ domEvent }) => {
                                                domEvent.stopPropagation();
                                                onClick?.();
                                            },
                                            ...menuItemProps,
                                        };
                                    }),
                                }}
                            >
                                <Button>
                                    Bulk Actions <MoreOutlined />
                                </Button>
                            </Dropdown>
                        )}

                    {/* Extra Actions */}
                    {extraActions.map((action, index) => {
                        const {
                            key,
                            label,
                            icon,
                            onClick,
                            type,
                            ...restProps
                        } = action;
                        return (
                            <Button
                                key={key || `action-${index}`}
                                icon={icon}
                                type={type}
                                onClick={onClick}
                                {...restProps}
                            >
                                {label}
                            </Button>
                        );
                    })}

                    {/* Export */}
                    <Tooltip title="Export data">
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                        />
                    </Tooltip>

                    {/* Create Button */}
                    {hasPermission(config.name, "create") && onCreate && (
                        <Button type="primary" onClick={onCreate}>
                            Create New
                        </Button>
                    )}
                </Space>
            </div>
        );
    };

    // Just use the columns as they are defined in the config
    const enhancedColumns = config.table?.columns?.map((column) => ({
        ...column,
        sorter: column.sortable !== false,
        ...(column.filterable && {
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search ${column.title}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            icon={<SearchOutlined />}
                            size="small"
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters()} size="small">
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{ color: filtered ? "#1890ff" : undefined }}
                />
            ),
        }),
    }));

    return (
        <div>
            {renderToolbar()}
            {renderFilters()}
            <Table
                columns={enhancedColumns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                rowKey="id"
                scroll={{ x: 800 }}
                rowSelection={
                    showBulkActions
                        ? {
                              selectedRowKeys,
                              onChange: handleSelectionChange,
                              preserveSelectedRowKeys: true,
                          }
                        : undefined
                }
                onRow={(record) => ({
                    onClick: () => onRowClick?.(record),
                    style: { cursor: onRowClick ? "pointer" : "default" },
                })}
                size="middle"
            />
        </div>
    );
};

export default BaseTable;
