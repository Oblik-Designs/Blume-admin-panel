import { useState, useEffect, useCallback } from "react";
import { useAPI } from "./useAPI";
export const useTableData = (endpoint, options = {}) => {
    const {
        initialPageSize = 10,
        defaultSort = "-created_at",
        autoLoad = true,
    } = options;
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: initialPageSize,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
    });
    const [sorter, setSorter] = useState({ field: null, order: null });
    const [filters, setFilters] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const { loading, error, get } = useAPI();
    const loadData = useCallback(async () => {
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
                sort: sorter.field
                    ? `${sorter.order === "descend" ? "-" : ""}${sorter.field}`
                    : defaultSort,
                ...filters,
            };
            const response = await get(endpoint, params, {
                showErrorMessage: true,
            });
            setData(response.data || []);
            setPagination((prev) => ({
                ...prev,
                total: response.total || 0,
            }));
        } catch (err) {
            console.error("Failed to load table data:", err);
            setData([]);
        }
    }, [
        endpoint,
        pagination.current,
        pagination.pageSize,
        sorter,
        filters,
        defaultSort,
        get,
    ]);
    useEffect(() => {
        if (autoLoad) {
            loadData();
        }
    }, [loadData, autoLoad]);
    const handleTableChange = (
        paginationConfig,
        filtersConfig,
        sorterConfig
    ) => {
        // Handle pagination
        if (
            paginationConfig.current !== pagination.current ||
            paginationConfig.pageSize !== pagination.pageSize
        ) {
            setPagination((prev) => ({
                ...prev,
                current: paginationConfig.current,
                pageSize: paginationConfig.pageSize,
            }));
        }
        // Handle sorting
        if (
            sorterConfig.field !== sorter.field ||
            sorterConfig.order !== sorter.order
        ) {
            setSorter({
                field: sorterConfig.field,
                order: sorterConfig.order,
            });
        }
        // Handle filters
        const newFilters = {};
        Object.keys(filtersConfig).forEach((key) => {
            if (filtersConfig[key] && filtersConfig[key].length > 0) {
                newFilters[key] = filtersConfig[key];
            }
        });
        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters);
            // Reset to first page when filters change
            setPagination((prev) => ({ ...prev, current: 1 }));
        }
    };
    const handleSelectionChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const refresh = () => {
        loadData();
    };
    const resetFilters = () => {
        setFilters({});
        setSorter({ field: null, order: null });
        setPagination((prev) => ({ ...prev, current: 1 }));
        setSelectedRowKeys([]);
    };
    return {
        data,
        loading,
        error,
        pagination,
        selectedRowKeys,
        handleTableChange,
        handleSelectionChange,
        refresh,
        resetFilters,
        setFilters: (newFilters) => {
            setFilters(newFilters);
            setPagination((prev) => ({ ...prev, current: 1 }));
        },
    };
};
